const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'production',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                options: {
                    presets: [["@babel/preset-react", {
                        "runtime": "automatic"
                    }]],
                }
            },
            // {
            //     test: /\.css$/i,
            //     use: ["style-loader", "css-loader"],
            // },
        ],
    },
};