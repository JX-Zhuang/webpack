const PLUGIN_NAME = 'FooPlugin';
const wait = (misec) => new Promise((r) => setTimeout(r, misec));
class FooPlugin1 {
    apply(compiler) {

        compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
            // const logger = compilation.getLogger(PLUGIN_NAME);
            // 调用分级日志接口
            // logger.log('Logging from FooPlugin')
            // logger.error("Error from FooPlugin");

            // compilation.errors.push(new Error("Emit Error From FooPlugin"));
            // compilation.warnings.push("Emit Warning From FooPlugin");

            // throw new Error("Throw Error Directly");
            const statsMap = new Map();
            compilation.hooks.buildModule.tap(PLUGIN_NAME, module => {
                const ident = module.identifier();
                const startTime = Date.now();
                // 模拟复杂耗时操作
                // ...
                while (Date.now() - startTime < 20000);
                // ...
                const endTime = Date.now();
                // 记录处理耗时
                statsMap.set(ident, endTime - startTime);
            });
            compilation.hooks.statsFactory.tap(PLUGIN_NAME, factory => {
                factory.hooks.result
                    .for('module')
                    .tap(PLUGIN_NAME, (module, context) => {
                        const { identifier } = module;
                        const duration = statsMap.get(identifier);
                        // 添加统计信息
                        module.fooDuration = duration || 0;
                    });
            })
        })
    }
}



const {
    sources: { ConcatSource, RawSource },
} = require("webpack");

class FooPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
            compilation.hooks.processAssets.tapAsync(PLUGIN_NAME, (assets, cb) => {
                Object.keys(assets).forEach((k) => {
                    assets[k] = new ConcatSource(
                        new RawSource("// Inject By zjx\n\n"),
                        assets[k]
                    );
                });
                cb();
            });
        });
    }
}
module.exports = FooPlugin;