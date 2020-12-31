import { marks } from 'prosemirror-schema-basic'
import { Node } from 'prosemirror-model'

const subscript = {
  excludes: 'subscript',
  parseDOM: [
    { tag: 'sub' },
    {
      style: 'vertical-align',
      getAttrs: (value: string) => value === 'sub' && null
    },
  ],
  toDOM: () => ['sub', 0],
}

const superscript = {
  excludes: 'superscript',
  parseDOM: [
    { tag: 'sup' },
    {
      style: 'vertical-align',
      getAttrs: (value: string) => value === 'super' && null
    },
  ],
  toDOM: () => ['sup', 0],
}

const strikethrough = {
  parseDOM: [
    { tag: 'strike' },
    {
      style: 'text-decoration',
      getAttrs: (value: string) => value === 'line-through' && null
    },
    {
      style: 'text-decoration-line',
      getAttrs: (value: string) => value === 'line-through' && null
    },
  ],
  toDOM: () => ['span', { style: 'text-decoration-line: line-through' }, 0],
}

const underline = {
  parseDOM: [
    { tag: 'u' },
    {
      style: 'text-decoration',
      getAttrs: (value: string) => value === 'underline' && null
    },
    {
      style: 'text-decoration-line',
      getAttrs: (value: string) => value === 'underline' && null
    },
  ],
  toDOM: () => ['span', { style: 'text-decoration: underline' }, 0],
}

const forecolor = {
  attrs: {
    color: {},
  },
  parseDOM: [
    {
      style: 'color',
      getAttrs: (color: string) => color ? { color } : {}
    },
  ],
  toDOM: (node: Node) => {
    const { color } = node.attrs
    let style = ''
    if(color) style += `color: ${color};`
    return ['span', { style }, 0]
  },
}

const backcolor = {
  attrs: {
    backcolor: {},
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      tag: 'span[style*=background-color]',
      getAttrs: (backcolor: string) => backcolor ? { backcolor } : {}
    },
  ],
  toDOM: (node: Node) => {
    const { backcolor } = node.attrs
    let style = ''
    if(backcolor) style += `background-color: ${backcolor};`
    return ['span', { style }, 0]
  },
}

const fontsize = {
  attrs: {
    fontsize: {},
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-size',
      getAttrs: (fontsize: string) => fontsize ? { fontsize } : {}
    },
  ],
  toDOM: (node: Node) => {
    const { fontsize } = node.attrs
    let style = ''
    if(fontsize) style += `font-size: ${fontsize}`
    return ['span', { style }, 0]
  },
}

const fontname = {
  attrs: {
    fontname: '',
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-family',
      getAttrs: (fontname: string) => ({ fontname: fontname ? fontname.replace(/[\"\']/g, '') : '' })
    },
  ],
  toDOM: (node: Node) => {
    const { fontname } = node.attrs
    let style = ''
    if(fontname) style += `font-family: ${fontname}`
    return ['span', { style }, 0]
  },
}

export default {
  ...marks,
  subscript,
  superscript,
  strikethrough,
  underline,
  forecolor,
  backcolor,
  fontsize,
  fontname,
}