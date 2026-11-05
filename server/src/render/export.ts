import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { nanoid } from 'nanoid'
import { ZipFile } from 'yazl'

import type { Slide } from '../../../src/types/slides'
import type { AppConfig } from '../config'
import type { DocumentRow } from '../db'
import { AppError } from '../errors'
import type { DocData } from '../schema/document'
import { newRenderPage } from './browser'

export type ExportFormat = 'pptx' | 'pdf' | 'png' | 'json'

export const EXPORT_FORMATS: ExportFormat[] = ['pptx', 'pdf', 'png', 'json']

export interface ExportOptions {
  masterOverwrite?: boolean
  ignoreMedia?: boolean
}

export interface ExportRequest {
  format: ExportFormat
  slides?: number[]
  options?: ExportOptions
}

export interface ExportFileResult {
  fileName: string
  mime: string
  ext: string
}

interface Deps {
  config: AppConfig
  taskTimeoutMs?: number
}

export function exportsDir(config: AppConfig): string {
  const dir = join(config.dataDir, 'exports')
  mkdirSync(dir, { recursive: true })
  return dir
}

function docData(row: DocumentRow): DocData {
  return JSON.parse(row.data) as DocData
}

// 校验并取出页码子集（页码从 0 开始，越界报 400）
export function pickSlides(data: DocData, indexes?: number[]): Slide[] {
  if (!indexes) return data.slides
  const bad = indexes.find(i => !Number.isInteger(i) || i < 0 || i >= data.slides.length)
  if (bad !== undefined) {
    throw AppError.validation(`slides 包含非法页码 ${bad}（共 ${data.slides.length} 页，页码从 0 开始）`)
  }
  return indexes.map(i => data.slides[i])
}

export function buildExportJson(data: DocData, indexes?: number[]): string {
  const slides = pickSlides(data, indexes)
  return JSON.stringify({
    title: data.title,
    width: data.viewportSize,
    height: data.viewportSize * data.viewportRatio,
    theme: data.theme,
    slides,
  })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// page.evaluate / waitForFunction 的函数体会被序列化进浏览器执行，不能引用 Node 侧变量，只能用 globalThis
type ExportGlobal = {
  ready: boolean
  load: (doc: unknown) => Promise<void>
  pptx: (options?: unknown) => Promise<string>
}
// 打开无头导出页并加载文档；watchdog 超时后主动关 context 让挂起的 page 调用报错
async function openExportPage(
  config: AppConfig,
  data: DocData,
  deviceScaleFactor: number,
  timeoutMs: number,
  docOverride?: DocData,
) {
  const { context, page } = await newRenderPage(config, {
    viewportSize: data.viewportSize,
    viewportRatio: data.viewportRatio,
    deviceScaleFactor,
  })
  const watchdog = setTimeout(() => {
    context.close().catch(() => {})
  }, timeoutMs)
  const close = async () => {
    clearTimeout(watchdog)
    await context.close().catch(() => {})
  }
  try {
    await page.goto(`${config.renderBaseUrl}/?mode=export`, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => (globalThis as any).__PPTIST_EXPORT__ !== undefined)
    await page.evaluate(doc => (globalThis as any).__PPTIST_EXPORT__.load(doc), docOverride ?? data)
    await page.waitForFunction(() => (globalThis as any).__PPTIST_EXPORT__.ready === true)
    return { page, close }
  }
  catch (err) {
    await close()
    throw AppError.exportFailed(`无头导出页加载失败: ${(err as Error).message}`)
  }
}

// 把多个 PNG 打成 zip（页码对应文档页序）
function zipPngs(entries: { name: string, data: Buffer }[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const zip = new ZipFile()
    const chunks: Buffer[] = []
    zip.outputStream.on('data', (chunk: Buffer) => chunks.push(chunk))
    zip.outputStream.on('end', () => resolve(Buffer.concat(chunks)))
    zip.outputStream.on('error', reject)
    for (const entry of entries) zip.addBuffer(entry.data, entry.name)
    zip.end()
  })
}

