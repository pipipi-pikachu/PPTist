module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'curly': ['error', 'multi-line'], // if、while等仅允许在单行中省略大括号
    'quotes': ['error', 'single', { // 字符串使用单引号（允许含有单引号的字符串使用双引号，允许模板字符串）
      'avoidEscape': true,
      'allowTemplateLiterals': true,
    }],
    'key-spacing': ['error', { // 强制在对象字面量的键和值之间使用一致的空格
      'beforeColon': false,
      'afterColon': true,
      'mode': 'strict',
    }],
    'no-empty': 'error', // 禁止空白块
    'no-else-return': 'error', // 禁止 if 语句中 return 语句之后有 else 块
    'no-multi-spaces': 'error', // 禁止出现多个空格
    'require-await': 'error', // 禁止使用不带 await 表达式的 async 函数
    'brace-style': ['error', 'stroustrup'], // 大括号风格要求
    'spaced-comment': ['error', 'always'], // 要求在注释前有空白
    'arrow-spacing': 'error', // 要求箭头函数的箭头之前或之后有空格
    'no-duplicate-imports': 'error', // 禁止重复导入
    'semi': ['error', 'never'], // 禁止行末分号
    'comma-spacing': ['error', { 'before': false, 'after': true }], // 强制在逗号周围使用空格
    'indent': ['error', 2, {'SwitchCase': 1}], // 两个空格的缩进
    'eqeqeq': ['error', 'always', {'null': 'ignore'}], // 必须使用全等判断（null的判断除外）
    'default-case': 'error', // switch块必须有default结尾
    'no-eval': 'error', // 禁止eval 
    'no-var': 'error', // 禁止var
    'no-with': 'error', // 禁止with
    'max-depth': ['error', 5], // 代码最大嵌套5层
    'consistent-this': ['error', 'self'], // 只能使用self代替this
    'max-lines': ['error', 1200], // 单文件最大1200行
    'no-multi-str': 'error', // 禁止多行字符串
    'space-infix-ops': 'error', // 中缀操作符周围有空格
    'space-before-blocks': ['error', 'always'], // 函数大括号前有空格
    'space-before-function-paren': ['error', { // 函数小括号前无空格（匿名异步函数前有）
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'keyword-spacing': ['error', { 'overrides': { // 强制关键字周围空格的一致性
      'if': { 'after': false },
      'for': { 'after': false },
      'while': { 'after': false },
      'function': { 'after': false },
      'switch': { 'after': false },
    }}],
    'prefer-const': 'error', // 必须优先使用const
    'no-useless-return': 'error', // 禁止多余的return
    'array-bracket-spacing': 'error', // 强制数组方括号中使用一致的空格
    'no-useless-escape': 'off', // 关闭禁用不必要的转义
    'no-alert': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 禁止alert
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 禁止console
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 禁止debugger
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
