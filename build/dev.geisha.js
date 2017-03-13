// webpack config for develop geisha.js
module.exports = {
	entry: './src/main/index',
	output: {
		path: './bundle',
		library: 'Geisha',
		filename: 'geisha.js',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	devtool: 'source-map'
}
