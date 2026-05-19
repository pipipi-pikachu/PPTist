import { marks } from 'prosemirror-schema-basic'
import type { MarkSpec } from 'prosemirror-model'

/**
 * 下标 mark。
 *
 * @remarks 支持 `<sub>` 标签和 `vertical-align: sub` 样式解析。
 */
const subscript: MarkSpec = {
  // 下标之间互斥，避免重复嵌套同类 mark。
  excludes: 'subscript',
  // DOM 解析规则。
  parseDOM: [
    // sub 标签。
    { tag: 'sub' },
    {
      // vertical-align 样式。
      style: 'vertical-align',
      // 仅 sub 值解析为下标。
      getAttrs: value => value === 'sub' && null
    },
  ],
  // 序列化为 sub 标签。
  toDOM: () => ['sub', 0],
}

/**
 * 上标 mark。
 *
 * @remarks 支持 `<sup>` 标签和 `vertical-align: super` 样式解析。
 */
const superscript: MarkSpec = {
  // 上标之间互斥，避免重复嵌套同类 mark。
  excludes: 'superscript',
  // DOM 解析规则。
  parseDOM: [
    // sup 标签。
    { tag: 'sup' },
    {
      // vertical-align 样式。
      style: 'vertical-align',
      // 仅 super 值解析为上标。
      getAttrs: value => value === 'super' && null
    },
  ],
  // 序列化为 sup 标签。
  toDOM: () => ['sup', 0],
}

/**
 * 删除线 mark。
 *
 * @remarks 兼容 strike 标签、text-decoration 和 text-decoration-line。
 */
const strikethrough: MarkSpec = {
  // DOM 解析规则。
  parseDOM: [
    // 老式 strike 标签。
    { tag: 'strike' },
    {
      // text-decoration 样式。
      style: 'text-decoration',
      // line-through 解析为删除线。
      getAttrs: value => value === 'line-through' && null
    },
    {
      // text-decoration-line 样式。
      style: 'text-decoration-line',
      // line-through 解析为删除线。
      getAttrs: value => value === 'line-through' && null
    },
  ],
  // 序列化为 span + 删除线样式。
  toDOM: () => ['span', { style: 'text-decoration-line: line-through;' }, 0],
}

/**
 * 下划线 mark。
 *
 * @remarks 兼容 u 标签、text-decoration 和 text-decoration-line。
 */
const underline: MarkSpec = {
  // DOM 解析规则。
  parseDOM: [
    // u 标签。
    { tag: 'u' },
    {
      // text-decoration 样式。
      style: 'text-decoration',
      // underline 解析为下划线。
      getAttrs: value => value === 'underline' && null
    },
    {
      // text-decoration-line 样式。
      style: 'text-decoration-line',
      // underline 解析为下划线。
      getAttrs: value => value === 'underline' && null
    },
  ],
  // 序列化为 span + 下划线样式。
  toDOM: () => ['span', { style: 'text-decoration: underline;' }, 0],
}

/**
 * 前景色 mark。
 */
const forecolor: MarkSpec = {
  // mark 属性。
  attrs: {
    // CSS 颜色值。
    color: {},
  },
  // 行内 mark。
  inline: true,
  // 归属 inline 分组。
  group: 'inline',
  // DOM 解析规则。
  parseDOM: [
    {
      // 读取 color 样式。
      style: 'color',
      // 有颜色时保存 color 属性。
      getAttrs: color => color ? { color } : {}
    },
  ],
  // 序列化为 span。
  toDOM: mark => {
    // 读取颜色属性。
    const { color } = mark.attrs
    // 拼接 style。
    let style = ''
    // 输出 color 样式。
    if (color) style += `color: ${color};`
    // 返回 span DOM 表达。
    return ['span', { style }, 0]
  },
}

/**
 * 背景色 mark。
 */
const backcolor: MarkSpec = {
  // mark 属性。
  attrs: {
    // CSS 背景色。
    backcolor: {},
  },
  // 行内 mark。
  inline: true,
  // 归属 inline 分组。
  group: 'inline',
  // DOM 解析规则。
  parseDOM: [
    {
      // 读取 background-color 样式。
      style: 'background-color',
      // 有背景色时保存 backcolor 属性。
      getAttrs: backcolor => backcolor ? { backcolor } : {}
    },
  ],
  // 序列化为 span。
  toDOM: mark => {
    // 读取背景色属性。
    const { backcolor } = mark.attrs
    // 拼接 style。
    let style = ''
    // 输出 background-color。
    if (backcolor) style += `background-color: ${backcolor};`
    // 返回 span DOM 表达。
    return ['span', { style }, 0]
  },
}

/**
 * 文本渐变 mark。
 *
 * @remarks 使用背景渐变 + background-clip:text + transparent color 表达渐变文字。
 */
