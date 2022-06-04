const { AsyncParallelBailHook } = require('tapable');
const hook = new AsyncParallelBailHook(['name', 'age']);
hook.tapPromise('1', (name, age) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('1', name, age);
            resolve();
        }, 1000);
    });
})
hook.tapPromise('2', (name, age) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('2', name, age);
            resolve('2 wrong');
        }, 2000);
    });
})
hook.tapPromise('3', (name, age) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('3', name, age);
            resolve();
        }, 3000);
    });
})
hook.promise('zjx', 12).then(err => {
    console.log('done', err);
}).catch(e => console.log(e));
