var path = require('path');

module.exports = {
    entry: {
        mezzuritejs: '../Mezzurite.AngularJS/_bundles/mezzurite_angularjs.umd.js'
    },
    mode: 'production',
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        path: path.join(__dirname, './app/'),
        filename: '[name].prod.js'
    },  
};