import type { NodeType, Schema } from 'prosemirror-model'
import {
  inputRules,
  wrappingInputRule,
  smartQuotes,
  emDash,
  ellipsis,
  InputRule,
} from 'prosemirror-inputrules'

/**
 * 创建引用块输入规则。
 *
 * @param nodeType - blockquote 节点类型。
 * @returns 输入 `> ` 时触发的 wrapping input rule。
 * @throws 当前函数不主动抛错。
 */
const blockQuoteRule = (nodeType: NodeType) => wrappingInputRule(/^\s*>\s$/, nodeType)

/**
 * 创建有序列表输入规则。
 *
 * @param nodeType - ordered_list 节点类型。
 * @returns 输入 `1. `、`2. ` 等格式时触发的 wrapping input rule。
 * @throws 当前函数不主动抛错。
 * @remarks 会把输入的数字写入 ordered_list 的 order 属性。
 */
const orderedListRule = (nodeType: NodeType) => (
  wrappingInputRule(
    // 匹配行首数字加点和空格。
    /^(\d+)\.\s$/, 
    nodeType, 
    // 把起始序号写入列表属性。
    match => ({order: +match[1]}),
    // 确认当前列表序号连续时才继续合并到同一列表。
    (match, node) => node.childCount + node.attrs.order === +match[1],
  )
)

/**
 * 创建无序列表输入规则。
 *
 * @param nodeType - bullet_list 节点类型。
 * @returns 输入 `- `、`+ ` 或 `* ` 时触发的 wrapping input rule。
 * @throws 当前函数不主动抛错。
 */
const bulletListRule = (nodeType: NodeType) => wrappingInputRule(/^\s*([-+*])\s$/, nodeType)

/**
 * 创建行内代码输入规则。
 *
 * @returns 输入反引号包裹文本时触发的 InputRule。
 * @throws 当前函数不主动抛错。
 * @remarks 例如输入 `` `code` `` 后，会去掉反引号并给内容添加 code mark。
 */
const codeRule = () => {
  // 匹配空白或行首后的 `code`。
  const inputRegex = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/
  
  // 创建输入规则。
  return new InputRule(inputRegex, (state, match, start, end) => {
    // 当前 schema。
    const { schema } = state

    // 用纯代码内容加一个空格替换原输入范围。
    const tr = state.tr.insertText(`${match[2]} `, start, end)
    // 创建 code mark。
    const mark = schema.marks.code.create()

    // 给插入的代码内容添加 code mark，不包括尾部空格。
    return tr.addMark(start, start + match[2].length, mark)
  })
}

/**
 * 创建自动链接输入规则。
 *
 * @returns 输入 URL 形态文本时触发的 InputRule。
 * @throws 当前函数不主动抛错。
 * @remarks 当前正则支持可选 http/https 前缀和常见域名路径形式。
 */
const linkRule = () => {
  // URL 粗匹配正则。
  const urlRegEx = /(?:https?:\/\/)?[\w-]+(?:\.[\w-]+)+\.?(?:\d+)?(?:\/\S*)?$/
  
  // 创建输入规则。
  return new InputRule(urlRegEx, (state, match, start, end) => {
    // 当前 schema。
    const { schema } = state

    // 保留原 URL 文本。
    const tr = state.tr.insertText(match[0], start, end)
    // 创建 link mark，href 和 title 都使用输入文本。
    const mark = schema.marks.link.create({ href: match[0], title: match[0] })

    // 给 URL 文本添加 link mark。
    return tr.addMark(start, start + match[0].length, mark)
  })
}

/**
 * 构建富文本输入规则插件。
 *
 * @param schema - 当前编辑器 schema。
 * @returns ProseMirror inputRules 插件。
 * @throws 当前函数不主动抛错。
 * @remarks 包含智能引号、省略号、破折号、引用、列表、行内代码和链接自动转换。
 */
export const buildInputRules = (schema: Schema) => {
  // 基础输入规则：智能引号、省略号和破折号。
  const rules = [
    ...smartQuotes,
    ellipsis,
    emDash,
  ]
  // `> ` 转引用块。
  rules.push(blockQuoteRule(schema.nodes.blockquote))
  // `1. ` 转有序列表。
  rules.push(orderedListRule(schema.nodes.ordered_list))
  // `- `、`+ `、`* ` 转无序列表。
  rules.push(bulletListRule(schema.nodes.bullet_list))
  // 反引号包裹文本转行内代码。
  rules.push(codeRule())
  // URL 自动转链接。
  rules.push(linkRule())

  // 返回 inputRules 插件。
  return inputRules({ rules })
}
