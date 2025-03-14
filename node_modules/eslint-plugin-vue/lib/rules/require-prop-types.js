/**
 * @fileoverview Prop definitions should be detailed
 * @author Armano
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('../utils').ComponentProp} ComponentProp
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require type definitions in props',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/require-prop-types.html'
    },
    fixable: null,
    schema: [],
    messages: {
      requireType: 'Prop "{{name}}" should define at least its type.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @param {ObjectExpression} node
     * @returns {boolean}
     */
    function objectHasType(node) {
      const typeProperty = node.properties.find(
        (p) =>
          p.type === 'Property' &&
          utils.getStaticPropertyName(p) === 'type' &&
          (p.value.type !== 'ArrayExpression' || p.value.elements.length > 0)
      )
      const validatorProperty = node.properties.find(
        (p) =>
          p.type === 'Property' &&
          utils.getStaticPropertyName(p) === 'validator'
      )
      return Boolean(typeProperty || validatorProperty)
    }

    /**
     * @param {ComponentProp} prop
     */
    function checkProperty(prop) {
      if (prop.type !== 'object' && prop.type !== 'array') {
        return
      }
      let hasType = true

      if (prop.type === 'array') {
        hasType = false
      } else {
        const { value } = prop
        switch (value.type) {
          case 'ObjectExpression': {
            // foo: {
            hasType = objectHasType(value)
            break
          }
          case 'ArrayExpression': {
            // foo: [
            hasType = value.elements.length > 0
            break
          }
          case 'FunctionExpression':
          case 'ArrowFunctionExpression': {
            hasType = false
            break
          }
        }
      }

      if (!hasType) {
        const { node, propName } = prop
        const name =
          propName ||
          (node.type === 'Identifier' && node.name) ||
          'Unknown prop'
        context.report({
          node,
          messageId: 'requireType',
          data: {
            name
          }
        })
      }
    }

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          for (const prop of props) {
            checkProperty(prop)
          }
        }
      }),
      utils.executeOnVue(context, (obj) => {
        const props = utils.getComponentPropsFromOptions(obj)

        for (const prop of props) {
          checkProperty(prop)
        }
      })
    )
  }
}
