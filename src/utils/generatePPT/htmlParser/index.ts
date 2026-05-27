// 参考：https://github.com/andrejewski/himalaya 用 TypeScript 重写并简化部分功能。

import { lexer } from './lexer'
import { parser } from './parser'
import { format } from './format'
import { toHTML } from './stringify'
export type { AST } from './types'

/**
 * 将 HTML 字符串转换为项目内部使用的轻量 AST。
 *
 * @param str - 待解析的 HTML 字符串。
 * @returns 结构化 AST 节点数组。
 * @throws 当前函数不主动捕获异常；lexer/parser/format 中的运行时异常会向外抛出。
 * @remarks
 * - 解析流程分为 lexer、parser、format 三步：先分词，再构造原始节点树，最后格式化属性和标签名。
 * - 该解析器主要服务于富文本导入导出，不追求完整浏览器级 HTML 兼容性。
 */
export const toAST = (str: string) => {
  // 把 HTML 字符串拆成 token。
  const tokens = lexer(str)
  // 把 token 组织成原始 HTMLNode 树。
  const nodes = parser(tokens)
  // 把原始节点树转换为对外 AST。
  return format(nodes)
}

// 导出 AST 反序列化为 HTML 的能力。
export { toHTML }
