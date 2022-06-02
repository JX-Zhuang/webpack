class WebpackDonePlugin {
    apply(compiler) {
        compiler.hooks.done.tap('WebpackDonePlugin', () => {
            console.log('结束编译WebpackDonePlugin');
        })
    }
}
module.exports = WebpackDonePlugin;