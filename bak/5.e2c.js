//模块定义
var modules = {
  './src/title.js': (module, exports, require) => {
    module.exports = {
      name: 'title_name',
      age: 'title_age'
    };
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
require.n = function (module) {
  var getter = module && module.__esModule ? () => module.default : () => module;
  return getter;
}
var exports = {};
require.r(exports);//标识此导出对象是es module导出的
let title = require('./src/title.js');
var title_default = require.n(title);
console.log(title_default());
console.log(title.age);