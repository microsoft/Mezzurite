import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify-es';
import json from 'rollup-plugin-json';

export default [
{
    input: './src/index.js',
    output: {
    dir: 'dist-esm',
    format: 'esm',
    chunkFileNames: "[name]-common.js",
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    }
    },
    experimentalCodeSplitting: true,
    external: [
        'react', 'react-dom', 'react-router', 'intersection-observer', '@microsoft/mezzurite-core'
    ],
    plugins: [
        json(),
        resolve(['.js', '.json']),
        babel({
            exclude: 'node_modules/**'
        }),
        // uglify()
    ]
},
{
    input: './src/index.js',
    output: {
    dir: 'dist',
    format: 'cjs',
    chunkFileNames: "[name]-common.js",
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    }
    },
    experimentalCodeSplitting: true,
    external: [
        'react', 'react-dom', 'react-router', 'intersection-observer', '@microsoft/mezzurite-core'
    ],
    plugins: [
        json(),
        resolve(['.js', '.json']),
        babel({
            exclude: 'node_modules/**'
        }),
        uglify()
    ]
},
{
    input: './src/index.js',
    output: {
    file: 'browser/mezzurite.react.umd.js',
    name: 'Mezzurite-React',
    format: 'umd',
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter',
        '@microsoft/mezzurite-core': 'MezzuriteCore'
    }
    },
    external: [
        'react', 'react-dom', 'react-router', 'intersection-observer', '@microsoft/mezzurite-core'
    ],
    plugins: [
        json(),
        resolve(['.js', '.json']),
        babel({
            exclude: 'node_modules/**'
        }),
        uglify()
    ]
}
]
