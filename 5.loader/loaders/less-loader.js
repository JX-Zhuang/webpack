const less = require('less');
function loader(lessSource) {
    let cssSource;
    console.log('less-loader')
    less.render(lessSource, {
        filename: this.resource
    }, (err, output) => {
        cssSource = output.css;
    });
    return `module.exports = ${JSON.stringify(cssSource)}`;
}
module.exports = loader;