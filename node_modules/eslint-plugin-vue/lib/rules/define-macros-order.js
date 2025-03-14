/**
 * @author Eduard Deisling
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

const MACROS_EMITS = 'defineEmits'
const MACROS_PROPS = 'defineProps'
const MACROS_OPTIONS = 'defineOptions'
const MACROS_SLOTS = 'defineSlots'
const ORDER_SCHEMA = [MACROS_EMITS, MACROS_PROPS, MACROS_OPTIONS, MACROS_SLOTS]
const DEFAULT_ORDER = [MACROS_PROPS, MACROS_EMITS]

/**
 * @param {VElement} scriptSetup
 * @param {ASTNode} node
 */
function inScriptSetup(scriptSetup, node) {
  return (
    scriptSetup.range[0] <= node.range[0] &&
    node.range[1] <= scriptSetup.range[1]
  )
}

/**
 * @param {ASTNode} node
 */
function isUseStrictStatement(node) {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'Literal' &&
    node.expression.value === 'use strict'
  )
}

/**
 * Get an index of the first statement after imports and interfaces in order
 * to place defineEmits and defineProps before this statement
 * @param {VElement} scriptSetup
 * @param {Program} program
 */
function getTargetStatementPosition(scriptSetup, program) {
  const skipStatements = new Set([
    'ImportDeclaration',
    'TSInterfaceDeclaration',
    'TSTypeAliasDeclaration',
    'DebuggerStatement',
    'EmptyStatement',
    'ExportNamedDeclaration'
  ])

  for (const [index, item] of program.body.entries()) {
    if (
      inScriptSetup(scriptSetup, item) &&
      !skipStatements.has(item.type) &&
      !isUseStrictStatement(item)
    ) {
      return index
    }
  }

  return -1
}

/**
 * We need to handle cases like "const props = defineProps(...)"
 * Define macros must be used only on top, so we can look for "Program" type
 * inside node.parent.type
 * @param {CallExpression|ASTNode} node
 * @return {ASTNode}
 */
function getDefineMacrosStatement(node) {
  if (!node.parent) {
    throw new Error('Node has no parent')
  }

  if (node.parent.type === 'Program') {
    return node
  }

  return getDefineMacrosStatement(node.parent)
}

/** @param {RuleContext} context */
function create(context) {
  const scriptSetup = utils.getScriptSetupElement(context)

  if (!scriptSetup) {
    return {}
  }

  const sourceCode = context.getSourceCode()
  const options = context.options
  /** @type {[string, string]} */
  const order = (options[0] && options[0].order) || DEFAULT_ORDER
  /** @type {Map<string, ASTNode>} */
  const macrosNodes = new Map()

  return utils.compositingVisitors(
    utils.defineScriptSetupVisitor(context, {
      onDefinePropsExit(node) {
        macrosNodes.set(MACROS_PROPS, getDefineMacrosStatement(node))
      },
      onDefineEmitsExit(node) {
        macrosNodes.set(MACROS_EMITS, getDefineMacrosStatement(node))
      },
      onDefineOptionsExit(node) {
        macrosNodes.set(MACROS_OPTIONS, getDefineMacrosStatement(node))
      },
      onDefineSlotsExit(node) {
        macrosNodes.set(MACROS_SLOTS, getDefineMacrosStatement(node))
      }
    }),
    {
      'Program:exit'(program) {
        /**
         * @typedef {object} OrderedData
         * @property {string} name
         * @property {ASTNode} node
         */
        const firstStatementIndex = getTargetStatementPosition(
          scriptSetup,
          program
        )
        const orderedList = order
          .map((name) => ({ name, node: macrosNodes.get(name) }))
          .filter(
            /** @returns {data is OrderedData} */
            (data) => utils.isDef(data.node)
          )

        for (const [index, should] of orderedList.entries()) {
          const targetStatement = program.body[firstStatementIndex + index]

          if (should.node !== targetStatement) {
            let moveTargetNodes = orderedList
              .slice(index)
              .map(({ node }) => node)
            const targetStatementIndex =
              moveTargetNodes.indexOf(targetStatement)
            if (targetStatementIndex >= 0) {
              moveTargetNodes = moveTargetNodes.slice(0, targetStatementIndex)
            }
            reportNotOnTop(should.name, moveTargetNodes, targetStatement)
            return
          }
        }
      }
    }
  )

  /**
   * @param {string} macro
   * @param {ASTNode[]} nodes
   * @param {ASTNode} before
   */
  function reportNotOnTop(macro, nodes, before) {
    context.report({
      node: nodes[0],
      loc: nodes[0].loc,
      messageId: 'macrosNotOnTop',
      data: {
        macro
      },
      *fix(fixer) {
        for (const node of nodes) {
          yield* moveNodeBefore(fixer, node, before)
        }
      }
    })
  }

  /**
   * Move all lines of "node" with its comments to before the "target"
   * @param {RuleFixer} fixer
   * @param {ASTNode} node
   * @param {ASTNode} target
   */
  function moveNodeBefore(fixer, node, target) {
    // get comments under tokens(if any)
    const beforeNodeToken = sourceCode.getTokenBefore(node)
    const nodeComment = sourceCode.getTokenAfter(beforeNodeToken, {
      includeComments: true
    })
    const nextNodeComment = sourceCode.getTokenAfter(node, {
      includeComments: true
    })
    // get positions of what we need to remove
    const cutStart = getLineStartIndex(nodeComment, beforeNodeToken)
    const cutEnd = getLineStartIndex(nextNodeComment, node)
    // get space before target
    const beforeTargetToken = sourceCode.getTokenBefore(target)
    const targetComment = sourceCode.getTokenAfter(beforeTargetToken, {
      includeComments: true
    })
    // make insert text: comments + node + space before target
    const textNode = sourceCode.getText(
      node,
      node.range[0] - nodeComment.range[0]
    )
    const insertText = getInsertText(textNode, target)

    return [
      fixer.insertTextBefore(targetComment, insertText),
      fixer.removeRange([cutStart, cutEnd])
    ]
  }

  /**
   * Get result text to insert
   * @param {string} textNode
   * @param {ASTNode} target
   */
  function getInsertText(textNode, target) {
    const afterTargetComment = sourceCode.getTokenAfter(target, {
      includeComments: true
    })
    const afterText = sourceCode.text.slice(
      target.range[1],
      afterTargetComment.range[0]
    )
    // handle case when a();b() -> b()a();
    const invalidResult = !textNode.endsWith(';') && !afterText.includes('\n')

    return textNode + afterText + (invalidResult ? ';' : '')
  }

  /**
   * Get position of the beginning of the token's line(or prevToken end if no line)
   * @param {ASTNode|Token} token
   * @param {ASTNode|Token} prevToken
   */
  function getLineStartIndex(token, prevToken) {
    // if we have next token on the same line - get index right before that token
    if (token.loc.start.line === prevToken.loc.end.line) {
      return prevToken.range[1]
    }

    return sourceCode.getIndexFromLoc({
      line: token.loc.start.line,
      column: 0
    })
  }
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce order of `defineEmits` and `defineProps` compiler macros',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-macros-order.html'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              enum: ORDER_SCHEMA
            },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      macrosNotOnTop:
        '{{macro}} should be the first statement in `<script setup>` (after any potential import statements or type definitions).'
    }
  },
  create
}
