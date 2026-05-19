import type { AST, ElementAST, ElementAttribute } from './types'
import { voidTags } from './tags'

/**
 * 将结构化属性列表序列化为 HTML 属性字符串。
 *
 * @param attributes - AST 中的结构化属性列表。
 * @returns 可拼接到开始标签中的属性字符串，包含前导空格。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - value 为 null 时输出布尔属性。
 * - style 属性为空时返回空字符串，避免输出无意义的空 style。
 * - 属性值含单引号时使用双引号包裹，否则默认使用单引号。
 */
export const formatAttributes = (attributes: ElementAttribute[]) => {
  // 逐个属性拼接为字符串。
  return attributes.reduce((attrs, attribute) => {
    // 解构属性名和值。
    const { key, value } = attribute
    // 布尔属性只输出属性名。
    if (value === null) return `${attrs} ${key}`
    // 空 style 不输出，避免生成 style=''。
    if (key === 'style' && !value) return ''

    // 如果属性值包含单引号，则改用双引号包裹。
    const quoteEscape = value.indexOf('\'') !== -1
    // 选择属性值包裹引号。
    const quote = quoteEscape ? '"' : '\''
    // 拼接当前属性。
    return `${attrs} ${key}=${quote}${value}${quote}`
  }, '')
}

/**
 * 将 HTML AST 重新序列化为 HTML 字符串。
 *
 * @param tree - 结构化 AST 节点数组。
 * @returns 序列化后的 HTML 字符串。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 文本节点和注释节点直接输出内容。
 * - void 标签不会输出闭合标签。
 * - 普通元素会递归序列化子节点。
 */
export const toHTML = (tree: AST[]) => {
  // 将每个 AST 节点转换为 HTML 片段。
  const htmlStrings: string[] = tree.map(node => {
    // 文本节点原样输出。
    if (node.type === 'text') return node.content
    // 注释节点补回注释标记。
    if (node.type === 'comment') return `<!--${node.content}-->`

    // 元素节点读取标签、属性和子节点。
    const { tagName, attributes, children } = node as ElementAST
    // 判断是否为 void 标签。
    const isSelfClosing = voidTags.includes(tagName.toLowerCase())

    // void 标签不输出闭合标签。
    if (isSelfClosing) return `<${tagName}${formatAttributes(attributes)}>`
    // 普通元素递归输出子节点和闭合标签。
    return `<${tagName}${formatAttributes(attributes)}>${toHTML(children)}</${tagName}>`
  })
  // 拼接全部 HTML 片段。
  return htmlStrings.join('')
}
