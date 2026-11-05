import { nanoid } from 'nanoid'
import { z } from 'zod'

import type { PPTElement, Slide, SlideTheme } from '../../../src/types/slides'
import { AppError, type ValidationIssue } from '../errors'

export interface DocData {
  title: string
  theme: SlideTheme
  viewportSize: number
  viewportRatio: number
  slides: Slide[]
}

export const MAX_SLIDES = 200
export const MAX_ELEMENTS_PER_SLIDE = 300

const num = z.number().finite()

// 通用几何字段：坐标尺寸必须是有限数字，id 缺省由服务端生成，rotate 缺省 0
const baseFields = {
  id: z.string().optional(),
  left: num,
  top: num,
  width: num,
  height: num,
  rotate: num.default(0),
}

const textElement = z.looseObject({
  ...baseFields,
  type: z.literal('text'),
  content: z.string({ error: 'text 元素缺少必填字段 content（富文本 HTML）' }),
  defaultFontName: z.string().default(''),
  defaultColor: z.string().default('#000000'),
})

const imageElement = z.looseObject({
  ...baseFields,
  type: z.literal('image'),
  src: z.string({ error: 'image 元素缺少必填字段 src' }).min(1, 'image 元素的 src 不能为空'),
})

const shapeElement = z.looseObject({
  ...baseFields,
  type: z.literal('shape'),
  viewBox: z.tuple([num, num], { error: 'shape 元素缺少必填字段 viewBox' }),
  path: z.string({ error: 'shape 元素缺少必填字段 path' }).min(1, 'shape 元素的 path 不能为空'),
})

// 线条没有 height / rotate，width 是描边粗细
const lineElement = z.looseObject({
  id: z.string().optional(),
  left: num,
  top: num,
  width: num,
  type: z.literal('line'),
  start: z.tuple([num, num], { error: 'line 元素缺少必填字段 start' }),
  end: z.tuple([num, num], { error: 'line 元素缺少必填字段 end' }),
  style: z.string({ error: 'line 元素缺少必填字段 style（solid/dashed/dotted）' }),
  color: z.string({ error: 'line 元素缺少必填字段 color' }),
  points: z.tuple([z.string(), z.string()]).default(['', '']),
})

const chartElement = z.looseObject({
  ...baseFields,
  type: z.literal('chart'),
  chartType: z.string({ error: 'chart 元素缺少必填字段 chartType' }),
  data: z.looseObject({
    labels: z.array(z.string(), { error: 'chart 元素的 data.labels 必须是字符串数组' }),
    series: z.array(z.array(num), { error: 'chart 元素的 data.series 必须是二维数字数组' }),
    legends: z.array(z.string()).optional(),
  }, { error: 'chart 元素缺少必填字段 data' }),
  themeColors: z.array(z.string()).optional(),
})

const tableCell = z.looseObject({
  id: z.string().optional(),
  colspan: z.number().int().positive().default(1),
  rowspan: z.number().int().positive().default(1),
  text: z.string({ error: '表格单元格缺少必填字段 text' }),
})

const tableElement = z.looseObject({
  ...baseFields,
  type: z.literal('table'),
  colWidths: z.array(num, { error: 'table 元素缺少必填字段 colWidths' }).min(1),
  cellMinHeight: num.default(36),
  data: z.array(z.array(tableCell), { error: 'table 元素缺少必填字段 data' }),
})

const latexElement = z.looseObject({
  ...baseFields,
  type: z.literal('latex'),
  latex: z.string({ error: 'latex 元素缺少必填字段 latex' }),
  path: z.string({ error: 'latex 元素缺少必填字段 path' }).min(1),
  viewBox: z.tuple([num, num], { error: 'latex 元素缺少必填字段 viewBox' }),
  color: z.string().default('#000000'),
  strokeWidth: num.default(1),
  fixedRatio: z.boolean().default(false),
})

const videoElement = z.looseObject({
  ...baseFields,
  type: z.literal('video'),
  src: z.string({ error: 'video 元素缺少必填字段 src' }).min(1),
  autoplay: z.boolean().default(false),
})

const audioElement = z.looseObject({
  ...baseFields,
  type: z.literal('audio'),
  src: z.string({ error: 'audio 元素缺少必填字段 src' }).min(1),
  fixedRatio: z.boolean().default(false),
  color: z.string().default('#000000'),
  loop: z.boolean().default(false),
  autoplay: z.boolean().default(false),
})

