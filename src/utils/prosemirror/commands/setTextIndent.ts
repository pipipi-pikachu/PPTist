import type { Schema } from 'prosemirror-model'
import { type Transaction, TextSelection, AllSelection } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { isList } from '../utils'

// 支持修改的缩进属性名。
type IndentKey = 'indent' | 'textIndent'

/**
 * 修改指定节点的缩进属性。
 *
 * @param tr - 当前 transaction。
 * @param pos - 目标节点位置。
 * @param delta - 缩进变化量，正数增加，负数减少。
 * @param indentKey - 需要修改的缩进属性名。
 * @returns 更新后的 transaction。
 * @throws 当前函数不主动抛错。
 * @remarks 缩进范围被限制在 0 到 8，避免生成过深缩进。
 */
function setNodeIndentMarkup(tr: Transaction, pos: number, delta: number, indentKey: IndentKey): Transaction {
  // 没有文档时直接返回。
  if (!tr.doc) return tr

  // 读取目标位置节点。
  const node = tr.doc.nodeAt(pos)
  // 节点不存在时直接返回。
  if (!node) return tr

  // 最小缩进等级。
  const minIndent = 0
  // 最大缩进等级。
  const maxIndent = 8

  // 计算新缩进等级。
  let indent = (node.attrs[indentKey] || 0) + delta
  // 夹紧到最小缩进。
  if (indent < minIndent) indent = minIndent
  // 夹紧到最大缩进。
  if (indent > maxIndent) indent = maxIndent

  // 缩进未变化时不产生 transaction 变更。
  if (indent === node.attrs[indentKey]) return tr

  // 构造新节点属性。
  const nodeAttrs = {
    // 保留原属性。
    ...node.attrs,
    // 写入目标缩进属性。
    [indentKey]: indent,
  }

  // 更新节点 markup，保留节点类型和 marks。
  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks)
}

/**
 * 批量设置当前选区内段落/引用块的缩进属性。
 *
 * @param tr - 当前 transaction。
 * @param schema - 当前编辑器 schema。
 * @param delta - 缩进变化量。
 * @param indentKey - 需要修改的缩进属性名。
 * @returns 更新后的 transaction。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 仅处理 TextSelection 和 AllSelection。
 * - 遇到列表节点时停止深入，列表缩进应由列表命令处理。
 */
const setIndent = (tr: Transaction, schema: Schema, delta: number, indentKey: IndentKey): Transaction => {
  // 当前 selection 和文档。
  const { selection, doc } = tr
  // 缺失 selection 或 doc 时直接返回。
  if (!selection || !doc) return tr

  // 仅支持文本选区和全选。
  if (!(selection instanceof TextSelection || selection instanceof AllSelection)) return tr

  // 当前选区范围。
  const { from, to } = selection

  // 遍历选区内节点。
  doc.nodesBetween(from, to, (node, pos) => {
    // 当前节点类型。
    const nodeType = node.type

    // 段落和引用块支持 indent/textIndent。
    if (nodeType.name === 'paragraph' || nodeType.name === 'blockquote') {
      // 更新当前节点缩进。
      tr = setNodeIndentMarkup(tr, pos, delta, indentKey)
      // 不继续深入该块节点。
      return false
    } 
    // 列表节点不在此处处理。
    else if (isList(node, schema)) return false
    // 其他节点继续遍历子节点。
    return true
  })

  // 返回更新后的 transaction。
  return tr
}

/**
 * 调整段落整体缩进。
 *
 * @param view - ProseMirror 编辑器视图。
 * @param delta - 缩进变化量。
 * @returns 发生文档变更时返回 true，否则返回 false。
 * @throws 当前函数不主动抛错。
 */
export const indentCommand = (view: EditorView, delta: number) => {
  // 当前编辑器状态。
  const { state } = view
  // schema 和 selection。
  const { schema, selection } = state

  // 创建缩进 transaction。
  const tr = setIndent(
    state.tr.setSelection(selection),
    schema,
    delta,
    'indent',
  )
  // 有文档变更时派发。
  if (tr.docChanged) {
    view.dispatch(tr)
    return true
  }

  // 没有变更时返回 false。
  return false
}

/**
 * 调整段落首行缩进。
 *
 * @param view - ProseMirror 编辑器视图。
 * @param delta - 缩进变化量。
 * @returns 发生文档变更时返回 true，否则返回 false。
 * @throws 当前函数不主动抛错。
 */
export const textIndentCommand = (view: EditorView, delta: number) => {
  // 当前编辑器状态。
  const { state } = view
  // schema 和 selection。
  const { schema, selection } = state

  // 创建首行缩进 transaction。
  const tr = setIndent(
    state.tr.setSelection(selection),
    schema,
    delta,
    'textIndent',
  )
  // 有文档变更时派发。
  if (tr.docChanged) {
    view.dispatch(tr)
    return true
  }

  // 没有变更时返回 false。
  return false
}
