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
        this.modules = [];
        this.chunks = [];
        this.assets = {};
        this.fileDependencies = [];
    }
    build(callback) {
        let entry = {};
        if (typeof this.options.entry === 'string') {
            entry.main = this.options.entry;
        } else {
            entry = this.options.entry;
        }
        for (const entryName in entry) {
            const entryFilePath = path.posix.join(baseDir, entry[entryName]);
            this.fileDependencies.push(entryFilePath);
            const entryModule = this.buildModule(entryName, entryFilePath);
            this.modules.push(entryModule);
            const chunk = {
                name: entryName,
                entryModule,
                modules: this.modules.filter(item => item.names.includes(entryName))
            };
            this.chunks.push(chunk);
        }
        //9.把每个chunk转换成一个单独的文件加入到输出列表
        this.chunks.forEach(chunk => {
            const filename = this.options.output.filename.replace('[name]', chunk.name);
            this.assets[filename] = getSource(chunk);
        });
        callback(null, {
            chunks: this.chunks,
            modules: this.modules,
            assets: this.assets
        }, this.fileDependencies);
    }
    buildModule(name, modulePath) {
        //6.调用loader
        let sourceCode = fs.readFileSync(modulePath, 'utf-8');
        let moduleId = './' + path.posix.relative(baseDir, modulePath);
        let module = {
            id: moduleId,
            names: [name],
            dependencies: []
        };
        let loaders = [];
        let { rules = [] } = this.options.module;
        rules.forEach(rule => {
            let { test } = rule;
            if (modulePath.match(test)) {
                loaders.push(...rule.use);
            }
        });
        //自右向左对模块进行编译
        sourceCode = loaders.reduceRight((sourceCode, loader) => {
            return require(loader)(sourceCode);
        }, sourceCode);
        //7.找出此模块的依赖模块，递归本步骤
        let ast = parser.parse(sourceCode, { sourceType: 'module' });
        traverse(ast, {
            CallExpression: (nodePath) => {
                const { node } = nodePath;
                if (node.callee.name === 'require') {
                    let depModuleName = node.arguments[0].value;
                    let dirname = path.posix.dirname(modulePath);
                    let depModulePath = path.posix.join(dirname, depModuleName);
                    let extensions = this.options.resolve.extensions;
                    depModulePath = tryExtensions(depModulePath, extensions);
                    this.fileDependencies.push(depModulePath);
                    let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
                    node.arguments = [types.stringLiteral(depModuleId)];
                    module.dependencies.push({
                        depModuleId,
                        depModulePath
                    });
                }
            }
        });
        let { code } = generator(ast);
        module._source = code;
        //递归本步骤依赖的模块进行编译
        module.dependencies.forEach(({
            depModuleId,
            depModulePath
        }) => {
            let existModule = this.modules.find(
                item => item.id === depModuleId);
            if (existModule) {
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