const { ExternalModule } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
class AutoExternalPlugin {
    constructor(options) {
        this.options = options;
        this.externalModules = Object.keys(this.options);
        this.importedModules = new Set();
    }
    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {
            normalModuleFactory.hooks.parser     // parser hookMap
                .for('javascript/auto')         //js对应的hook
                .tap('AutoExternalPlugin', (parser) => { //acorn
                    parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
                        if (this.externalModules.includes(source)) {
                            this.importedModules.add(source);
                        }
                    });
                    parser.hooks.call.for('require').tap('AutoExternalPlugin', (expression) => {
                        let value = expression.arguments[0].value;
                        if (this.externalModules.includes(value)) {
                            this.importedModules.add(value);
                        }
                    });
                });
            normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolveData, callback) => {
                const { request } = resolveData;//获取请求的资源
                if (this.externalModules.includes(request)) {
                    let { variable } = this.options[request];
                    callback(null, new ExternalModule(variable, 'window', request));
                } else {
                    callback(null);
                }
            })
        });
        compiler.hooks.compilation.tap('AutoExternalPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags
                .tapAsync('AutoExternalPlugin', (htmlData, callback) => {
                    Object.keys(this.options)
                        .filter(key => this.importedModules.has(key))
                        .forEach(key => {
                            htmlData.assetTags.scripts.unshift({
                                tagName: 'script',
                                voidTag: false,
                                attributes: {
                                    defer: false,
                                    src: this.options[key].url
                                }
                            })
                        });
                    callback(null,htmlData);
                });
        })
    }
}
module.exports = AutoExternalPlugin;