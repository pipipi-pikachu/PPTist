import { wrapInList, liftListItem } from 'prosemirror-schema-list'
import type { Node, NodeType } from 'prosemirror-model'
import type { Transaction, EditorState } from 'prosemirror-state'
import { findParentNode, isList } from '../utils'

// 列表节点属性结构。
type Attr = Record<string, number | string>

/**
 * 列表内文本样式属性。
 */
interface TextStyleAttr {
  /** 列表文本颜色。 */
  color?: string
  /** 列表文本字号。 */
  fontsize?: string
}

/**
 * 创建切换列表的 ProseMirror 命令。
 *
 * @param listType - 目标列表节点类型，例如 bullet_list 或 ordered_list。
 * @param itemType - 列表项节点类型。
 * @param listStyleType - 列表样式类型；为空时可用于取消同类型列表。
 * @param textStyleAttr - 写入列表节点的文本样式属性。
 * @returns ProseMirror 命令函数。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 当前选区已经在同类型列表内且没有指定 listStyleType 时，会 lift 列表项，相当于取消列表。
 * - 当前选区在其他列表内时，会尝试把父列表节点转换为目标列表类型。
 * - 当前选区不在列表内时，会 wrapInList 创建新列表。
 */
export const toggleList = (listType: NodeType, itemType: NodeType, listStyleType: string, textStyleAttr: TextStyleAttr = {}) => {
  // 返回符合 ProseMirror command 约定的函数。
  return (state: EditorState, dispatch: (tr: Transaction) => void) => {
    // 当前 schema 和 selection。
    const { schema, selection } = state
    // 选区起止 ResolvedPos。
    const { $from, $to } = selection
    // 获取当前选区块范围。
    const range = $from.blockRange($to)

    // 没有块范围时无法切换列表。
    if (!range) return false

    // 查找当前选区最近的列表父节点。
    const parentList = findParentNode((node: Node) => isList(node, schema))(selection)

    // 当前选区位于列表内，且当前块范围与父列表深度接近时，优先处理已有列表。
    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      // 已经是目标列表，且没有指定特殊列表样式时，取消列表。
      if (parentList.node.type === listType && !listStyleType) {
        // lift 当前列表项到普通块。
        return liftListItem(itemType)(state, dispatch)
      }

      // 当前位于列表内，且目标列表类型可以容纳当前列表内容时，直接转换列表类型。
      if (isList(parentList.node, schema) && listType.validContent(parentList.node.content)) {
        // 当前 transaction。
        const { tr } = state

        // 合并原列表属性和文本样式属性。
        const nodeAttrs: Attr = {
          ...parentList.node.attrs,
          ...textStyleAttr,
        }
        // 存在 listStyleType 时写入列表样式类型。
        if (listStyleType) nodeAttrs.listStyleType = listStyleType

        // 将父列表节点改为目标列表类型。
        tr.setNodeMarkup(parentList.pos, listType, nodeAttrs)

        // dispatch 存在时派发 transaction。
        if (dispatch) dispatch(tr)

        // 保持原有返回语义。
        return false
      }
    }

    // 当前不在列表中时，创建新列表属性。
    const nodeAttrs: Attr = {
      ...textStyleAttr,
    }
    // 写入列表样式类型。
    if (listStyleType) nodeAttrs.listStyleType = listStyleType

    // 使用 ProseMirror 官方 wrapInList 命令包裹当前选区。
    return wrapInList(listType, nodeAttrs)(state, dispatch)
  }
}
