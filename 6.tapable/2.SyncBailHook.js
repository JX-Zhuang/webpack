const { SyncBailHook } = require('tapable');
const hook = new SyncBailHook(['name', 'age']);
//有一个返回非undefined，后面不执行了
hook.tap('1', (name, age) => {
    console.log('1', name, age);
})
hook.tap('2', (name, age) => {
    console.log('2', name, age);
    return '2'
})
hook.tap('3', (name, age) => {
    console.log('3', name, age);
    return '3'
})
hook.call('zjx', 12);
