var modules = {};
//已经加载过的
var cache = {};
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = cache[moduleId] = {
    exports: {}
  };
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.f = {};
require.p = '';
require.u = function (chunkId) {
  return chunkId + '.main.js';
};
require.l = function (url) {
  let script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
};
//已经安装好的代码块，main.js就是对应的main代码块。0表示加载成功
var installedChunks = { main: 0 };
function webpackJsonCallback([chunkIds, moreModules]) {
  const resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i];
    resolves.push(installedChunks[chunkId][0]);
    installedChunks[chunkId] = 0;//标注代码块加载完成
  }
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }
  while (resolves.length) {
    resolves.shift()();
  }
}
require.f.j = function (chunkId, promises) {
  var installedChunkData;
  var promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  installedChunkData[2] = promise;
  promises.push(promise);
  var url = require.p + require.u(chunkId);
  require.l(url);
};

require.e = function (chunkId) {
  let promises = [];
  require.f.j(chunkId, promises);
  return Promise.all(promises);
}
require.r = function (exports) {
  Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
  });
  Object.defineProperty(exports, '__esModule', { value: true });
};
require.d = function (exports, definition) {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      get: definition[key]
    });
  }
}
var chunkGlobal = window["chunkGlobal"] = [];
chunkGlobal.push = webpackJsonCallback;
//1.先通过jsonp加载文件
require.e('src_title_js').then(require.bind(require, './src/title.js')).then(result => {
  console.log(result);
});