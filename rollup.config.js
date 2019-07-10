import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'lib/mezzurite.js',
      format: 'cjs',
      indent: false
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      nodeResolve(),
      babel()
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'es/mezzurite.js',
      format: 'es',
      indent: false
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      nodeResolve(),
      babel()
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'es/mezzurite.mjs',
      format: 'es',
      indent: false
    },
    plugins: [
      nodeResolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/mezzurite.js',
      format: 'umd',
      name: 'Mezzurite',
      indent: false
    },
    plugins: [
      nodeResolve(),
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/mezzurite.min.js',
      format: 'umd',
      name: 'Mezzurite',
      indent: false
    },
    plugins: [
      nodeResolve(),
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];
