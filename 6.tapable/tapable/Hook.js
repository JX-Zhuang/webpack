class Hook {
    constructor(args) {
        this.args = Array.isArray(args) ? args : [];
        this.taps = [];
        this.call = CALL_DELEGATE;
        this.callAsync = CALL_ASYNC_DELEGATE;
        this.promise = PROMISE_DELEGATE;
        this._x = null;
        this.interceptors = [];
    }
    intercept(interceptor) {
        this.interceptors.push(interceptor);
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
        this.runRegisterInterceptors(tapInfo);
        this._insert(tapInfo);
    }
    runRegisterInterceptors(tapInfo) {
        for (const interceptor of this.interceptors) {
            if (interceptor.register) {
                interceptor.register(tapInfo);
            }
        }
    }
    _insert(tapInfo) {
        let before;
        if (typeof tapInfo.before === 'string') {
            before = new Set([tapInfo.before]);
        } else if (Array.isArray(tapInfo.before)) {
            before = new Set(tapInfo.before);
        }
        let stage = 0;
        if (typeof tapInfo.stage === 'number') {
            stage = tapInfo.stage;
        }
        let i = this.taps.length;
        while (i > 0) {
            i--;
            const x = this.taps[i];
            this.taps[i + 1] = x;
            const xStage = x.stage || 0;
            if (before) {
                if (before.has(x.name)) {
                    before.delete(x.name);
                    continue;
                }
                if(before.size>0){
                    continue;
                }
            }
            if (xStage > stage) continue;
            i++;
            break;
        }
        this.taps[i] = tapInfo;
    }
    compile(options) {
        throw new Error('此方法是抽象方法，需要子类实现');
    }
    _createCall(type) {
        return this.compile({
            taps: this.taps,
            args: this.args,
            type,
            interceptors: this.interceptors
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