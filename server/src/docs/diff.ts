import { isDeepStrictEqual } from 'node:util'

import type { Note, PPTElement, Slide } from '../../../src/types/slides'
import type { DocData } from '../schema/document'

const MAX_LINES = 50

const TYPE_NAMES: Record<string, string> = {
  text: '文本',
  image: '图片',
  shape: '形状',
  line: '线条',
  chart: '图表',
  table: '表格',
  latex: '公式',
  video: '视频',
  audio: '音频',
}

const GEOMETRY_PROPS = ['left', 'top', 'width', 'height', 'rotate', 'start', 'end', 'broken', 'broken2', 'curve', 'cubic']

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function truncate(text: string, max = 40): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

function elementText(el: PPTElement): string {
  if (el.type === 'text' && typeof el.content === 'string') return truncate(stripHtml(el.content), 20)
  if (el.type === 'shape' && el.text?.content) return truncate(stripHtml(el.text.content), 20)
  return ''
}

function elementDesc(el: PPTElement): string {
  const name = TYPE_NAMES[el.type] ?? el.type
  const text = elementText(el)
  return text ? `${name} '${text}'` : name
}

function elementName(el: PPTElement): string {
  const name = TYPE_NAMES[el.type] ?? el.type
  const text = elementText(el)
  return `${name}元素` + (text ? ` '${text}'` : '')
}

// 页面标签：取 textType 为 title 的文本元素，没有就取第一个文本元素
function slideLabel(slide: Slide): string {
  const texts = slide.elements.filter((el): el is PPTElement & { type: 'text' } => el.type === 'text')
  const title = texts.find(el => el.textType === 'title') ?? texts[0]
  return title ? truncate(stripHtml(title.content), 20) : ''
}

function pageTag(slide: Slide, index: number): string {
  const label = slideLabel(slide)
  return `第${index + 1}页` + (label ? `「${label}」` : '')
}

function changedProps(prev: PPTElement, next: PPTElement): string[] {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)])
  const changed: string[] = []
  for (const key of keys) {
    const a = (prev as unknown as Record<string, unknown>)[key]
    const b = (next as unknown as Record<string, unknown>)[key]
    if (!isDeepStrictEqual(a, b)) changed.push(key)
  }
  return changed
}

function diffElement(prev: PPTElement, next: PPTElement, page: string, out: string[]): void {
  const props = changedProps(prev, next).filter(key => key !== 'id' && key !== 'type')
  if (!props.length) return

  if (prev.type === 'text' && next.type === 'text' && props.includes('content')) {
    const before = truncate(stripHtml(prev.content))
    const after = truncate(stripHtml(next.content))
    out.push(`${page}：修改文本 '${before}'→'${after}'`)
    const rest = props.filter(key => key !== 'content')
    if (rest.length) out.push(`${page}：修改元素样式（${rest.join(', ')}）`)
    return
  }

  const geometry = props.filter(key => GEOMETRY_PROPS.includes(key))
  const others = props.filter(key => !GEOMETRY_PROPS.includes(key))
  if (geometry.length) out.push(`${page}：移动/缩放元素（${elementDesc(next)}）`)
  if (others.length) out.push(`${page}：修改元素样式（${others.join(', ')}）`)
}

function diffNotes(prev: Note[] | undefined, next: Note[] | undefined, page: string, out: string[]): void {
  const prevById = new Map((prev ?? []).map(note => [note.id, note]))
  const nextById = new Map((next ?? []).map(note => [note.id, note]))

  for (const [id, note] of nextById) {
    const before = prevById.get(id)
    if (!before) {
      out.push(`${page}：新增批注 '${truncate(note.content, 20)}'`)
      continue
    }
    const prevReplies = new Set((before.replies ?? []).map(reply => reply.id))
    for (const reply of note.replies ?? []) {
      if (!prevReplies.has(reply.id)) out.push(`${page}：回复批注 '${truncate(reply.content, 20)}'`)
    }
    if (before.content !== note.content) out.push(`${page}：修改批注 '${truncate(note.content, 20)}'`)
  }
  for (const id of prevById.keys()) {
    if (!nextById.has(id)) out.push(`${page}：删除批注`)
  }
}

function diffSlide(prev: Slide, next: Slide, index: number, out: string[]): void {
  const page = pageTag(next, index)
  const prevById = new Map(prev.elements.map(el => [el.id, el]))
  const nextIds = new Set(next.elements.map(el => el.id))

  for (const el of next.elements) {
    const before = prevById.get(el.id)
    if (!before) out.push(`${page}：新增${elementName(el)}`)
    else diffElement(before, el, page, out)
  }
  for (const el of prev.elements) {
    if (!nextIds.has(el.id)) out.push(`${page}：删除${elementName(el)}`)
  }

  if (!isDeepStrictEqual(prev.background, next.background)) out.push(`${page}：修改背景`)
  if (!isDeepStrictEqual(prev.remark, next.remark)) out.push(`${page}：修改备注`)
  if (!isDeepStrictEqual(prev.animations, next.animations)) out.push(`${page}：修改动画`)
  if (!isDeepStrictEqual(prev.turningMode, next.turningMode)) out.push(`${page}：修改翻页方式`)
  if (!isDeepStrictEqual(prev.type, next.type)) out.push(`${page}：修改页面类型`)
  diffNotes(prev.notes, next.notes, page, out)
}

export function summarize(prev: DocData, next: DocData): string[] {
  const out: string[] = []

  if (prev.title !== next.title) out.push(`修改标题 '${truncate(prev.title)}'→'${truncate(next.title)}'`)
  if (!isDeepStrictEqual(prev.theme, next.theme)) out.push('修改主题')
  if (prev.viewportSize !== next.viewportSize || prev.viewportRatio !== next.viewportRatio) out.push('修改画布尺寸/比例')

  const prevById = new Map(prev.slides.map((slide, i) => [slide.id, { slide, index: i }]))
  const nextById = new Map(next.slides.map((slide, i) => [slide.id, { slide, index: i }]))

  for (const [id, { slide, index }] of nextById) {
    const before = prevById.get(id)
    if (!before) {
      out.push(`新增第${index + 1}页`)
      continue
    }
    if (before.index !== index) out.push(`第${before.index + 1}页移动到第${index + 1}页`)
    if (!isDeepStrictEqual(before.slide, slide)) diffSlide(before.slide, slide, index, out)
  }
  for (const [id, { slide, index }] of prevById) {
    if (!nextById.has(id)) out.push(`删除${pageTag(slide, index)}`)
  }

  if (out.length > MAX_LINES) {
    const extra = out.length - MAX_LINES + 1
    return [...out.slice(0, MAX_LINES - 1), `…等 ${extra} 处修改`]
  }
  return out
}
