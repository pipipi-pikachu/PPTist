// https://stylelint.io/user-guide/rules/list

module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html/html',
    'stylelint-config-html/vue',
  ],
  rules: {
    'indentation': 2,
    'max-nesting-depth': 5,
    'string-no-newline': true,
    'string-quotes': 'single',
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'font-weight-notation': 'numeric',
    'function-calc-no-unspaced-operator': true,
    'function-url-quotes': 'never',
    'block-no-empty': true,
    'no-eol-whitespace': true,
    'block-opening-brace-newline-after': 'always',
    'block-opening-brace-space-before': 'always',
    'declaration-block-no-duplicate-properties': [true, {
      ignoreProperties: ['overflow'],
    }],
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-trailing-semicolon': 'always',
    'selector-pseudo-element-colon-notation': 'double',
    'declaration-block-no-redundant-longhand-properties': [true, {
      ignoreShorthands: ['inset'],
    }],
    'alpha-value-notation': 'number',

    'max-empty-lines': null,
    'no-missing-end-of-source-newline': null,
    'no-descending-specificity': null,
    'at-rule-empty-line-before': null,
    'at-rule-no-unknown': null,
    'rule-empty-line-before': null,
    'number-leading-zero': null,
    'selector-pseudo-element-no-unknown': null,
    'selector-list-comma-newline-after': null,
    'no-invalid-double-slash-comments': null,
    'color-function-notation': null,
    'font-family-no-missing-generic-family-keyword': null,
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'shorthand-property-no-redundant-values': null,
  },
  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss'
    },
  ],
}