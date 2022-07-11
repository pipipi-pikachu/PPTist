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
    indent: {
      default: 0,
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

        const indent = +((dom as HTMLElement).getAttribute('data-indent') || 0)
      
        return { align, indent }
      }
    }
  ],
  toDOM: (node: Node) => {
    const { align, indent } = node.attrs
    let style = ''
    if (align && align !== 'left') style += `text-align: ${align};`

    const attr = { style }
    if (indent) attr['data-indent'] = indent

    return ['p', attr, 0]
  },
}

// https://github.com/pipipi-pikachu/PPTist/issues/134
const { hard_break, ...otherNodes } = nodes

export default {
  ...otherNodes,
  'ordered_list': _orderedList,
  'bullet_list': _bulletList,
  'list_item': _listItem,
  paragraph,
}
