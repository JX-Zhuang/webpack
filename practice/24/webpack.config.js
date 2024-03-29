const path = require('path');
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.js'),
    devtool: false,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    }
}