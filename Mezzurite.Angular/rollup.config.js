// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify-es';
import json from 'rollup-plugin-json';
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
        ],
      plugins: [
        json(),
        resolve(['.js', '.json']),
        typescript()
        ],
      },
      {
        input: 'src/index.ts',
        output: [
          {
            name: "MezzuriteAngular",
            file: "./browser/mezzurite.angular.umd.js",
            format: 'umd',
          }
        ],
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
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
          uglify()
        ],
      }
]