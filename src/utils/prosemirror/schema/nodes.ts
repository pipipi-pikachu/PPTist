import { nodes } from 'prosemirror-schema-basic'
import type { Node, NodeSpec } from 'prosemirror-model'
import { listItem as _listItem } from 'prosemirror-schema-list'

// 节点 DOM 属性对象类型。
type Attr = Record<string, number | string>

/**
 * 有序列表节点定义。
 *
 * @remarks 扩展基础 ordered_list，额外支持列表样式、字号和颜色，便于富文本样式导入导出。
 */
const orderedList: NodeSpec = {
  // 列表节点属性。
  attrs: {
    // 起始序号。
    order: {
      default: 1,
    },
    // CSS list-style-type。
    listStyleType: {
      default: '',
    },
    // 列表字号。
    fontsize: {
      default: '',
    },
    // 列表文字颜色。
    color: {
      default: '',
    },
  },
  // 有序列表必须包含一个或多个 list_item。
  content: 'list_item+',
  // 有序列表是块级节点。
  group: 'block',
  // 从 DOM 解析 ol。
  parseDOM: [
    { 
      tag: 'ol', 
      // 从 DOM 元素提取列表属性。
      getAttrs: dom => {
        // start 属性控制有序列表起始序号。
        const order = ((dom as HTMLElement).hasAttribute('start') ? (dom as HTMLElement).getAttribute('start') : 1) || 1
        // 初始化属性对象。
        const attr: Attr = { order: +order }

        // 读取内联样式。
        const { listStyleType, fontSize, color } = (dom as HTMLElement).style
        // 记录列表符号样式。
        if (listStyleType) attr['listStyleType'] = listStyleType
        // 记录字号。
        if (fontSize) attr['fontsize'] = fontSize
        // 记录颜色。
        if (color) attr['color'] = color

        // 返回节点属性。
        return attr
      }
    }
  ],
  // 序列化为 DOM。
  toDOM: (node: Node) => {
    // 读取节点属性。
    const { order, listStyleType, fontsize, color } = node.attrs
    // 拼接 style 字符串。
    let style = ''
    // 输出列表符号样式。
    if (listStyleType) style += `list-style-type: ${listStyleType};`
    // 输出字号。
    if (fontsize) style += `font-size: ${fontsize};`
    // 输出颜色。
    if (color) style += `color: ${color};`

    // DOM 属性对象。
    const attr: Attr = { style }
    // 起始序号不是 1 时输出 start 属性。
    if (order !== 1) attr['start'] = order


    // 0 表示子内容插槽。
    return ['ol', attr, 0]
  },
}

/**
 * 无序列表节点定义。
 *
 * @remarks 扩展基础 bullet_list，支持列表样式、字号和颜色。
 */
const bulletList: NodeSpec = {
  // 列表节点属性。
  attrs: {
    // CSS list-style-type。
    listStyleType: {
      default: '',
    },
    // 列表字号。
    fontsize: {
      default: '',
    },
    // 列表文字颜色。
    color: {
      default: '',
    },
  },
  // 无序列表必须包含一个或多个 list_item。
  content: 'list_item+',
  // 无序列表是块级节点。
  group: 'block',
  // 从 DOM 解析 ul。
  parseDOM: [
    {
      tag: 'ul',
      // 从 DOM 元素提取列表样式属性。
      getAttrs: dom => {
        // 初始化属性对象。
        const attr: Attr = {}

        // 读取内联样式。
        const { listStyleType, fontSize, color } = (dom as HTMLElement).style
        // 记录列表符号样式。
        if (listStyleType) attr['listStyleType'] = listStyleType
        // 记录字号。
        if (fontSize) attr['fontsize'] = fontSize
        // 记录颜色。
        if (color) attr['color'] = color

        // 返回节点属性。
        return attr
      }
    }
  ],
  // 序列化为 DOM。
  toDOM: (node: Node) => {
    // 读取节点属性。
    const { listStyleType, fontsize, color } = node.attrs
    // 拼接 style 字符串。
    let style = ''
    // 输出列表符号样式。
    if (listStyleType) style += `list-style-type: ${listStyleType};`
    // 输出字号。
    if (fontsize) style += `font-size: ${fontsize};`
    // 输出颜色。
    if (color) style += `color: ${color};`

    // 返回 ul DOM 表达。
    return ['ul', { style }, 0]
  },
}

