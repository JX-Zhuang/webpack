const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: './index.js',
    mode: 'development',
    devtool: false,
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: ["style-loader", {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1
                    }
                }, {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                // 添加 autoprefixer 插件
                                plugins: [require("autoprefixer")],
                            },
                        },
                    }, "less-loader"],
            },
        ],
    },
    plugins: [
        // new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        })
    ]
};