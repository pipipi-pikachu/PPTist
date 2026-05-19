import type { Schema, Node, NodeType } from 'prosemirror-model'
import type { Transaction } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

/**
 * 在指定 transaction 中设置选区内块节点的文本对齐方式。
 *
 * @param tr - 当前 transaction。
 * @param schema - 当前编辑器 schema。
 * @param alignment - 目标对齐方式；空字符串会清除 align 属性。
 * @returns 更新后的 transaction。
 * @throws 当前函数不主动抛错。
 * @remarks 仅处理 blockquote、list_item 和 paragraph，避免对非文本块写入无效属性。
 */
export const setTextAlign = (tr: Transaction, schema: Schema, alignment: string) => {
  // 从 transaction 中读取当前 selection 和文档。
  const { selection, doc } = tr
  // 没有 selection 或 doc 时原样返回。
  if (!selection || !doc) return tr

  // 当前选区范围。
  const { from, to } = selection
  // schema 节点集合。
  const { nodes } = schema

  // 支持对齐属性的引用块节点。
  const blockquote = nodes.blockquote
  // 支持对齐属性的列表项节点。
  const listItem = nodes.list_item
  // 支持对齐属性的段落节点。
  const paragraph = nodes.paragraph

  /**
   * 待更新节点任务。
   */
  interface Task {
    /** 待更新节点。 */
    node: Node
    /** 节点在文档中的位置。 */
    pos: number
    /** 节点类型。 */
    nodeType: NodeType
  }

  // 收集需要更新的节点，避免遍历过程中直接修改导致位置映射干扰。
  const tasks: Task[] = []
  // alignment 为空时统一归一化为空字符串。
  alignment = alignment || ''

  // 允许写入 align 的节点类型集合。
  const allowedNodeTypes = new Set([blockquote, listItem, paragraph])

  // 遍历选区内节点。
  doc.nodesBetween(from, to, (node, pos) => {
    // 当前节点类型。
    const nodeType = node.type
    // 当前节点对齐方式。
    const align = node.attrs.align || ''
    // 对齐方式不同且节点类型允许时加入更新任务。
    if (align !== alignment && allowedNodeTypes.has(nodeType)) {
      tasks.push({
        node,
        pos,
        nodeType,
      })
    }
    // 返回 true 表示继续遍历子节点。
    return true
  })

  // 没有需要更新的节点时直接返回原 transaction。
  if (!tasks.length) return tr

  // 逐个更新节点属性。
  tasks.forEach(task => {
    // 解构任务。
    const { node, pos, nodeType } = task
    // 当前节点属性。
    let { attrs } = node
    // 有 alignment 时写入 align。
    if (alignment) attrs = { ...attrs, align: alignment }
    // 空 alignment 时清除 align。
    else attrs = { ...attrs, align: null }
    // 更新节点 markup，保留 marks。
    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks)
  })

  // 返回更新后的 transaction。
  return tr
}

/**
 * 执行文本对齐命令并派发 transaction。
 *
 * @param view - ProseMirror 编辑器视图。
 * @param alignment - 目标对齐方式。
 * @returns 无显式返回值。
 * @throws 当前函数不主动抛错。
 */
export const alignmentCommand = (view: EditorView, alignment: string) => {
  // 当前编辑器状态。
  const { state } = view
  // schema 和当前 selection。
  const { schema, selection } = state
  // 基于当前 selection 创建对齐 transaction。
  const tr = setTextAlign(
    state.tr.setSelection(selection),
    schema,
    alignment,
  )
  // 派发对齐 transaction。
  view.dispatch(tr)
}
