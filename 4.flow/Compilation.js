const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const types = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
function toUnixPath(filePath) {
    return filePath.replace(/\\/g, "/");
}
//当前命令所在的目录
const baseDir = toUnixPath(process.cwd());
class Compilation {
    constructor(options) {
        this.options = options;
        //本次编译所有生成出来的模块
        this.modules = [];
        //本次编译产出的所有代码块，入口模块和依赖模块打包在一起成为代码块
        this.chunks = [];
        //本次编译产出的资源文件
        this.assets = {};
        //本次打包涉及了哪些文件，主要是为了实现watch，监听文件的变化，
        //文件变化后会重新编译
        this.fileDependencies = [];
    }
    build(callback) {
        //5.根据配置文件的entry配置项找到所有的入口
        let entry = {};
        if (typeof this.options.entry === 'string') {
            entry.main = this.options.entry;
        } else {
            entry = this.options.entry;
        }
        //6.从入口文件出发，调用所有的loader规则，对模块进行编译
        for (let entryName in entry) {
            //入口的名称就是entry的属性名，会成为代码块的名称
            let entryFilePath = path.posix.join(baseDir, entry[entryName]);
            //把入口文件的绝对路径添加到依赖中
            this.fileDependencies.push(entryFilePath);
            //6.从入口文件出发，调用所有的loader规则，对模块进行编译
            let entryModule = this.buildModule(entryName, entryFilePath);
            this.modules.push(entryModule);
            //8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
            let chunk = {
                name: entryName,
                entryModule,//此代码块对应的入口模块的对象
                modules: this.modules.filter(item => item.names.includes(entryName))
            };
            this.chunks.push(chunk);
        }
        //9.再把每个Chunk转换成一个单独的文件加入到输出列表
        this.chunks.forEach(chunk => {
            let filename = this.options.output.filename.replace('[name]', chunk.name);
            this.assets[filename] = getSource(chunk);
        });
        callback(null, {
            chunks: this.chunks,
            modules: this.modules,
            assets: this.assets
        }, this.fileDependencies);
    }
    buildModule(name, modulePath) {
        //6.从入口文件出发，调用所有的loader规则，对模块进行编译
        //6.1读取模块内容
        let sourceCode = fs.readFileSync(modulePath, 'utf-8');
        // buildModule会返回一个模块对象，每个模块都有一个moduleId
        let moduleId = './' + path.posix.relative(baseDir, modulePath);
        let module = {
            id: moduleId,
            names: [name],
            dependencies: []
        };
        //查找对应的loader对源码进行翻译和转换
        let loaders = [];
        let { rules = [] } = this.options.module;
        rules.forEach(rule => {
            let { test } = rule;
            //如果模块的路径和正则匹配，就把此规则对应的loader添加到数组里
            if (modulePath.match(test)) {
                loaders.push(...rule.use);
            }
        });
        //自右向左对模块进行转译
        sourceCode = loaders.reduceRight((sourceCode, loader) => {
            return require(loader)(sourceCode);
        }, sourceCode);
        //loader翻译后的内容一定是js内容

        //7.再找出此模块的依赖模块，再递归本步骤依赖的模块进行编译
        let ast = parser.parse(sourceCode, { sourceType: 'module' });
        traverse(ast, {
            CallExpression: (nodePath) => {
                const { node } = nodePath;
                if (node.callee.name === 'require') {
                    //获取依赖模块
                    let depModuleName = node.arguments[0].value;
                    //当前正在编译的模块所在的目录
                    let dirname = path.posix.dirname(modulePath);
                    //获取依赖模块的绝对路径
                    let depModulePath = path.posix.join(dirname, depModuleName);
                    let extensions = this.options.resolve.extensions;
                    depModulePath = tryExtensions(depModulePath, extensions);
                    this.fileDependencies.push(depModulePath);
                    //依赖模块的Id
                    let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
                    //修改语法树，把依赖模块修改为依赖模块ID
                    node.arguments = [types.stringLiteral(depModuleId)];
                    //添加依赖
                    module.dependencies.push({
                        depModuleId,
                        depModulePath
                    });
                }
            }
        });
        //生成新代码
        let { code } = generator(ast);
        module._source = code;
        //再递归本步骤依赖的模块进行编译
        module.dependencies.forEach(({
            depModuleId,
            depModulePath
        }) => {
            let existModule = this.modules.find(
                item => item.id === depModuleId);
            //如果modules里存在这个将要编译的依赖模块里，就不需要编译了
            //直接把此代码块的名称添加到对应的name里
            if (existModule) {
                //name指的是它属于哪些代码块
                existModule.names.push(name);
            } else {
                let depModule = this.buildModule(name, depModulePath);
                this.modules.push(depModule);
            }
        });
        return module;
    }
}
function getSource(chunk) {
    return `
     (() => {
      var modules = {
        ${chunk.modules.map(
        (module) => `
          "${module.id}": (module) => {
            ${module._source}
          }
        `
    )}  
      };
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = (cache[moduleId] = {
          exports: {},
        });
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports ={};
      ${chunk.entryModule._source}
    })();
     `;
}
function tryExtensions(modulePath, extensions) {
    if (fs.existsSync(modulePath)) {
        return modulePath;
    }
    for (let i = 0; i < extensions.length; i++) {
        let filePath = modulePath + extensions[i];
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    throw new Error(`无法找到${modulePath}`);
}
module.exports = Compilation;