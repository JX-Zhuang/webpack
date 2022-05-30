//模块定义
var modules = {
  './src/title.js': (module, exports, require) => {
    //标识此exports是一个es module的导出
    require.r(exports);
    require.d(exports, {
      default: () => _DEFAULT_EXPORT_,
      age: () => age
    });
    const _DEFAULT_EXPORT_ = 'title_name';
    const age = 'title_age';
  }
}
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
var exports = {};
require.r(exports);
let title = require('./src/title.js');
console.log(title.default);
console.log(title.age);