const { merge } = require("webpack-merge");
const path = require('path');
const baseConfig = {
    output: {
        path: path.resolve(__dirname, "./dist")
    },
    name: "amd",
    entry: "./app.js",
    mode: "development",
};

module.exports = [
    merge(baseConfig, {
        output: {
            filename: "[name]-amd.js",
            libraryTarget: "amd",
        },
    }),
    merge(baseConfig, {
        output: {
            filename: "[name]-commonjs.js",
            libraryTarget: "commonjs",
        },
    }),
];