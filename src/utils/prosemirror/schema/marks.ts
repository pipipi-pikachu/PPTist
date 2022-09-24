import { marks } from 'prosemirror-schema-basic'
import { MarkSpec } from 'prosemirror-model'

const subscript: MarkSpec = {
  excludes: 'subscript',
  parseDOM: [
    { tag: 'sub' },
    {
      style: 'vertical-align',
      getAttrs: value => value === 'sub' && null
    },
  ],
  toDOM: () => ['sub', 0],
}

const superscript: MarkSpec = {
  excludes: 'superscript',
  parseDOM: [
    { tag: 'sup' },
    {
      style: 'vertical-align',
      getAttrs: value => value === 'super' && null
    },
  ],
  toDOM: () => ['sup', 0],
}

const strikethrough: MarkSpec = {
  parseDOM: [
    { tag: 'strike' },
    {
      style: 'text-decoration',
      getAttrs: value => value === 'line-through' && null
    },
    {
      style: 'text-decoration-line',
      getAttrs: value => value === 'line-through' && null
    },
  ],
  toDOM: () => ['span', { style: 'text-decoration-line: line-through' }, 0],
}

const underline: MarkSpec = {
  parseDOM: [
    { tag: 'u' },
    {
      style: 'text-decoration',
      getAttrs: value => value === 'underline' && null
    },
    {
      style: 'text-decoration-line',
      getAttrs: value => value === 'underline' && null
    },
  ],
  toDOM: () => ['span', { style: 'text-decoration: underline' }, 0],
}

const forecolor: MarkSpec = {
  attrs: {
    color: {},
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'color',
      getAttrs: color => color ? { color } : {}
    },
  ],
  toDOM: mark => {
    const { color } = mark.attrs
    let style = ''
    if (color) style += `color: ${color};`
    return ['span', { style }, 0]
  },
}

const backcolor: MarkSpec = {
  attrs: {
    backcolor: {},
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'background-color',
      getAttrs: backcolor => backcolor ? { backcolor } : {}
    },
  ],
  toDOM: mark => {
    const { backcolor } = mark.attrs
    let style = ''
    if (backcolor) style += `background-color: ${backcolor};`
    return ['span', { style }, 0]
  },
}

const fontsize: MarkSpec = {
  attrs: {
    fontsize: {},
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-size',
      getAttrs: fontsize => fontsize ? { fontsize } : {}
    },
  ],
  toDOM: mark => {
    const { fontsize } = mark.attrs
    let style = ''
    if (fontsize) style += `font-size: ${fontsize}`
    return ['span', { style }, 0]
  },
}

const fontname: MarkSpec = {
  attrs: {
    fontname: {},
  },
  inline: true,
  group: 'inline',
  parseDOM: [
    {
      style: 'font-family',
      getAttrs: fontname => {
        return { fontname: fontname && typeof fontname === 'string' ? fontname.replace(/[\"\']/g, '') : '' }
      }
    },
  ],
  toDOM: mark => {
    const { fontname } = mark.attrs
    let style = ''
    if (fontname) style += `font-family: ${fontname}`
    return ['span', { style }, 0]
  },
}

const link: MarkSpec = {
  attrs: {
    href: {},
    title: { default: null },
    target: { default: '_blank' },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs: dom => {
        const href = (dom as HTMLElement).getAttribute('href')
        const title = (dom as HTMLElement).getAttribute('title')
        return { href, title }
      }
    },
  ],
  toDOM: node => ['a', node.attrs, 0],
}

export default {
  ...marks,
  fontsize,
  fontname,
  forecolor,
  backcolor,
  subscript,
  superscript,
  strikethrough,
  underline,
  link,
}