// const { SyncHook } = require('tapable');
class SyncHook {
    constructor(args) {
        this.args = args;
        this.argsLen = args ? args.length : 0;
        this.taps = [];
    }
    tap(name, fn) {
        this.taps.push({ name, fn });
    }
    call() {
        let args = Array.prototype.slice.call(arguments, 0, this.argsLen);
        this.taps.forEach(tap => {
            tap.fn(...args);
        });
    }
}

let syncHook = new SyncHook(['name']);
syncHook.tap('监听器名称1', (name) => {
    console.log('监听器名称1', name);
});
syncHook.tap('监听器名称2', (name) => {
    console.log('监听器名称2', name);
});

class SomePlugin {
    apply() {
        syncHook.tap('SomePlugin', (name) => {
            console.log('SomePlugin', name);
        });
    }
}
new SomePlugin().apply();

syncHook.call('监听器名称1');