// 执行一次导出，把结果写入 DATA_DIR/exports/<随机文件名>.<ext>
export async function runExport({ config, taskTimeoutMs = 120_000 }: Deps, row: DocumentRow, req: ExportRequest): Promise<ExportFileResult> {
  const data = docData(row)
  pickSlides(data, req.slides) // 先校验页码，避免白跑浏览器

  if (req.format === 'json') {
    const fileName = `${nanoid()}.json`
    writeFileSync(join(exportsDir(config), fileName), buildExportJson(data, req.slides))
    return { fileName, mime: 'application/json', ext: 'json' }
  }

  if (req.format === 'pptx') {
    const { page, close } = await openExportPage(config, data, 2, taskTimeoutMs)
    try {
      const base64 = await page.evaluate(
        options => ((globalThis as any).__PPTIST_EXPORT__ as ExportGlobal).pptx(options),
        { ...req.options, slides: req.slides },
      ) as string
      const fileName = `${nanoid()}.pptx`
      writeFileSync(join(exportsDir(config), fileName), Buffer.from(base64, 'base64'))
      return { fileName, mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', ext: 'pptx' }
    }
    finally {
      await close()
    }
  }

  if (req.format === 'pdf') {
    const { page, close } = await openExportPage(config, data, 2, taskTimeoutMs)
    try {
      const pageRanges = req.slides?.map(i => i + 1).join(',')
      const pdf = await page.pdf({
        width: `${data.viewportSize}px`,
        height: `${data.viewportSize * data.viewportRatio}px`,
        printBackground: true,
        ...(pageRanges ? { pageRanges } : {}),
      })
      const fileName = `${nanoid()}.pdf`
      writeFileSync(join(exportsDir(config), fileName), pdf)
      return { fileName, mime: 'application/pdf', ext: 'pdf' }
    }
    finally {
      await close()
    }
  }

  // png：逐页截图，单页直接出 .png，多页打 .zip
  const { page, close } = await openExportPage(config, data, 2, taskTimeoutMs)
  try {
    const handles = await page.$$('.export-page')
    const indexes = req.slides ?? handles.map((_, i) => i)
    const shots: { index: number, data: Buffer }[] = []
    for (const i of indexes) {
      if (!handles[i]) throw AppError.exportFailed(`页面截图失败：找不到第 ${i + 1} 页的渲染节点`)
      shots.push({ index: i, data: await handles[i].screenshot({ type: 'png' }) })
    }
    if (shots.length === 1) {
      const fileName = `${nanoid()}.png`
      writeFileSync(join(exportsDir(config), fileName), shots[0].data)
      return { fileName, mime: 'image/png', ext: 'png' }
    }
    const zipped = await zipPngs(shots.map(shot => ({ name: `page-${shot.index + 1}.png`, data: shot.data })))
    const fileName = `${nanoid()}.zip`
    writeFileSync(join(exportsDir(config), fileName), zipped)
    return { fileName, mime: 'application/zip', ext: 'zip' }
  }
  finally {
    await close()
  }
}

// 单页 PNG 截图（render_slide / slides/:index.png）：只加载该页，输出宽度 = width 像素
export async function renderSlideImage({ config, taskTimeoutMs = 120_000 }: Deps, row: DocumentRow, index: number, width: number): Promise<Buffer> {
  const data = docData(row)
  const slide = pickSlides(data, [index])[0]
  const single: DocData = { ...data, slides: [slide] }
  const scale = width / data.viewportSize

  const { page, close } = await openExportPage(config, data, scale, taskTimeoutMs, single)
  try {
    const target = await page.$('.export-page')
    if (!target) throw AppError.exportFailed('页面截图失败：找不到渲染节点')
    return await target.screenshot({ type: 'png' })
  }
  finally {
    await close()
  }
}
