const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: {
        foo: {
            import: ['./a.js', './a1.js'],
            runtime: 'runtime'
        },
        bar: {
            import: './c.js',
            runtime: 'runtime'
        }
    },
    devtool: false,
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        })
    ]
}