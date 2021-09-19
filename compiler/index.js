const fs = require('fs');
const path = require('path');
const babel = require("@babel/core");
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const stepOne = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = babelParser.parse(content, {
        sourceType: 'module'
    });
    const dependencies = {};
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename)
            dependencies[node.source.value] = path.join(dirname, node.source.value);
        }
    })
    const { code } = babel.transformFromAstSync(ast, null, {
        presets: ["@babel/preset-env"]
    });
    return {
        filename,
        code,
        dependencies
    }
};
const stepTwo = (entry) => {
    const entryModule = stepOne(entry);
    const graphArr = [entryModule];
    for (let i = 0; i < graphArr.length; i++) {
        const { dependencies } = graphArr[i];
        Object.values(dependencies).forEach((item) => {
            graphArr.push(stepOne(item));
        });
    }
    const graph = {};
    graphArr.forEach(({ filename, dependencies, code }) => {
        graph[filename] = {
            dependencies,
            code
        };
    });
    return graph;
}
const stepThree = (entry) => {
    //要先把对象转换为字符串，不然在下面的模板字符串中会默认调取对象的toString方法，参数变成[Object object],显然不行
    const graph = JSON.stringify(stepTwo(entry))
    return `
        (function(graph) {
            //require函数的本质是执行一个模块的代码，然后将相应变量挂载到exports对象上
            function require(module) {
                //localRequire的本质是拿到依赖包的exports变量
                function localRequire(relativePath) {
                    return require(graph[module].dependencies[relativePath]);
                }
                var exports = {};
                (function(require, exports, code) {
                    eval(code);
                })(localRequire, exports, graph[module].code);
                return exports;//函数返回指向局部变量，形成闭包，exports变量在函数执行后不会被摧毁
            }
            require('${entry}')
        })(${graph})`;
}
const filename = path.join(__dirname, '..', 'src/index.js');
console.log(stepThree(filename));