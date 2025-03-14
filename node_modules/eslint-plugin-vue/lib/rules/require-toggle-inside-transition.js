/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require control the display of the content inside `<transition>`',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/require-toggle-inside-transition.html'
    },
    fixable: null,
    schema: [],
    messages: {
      expected:
        'The element inside `<transition>` is expected to have a `v-if` or `v-show` directive.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * Check if the given element has display control.
     * @param {VElement} element The element node to check.
     */
    function verifyInsideElement(element) {
      if (utils.isCustomComponent(element)) {
        return
      }

      /** @type VElement */ // @ts-expect-error
      const parent = element.parent
      if (utils.hasAttribute(parent, 'appear')) {
        return
      }

      if (
        element.name !== 'slot' &&
        !utils.hasDirective(element, 'if') &&
        !utils.hasDirective(element, 'show') &&
        !utils.hasDirective(element, 'bind', 'key')
      ) {
        context.report({
          node: element.startTag,
          loc: element.startTag.loc,
          messageId: 'expected'
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VElement} node */
      "VElement[name='transition'] > VElement"(node) {
        const child = node.parent.children.find(utils.isVElement)
        if (child !== node) {
          return
        }

        verifyInsideElement(node)
      }
    })
  }
}
