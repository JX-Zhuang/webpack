
     (() => {
      var modules = {
        
          "./src/title.js": (module) => {
            module.exports = "title"; //loader2//loader1
          }
        ,
          "./src/entry1.js": (module) => {
            let title = require("./src/title.js");

console.log("entry1", title); //loader2//loader1
          }
          
      };
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = (cache[moduleId] = {
          exports: {},
        });
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports ={};
      let title = require("./src/title.js");

console.log("entry1", title); //loader2//loader1
    })();
     