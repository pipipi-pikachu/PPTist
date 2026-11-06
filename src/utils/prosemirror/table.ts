import { DOMParser, DOMSerializer, Schema, type Mark, type Node } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { closeHistory } from 'prosemirror-history'
import { nodes } from 'prosemirror-schema-basic'
import type { TableCell, TableCellStyle } from '@/types/slides'
import marks from './schema/marks'

export const tableSchema = new Schema({
  nodes: {
    doc: { content: 'paragraph+' },
    paragraph: nodes.paragraph,
    text: nodes.text,
    hard_break: nodes.hard_break,
  },
  marks: {
    strong: marks.strong,
    em: marks.em,
    underline: {
      ...marks.underline,
      parseDOM: [
        { tag: 'u' },
        { style: 'text-decoration', consuming: false, getAttrs: value => String(value).includes('underline') ? null : false },
        { style: 'text-decoration-line', consuming: false, getAttrs: value => String(value).includes('underline') ? null : false },
      ],
    },
    strikethrough: {
      ...marks.strikethrough,
      parseDOM: [
        { tag: 's' }, { tag: 'del' }, { tag: 'strike' },
        { style: 'text-decoration', getAttrs: value => String(value).includes('line-through') ? null : false },
        { style: 'text-decoration-line', getAttrs: value => String(value).includes('line-through') ? null : false },
      ],
    },
    forecolor: marks.forecolor,
    fontsize: marks.fontsize,
    fontname: marks.fontname,
  },
})

export const parseTableText = (html: string) => {
  const container = document.createElement('div')
  container.innerHTML = html
  return DOMParser.fromSchema(tableSchema).parse(container, { preserveWhitespace: 'full' })
}

export const serializeTableText = (doc: Node) => {
  const container = document.createElement('div')
  container.appendChild(DOMSerializer.fromSchema(tableSchema).serializeFragment(doc.content))
  return container.innerHTML
}

// 跨格粘贴也使用文档事务，保留该单元格此前的文字历史，并与相邻输入分组隔离。
export const replaceTableText = (state: EditorState, html: string) => {
  return closeHistory(state.tr.replaceWith(0, state.doc.content.size, parseTableText(html).content))
}

export const plainTextToTableHTML = (text: string) => {
  const container = document.createElement('div')
  container.textContent = text
  return `<p>${container.innerHTML.replace(/\r\n?|\n/g, '<br>')}</p>`
}

export const getTableTextAttrs = (state: EditorState, defaults: TableCellStyle = {}) => {
  let selectedMarks: readonly Mark[] = state.storedMarks || state.selection.$from.marks()
  if (!state.selection.empty) {
    let found = false
    state.doc.nodesBetween(state.selection.from, state.selection.to, node => {
      if (!found && node.isText) {
        selectedMarks = node.marks
        found = true
      }
    })
  }
  const useDefaultMarks = !state.doc.textContent && !state.storedMarks
  const isBold = useDefaultMarks ? !!defaults.bold : !!tableSchema.marks.strong.isInSet(selectedMarks)
  const isEm = useDefaultMarks ? !!defaults.em : !!tableSchema.marks.em.isInSet(selectedMarks)
  const isUnderline = useDefaultMarks ? !!defaults.underline : !!tableSchema.marks.underline.isInSet(selectedMarks)
  const isStrikethrough = useDefaultMarks ? !!defaults.strikethrough : !!tableSchema.marks.strikethrough.isInSet(selectedMarks)
  const color = tableSchema.marks.forecolor.isInSet(selectedMarks)?.attrs.color as string | undefined
  const fontsize = tableSchema.marks.fontsize.isInSet(selectedMarks)?.attrs.fontsize as string | undefined
  const fontname = tableSchema.marks.fontname.isInSet(selectedMarks)?.attrs.fontname as string | undefined

  return {
    bold: isBold,
    em: isEm,
    underline: isUnderline,
    strikethrough: isStrikethrough,
    color: color || defaults.color || '#000000',
    fontsize: fontsize || defaults.fontsize || '14px',
    fontname: fontname || defaults.fontname || '',
  }
}

export type TableTextAttrs = ReturnType<typeof getTableTextAttrs>

export const defaultTableTextAttrs: TableTextAttrs = {
  bold: false,
  em: false,
  underline: false,
  strikethrough: false,
  color: '#000000',
  fontsize: '14px',
  fontname: '',
}

// 工具栏在没有文字选区时修改整格；键盘快捷键仍由 ProseMirror 处理后续输入格式。
export const setTableTextAttrs = (state: EditorState, attrs: Partial<TableTextAttrs>, all = false) => {
  const wholeCell = all || state.selection.empty
  const from = wholeCell ? 0 : state.selection.from
  const to = wholeCell ? state.doc.content.size : state.selection.to
  const tr = state.tr
  const markNames = { bold: 'strong', em: 'em', underline: 'underline', strikethrough: 'strikethrough', color: 'forecolor', fontsize: 'fontsize', fontname: 'fontname' }
  for (const key of Object.keys(attrs) as (keyof TableTextAttrs)[]) {
    const value = attrs[key]
    const type = tableSchema.marks[markNames[key]]
    if (!type || value === undefined) continue
    const mark = value || key === 'fontname' ? type.create(typeof value === 'boolean' ? null : { [key]: value }) : null
    tr.removeMark(from, to, type)
    if (mark) tr.addMark(from, to, mark)
    if (state.selection.empty) {
      if (mark) tr.addStoredMark(mark)
      else tr.removeStoredMark(type)
    }
  }
  return tr
}

export const updateTableCellTextAttrs = (cell: TableCell, attrs: Partial<TableTextAttrs>) => {
  const state = EditorState.create({ doc: parseTableText(cell.text) })
  cell.text = serializeTableText(state.apply(setTableTextAttrs(state, attrs, true)).doc)
  cell.style = { ...cell.style, ...attrs }
}
