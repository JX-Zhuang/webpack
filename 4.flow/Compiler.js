const path = require('path');
const fs = require('fs');
const { SyncHook } = require('tapable');
const Compilation = require('./Compilation');
class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(), //编译开始触发
            done: new SyncHook() //编译结束触发
        }
    }
    // 4.执行compiler的run方法，开始编译
    run(callback) {
        this.hooks.run.call();
        // 编译成功后的回调
        const onCompiled = (err, stats, fileDependencies) => {
            //10.在确定好输出内容后，会根据配置的输出的路径和文件名，把文件内容写到文件系统里
            const outputPath = this.options.output.path;
            for (let filename in stats.assets) {
                if (!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath);
                }
                let filePath = path.join(this.options.output.path, filename);
                fs.writeFileSync(filePath, stats.assets[filename], 'utf-8');
            }
            callback(err, {
                toJson: () => stats
            });
            fileDependencies.forEach((fileDependency) => {
                fs.watch(fileDependency, () => {
                    this.compile(onCompiled);
                });
            });
            //编译成功后触发done钩子
            this.hooks.done.call();
        }
        //开始编译，编译成功后调用onCompiled
        this.compile(onCompiled);
    }
    compile(callback) {
        //每次编译都会产生一个新的Compilation
        let compilation = new Compilation(this.options);
        compilation.build(callback);
    }
}
module.exports = Compiler;