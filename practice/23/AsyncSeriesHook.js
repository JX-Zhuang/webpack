const { AsyncSeriesHook } = require("tapable");

const hook = new AsyncSeriesHook();
hook.tapAsync("test", cb => {
    console.log("callback A");
    setTimeout(() => {
        console.log("callback A 异步操作结束");
        cb();
    }, 1000);
});

hook.tapAsync("test", () => {
    console.log("callback B");
});

// hook.callAsync();

const hook2 = new AsyncSeriesHook();
hook2.tapPromise("test", () => {
    console.log("callback A");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("callback A 异步操作结束");
            resolve();
        }, 1000);
    });
});
hook2.tapPromise("test", () => {
    console.log("callback B");
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("callback B 异步操作结束");
            resolve();
        }, 1000);
    });
});

hook2.promise();