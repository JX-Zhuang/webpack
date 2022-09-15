const sourceMap = require('source-map');
const rawSourceMap = {
    "version": 3,
    "file": "./dist/main.js",
    "mappings": ";;;;;AAAA;AACA;AACA;AACA;AACA,Q",
    "sources": [
        "webpack://29/./src/index.js"
    ],
    "sourcesContent": [
        "class Person{\n    constructor(){}\n}\nconst zjx = new Person();\nzjx.a();"
    ],
    "names": [],
    "sourceRoot": "./"
};
const init = async () => {
    try {
        require('./dist1/main');
    } catch (e) {
        console.dir(e)
        await sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
            console.log(e)
            console.log(consumer.originalPositionFor({
                line: e.line,
                column: e.column
            }));
        });
    }
};
init();