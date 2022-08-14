const Compiler = require('./Compiler');
function webpack(options) {
    //1.初始化参数，命令行的参数优先级高，假设最终参数是finalOptions
    const finalOptions = {
        ...options
    };
    //2.初始化Compiler的实例
    const compiler = new Compiler(finalOptions);
    //3.加载plugins
    const { plugins } = finalOptions;
    for (const plugin of plugins) {
        plugin.apply(compiler);
    }
    //4.执行compiler的run方法
    return compiler;
}
module.exports = webpack;