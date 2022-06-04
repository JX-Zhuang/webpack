const babel = require('@babel/core');
const path = require('path');
function loader(source) {
    const options = this.getOptions();
    const loaderOptions = {
        ...options
    };
    const { code } = babel.transformSync(source, loaderOptions);
    return code;
}
module.exports = loader;
/**
 * babel-loader:函数，接收老代码，返回新代码
 * @babel/core:负责把源代码转换成AST，遍历语法树，生成新代码
 * core不认识具体的语法，不会转换任何语法
 * 
 */