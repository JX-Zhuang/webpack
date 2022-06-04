const { AsyncSeriesBailHook } = require('tapable');
const hook = new AsyncSeriesBailHook(['name', 'age']);
console.time("cost");
hook.tapAsync('1', (name, age, callback) => {
    setTimeout(() => {
        console.log('1', name, age);
        callback();
    }, 1000);
})
hook.tapAsync('2', (name, age, callback) => {
    setTimeout(() => {
        console.log('2', name, age);
        callback(null, '2返回值');
    }, 2000);
})
hook.tapAsync('3', (name, age, callback) => {
    setTimeout(() => {
        console.log('3', name, age);
        callback();
    }, 3000);
})
hook.callAsync('zjx', 12, (err, data) => {
    console.log(err, data, 'done');
    console.timeEnd("cost");
});
