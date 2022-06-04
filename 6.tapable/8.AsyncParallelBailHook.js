const { AsyncParallelBailHook } = require('tapable');
const hook = new AsyncParallelBailHook(['name', 'age']);
hook.tapAsync('1', (name, age, callback) => {
    setTimeout(() => {
        console.log('1', name, age);
        callback();
    }, 1000);
})
hook.tapAsync('2', (name, age, callback) => {
    setTimeout(() => {
        console.log('2', name, age);
        callback('xxx');
    }, 2000);
})
hook.tapAsync('3', (name, age, callback) => {
    setTimeout(() => {
        console.log('3', name, age);
        callback();
    }, 3000);
})
hook.callAsync('zjx', 12, (err) => {
    console.log(err, 'done');
});
