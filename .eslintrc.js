// https://eslint.org/docs/rules/

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'curly': ['error', 'multi-line'],
    'eqeqeq': ['error', 'always'],
    'semi': ['error', 'never'],
    'indent': ['error', 2, { 
      'SwitchCase': 1,
    }],
    'quotes': ['error', 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true,
    }],
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true,
      'mode': 'strict',
    }],
    'no-empty': 'error',
    'no-else-return': 'error',
    'no-multi-spaces': 'error',
    'require-await': 'error',
    'brace-style': ['error', 'stroustrup'],
    'spaced-comment': ['error', 'always'],
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    'comma-spacing': ['error', {
      'before': false,
      'after': true,
    }],
    'default-case': 'error',
    'consistent-this': ['error', '_this'],
    'max-depth': ['error', 6],
    'max-lines': ['error', 800],
    'no-multi-str': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': ['error', {
      'named': 'never',
      'anonymous': 'never',
      'asyncArrow': 'always',
    }],
    'keyword-spacing': ['error'],
    'prefer-const': 'error',
    'no-useless-return': 'error',
    'array-bracket-spacing': 'error',
    'no-useless-escape': 'off',
    'no-unused-vars': 'off',
    'no-eval': 'error',
    'no-var': 'error',
    'no-with': 'error',
    'no-alert': isProduction ? 'error' : 'warn',
    'no-console': isProduction ? 'error' : 'warn',
    'no-debugger': isProduction ? 'error' : 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': ['error', {
      'extendDefaults': true,
      'types': {
        '{}': false,
      },
    }],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true,
      },
    },
  ],
}
