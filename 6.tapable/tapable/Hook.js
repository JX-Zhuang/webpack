class Hook {
    constructor(args) {
        this.args = Array.isArray(args) ? args : [];
        this.taps = [];
        this.call = CALL_DELEGATE;
        this.callAsync = CALL_ASYNC_DELEGATE;
        this.promise = PROMISE_DELEGATE;
        this._x = null;
    }
    tap(options, fn) {
        this._tap('sync', options, fn);
    }
    tapAsync(options, fn) {
        this._tap('async', options, fn);
    }
    tapPromise(options, fn) {
        this._tap('promise', options, fn);
    }
    _tap(type, options, fn) {
        if (typeof options === 'string') {
            options = {
                name: options
            };
        }
        const tapInfo = { ...options, type, fn };
        this._insert(tapInfo);
    }
    _insert(tapInfo) {
        this.taps.push(tapInfo);
    }
    compile(options) {
        throw new Error('此方法是抽象方法，需要子类实现');
    }
    _createCall(type) {
        return this.compile({
            taps: this.taps,
            args: this.args,
            type
        });
    }
}
const CALL_DELEGATE = function (...args) {
    //动态创建call方法
    this.call = this._createCall('sync');
    return this.call(...args);
}
const CALL_ASYNC_DELEGATE = function (...args) {
    //动态创建call方法
    this.callAsync = this._createCall('async');
    return this.callAsync(...args);
}
const PROMISE_DELEGATE = function (...args) {
    //动态创建call方法
    this.promise = this._createCall('promise');
    return this.promise(...args);
}
module.exports = Hook;