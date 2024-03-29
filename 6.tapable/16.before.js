//控制注册的回调函数的执行顺序
let { SyncHook } = require('./tapable');
let hook = new SyncHook(['name']);
hook.tap({ name: 'tap1' }, (name) => {
    console.log(1, name);
});
hook.tap({ name: 'tap3' }, (name) => {
    console.log(3, name);
});
hook.tap({ name: 'tap5' }, (name) => {
    console.log(4, name);
});
hook.tap({ name: 'tap2', before: ['tap3', 'tap5'] }, (name) => {
    console.log(2, name);
});
hook.call('zjx');