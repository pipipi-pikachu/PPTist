import { NodeType, Schema } from 'prosemirror-model'
import {
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  smartQuotes,
  emDash,
  ellipsis,
} from 'prosemirror-inputrules'

const blockQuoteRule = (nodeType: NodeType) => wrappingInputRule(/^\s*>\s$/, nodeType)

const orderedListRule = (nodeType: NodeType) => (
  wrappingInputRule(
    /^(\d+)\.\s$/, 
    nodeType, 
    match => ({order: +match[1]}),
    (match, node) => node.childCount + node.attrs.order === +match[1],
  )
)

const bulletListRule = (nodeType: NodeType) => wrappingInputRule(/^\s*([-+*])\s$/, nodeType)

const codeBlockRule = (nodeType: NodeType) => textblockTypeInputRule(/^```$/, nodeType)

export const buildInputRules = (schema: Schema) => {
  const rules = [
    ...smartQuotes,
    ellipsis,
    emDash,
  ]
  rules.push(blockQuoteRule(schema.nodes.blockquote))
  rules.push(orderedListRule(schema.nodes.ordered_list))
  rules.push(bulletListRule(schema.nodes.bullet_list))
  rules.push(codeBlockRule(schema.nodes.code_block))

  return inputRules({ rules })
}