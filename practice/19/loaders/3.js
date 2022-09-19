const { validate } = require('schema-utils');
const schema = require('./3.json');
module.exports = function (source) {
    const { version, webpack } = this;
    console.log('3.js')
    const options = this.getOptions();
    validate(schema, options, "Loader");
    const newSource = `
    /**
     * Loader API Version: ${version}
     * Is this in "webpack mode": ${webpack}
     */
    /**
     * Original Source From Loader
     */
    ${source}`;

    return newSource;
}