import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default [
{
    input: './src/mezzurite-react.js',
    output: {
    dir: 'dist/esm',
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
        })
    ]
},
{
    input: './src/mezzurite-react.js',
    output: {
    file: 'dist/bundles/mezzurite-react.umd.js',
    name: 'Mezzurite-React',
    sourcemap: true,
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
    ]
}
]
