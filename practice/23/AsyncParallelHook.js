const { AsyncParallelHook } = require('tapable');
const hook = new AsyncParallelHook();
hook.tapPromise("test", () => {
    return new Promise(resolve => {
        console.log("A");
        setTimeout(() => {
            console.log("callback A");
            resolve();
        }, 1000);
    });
});
hook.tapPromise("test", () => {
    console.log("B");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("callback B");
            resolve();
        }, 1000);
    });
});
hook.tapPromise("test", () => {
    console.log("C");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("callback C");
            resolve();
        }, 1000);
    });
});
hook.callAsync((err) => {
    if (err) {
        console.log(`interrupt with "${err.message}"`);
    }
});