const express = require('express');
const logger = require('morgan');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');
const compiler = webpack(webpackOptions);
const app = express();
app.use(webpackDevMiddleware(compiler, {}));
app.use(logger('dev'));
app.get('/users', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'zjx' },
            { id: 2, name: 'zjx2' },
            { id: 3, name: 'zjx3' }
        ]
    })
});
app.listen(8421, () => console.log('ok 8421'));