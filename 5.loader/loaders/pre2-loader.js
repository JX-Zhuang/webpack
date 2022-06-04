function loader(source) {
    console.log('pre2',this);
    return source;
}
loader.pitch = function(){
    console.log('pre2-pitch'); 
}
loader.raw = true;
module.exports = loader;