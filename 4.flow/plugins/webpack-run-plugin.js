class WebpackRunPlugin {
    apply(compiler) {
        compiler.hooks.run.tap('WebpackRunPlugin', () => {
            console.log('开始编译WebpackRunPlugin');
        })
    }
}
module.exports = WebpackRunPlugin;