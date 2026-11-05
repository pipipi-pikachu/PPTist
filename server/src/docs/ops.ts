import { nanoid } from 'nanoid'

import type { PPTElement, Slide, SlideTheme } from '../../../src/types/slides'
import { AppError } from '../errors'
import { parseElement, parseSlide, type DocData } from '../schema/document'

export interface OpAddSlides {
  op: 'addSlides'
  slides: Slide[]
  index?: number
}
export interface OpUpdateSlide {
  op: 'updateSlide'
  slideId: string
  props: Partial<Omit<Slide, 'id' | 'elements'>>
}
export interface OpDeleteSlides {
  op: 'deleteSlides'
  slideIds: string[]
}
export interface OpMoveSlide {
  op: 'moveSlide'
  slideId: string
  toIndex: number
}
export interface OpAddElements {
  op: 'addElements'
  slideId: string
  elements: PPTElement[]
  index?: number
}
export interface OpUpdateElements {
  op: 'updateElements'
  updates: { id: string, props: Record<string, unknown> }[]
}
export interface OpDeleteElements {
  op: 'deleteElements'
  ids: string[]
}
export interface OpSetTheme {
  op: 'setTheme'
  theme: Partial<SlideTheme>
}
export interface OpSetTitle {
  op: 'setTitle'
  title: string
}
export interface OpAddNote {
  op: 'addNote'
  slideId: string
  content: string
  elId?: string
}
export interface OpReplyNote {
  op: 'replyNote'
  slideId: string
  noteId: string
  content: string
}

export type Op =
  | OpAddSlides
  | OpUpdateSlide
  | OpDeleteSlides
  | OpMoveSlide
  | OpAddElements
  | OpUpdateElements
  | OpDeleteElements
  | OpSetTheme
  | OpSetTitle
  | OpAddNote
  | OpReplyNote

function requireSlide(doc: DocData, slideId: string): Slide {
  const slide = doc.slides.find(item => item.id === slideId)
  if (!slide) throw AppError.validation(`找不到页面 id=${slideId}`)
  return slide
}

function findElement(doc: DocData, id: string): PPTElement | undefined {
  for (const slide of doc.slides) {
    const el = slide.elements.find(item => item.id === id)
    if (el) return el
  }
  return undefined
}

// Agent 原子操作：按顺序执行，任何一步失败整体回滚（在副本上操作）
export function applyOps(doc: DocData, ops: Op[]): DocData {
  const next = structuredClone(doc)
  ops.forEach((op, i) => applyOp(next, op, i))
  return next
}

