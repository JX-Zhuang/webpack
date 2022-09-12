const HtmlWebpackPlugin = require('html-webpack-plugin');
const DemoPlugin = require('./DemoPlugin');
module.exports = {
    mode: 'development',
    entry: './main',
    devtool: false,
    plugins: [
        new DemoPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        })
    ]
}