// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2'
import uglify from 'rollup-plugin-uglify-es';
import json from 'rollup-plugin-json';
import copy from 'rollup-plugin-copy-glob';
import pkg from './package.json'

export default [
    {
      input: 'src/angular-performance.module.ts',
      output: [
        {
          file: "build/compiled/dist/index.js",
          format: 'esm',
        }
      ],
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        "rxjs/operators",
        "@microsoft/mezzurite-core"
      ],
    plugins: [
        json(),
        resolve(['.js', '.json']),
        typescript(),
        uglify()
      ],
    },
    {
        input: 'src/angular-performance.module.ts',
        output: [
          {
            file: pkg.main,
            format: 'cjs',
          }
        ],
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
          "rxjs/operators",
          "@microsoft/mezzurite-core"
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
      },
      {
        input: 'src/angular-performance.module.ts',
        output: [
          {
            file: pkg.module,
            format: 'es',
          }
        ],
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
          "rxjs/operators",
          "@microsoft/mezzurite-core"
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
            { files: 'aot/src/*.metadata.json', dest: 'dist' },
            { files: 'aot/src/*.metadata.json', dest: 'dist-esm' }
          ], { verbose: false, watch: false })
        ],
      },
      {
        input: 'src/angular-performance.module.ts',
        output: [
          {
            name: "MezzuriteAngular",
            file: "./browser/mezzurite.angular.umd.js",
            format: 'umd',
            globals: {
              "@angular/core": "ng.core",
              "@microsoft/mezzurite-core": "mezzurite-core",
              rxjs: "Rx",
              "rxjs/operators": "Rx",
              "@angular/router": "ng.router"
            },
          }
        ],
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
          "rxjs/operators",
          "@microsoft/mezzurite-core"
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