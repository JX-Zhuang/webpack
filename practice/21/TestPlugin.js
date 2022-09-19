class TestPlugin {
    static defaultOptions = {
        outputFile: 'assets.md',
    };
    constructor(options = {}) {
        this.options = { ...TestPlugin.defaultOptions, ...options };
    }
    apply(compiler) {
        const pluginName = TestPlugin.name;
        compiler.hooks.environment.tap(pluginName, (...argus) => {
            console.log('environment', argus);
        });
        compiler.hooks.afterEnvironment.tap(pluginName, (...argus) => {
            console.log('afterEnvironment', argus);
        });
        compiler.hooks.entryOption.tap(pluginName, (...argus) => {
            console.log('entryOption', argus);
        });
    }
}
module.exports = TestPlugin;