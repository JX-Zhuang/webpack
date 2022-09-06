const path = require('path');
const FooPlugin = require('./plugins/FooPlugin');
const BlockPlugin = require('./plugins/BlockPlugin');
const { ProgressPlugin } = require("webpack");
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: false,
    output: {
        path: path.resolve('dist'),
        filename: 'main.js'
    },
    plugins: [
        new FooPlugin(),
        // new BlockPlugin(),
        // new ProgressPlugin({
        //     activeModules: false,
        //     entries: true,
        //     handler(percentage, message, ...args) {
        //         // custom logic
        //     },
        //     //...
        // }),
    ]
}