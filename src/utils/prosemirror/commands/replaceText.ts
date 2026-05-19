import { EditorView } from 'prosemirror-view'
import { Mark, NodeType, Node } from 'prosemirror-model'

/**
 * 用纯文本替换当前编辑器的全部文档内容。
 *
 * @param view - ProseMirror 编辑器视图。
 * @param newText - 新文本内容，换行符会被拆分为多个块节点。
 * @returns 无显式返回值。
 * @throws 当前函数不主动抛错；schema 创建节点失败时沿用 ProseMirror 行为。
 * @remarks
 * - 会尽量继承原文档首字符位置的 marks 和父节点类型。
 * - 空行会创建空块节点，保留换行结构。
 */
export const replaceText = (view: EditorView, newText: string) => {
  // 当前编辑器状态。
  const { state } = view
  // schema 用于创建节点，doc 用于读取原内容和替换范围。
  const { schema, doc } = state

  // 默认继承的 mark 列表。
  let marks: Mark[] = []
  // 默认块节点类型为 paragraph。
  let nodeType: NodeType = schema.nodes.paragraph

  // 文档有实际内容时，读取首字符所在位置的 marks 和父节点类型。
  if (doc.content.size > 2) {
    // 解析文档中第一个内容位置。
    const firstCharPos = doc.resolve(1)
    
    // 继承首字符 marks，保持替换后基本样式一致。
    marks = [...firstCharPos.marks()]
    
    // 继承首字符父节点类型，例如 paragraph 或 blockquote。
    nodeType = firstCharPos.parent.type
  }

  // 按换行拆分为多个块。
  const lines = newText.split('\n')
  
  // 将每一行文本转换为 ProseMirror 块节点。
  const newNodes: Node[] = lines.map((line: string) => {
    // 空行创建空块节点。
    if (line.trim() === '') return nodeType.create()
    
    // 非空行创建带继承 marks 的文本节点。
    const textNode = schema.text(line, marks)
    // 用继承的块节点类型包裹文本节点。
    return nodeType.create(null, textNode)
  })

  // 创建 transaction。
  const tr = state.tr
  
  // 用新节点替换整个文档内容。
  tr.replaceWith(0, doc.content.size, newNodes)

  // 派发 transaction。
  view.dispatch(tr)
}
