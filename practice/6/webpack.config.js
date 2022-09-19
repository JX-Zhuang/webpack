module.exports = {
    mode: 'none',
    entry: './index',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            // {
            //     test: /\.tsx$/,
            //     loader: "babel-loader",
            //     options: {
            //         presets: [["@babel/preset-react", {
            //             "runtime": "automatic"
            //         }], '@babel/preset-typescript'],
            //     }
            // },
            {
                test: /\.tsx$/,
                use: 'ts-loader',
            },
        ],
    },
};