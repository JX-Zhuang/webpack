const path = require('path');
const fs = require('fs');
const { SyncHook } = require('tapable');
const Compilation = require('./Compilation');
class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(),
            done: new SyncHook()
        }
    }
    //4.执行compiler的run方法，开始编译
    run(callback) {
        this.hooks.run.call();
        //编译成功后的回调
        const onCompiled = (err, stats, fileDependencies) => {
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
            this.hooks.done.call();
        };
        //开始编译
        this.compile(onCompiled);
    }
    compile(callback) {
        //每次编译，都要生成一个compilation
        const compilation = new Compilation(this.options);
        compilation.build(callback);
    }
}
module.exports = Compiler;