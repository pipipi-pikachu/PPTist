import { nodes } from 'prosemirror-schema-basic'
import { Node, NodeSpec } from 'prosemirror-model'
import { orderedList, bulletList, listItem } from 'prosemirror-schema-list'

const _orderedList: NodeSpec = {
  ...orderedList,
  content: 'list_item+',
  group: 'block',
}

const _bulletList: NodeSpec = {
  ...bulletList,
  content: 'list_item+',
  group: 'block',
}

const _listItem: NodeSpec = {
  ...listItem,
  content: 'paragraph block*',
  group: 'block',
}

const paragraph: NodeSpec = {
  attrs: {
    align: {
      default: '',
    },
  },
  content: 'inline*',
  group: 'block',
  parseDOM: [
    {
      tag: 'p',
      getAttrs: dom => {
        const { textAlign } = (dom as HTMLElement).style
        let align = (dom as HTMLElement).getAttribute('align') || textAlign || ''
        align = /(left|right|center|justify)/.test(align) ? align : ''
      
        return { align }
      }
    }
  ],
  toDOM: (node: Node) => {
    const { align } = node.attrs
    let style = ''
    if (align && align !== 'left') style += `text-align: ${align};`

    return ['p', { style }, 0]
  },
}

export default {
  ...nodes,
  'ordered_list': _orderedList,
  'bullet_list': _bulletList,
  'list_item': _listItem,
  paragraph,
}