/**
 * 列表项节点定义。
 *
 * @remarks 基于 prosemirror-schema-list 的 listItem 扩展，限制内容从 paragraph 开始。
 */
const listItem: NodeSpec = {
  // 继承官方 list_item 行为。
  ..._listItem,
  // 列表项必须以 paragraph 开头，后面可接其他 block。
  content: 'paragraph block*',
  // 列表项作为块级节点参与编辑。
  group: 'block',
}

/**
 * 段落节点定义。
 *
 * @remarks 增加 align、indent、textIndent 属性，用于 PPT 富文本对齐和缩进。
 */
const paragraph: NodeSpec = {
  // 段落属性。
  attrs: {
    // 文本对齐方式。
    align: {
      default: '',
    },
    // 段落缩进等级。
    indent: {
      default: 0,
    },
    // 首行缩进等级。
    textIndent: {
      default: 0,
    },
  },
  // 段落内容为任意 inline。
  content: 'inline*',
  // 段落是块级节点。
  group: 'block',
  // DOM 解析规则。
  parseDOM: [
    {
      tag: 'p',
      // 从 p 标签提取对齐和缩进属性。
      getAttrs: dom => {
        // 读取样式中的 text-align 和 text-indent。
        const { textAlign, textIndent } = (dom as HTMLElement).style

        // align 属性优先，其次使用样式 text-align。
        let align = (dom as HTMLElement).getAttribute('align') || textAlign || ''
        // 只接受支持的对齐值。
        align = /(left|right|center|justify)/.test(align) ? align : ''

        // 首行缩进等级。
        let textIndentLevel = 0
        // 存在 text-indent 样式时解析缩进等级。
        if (textIndent) {
          // em 单位直接按整数等级读取。
          if (/em/.test(textIndent)) {
            textIndentLevel = parseInt(textIndent)
          }
          // px 单位按 16px 一个等级换算。
          else if (/px/.test(textIndent)) {
            textIndentLevel = Math.floor(parseInt(textIndent) / 16)
            // 小于 16px 但存在缩进时至少记为 1 级。
            if (!textIndentLevel) textIndentLevel = 1
          }
        }

        // data-indent 保存段落整体缩进等级。
        const indent = +((dom as HTMLElement).getAttribute('data-indent') || 0)
      
        // 返回段落属性。
        return { align, indent, textIndent: textIndentLevel }
      }
    },
    {
      // 图片不作为段落内容解析。
      tag: 'img',
      ignore: true,
    },
    {
      // pre 内容跳过，避免代码块被段落规则吞掉。
      tag: 'pre',
      skip: true,
    },
  ],
  // 序列化为 DOM。
  toDOM: (node: Node) => {
    // 读取段落属性。
    const { align, indent, textIndent } = node.attrs
    // 拼接 style 字符串。
    let style = ''
    // 非左对齐才输出 text-align，左对齐使用默认值。
    if (align && align !== 'left') style += `text-align: ${align};`
    // 输出首行缩进。
    if (textIndent) style += `text-indent: ${textIndent}em;`

    // DOM 属性对象。
    const attr: Attr = { style }
    // 输出段落整体缩进等级。
    if (indent) attr['data-indent'] = indent

    // 返回 p DOM 表达。
    return ['p', attr, 0]
  },
}

// 从基础 schema 复用 doc、blockquote 和 text。
const {
  doc,
  blockquote,
  text,
} = nodes

// 项目富文本节点定义集合。
export default {
  doc,
  paragraph,
  blockquote,
  text,
  'ordered_list': orderedList,
  'bullet_list': bulletList,
  'list_item': listItem,
}
