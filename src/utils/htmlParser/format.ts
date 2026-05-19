import type { HTMLNode, CommentOrTextAST, ElementAST, AST } from './types'

/**
 * 按第一次出现的分隔符拆分字符串。
 *
 * @param str - 需要拆分的原始字符串。
 * @param sep - 分隔符。
 * @returns 未找到分隔符时返回仅包含原字符串的数组；找到时返回头部和剩余部分。
 * @throws 当前函数不主动抛错。
 * @remarks 用于解析属性 `key=value`，只按第一个等号拆分，避免属性值中后续等号被错误切开。
 */
export const splitHead = (str: string, sep: string) => {
  // 查找分隔符第一次出现的位置。
  const idx = str.indexOf(sep)
  // 没有分隔符时返回原字符串。
  if (idx === -1) return [str]
  // 返回分隔符前后的两段内容。
  return [str.slice(0, idx), str.slice(idx + sep.length)]
}

/**
 * 去掉属性值首尾匹配的引号。
 *
 * @param str - 原始属性值。
 * @returns 去掉首尾同类引号后的字符串；不满足条件时返回原值。
 * @throws 当前函数不主动抛错。
 * @remarks 同时支持单引号和双引号，只有首尾引号类型一致才会去除。
 */
const unquote = (str: string) => {
  // 首字符。
  const car = str.charAt(0)
  // 最后一个字符索引。
  const end = str.length - 1
  // 判断是否以单引号或双引号开头。
  const isQuoteStart = car === '"' || car === "'"
  // 首尾引号匹配时去掉包裹引号。
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  // 非引号包裹时原样返回。
  return str
}

/**
 * 将 parser 输出的原始属性字符串转换为结构化属性。
 *
 * @param attributes - 原始属性字符串数组。
 * @returns 结构化属性列表。
 * @throws 当前函数不主动抛错。
 * @remarks 不带 `=` 的属性会被视作布尔属性，value 为 null。
 */
const formatAttributes = (attributes: string[]) => {
  // 遍历每个原始属性字符串。
  return attributes.map(attribute => {
    // 按第一个等号拆分 key 和 value。
    const parts = splitHead(attribute.trim(), '=')
    // 属性名。
    const key = parts[0]
    // 属性值；不存在时为 null，存在时去掉包裹引号。
    const value = typeof parts[1] === 'string' ? unquote(parts[1]) : null
    // 返回结构化属性。
    return { key, value }
  })
}

/**
 * 将 parser 阶段的 HTMLNode 树格式化为对外 AST。
 *
 * @param nodes - parser 输出的原始节点树。
 * @returns 结构化 AST 数组。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 元素标签名会统一转换为小写。
 * - 元素属性会从字符串数组转换为 `{ key, value }` 结构。
 */
export const format = (nodes: HTMLNode[]): AST[] => {
  // 递归转换每个节点。
  return nodes.map(node => {   
    // 元素节点需要递归格式化子节点和属性。
    if (node.type === 'element') {
      // 递归转换子节点。
      const children = format(node.children)
      // 构造元素 AST。
      const item: ElementAST = {
        // 节点类型。
        type: 'element',
        // 标签名小写化，便于后续匹配。
        tagName: node.tagName.toLowerCase(),
        // 结构化属性。
        attributes: formatAttributes(node.attributes),
        // 子 AST。
        children,
      }
      // 返回元素 AST。
      return item
    }

    // 注释和文本节点只需要保留类型与内容。
    const item: CommentOrTextAST = {
      // 节点类型。
      type: node.type,
      // 节点内容。
      content: node.content,
    }
    // 返回文本或注释 AST。
    return item
  })
}
