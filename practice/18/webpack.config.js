const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    devtool:false,
    externals: {
        lodash: "_",
    },
    plugins: [
        new HtmlWebpackPlugin({
            templateContent: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
    <script defer crossorigin src="//unpkg.com/react@18/umd/react.development.js"></script>
    <script defer crossorigin src="//unpkg.com/lodash@4.17.21/lodash.min.js"></script>
  </head>
  <body>
    <div id="app" />
  </body>
  </html>
    `,
        }),
    ],
};