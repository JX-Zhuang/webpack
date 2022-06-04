const { SyncHook } = require('./tapable');
const hook = new SyncHook(['name']);
hook.intercept({
    register(tapInfo) {//注册tapInfo拦截器会在每次注册新的回调前触发
        console.log('intercept1 register', tapInfo.name);
    },
    tap(tapInfo) {//调用回调时执行
        console.log('intercept1 tap', tapInfo.name);
    },
    call(name) {//调用call方法的时候执行一次
        console.log('intercept1 call', name);
    }
});
hook.intercept({
    register(tapInfo) {
        console.log('intercept2 register', tapInfo.name);
    },
    tap(tapInfo) {
        console.log('intercept2 tap', tapInfo.name);
    },
    call(name) {
        console.log('intercept2 call', name);
    }
})
hook.tap({
    name: 'A'
}, (name) => {
    console.log('A', name);
});
hook.tap({
    name: 'B'
}, (name) => {
    console.log('B', name);
});
hook.call('zjx');