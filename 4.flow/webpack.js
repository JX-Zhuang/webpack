const Compiler = require('./Compiler');
function webpack(options) {
    // 1.初始化参数，配置文件和shell何必参数，命令行优先级高
    const argv = process.argv.slice(2);
    // --mode=development
    let shellOptions = argv.reduce((shellOptions, option) => {
        let [key, value] = option.split('=');
        shellOptions[key.slice(2)] = value;
        return shellOptions;
    }, {});
    let finalOptions = {
        ...options,
        ...shellOptions
    };
    // 2.用上一步的配置对象初始化Compiler对象
    const compiler = new Compiler(finalOptions);
    // 3.加载所有的插件
    const { plugins } = finalOptions;
    for (let plugin of plugins) {
        plugin.apply(compiler);
    }
    // 4.执行compiler的run方法
    return compiler;
}
module.exports = webpack;