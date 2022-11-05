import { wrapInList, liftListItem } from 'prosemirror-schema-list'
import { Schema, Node, NodeType } from 'prosemirror-model'
import { Transaction, EditorState } from 'prosemirror-state'
import { findParentNode } from '../utils'

export const isList = (node: Node, schema: Schema) => {
  return (
    node.type === schema.nodes.bullet_list ||
    node.type === schema.nodes.ordered_list
  )
}

export const toggleList = (listType: NodeType, itemType: NodeType, listStyleType?: string) => {
  return (state: EditorState, dispatch: (tr: Transaction) => void) => {
    const { schema, selection } = state
    const { $from, $to } = selection
    const range = $from.blockRange($to)

    if (!range) return false

    const parentList = findParentNode((node: Node) => isList(node, schema))(selection)

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      if (parentList.node.type === listType && !listStyleType) {
        return liftListItem(itemType)(state, dispatch)
      }

      if (isList(parentList.node, schema) && listType.validContent(parentList.node.content)) {
        const { tr } = state
        if (listStyleType) {
          const nodeAttrs = {
            ...parentList.node.attrs,
            listStyleType: listStyleType,
          }
          tr.setNodeMarkup(parentList.pos, listType, nodeAttrs)
        }
        else tr.setNodeMarkup(parentList.pos, listType)

        if (dispatch) dispatch(tr)

        return false
      }
    }

    if (listStyleType) return wrapInList(listType, { listStyleType })(state, dispatch)
    return wrapInList(listType)(state, dispatch)
  }
}