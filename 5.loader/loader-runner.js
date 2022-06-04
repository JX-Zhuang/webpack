const fs = require('fs');
/**
 * 根据loader模块的绝对路径得到loader对象
 * @param {*} loader 
 */
function createLoaderObject(loader) {
    const normal = require(loader);
    const pitch = normal.pitch;
    return {
        path: loader,//loader绝对路径
        normal,
        pitch,
        raw: normal.raw,//如果raw为true，那么normal的参数是buffer
        data: {},
        pitchExecuted: false, //此loader的pitch函数执行过？
        normalExecuted: false    //此loader的normal函数执行过？
    };
}

function processResource(processOptions, loaderContext, pitchingCallback) {
    processOptions.readResource(loaderContext.resource, (err, resourceBuffer) => {
        processOptions.resourceBuffer = resourceBuffer;
        loaderContext.loaderIndex--;
        iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], pitchingCallback);
    });
}
function convertArgs(args, raw) {
    if (raw && !Buffer.isBuffer(args[0])) {
        args[0] = Buffer.from(args[0]);
    } else if (!raw && Buffer.isBuffer(args[0])) {
        args[0] = args[0].toString('utf-8');
    }
}
function iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback) {
    if (loaderContext.loaderIndex < 0) {
        return pitchingCallback(null, args);
    }
    const currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
    if (currentLoader.normalExecuted) {
        loaderContext.loaderIndex--;
        return iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback);
    }
    let normalFn = currentLoader.normal;
    currentLoader.normalExecuted = true;
    convertArgs(args, currentLoader.raw);
    runSyncOrAsync(normalFn, loaderContext, args, (err, ...returnArgs) => {
        if (err) return pitchingCallback(err);
        return iterateNormalLoaders(processOptions, loaderContext, returnArgs, pitchingCallback)
    });
}
function iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback) {
    if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
        return processResource(processOptions, loaderContext, pitchingCallback);
    }
    const currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
    if (currentLoader.pitchExecuted) {
        loaderContext.loaderIndex++;
        return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
    }
    let pitchFn = currentLoader.pitch;
    currentLoader.pitchExecuted = true;//不管pitch有没有，都设置为true
    if (!pitchFn) {
        return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
    }
    //同步或异步调用pitchFn
    runSyncOrAsync(pitchFn, loaderContext, [
        loaderContext.remainingRequest,
        loaderContext.previousRequest,
        loaderContext.data
    ], (err, ...args) => {
        //判断
        if (args.length > 0 && args.some(item => item)) {
            loaderContext.loaderIndex--;
            iterateNormalLoaders(processOptions, loaderContext, argus, pitchingCallback);
        } else {
            return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
        }
    });
}

function runSyncOrAsync(fn, loaderContext, args, runCallback) {
    let isSync = true;
    loaderContext.callback = (err, ...args) => {
        runCallback(err, ...args);
    };
    loaderContext.async = () => {
        isSync = false;
        return loaderContext.callback;
    };
    let result = fn.apply(loaderContext, args);
    if (isSync) {
        runCallback(null, result);
    }
}

function runLoaders(options, finalCallback) {
    const { resource, loaders = [], context = {}, readResource = fs.readFile } = options;
    const loaderObjects = loaders.map(createLoaderObject);
    const loaderContext = context;//会成为loader执行过程中的this指针
    loaderContext.resource = resource;
    loaderContext.readResource = readResource;
    loaderContext.loaders = loaderObjects;
    loaderContext.loaderIndex = 0;  //正在执行的loader的索引
    loaderContext.callback = null;  //调用callback，可以让当前的loader结束
    loaderContext.async = null; //内置方法，同步变异步
    Object.defineProperty(loaderContext, 'request', {
        get() {
            return loaderContext.loaders.map(loader => loader.path).concat(loaderContext.resource).join('!');
        }
    });
    Object.defineProperty(loaderContext, 'remainingRequest', {
        get() {
            return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).map(loader => loader.path).concat(loaderContext.resource).join('!');
        }
    });
    Object.defineProperty(loaderContext, 'currentRequest', {
        get() {
            return loaderContext.loaders.slice(loaderContext.loaderIndex).map(loader => loader.path).concat(loaderContext.resource).join('!');
        }
    });
    Object.defineProperty(loaderContext, 'previousRequest', {
        get() {
            return loaderContext.loaders.slice(0, loaderContext.loaderIndex).map(loader => loader.path).concat(loaderContext.resource).join('!');
        }
    });
    Object.defineProperty(loaderContext, 'data', {
        get() {
            return loaderContext.loaders[loaderContext.loaderIndex].data;
        }
    });
    let processOptions = {
        resourceBuffer: null,    //原始内容
        readResource
    };
    //迭代loader
    //开始从左到右迭代执行loader的pitch
    iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
        finalCallback(err, {
            result,
            resourceBuffer: processOptions.resourceBuffer
        })
    })
}

exports.runLoaders = runLoaders;