const elementSchema = z.discriminatedUnion('type', [
  textElement,
  imageElement,
  shapeElement,
  lineElement,
  chartElement,
  tableElement,
  latexElement,
  videoElement,
  audioElement,
])

const noteReplySchema = z.looseObject({
  id: z.string().optional(),
  content: z.string({ error: '批注回复缺少必填字段 content' }),
  time: z.number().default(() => Date.now()),
  user: z.string().default(''),
})

const noteSchema = z.looseObject({
  id: z.string().optional(),
  content: z.string({ error: '批注缺少必填字段 content' }),
  time: z.number().default(() => Date.now()),
  user: z.string().default(''),
  elId: z.string().optional(),
  replies: z.array(noteReplySchema).optional(),
})

const animationSchema = z.looseObject({
  id: z.string().optional(),
  elId: z.string({ error: '动画缺少必填字段 elId' }),
  effect: z.string().optional(),
  type: z.string().optional(),
  duration: num.optional(),
  trigger: z.string().optional(),
})

const slideSchema = z.looseObject({
  id: z.string().optional(),
  elements: z.array(elementSchema).max(MAX_ELEMENTS_PER_SLIDE, '单页元素数量超过上限 300').default([]),
  notes: z.array(noteSchema).optional(),
  remark: z.string().optional(),
  background: z.looseObject({}).optional(),
  animations: z.array(animationSchema).optional(),
})

export const documentSchema = z.looseObject({
  title: z.string().default('未命名演示文稿'),
  theme: z.looseObject({}).optional(),
  viewportSize: num.positive('viewportSize 必须是正数').default(1000),
  viewportRatio: num.positive('viewportRatio 必须是正数').default(0.5625),
  slides: z.array(slideSchema).max(MAX_SLIDES, '页面数量超过上限 200').default([]),
})

function formatPath(path: PropertyKey[]): string {
  let out = ''
  for (const seg of path) {
    if (typeof seg === 'number') out += `[${seg}]`
    else out += out ? `.${String(seg)}` : String(seg)
  }
  return out || '(root)'
}

export function toValidationIssues(error: z.ZodError): ValidationIssue[] {
  return error.issues.map(issue => ({
    path: formatPath(issue.path),
    message: issue.message,
  }))
}

export function parseDocument(input: unknown): DocData {
  const result = documentSchema.safeParse(input ?? {})
  if (!result.success) {
    throw AppError.validation('文档结构校验失败', toValidationIssues(result.error))
  }
  return result.data as unknown as DocData
}

export function parseSlide(input: unknown): Slide {
  const result = slideSchema.safeParse(input)
  if (!result.success) {
    throw AppError.validation('页面结构校验失败', toValidationIssues(result.error))
  }
  return result.data as unknown as Slide
}

export function parseElement(input: unknown): PPTElement {
  const result = elementSchema.safeParse(input)
  if (!result.success) {
    throw AppError.validation('元素结构校验失败', toValidationIssues(result.error))
  }
  return result.data as unknown as PPTElement
}

// 补齐缺失的 id；重复的 id 给后出现的重新生成。返回是否有改动
export function normalizeDocIds(doc: DocData): boolean {
  let changed = false
  const seenSlides = new Set<string>()
  const seenElements = new Set<string>()
  const seenNotes = new Set<string>()
  const seenCells = new Set<string>()

  const uniqId = (seen: Set<string>, current: unknown): string => {
    if (typeof current === 'string' && current && !seen.has(current)) {
      seen.add(current)
      return current
    }
    let id = nanoid(10)
    while (seen.has(id)) id = nanoid(10)
    seen.add(id)
    changed = true
    return id
  }

  for (const slide of doc.slides) {
    slide.id = uniqId(seenSlides, slide.id)
    for (const el of slide.elements) {
      el.id = uniqId(seenElements, el.id)
      if (el.type === 'table' && Array.isArray(el.data)) {
        for (const row of el.data) {
          for (const cell of row) cell.id = uniqId(seenCells, cell.id)
        }
      }
    }
    for (const anim of slide.animations ?? []) anim.id = uniqId(new Set(), anim.id)
    for (const note of slide.notes ?? []) {
      note.id = uniqId(seenNotes, note.id)
      for (const reply of note.replies ?? []) reply.id = uniqId(new Set(), reply.id)
    }
  }
  return changed
}
