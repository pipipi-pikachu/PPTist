import sanitizeHtml from 'sanitize-html'

import type { PPTElement, PPTImageElement, Slide } from '../../../src/types/slides'
import { AppError } from '../errors'
import type { DocData } from './document'

// 富文本白名单取自 doc/AI_PPT_SCHEMA.md「富文本内容约束」一节
// 块级：p/ul/ol/li/blockquote；行内：strong/em/u/strike/sup/sub/code；样式标签：span；外加 br（ProseMirror 硬换行）
const SAFE_STYLE = /^(?![\s\S]*?(?:expression|url\s*\(|javascript|vbscript|behavior|@import))[^;{}<>]{1,200}$/i
const FONT_SIZE = /^\d+(?:\.\d+)?(?:px|em|rem|pt|%)$/i
const TEXT_ALIGN = /^(?:left|right|center|justify|start|end)$/i
const COLORISH = /^(?![\s\S]*?(?:expression|url\s*\(|javascript|vbscript|behavior|@import))[#a-zA-Z0-9\s,()%._-]{1,100}$/i

const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'u', 'strike', 'sup', 'sub', 'code', 'span', 'br'],
  allowedAttributes: { '*': ['style'] },
  allowedStyles: {
    span: {
      'color': [COLORISH],
      'background-color': [COLORISH],
      'font-size': [FONT_SIZE],
      'font-family': [SAFE_STYLE],
    },
    p: { 'text-align': [TEXT_ALIGN] },
    ul: { 'font-size': [FONT_SIZE], 'color': [COLORISH] },
    ol: { 'font-size': [FONT_SIZE], 'color': [COLORISH] },
  },
}

const PLAIN_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
}

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, RICH_TEXT_OPTIONS)
}

export function sanitizePlainText(text: string): string {
  return sanitizeHtml(text, PLAIN_TEXT_OPTIONS)
}

export function isDataImageUrl(src: string): boolean {
  return /^data:image\/(?:png|jpe?g|gif|webp);base64,/i.test(src)
}

// 媒体地址只允许 http(s)、/assets/... 和 data: 图片（后续会被转存）
function checkMediaSrc(src: string, path: string): void {
  if (typeof src !== 'string' || src === '') return
  if (/^https?:\/\//i.test(src)) return
  if (src.startsWith('/assets/')) return
  if (isDataImageUrl(src)) return
  throw AppError.validation('媒体地址不被允许（仅支持 http(s)、/assets/ 和 data: 图片）', [{
    path,
    message: `非法的媒体地址: ${src.slice(0, 80)}`,
  }])
}

function sanitizeLink(el: PPTElement, slideIds: Set<string>, path: string): void {
  const link = el.link
  if (!link || typeof link !== 'object') return
  if (link.type === 'web') {
    if (typeof link.target === 'string' && /^https?:\/\//i.test(link.target)) return
    delete el.link
    return
  }
  if (link.type === 'slide') {
    if (typeof link.target === 'string' && slideIds.has(link.target)) return
    delete el.link
    return
  }
  delete el.link
  void path
}

function sanitizeElement(el: PPTElement, slideIds: Set<string>, path: string): void {
  if (el.type === 'text' && typeof el.content === 'string') {
    el.content = sanitizeRichText(el.content)
  }
  if (el.type === 'shape' && el.text && typeof el.text.content === 'string') {
    el.text.content = sanitizeRichText(el.text.content)
  }
  if (el.type === 'table' && Array.isArray(el.data)) {
    for (const row of el.data) {
      for (const cell of row) {
        if (typeof cell.text === 'string') cell.text = sanitizeRichText(cell.text)
      }
    }
  }
  if (el.type === 'image') checkMediaSrc(el.src, `${path}.src`)
  if (el.type === 'video') {
    checkMediaSrc(el.src, `${path}.src`)
    if (el.poster) checkMediaSrc(el.poster, `${path}.poster`)
  }
  if (el.type === 'audio') checkMediaSrc(el.src, `${path}.src`)
  sanitizeLink(el, slideIds, `${path}.link`)
}

function sanitizeSlide(slide: Slide, slideIds: Set<string>, index: number): void {
  if (typeof slide.remark === 'string') slide.remark = sanitizeRichText(slide.remark)
  if (slide.background?.image?.src) {
    checkMediaSrc(slide.background.image.src, `slides[${index}].background.image.src`)
  }
  for (const [i, el] of slide.elements.entries()) {
    sanitizeElement(el, slideIds, `slides[${index}].elements[${i}]`)
  }
  for (const note of slide.notes ?? []) {
    if (typeof note.content === 'string') note.content = sanitizePlainText(note.content)
    for (const reply of note.replies ?? []) {
      if (typeof reply.content === 'string') reply.content = sanitizePlainText(reply.content)
    }
  }
}

export function sanitizeDocument(doc: DocData): void {
  const slideIds = new Set(doc.slides.map(slide => slide.id))
  for (const [i, slide] of doc.slides.entries()) sanitizeSlide(slide, slideIds, i)
}

// 供写入流水线找出需要转存的 data: 图片地址（image.src / video.poster / 背景图）
export function collectDataImageUrls(doc: DocData): { slideIndex: number, elementIndex: number | null, kind: 'src' | 'poster' | 'background' }[] {
  const found: { slideIndex: number, elementIndex: number | null, kind: 'src' | 'poster' | 'background' }[] = []
  for (const [i, slide] of doc.slides.entries()) {
    if (slide.background?.image?.src && isDataImageUrl(slide.background.image.src)) {
      found.push({ slideIndex: i, elementIndex: null, kind: 'background' })
    }
    for (const [j, el] of slide.elements.entries()) {
      if (el.type === 'image' && isDataImageUrl((el as PPTImageElement).src)) {
        found.push({ slideIndex: i, elementIndex: j, kind: 'src' })
      }
      if (el.type === 'video' && el.poster && isDataImageUrl(el.poster)) {
        found.push({ slideIndex: i, elementIndex: j, kind: 'poster' })
      }
    }
  }
  return found
}
