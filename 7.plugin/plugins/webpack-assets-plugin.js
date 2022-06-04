//打印产出的代码块和文件
//Compilation插件
class WebpackAssetsPlugin {
    apply(compiler) {
        //每当compiler创建一个新的compilation的时候，执行回调，参数是compilation
        compiler.hooks.compilation.tap('WebpackAssetsPlugin', (compilation) => {
            //编译的时候，每当代码块创建一个新的文件的时候，执行回调
            compilation.hooks.chunkAsset.tap('WebpackAssetsPlugin', (chunk, filename) => {
                console.log(chunk.name || chunk.id, filename);
            });
        });
    }
}
module.exports = WebpackAssetsPlugin;