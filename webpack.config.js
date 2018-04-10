const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
module.exports = {
    entry: ["./src/main.js"],
    mode: "production",
    devtool: 'source-map',
	optimization: {
		minimize: true,
		minimizer: [
			new UglifyJsPlugin({
                sourceMap: true,
				uglifyOptions: {
					output: {
						ascii_only: true
					},
				},
			})
		]
	},
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "astronomy.min.js",
        library: "AstronomyJS",
        libraryExport: "MainModule",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};