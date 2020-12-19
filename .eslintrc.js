module.exports = {
  root: true,
  env: {
    node: true,
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
    'semi': ['error', 'never'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'indent': ['error', 2, {'SwitchCase': 1}],
    'eqeqeq': ['error', 'always', {'null': 'ignore'}],
    'default-case': 'error',
    'no-eval': 'error',
    'no-var': 'error',
    'no-with': 'error',
    'max-depth': ['error', 5],
    'consistent-this': ['error', 'self'],
    'max-lines': ['error', 1500],
    'no-multi-str': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'keyword-spacing': ['error', { 'overrides': {
      'if': { 'after': false },
      'for': { 'after': false },
      'while': { 'after': false },
      'function': { 'after': false },
      'switch': { 'after': false },
    }}],
    'prefer-const': 'error',
    'no-useless-return': 'error',
    'array-bracket-spacing': 'error',
    'no-useless-escape': 'off',
    'no-alert': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
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
