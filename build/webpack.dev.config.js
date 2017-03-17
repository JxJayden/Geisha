var webpack = require('webpack')

module.exports = {
    entry: './src/index',
    output: {
        path: './bundle',
        filename: 'geisha.js',
        library: 'Geisha',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
                "plugins": [
                    "add-module-exports"
                ]
            }
        }]
    },
    devtool: 'source-map'
}
