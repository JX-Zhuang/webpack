const { SyncHook } = require('tapable');
class Somebody {
    constructor() {
        this.hooks = {
            sleep: new SyncHook()
        };
    }
    sleep() {
        this.hooks.sleep.callAsync((err) => {
            if (err) {
                console.log(`interrupt with "${err.message}"`);
            }
        });
    }
}
const person = new Somebody();
// 注册回调
person.hooks.sleep.tap("test", () => {
    console.log("callback A");
});
person.hooks.sleep.tap("test", () => {
    console.log("callback B");
    // throw new Error("我就是要报错");
});
person.hooks.sleep.tap("test", () => {
    console.log("callback C");
});

person.sleep();