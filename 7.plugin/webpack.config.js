const DonePlugin = require('./plugins/done-plugin');
const WebpackAssetsPlugin = require('./plugins/webpack-assets-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoExternalPlugin = require('./plugins/auto-external-plugin');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: false,
    plugins: [
        // new DonePlugin({ name: 'done' }),
        // new WebpackAssetsPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new AutoExternalPlugin({
            jquery: {//自动把jquery模块变成一个外部依赖模块
                variable: '$',//不再打包，而是从window.jQuery变量上获取jquery对象
                url: 'https://cdn.bootcss.com/jquery/3.1.0/jquery.js'//CDN脚本
            },
            lodash: {//自动把jquery模块变成一个外部依赖模块
                variable: '_',//不再打包，而是从window.jQuery变量上获取jquery对象
                url: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js'//CDN脚本
            }
        })
    ],
    // externals: {
    //     jquery: '$',
    //     lodash: '_'
    // }
}