function applyOp(doc: DocData, op: Op, index: number): void {
  const where = `ops[${index}]`

  switch (op.op) {
    case 'addSlides': {
      if (!Array.isArray(op.slides) || !op.slides.length) {
        throw AppError.validation(`${where}: slides 不能为空`)
      }
      const slides = op.slides.map(slide => parseSlide(slide))
      const at = op.index === undefined ? doc.slides.length : op.index
      if (!Number.isInteger(at) || at < 0 || at > doc.slides.length) {
        throw AppError.validation(`${where}: index=${op.index} 超出范围（0~${doc.slides.length}）`)
      }
      doc.slides.splice(at, 0, ...slides)
      return
    }

    case 'updateSlide': {
      const slide = requireSlide(doc, op.slideId)
      const props = { ...op.props }
      delete (props as Record<string, unknown>).id
      delete (props as Record<string, unknown>).elements
      Object.assign(slide, props)
      return
    }

    case 'deleteSlides': {
      if (!Array.isArray(op.slideIds) || !op.slideIds.length) {
        throw AppError.validation(`${where}: slideIds 不能为空`)
      }
      const missing = op.slideIds.filter(id => !doc.slides.some(slide => slide.id === id))
      if (missing.length) throw AppError.validation(`找不到页面 id=${missing.join(', ')}`)
      const remove = new Set(op.slideIds)
      doc.slides = doc.slides.filter(slide => !remove.has(slide.id))
      return
    }

    case 'moveSlide': {
      const at = doc.slides.findIndex(slide => slide.id === op.slideId)
      if (at < 0) throw AppError.validation(`找不到页面 id=${op.slideId}`)
      if (!Number.isInteger(op.toIndex) || op.toIndex < 0 || op.toIndex >= doc.slides.length) {
        throw AppError.validation(`${where}: toIndex=${op.toIndex} 超出范围（0~${doc.slides.length - 1}）`)
      }
      const [slide] = doc.slides.splice(at, 1)
      doc.slides.splice(op.toIndex, 0, slide)
      return
    }

    case 'addElements': {
      const slide = requireSlide(doc, op.slideId)
      if (!Array.isArray(op.elements) || !op.elements.length) {
        throw AppError.validation(`${where}: elements 不能为空`)
      }
      const elements = op.elements.map(el => parseElement(el))
      const at = op.index === undefined ? slide.elements.length : op.index
      if (!Number.isInteger(at) || at < 0 || at > slide.elements.length) {
        throw AppError.validation(`${where}: index=${op.index} 超出范围（0~${slide.elements.length}）`)
      }
      slide.elements.splice(at, 0, ...elements)
      return
    }

    case 'updateElements': {
      if (!Array.isArray(op.updates) || !op.updates.length) {
        throw AppError.validation(`${where}: updates 不能为空`)
      }
      // 先校验全部 id 都存在再应用，保证原子性
      for (const update of op.updates) {
        if (!findElement(doc, update.id)) throw AppError.validation(`找不到元素 id=${update.id}`)
      }
      for (const update of op.updates) {
        const el = findElement(doc, update.id)!
        const props = { ...(update.props ?? {}) }
        delete props.id
        delete props.type
        Object.assign(el, props)
      }
      return
    }

    case 'deleteElements': {
      if (!Array.isArray(op.ids) || !op.ids.length) {
        throw AppError.validation(`${where}: ids 不能为空`)
      }
      const missing = op.ids.filter(id => !findElement(doc, id))
      if (missing.length) throw AppError.validation(`找不到元素 id=${missing.join(', ')}`)
      const remove = new Set(op.ids)
      for (const slide of doc.slides) {
        slide.elements = slide.elements.filter(el => !remove.has(el.id))
      }
      return
    }

    case 'setTheme': {
      if (!op.theme || typeof op.theme !== 'object') {
        throw AppError.validation(`${where}: theme 必须是对象`)
      }
      Object.assign(doc.theme, op.theme)
      return
    }

    case 'setTitle': {
      if (typeof op.title !== 'string' || !op.title) {
        throw AppError.validation(`${where}: title 必须是非空字符串`)
      }
      doc.title = op.title
      return
    }

    case 'addNote': {
      const slide = requireSlide(doc, op.slideId)
      if (typeof op.content !== 'string' || !op.content) {
        throw AppError.validation(`${where}: content 不能为空`)
      }
      if (op.elId && !slide.elements.some(el => el.id === op.elId)) {
        throw AppError.validation(`找不到元素 id=${op.elId}（批注关联元素）`)
      }
      slide.notes = slide.notes ?? []
      slide.notes.push({
        id: nanoid(10),
        content: op.content,
        time: Date.now(),
        user: 'Agent',
        ...(op.elId ? { elId: op.elId } : {}),
        replies: [],
      })
      return
    }

    case 'replyNote': {
      const slide = requireSlide(doc, op.slideId)
      const note = slide.notes?.find(item => item.id === op.noteId)
      if (!note) throw AppError.validation(`找不到批注 id=${op.noteId}`)
      if (typeof op.content !== 'string' || !op.content) {
        throw AppError.validation(`${where}: content 不能为空`)
      }
      note.replies = note.replies ?? []
      note.replies.push({ id: nanoid(10), content: op.content, time: Date.now(), user: 'Agent' })
      return
    }

    default:
      throw AppError.validation(`未知操作: ${JSON.stringify((op as { op?: string }).op ?? op)}`)
  }
}
