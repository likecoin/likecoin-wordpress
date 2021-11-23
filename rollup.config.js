// Rollup plugins
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

function createConfig(filename) {
  return {
    input: `likecoin/js/${filename}`,
    output: {
      file: `likecoin/assets/js/${filename}`,
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
}

const configs = [
  'admin/likecoin_editor.js',
  'admin/likecoin_metabox.js',
].map((filename) => createConfig(filename));

export default configs;
