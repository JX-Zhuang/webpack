const fs = require('fs');
const readDir = fs.readdirSync('/Users/jx-zhuang/code/webpack-self/practice/14/node_modules/bootstrap/dist/css');
console.log(readDir.filter(name=>name.endsWith('.css')).map((name)=>`import 'bootstrap/dist/css/${name}';`));