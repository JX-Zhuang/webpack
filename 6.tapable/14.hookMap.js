const { HookMap, SyncHook } = require('./tapable');
const keyedHookMap = new HookMap(() => {
    return new SyncHook(['name']);
});
keyedHookMap.for('key1').tap('plugin1', (name)=> {
    console.log(1, name);
});
keyedHookMap.for('key2').tap('plugin1', (name)=> {
    console.log(2, name);
});
const hook = keyedHookMap.get('key1');
hook.call('zjx');