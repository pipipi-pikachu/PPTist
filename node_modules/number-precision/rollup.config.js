import typescript from 'rollup-plugin-typescript2'

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'iife',
      name: 'NP',
      dest: './build/index.iife.js'
    },
    {
      format: 'umd',
      name: 'NP',
      dest: './build/index.umd.js'
    },
    {
      format: 'cjs',
      dest: './build/index.js'
    },
    {
      format: 'es',
      dest: './build/index.es.js'
    }
  ],
  plugins: [typescript({cacheRoot: `${require('temp-dir')}/.rpt2_cache`})]
}
