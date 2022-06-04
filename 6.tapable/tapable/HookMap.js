class HookMap {
    constructor(factory) {
        this.map = new Map();
        this.factory = factory;
    }
    for(key) {
        const hook = this.get(key);
        if (hook) return hook;
        let newHooks = this.factory();
        this.map.set(key, newHooks);
        return newHooks;
    }
    get(key) {
        return this.map.get(key);
    }
}
module.exports = HookMap;