var path = require('path');

module.exports = {
    target: 'web',
    externals: {
        angular: 'angular'
    },
    entry: {
        mezzuritejs: '../../Mezzurite.AngularJS/_bundles/mezzurite_angularjs.umd.js'
    },
    mode: 'development',
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        path: path.join(__dirname, './app/'),
        filename: '[name].prod.js'
    },  
};