const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
//source map sources 目录
module.exports = {
    entry: "./src/index",
    mode: "development",
    devtool: 'source-map',
    optimization: {
        usedExports: true,
    },
    entry: './src/main',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    output: {
        clean: true,
        devtoolModuleFilenameTemplate: info => {
            return path
                .relative('', info.absoluteResourcePath)
                .replace(/\\/g, '/')
        }
    }
};