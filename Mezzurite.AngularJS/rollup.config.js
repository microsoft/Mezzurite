import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify-es';
import json from 'rollup-plugin-json';
import copy from 'rollup-plugin-copy-glob';
import pkg from './package.json'

export default [
    {
        input: 'src/index.ts',
        output: [
          {
            file: pkg.main,
            format: 'cjs',
          },
          {
            file: pkg.module,
            format: 'es',
          },
        ],
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
          "@ms/mezzurite-core"
        ],
      plugins: [
          json(),
          resolve(['.js', '.json']),
          typescript(),
          uglify()
        ],
      },
      {
        input: 'src/index.ts',
        output: [
          {
            name: "MezzuriteAngularJS",
            file: "./browser/mezzurite.angularjs.umd.js",
            format: 'umd',
            globals: {
              "angular": "angular",
              "@ms/mezzurite-core": "MezzuriteCore",
            },
          }
        ],
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
          "@ms/mezzurite-core"
        ],
      plugins: [
          json(),
          resolve(['.js', '.json']),
          typescript({
            tsconfigOverride: {
                compilerOptions: {
                    declaration: false
                }
            }
          }),
          uglify(),
          copy([
            { files: 'dist/src/*.*', dest: 'dist' },
            { files: 'dist-esm/src/*.*', dest: 'dist-esm' },
          ], { verbose: true, watch: false })
        ],
      }
]