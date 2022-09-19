const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: "./src/index",
    mode: "development",
    devtool: 'source-map',
    optimization: {
        usedExports: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    output: {
        clean: true
    },
    devServer: {
        hot: true,
    }
};