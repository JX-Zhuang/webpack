const path = require('path');
function loader(cssSource) {
    console.log('style loader')
    let script = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(cssSource)};
    document.head.appendChild(style);
    `;
    return script;
}
//pitch
///Users/jx-zhuang/code/webpack-self/5.loader/loaders/less-loader.js
//!/Users/jx-zhuang/code/webpack-self/5.loader/src/index.less
loader.pitch = function (remainingRequest) {
    console.log('style patch')
    let script = `
    let style = document.createElement('style');
    style.innerHTML = require(${stringifyRequest(this, '!!' + remainingRequest)});
    document.head.appendChild(style);
    `;
    return script;
}
//把loader和文件从绝对路径变成相对路径
function stringifyRequest(loaderContext, request) {
    const prefixReg = /^-?!+/;
    const prefixRequest = request.match(prefixReg);
    const prefix = prefixRequest ? prefixRequest[0] : '';
    const splitted = request.replace(prefixReg, '').split('!');
    const { context } = loaderContext;
    return JSON.stringify(prefix + splitted.map(part => {
        part = path.relative(context, part); //相对于项目根目录的相对路径
        if (part[0] !== '.') {
            part = './' + part;
        }
        return part.replace(/\\/, '/');
    }).join('!'));
}
module.exports = loader;