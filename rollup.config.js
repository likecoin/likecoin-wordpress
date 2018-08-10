// Rollup plugins
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

export default {
  entry: 'likecoin/assets/js/likecoin.js',
  dest: 'likecoin/assets/js/likecoin.es5.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    nodeResolve(),
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
