(() => {
  "use strict";
  var __webpack_modules__ = {
    "./src/bar.js": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        "bar": () => bar
      });
      const bar = 'bar';
      const foo = 'foo';
    }
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
        }
      }
    };
  })();
  (() => {
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  var __webpack_exports__ = {};
  (() => {
    var _bar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/bar.js");
    console.log(_bar__WEBPACK_IMPORTED_MODULE_0__.bar);
  })();
})();