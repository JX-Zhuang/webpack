
const threadLoader = require('thread-loader');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// threadLoader.warmup({
//     workers: 4,
//     poolTimeout: 2000
// }, ["style-loader", "css-loader", "less-loader"]);
module.exports = {
    mode: "development",
    devtool: false,
    entry: './src/index.js',
    output: {
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    // "thread-loader",
                    "css-loader",
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                strictMath: false,
                                javascriptEnabled: true
                            },
                        },
                    },
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    // "thread-loader",
                    "css-loader"
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        }),
    ],
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
    },
};