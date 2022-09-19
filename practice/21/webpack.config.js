const TestPlugin = require('./TestPlugin');
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: false,
    plugins: [
        new TestPlugin({
            outputFile:'outputFile.md'
        })
    ]
}