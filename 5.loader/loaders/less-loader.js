const less = require('less');
function loader(lessSource) {
    let cssSource;
    console.log('less-loader',lessSource)
    less.render(lessSource, {
        filename: this.resource
    }, (err, output) => {
        cssSource = output.css;
    });
    return `module.exports = ${JSON.stringify(cssSource)}`;
}
loader.pitch = function(){
    console.log('less-loader pitch');
    return '123';
}
module.exports = loader;