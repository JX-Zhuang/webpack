const webpack = require("./myWebpack/webpack");
const options = require("./webpack.config");
const compiler = webpack(options);
compiler.run((err, stats) => {
    console.log(err);
    console.log(
        JSON.stringify(
            stats.toJson({
                assets: true, //资源
                chunks: true, //代码块
                modules: true, //模块
            }),
            null,
            2
        )
    );
});