const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: { main: "./src/index.js" },
    output: {
        filename: "[name].js",
        path: path.resolve(process.cwd(), "./dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
            },
        ],
    },
    plugins: [new HTMLWebpackPlugin()],
};