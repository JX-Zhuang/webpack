const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
module.exports = {
    mode: 'production',
    entry: './src/index.js',
    devtool: false,
    output: {
        path: path.resolve('dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10000
                    }
                }
            },
        ],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    plugins: [
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i
        })
        // new ESLintPlugin({
        //     fix: true
        // }),
        // new HtmlWebpackPlugin({
        //     template: './src/index.html',
        //     filename: 'index.html'
        // }),
        // new DefinePlugin({
        //     PROD: true,
        //     VERSION: JSON.stringify("12.13.0"),
        //     obj: {
        //         a: 1
        //     },
        //     fn: () => console.log(9)
        // })
    ],
    // optimization: {
    //     minimizer: [
    //         new ImageMinimizerPlugin({
    //             minimizer: {
    //                 implementation: ImageMinimizerPlugin.imageminMinify,
    //                 options: {
    //                     plugins: [
    //                         ["optipng", { optimizationLevel: 5 }],
    //                     ],
    //                 },
    //             },
    //         }),
    //     ],
    // },
}