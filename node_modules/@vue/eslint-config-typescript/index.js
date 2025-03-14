module.exports = {
  plugins: ['@typescript-eslint'],

  // Prerequisite `eslint-plugin-vue`, being extended, sets
  // root property `parser` to `'vue-eslint-parser'`, which, for code parsing,
  // in turn delegates to the parser, specified in `parserOptions.parser`:
  // https://github.com/vuejs/eslint-plugin-vue#what-is-the-use-the-latest-vue-eslint-parser-error
  parserOptions: {
    parser: {
      'js': 'espree',
      'jsx': 'espree',
      'cjs': 'espree',
      'mjs': 'espree',

      'ts': require.resolve('@typescript-eslint/parser'),
      'tsx': require.resolve('@typescript-eslint/parser'),
      'cts': require.resolve('@typescript-eslint/parser'),
      'mts': require.resolve('@typescript-eslint/parser'),

      // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
    },
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true
    }
  },

  extends: [
    'plugin:@typescript-eslint/eslint-recommended'
  ],

  overrides: [
    {
      files: ['*.ts', '*.cts', '*.mts', '*.tsx', '*.vue'],
      rules: {
        // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
        // does not work with type definitions
        'no-unused-vars': 'off',
        // TS already checks for that, and Typescript-Eslint recommends to disable it
        // https://typescript-eslint.io/linting/troubleshooting#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'warn'
      }
    }
  ]
}
