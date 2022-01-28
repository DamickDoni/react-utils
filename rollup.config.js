import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const devMode = (process.env.NODE_ENV === 'development');
console.log(`${ devMode ? 'development' : 'production' } mode bundle`);

let pkg = require('./package.json');


export default [
  {
    input: ['./lib/index.js'],
      watch: {
      include: './lib/**',
      clearScreen: false
    },
     plugins: [
      nodeResolve(),
      commonjs(),
       getBabelOutputPlugin({
        presets: ['@babel/preset-env']
      })
    ],
    output: {
      dir: "dist",
      format: 'es',
       sourcemap: devMode ? 'inline' : false,
       plugins: [
        terser({
          ecma: 2020,
          mangle: { toplevel: true },
          compress: {
            module: true,
            toplevel: true,
            unsafe_arrows: true,
            drop_console: !devMode,
            drop_debugger: !devMode
          },
          output: { quote_style: 1 }
        })
      ]
    }
  }
];