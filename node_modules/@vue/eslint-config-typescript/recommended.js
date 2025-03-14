module.exports = {
  extends: [
    require.resolve('./index'),
    'plugin:@typescript-eslint/recommended'
  ],
  
  // the ts-eslint recommended ruleset sets the parser so we need to set it back
  parser: require.resolve('vue-eslint-parser'),

  rules: {
    // this rule, if on, would require explicit return type on the `render` function
    '@typescript-eslint/explicit-function-return-type': 'off',

    // The following rules are enabled in an `overrides` field in the
    // `@typescript-eslint/recommended` ruleset, only turned on for TypeScript source modules
    // <https://github.com/typescript-eslint/typescript-eslint/blob/cb2d44650d27d8b917e8ce19423245b834db29d2/packages/eslint-plugin/src/configs/eslint-recommended.ts#L27-L30>

    // But as ESLint cannot precisely target `<script lang="ts">` blocks and skip normal `<script>`s,
    // no TypeScript code in `.vue` files would be checked against these rules.
    
    // So we now enable them globally.
    // That would also check plain JavaScript files, which diverges a little from
    // the original intention of the `@typescript-eslint/recommended` rulset.
    // But it should be mostly fine.
    'no-var': 'error', // ts transpiles let/const to var, so no need for vars any more
    'prefer-const': 'error', // ts provides better types with const
    'prefer-rest-params': 'error', // ts provides better types with rest args over arguments
    'prefer-spread': 'error', // ts transpiles spread to apply, so no need for manual apply
  },

  overrides: [
    {
      files: ['shims-tsx.d.ts'],
      rules: {
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    },
    {
      files: ['*.js', '*.cjs'],
      rules: {
        // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}
