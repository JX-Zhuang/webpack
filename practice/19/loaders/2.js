module.exports = function rawLoader(source) {
    const json = JSON.stringify(source)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

    const esModule = true;
        // typeof options.esModule !== 'undefined' ? options.esModule : true;

    return `${esModule ? 'export default' : 'module.exports ='} ${json};`;
}