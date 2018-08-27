// Rollup plugins
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'likecoin/assets/js/likecoin.js',
  output: {
    file: 'likecoin/assets/js/dist/likecoin.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
