const path = require("path");

module.exports = {
    mode: "development",
    devtool: false,
    entry: "./src/index.js",

    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist"),
        library: {
            name: '_',
            type: 'umd'
        },
    },
    externals:{
        lodash:{
            commonjs: "lodash",
            commonjs2: "lodash"
        }
    }
};