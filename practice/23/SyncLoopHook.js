const { SyncLoopHook } = require('tapable');
class Somebody {
    constructor() {
        this.hooks = {
            sleep: new SyncLoopHook()
        }
    }
    sleep() {
        return this.hooks.sleep.call();
    }
}
const person = new Somebody();
let times = 0;
// 注册回调
person.hooks.sleep.tap("test", (arg) => {
    ++times;
    console.log(`第 ${times} 次执行回调A`);
    if (times < 4) {
        return times;
    }
});

person.hooks.sleep.tap("test", (arg) => {
    console.log(`执行回调B`);
});

person.sleep();