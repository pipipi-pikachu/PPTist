import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { resolveDocAccess } from '../auth'
import type { AppConfig } from '../config'
import type { Db, DocumentRow, ExportJobRow } from '../db'
import { AppError } from '../errors'
import {
  EXPORT_FORMATS,
  exportsDir,
  renderSlideImage,
  type ExportFormat,
  type ExportRequest,
} from '../render/export'
import {
  exportQuotaFor,
  exportsUsedToday,
  findJobByFile,
  getExportJob,
  submitExport,
} from '../render/jobs'
import type { RenderQueue } from '../render/queue'
import type { DocData } from '../schema/document'

interface ExportsRoutesDeps {
  db: Db
  config: AppConfig
  queue: RenderQueue
}

const FILE_NAME_RE = /^[A-Za-z0-9_-]{21}\.(pptx|pdf|png|zip|json)$/

const MIME_BY_EXT: Record<string, string> = {
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pdf: 'application/pdf',
  png: 'image/png',
  zip: 'application/zip',
  json: 'application/json',
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function jobUrl(config: AppConfig, job: ExportJobRow): string | undefined {
  return job.file ? `${config.publicBaseUrl}/exports/${job.file}` : undefined
}

function jobPayload(config: AppConfig, job: ExportJobRow) {
  return {
    jobId: job.id,
    status: job.status,
    format: job.format,
    ...(job.file ? { url: jobUrl(config, job) } : {}),
    ...(job.error ? { error: job.error } : {}),
  }
}

function parseExportBody(req: FastifyRequest, data: DocData): ExportRequest {
  const body = (req.body ?? {}) as { format?: string, slides?: unknown, options?: { masterOverwrite?: boolean, ignoreMedia?: boolean } }
  if (!body.format || !EXPORT_FORMATS.includes(body.format as ExportFormat)) {
    throw AppError.validation(`format 必须是 ${EXPORT_FORMATS.join(' / ')} 之一`)
  }
  let slides: number[] | undefined
  if (body.slides !== undefined) {
    if (!Array.isArray(body.slides) || !body.slides.every(i => Number.isInteger(i))) {
      throw AppError.validation('slides 必须是整数页码数组（从 0 开始）')
    }
    slides = body.slides as number[]
    const bad = slides.find(i => i < 0 || i >= data.slides.length)
    if (bad !== undefined) {
      throw AppError.validation(`slides 包含非法页码 ${bad}（共 ${data.slides.length} 页）`)
    }
  }
  return { format: body.format as ExportFormat, slides, options: body.options }
}

export function exportsRoutes({ db, config, queue }: ExportsRoutesDeps): FastifyPluginAsync {
  return app => {
    app.post('/api/docs/:id/exports', async req => {
      const docId = (req.params as { id: string }).id
      const access = resolveDocAccess(db, config, req, docId)
      if (access.role === 'view') throw AppError.forbidden('只读链接不能导出')

      const row = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId) as DocumentRow
      const data = JSON.parse(row.data) as DocData
      const body = parseExportBody(req, data)

      const quota = exportQuotaFor(db, config, access.ownerId)
      if (exportsUsedToday(db, access.ownerId) >= quota) {
        throw AppError.quotaExceeded(`今日导出次数已达上限（${quota} 次/天）`)
      }

      const { job, settled } = submitExport({ db, config, queue }, row, body)
      const finished = await Promise.race([
        settled.then(() => true),
        delay(config.exportSyncWaitMs).then(() => false),
      ])
      if (!finished) return { status: 'pending', jobId: job.id }

      const latest = getExportJob(db, job.id)!
      if (latest.status === 'done') return { status: 'done', url: jobUrl(config, latest) }
      return { status: latest.status, jobId: job.id, ...(latest.error ? { error: latest.error } : {}) }
    })

    app.get('/api/exports/:jobId', req => {
      const jobId = (req.params as { jobId: string }).jobId
      const job = getExportJob(db, jobId)
      if (!job) throw AppError.notFound('导出任务不存在')
      // 令牌 / Key 都要对任务所属文档有访问权；文档已删则任务也视为不存在
      try {
        resolveDocAccess(db, config, req, job.doc_id)
      }
      catch {
        throw AppError.notFound('导出任务不存在')
      }
      return jobPayload(config, job)
    })

    // 文件名是 21 位随机串，本身即凭证；24h 后由清理任务删除
    app.get('/exports/:file', (req, reply) => {
      const file = (req.params as { file: string }).file
      if (!FILE_NAME_RE.test(file)) throw AppError.notFound()
      const path = join(exportsDir(config), file)
      if (!existsSync(path)) throw AppError.notFound()

      const ext = file.split('.').pop()!
      const job = findJobByFile(db, file)
      let downloadName = `export.${ext}`
      if (job) {
        const doc = db.prepare('SELECT title FROM documents WHERE id = ?').get(job.doc_id) as { title: string } | undefined
        if (doc?.title) downloadName = `${doc.title.replace(/["\\\r\n]/g, '_')}.${ext}`
      }
      reply
        .header('Content-Type', MIME_BY_EXT[ext] ?? 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadName)}"`)
      return reply.send(readFileSync(path))
    })

    // 单页 PNG 截图，MCP 的 render_slide 用同一实现；返回图片本身不落盘
    app.get('/api/docs/:id/slides/:index.png', async (req, reply) => {
      const docId = (req.params as { id: string }).id
      const params = req.params as { index: string }
      resolveDocAccess(db, config, req, docId)

      const index = Number(params.index)
      if (!Number.isInteger(index) || index < 0) throw AppError.validation('页码必须是从 0 开始的整数')

      const query = req.query as { width?: string }
      let width = 1000
      if (query.width !== undefined) {
        width = Number(query.width)
        if (!Number.isInteger(width) || width < 16 || width > 4000) {
          throw AppError.validation('width 必须是 16~4000 的整数像素')
        }
      }

      const row = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId) as DocumentRow
      const data = JSON.parse(row.data) as DocData
      if (index >= data.slides.length) {
        throw AppError.validation(`页码 ${index} 超出范围（共 ${data.slides.length} 页）`)
      }

      const png = await queue.run(() => renderSlideImage({ config }, row, index, width))
      reply.header('Content-Type', 'image/png')
      return reply.send(png)
    })

    return Promise.resolve()
  }
}
