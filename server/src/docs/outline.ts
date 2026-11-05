import type { Note, PPTElement, Slide, SlideBackground } from '../../../src/types/slides'
import type { DocData } from '../schema/document'

const TEXT_MAX = 80

export interface ElementOutline {
  id: string
  type: string
  left: number
  top: number
  width?: number
  height?: number
  rotate?: number
  text?: string
  src?: string
}

export interface CommentOutline {
  id: string
  user: string
  content: string
  elId?: string
  time: number
}

export interface SlideOutline {
  index: number
  id: string
  type?: string
  background?: string
  elements: ElementOutline[]
  comments: CommentOutline[]
}

export interface DocOutline {
  title: string
  viewportSize: number
  viewportRatio: number
  slideCount: number
  slides: SlideOutline[]
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function truncate(text: string, max = TEXT_MAX): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

// 元素纯文本：文本元素 content、形状内文本、表格单元格，截断 80 字
function elementText(el: PPTElement): string | undefined {
  if (el.type === 'text' && typeof el.content === 'string') {
    return truncate(stripHtml(el.content)) || undefined
  }
  if (el.type === 'shape' && el.text?.content) {
    return truncate(stripHtml(el.text.content)) || undefined
  }
  if (el.type === 'table' && Array.isArray(el.data)) {
    const text = el.data.flat().map(cell => cell.text).filter(Boolean).join(' / ')
    return truncate(stripHtml(text)) || undefined
  }
  return undefined
}

function elementOutline(el: PPTElement): ElementOutline {
  const out: ElementOutline = { id: el.id, type: el.type, left: el.left, top: el.top }
  if ('width' in el) out.width = el.width
  if ('height' in el) out.height = el.height
  if ('rotate' in el && el.rotate !== undefined) out.rotate = el.rotate
  const text = elementText(el)
  if (text) out.text = text
  if ((el.type === 'image' || el.type === 'video' || el.type === 'audio') && typeof el.src === 'string') {
    out.src = el.src
  }
  return out
}

function backgroundSummary(background?: SlideBackground): string | undefined {
  if (!background) return undefined
  if (background.type === 'solid') return `纯色 ${background.color ?? ''}`.trim()
  if (background.type === 'image') return `图片 ${background.image?.src ?? ''}`.trim()
  if (background.type === 'gradient') return '渐变'
  return background.type
}

// 未回复的批注：replies 为空，给 Agent 提示用户留了话
function commentOutline(note: Note): CommentOutline {
  return {
    id: note.id,
    user: note.user,
    content: note.content,
    ...(note.elId ? { elId: note.elId } : {}),
    time: note.time,
  }
}

function slideOutline(slide: Slide, index: number): SlideOutline {
  return {
    index,
    id: slide.id,
    ...(slide.type ? { type: slide.type } : {}),
    ...(backgroundSummary(slide.background) ? { background: backgroundSummary(slide.background) } : {}),
    elements: slide.elements.map(elementOutline),
    comments: (slide.notes ?? []).filter(note => !(note.replies ?? []).length).map(commentOutline),
  }
}

// 把文档压缩成大纲，给 get_presentation 的 outline 视图用，省 Agent 的 token
export function toOutline(data: DocData): DocOutline {
  return {
    title: data.title,
    viewportSize: data.viewportSize,
    viewportRatio: data.viewportRatio,
    slideCount: data.slides.length,
    slides: data.slides.map(slideOutline),
  }
}
