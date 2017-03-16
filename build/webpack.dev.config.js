var webpack = require('webpack')

module.exports = {
    entry: './src/index',
    output: {
        path: './bundle',
        filename: 'Geisha.js',
        library: 'Geisha',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['env'],
                "plugins": [
                    "add-module-exports"
                ]
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        })
    ],
    devtool: '#source-map'
}
