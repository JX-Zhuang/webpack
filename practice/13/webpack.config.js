const path = require("path");

module.exports = {
    mode: "development",
    devtool: false,
    entry: {
        main: { import: './src/main.js', runtime: "common-runtime" },
        index: { import: "./src/index.js", dependOn: "main" },
    },
    output: {
        clean: true,
        filename: "[name]1.js",
        path: path.resolve(__dirname, "dist"),
    },
    cache: {
        type: 'filesystem'
    }
};