const textgradient: MarkSpec = {
  // mark 属性。
  attrs: {
    // CSS linear-gradient 字符串。
    gradient: {},
  },
  // 行内 mark。
  inline: true,
  // 归属 inline 分组。
  group: 'inline',
  // 不排斥其他 mark，允许和字号/字体等叠加。
  excludes: '',
  // DOM 解析规则。
  parseDOM: [
    {
      // 读取 background 样式。
      style: 'background',
      // 只有 linear-gradient 才识别为文本渐变。
      getAttrs: value => {
        if (value && typeof value === 'string' && value.includes('linear-gradient')) {
          return { gradient: value }
        }
        return false
      }
    },
  ],
  // 序列化为 span。
  toDOM: mark => {
    // 读取渐变属性。
    const { gradient } = mark.attrs
    // 拼接 style。
    let style = ''
    // 输出渐变文字所需 CSS。
    if (gradient) {
      style += `background: ${gradient}; background-clip: text; -webkit-background-clip: text; color: transparent;`
    }
    // 返回 span DOM 表达。
    return ['span', { style }, 0]
  },
}

/**
 * 字号 mark。
 */
const fontsize: MarkSpec = {
  // mark 属性。
  attrs: {
    // CSS font-size。
    fontsize: {},
  },
  // 行内 mark。
  inline: true,
  // 归属 inline 分组。
  group: 'inline',
  // DOM 解析规则。
  parseDOM: [
    {
      // 读取 font-size 样式。
      style: 'font-size',
      // 有字号时保存 fontsize 属性。
      getAttrs: fontsize => fontsize ? { fontsize } : {}
    },
  ],
  // 序列化为 span。
  toDOM: mark => {
    // 读取字号。
    const { fontsize } = mark.attrs
    // 拼接 style。
    let style = ''
    // 输出 font-size。
    if (fontsize) style += `font-size: ${fontsize};`
    // 返回 span DOM 表达。
    return ['span', { style }, 0]
  },
}

/**
 * 字体 mark。
 */
const fontname: MarkSpec = {
  // mark 属性。
  attrs: {
    // CSS font-family。
    fontname: {},
  },
  // 行内 mark。
  inline: true,
  // 归属 inline 分组。
  group: 'inline',
  // DOM 解析规则。
  parseDOM: [
    {
      // 读取 font-family 样式。
      style: 'font-family',
      // 去掉浏览器可能补上的引号，保存纯字体名。
      getAttrs: fontname => {
        return { fontname: fontname && typeof fontname === 'string' ? fontname.replace(/[\"\']/g, '') : '' }
      }
    },
  ],
  // 序列化为 span。
  toDOM: mark => {
    // 读取字体名。
    const { fontname } = mark.attrs
    // 拼接 style。
    let style = ''
    // 输出 font-family。
    if (fontname) style += `font-family: ${fontname};`
    // 返回 span DOM 表达。
    return ['span', { style }, 0]
  },
}

/**
 * 链接 mark。
 */
const link: MarkSpec = {
  // 链接属性。
  attrs: {
    // 链接地址。
    href: {},
    // 链接标题。
    title: { default: null },
    // 链接打开目标。
    target: { default: '_blank' },
  },
  // 光标移动到链接末尾后继续输入不自动继承链接。
  inclusive: false,
  // DOM 解析规则。
  parseDOM: [
    {
      // 解析带 href 的 a 标签。
      tag: 'a[href]',
      // 提取 href 和 title。
      getAttrs: dom => {
        const href = (dom as HTMLElement).getAttribute('href')
        const title = (dom as HTMLElement).getAttribute('title')
        return { href, title }
      }
    },
  ],
  // 序列化为 a 标签。
  toDOM: node => ['a', node.attrs, 0],
}

/**
 * 搜索高亮 mark。
 *
 * @remarks 用于搜索面板高亮命中项，data-index 对应搜索结果索引。
 */
const mark: MarkSpec = {
  // 高亮属性。
  attrs: {
    // 搜索结果索引。
    index: { default: null },
  },
  // DOM 解析规则。
  parseDOM: [
    {
      // 解析 mark 标签。
      tag: 'mark',
      // 提取 data-index。
      getAttrs: dom => {
        const index = (dom as HTMLElement).dataset.index
        return { index }
      }
    },
  ],
  // 序列化为 mark 标签。
  toDOM: node => ['mark', { 'data-index': node.attrs.index }, 0],
}

// 复用基础 schema 的斜体、加粗和代码 mark。
const { em, strong, code } = marks

// 项目富文本 mark 定义集合。
export default {
  em,
  strong,
  fontsize,
  fontname,
  code,
  textgradient,
  forecolor,
  backcolor,
  subscript,
  superscript,
  strikethrough,
  underline,
  link,
  mark,
}
