var path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    target: 'web',
    externals: {
        angular: 'angular'
    },
    mode: 'development',
    resolve: {
        extensions: [".ts", ".js"]
    }, 
    plugins: [
        new CopyWebpackPlugin([
            { from: '../Mezzurite.Core/browser/*', to: './app' },
            { from: '../Mezzurite.AngularJS/browser/*', to: './app' },
          ], {})
    ]
};