import type { EditorView } from 'prosemirror-view'
import { isList } from '../utils'

// 列表样式属性写入结构。
type Style = Record<string, string>

/**
 * 设置当前选区内列表节点的样式属性。
 *
 * @param view - ProseMirror 编辑器视图。
 * @param style - 单个样式对象或样式对象数组，每项需包含 key/value。
 * @returns 无显式返回值；会直接派发 transaction。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 仅当列表节点完整落入选区附近时才更新，避免误改外层列表。
 * - 常用于设置有序/无序列表的 listStyleType 等属性。
 */
export const setListStyle = (view: EditorView, style: Style | Style[]) => {
  // 当前编辑器状态。
  const { state } = view
  // schema 和 selection。
  const { schema, selection } = state
  // 创建带当前 selection 的 transaction。
  const tr = state.tr.setSelection(selection)
  
  // transaction 文档。
  const { doc } = tr
  // 没有文档时直接返回 transaction。
  if (!doc) return tr

  // 当前选区范围。
  const { from, to } = selection
  // 遍历选区内节点。
  doc.nodesBetween(from, to, (node, pos) => {
    // 仅处理列表节点。
    if (isList(node, schema)) {
      // 确保列表节点大致处于选区范围内；保留原有前后 3 个位置的容忍窗口。
      if (from - 3 <= pos && to + 3 >= pos + node.nodeSize) {
        // 统一转换为数组，便于批量写入。
        const styles = Array.isArray(style) ? style : [style]

        // 逐个写入样式属性。
        for (const style of styles) {
          // setNodeAttribute 会修改指定列表节点属性。
          tr.setNodeAttribute(pos, style.key, style.value)
        }
      }
    }
    // 返回 false 表示不深入当前节点子树，列表样式只需要处理列表节点本身。
    return false
  })

  // 派发 transaction。
  view.dispatch(tr)
}
