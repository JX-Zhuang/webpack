const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'main.js'
    },
    resolve: {
        alias: {
            '@': path.resolve('src')
        }
    },
    devServer: {
        static: path.resolve(__dirname, 'public'),
        port: 8080,
        open: true,
        onBeforeSetupMiddleware({ app }) {
            app.get('/api/users', (req, res) => {
                res.json({
                    success: true,
                    data: [
                        { id: 1, name: 'zjx' },
                        { id: 2, name: 'zjx2' },
                        { id: 3, name: 'zjx3' }
                    ]
                })
            });
        },
        // proxy: {
        //     "/api": {
        //         target: "http://localhost:8421",
        //         pathRewrite: {
        //             "^/api": ""
        //         }
        //     }
        // }
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     loader: 'eslint-loader',
            //     enforce: 'pre', //默认，pre前置，post后置
            //     options: {
            //         fix: true
            //     },
            //     exclude: /node_modules/
            // },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { legacy: true }],
                            ["@babel/plugin-proposal-class-properties", { loose: true }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', //会返回一段脚本，此脚本会动态创建style标签，并且把内容设置为css-loader传递过来的内容
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            import: true
                        }
                    },
                    'postcss-loader'
                    // 'css-loader'    //会读取CSS文件，自动识别import语句
                ]   //从右向左
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.png$/,
                type: 'asset/resource'   //webpack5新功能
            },
            {
                test: /\.ico$/,
                type: 'asset/inline'    //base64字符串
            },
            {
                test: /\.txt$/,
                type: 'asset/source'    //读取文件原始内容
            },
            {
                test: /\.jpg$/,
                type: 'asset',  //如果只写asset，会自动根据文件大小进行选择
                parser: {   //大于4k，自动生成一个新文件，小于4k，返回base64
                    dataUrlCondition: {
                        maxSize: 4 * 1024
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]
}