import typescript from 'rollup-plugin-typescript2'
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
          typescript(),
        ],
      },
      {
        input: 'src/index.ts',
        output: [
          {
            name: "MezzuriteCore",
            file: "./browser/mezzurite.core.umd.js",
            format: 'umd',
          }
        ],
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
        ],
      plugins: [
          typescript({
            tsconfigOverride: {
                compilerOptions: {
                    declaration: false
                }
            }
          }),
        ],
      }
]