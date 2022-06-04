const { runLoaders } = require('./loader-runner');
const path = require('path');
const fs = require('fs');
const entryFile = path.resolve(__dirname, './src/index.js');
//行内loader
const request = `inline1-loader!inline2-loader!${entryFile}`;
let rules = [{
    test: /\.js/,
    use: ['normal1-loader', 'normal2-loader']
}, {
    test: /\.js/,
    enforce: 'pre', //是不是pre和loader无关，和配置有关
    use: ['pre1-loader', 'pre2-loader']
}, {
    test: /\.js/,
    enforce: 'post',
    use: ['post1-loader', 'post2-loader']
}];
let parts = request.replace(/^-?!+/, '').split('!');
let resource = parts.pop();
// loader顺序：post(后置)+inline(内联)+normal(正常)+pre(前置) 厚脸挣钱
let preLoaders = [], postLoaders = [], inlineLoaders = parts, normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (rule.test.test(resource)) {
        if (rule.enforce === 'post') {
            postLoaders.push(...rule.use);
        } else if (rule.enforce === 'pre') {
            preLoaders.push(...rule.use);
        } else {
            normalLoaders.push(...rule.use);
        }
    }
}
let loaders = [];
if (request.startsWith('!!')) {
    loaders.push(inlineLoaders);
} else if (request.startsWith('-!')) {
    loaders.push(...postLoaders, ...inlineLoaders);
} else if (request.startsWith('!')) {
    loaders.push(...postLoaders, ...inlineLoaders, ...preLoaders);
} else {
    loaders.push(...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders);
}
loaders = loaders.map(loader => path.resolve(__dirname, 'loaders', loader + '.js'));
runLoaders({
    resource: entryFile,
    loaders,
    context: {
        age: 25
    },  //loader执行时的this指针
    readResource: fs.readFile   //读取文件的方法
}, (error, result) => {
    console.log(error, result);
});