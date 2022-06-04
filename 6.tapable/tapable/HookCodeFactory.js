class HookCodeFactory {
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(tapInfo => tapInfo.fn);
    }
    init(options) {
        this.options = options;
    }
    deInit(options) {
        this.options = null;
    }
    args(options = {}) {
        const { after, before } = options;
        const allArgs = [...this.options.args] || [];
        if (before) {
            allArgs.unshift(before);
        }
        if (after) {
            allArgs.push(after);
        }
        return allArgs.join(',');
    }
    header() {
        let code = '';
        code += `var _x = this._x;\n`;
        return code;
    }
    // content(){

    // }
    create(options) {
        this.init(options);
        let fn;
        switch (this.options.type) {
            case 'sync':
                fn = new Function(this.args(), this.header() + this.content());
                break;
            case 'async':
                fn = new Function(this.args({ after: '_callback' }), this.header() + this.content({
                    onDone: () => `_callback();\n`
                }));
                break;
            case 'promise':
                let tapsContent = this.content({
                    onDone: () => `_resolve();\n`
                });
                let content = `return new Promise(function(_resolve,_reject){
                    ${tapsContent}
                })`;
                fn = new Function(this.args(), this.header() + content);
                break;
            default:
                break;
        }
        this.deInit();
        return fn;
    }
    callTapsParallel({ onDone }) {
        const taps = this.options.taps;
        let code = `var _counter = ${taps.length};\n`;
        code += `
        var _done = (function(){
            ${onDone()};
        });\n
        `;
        for (let i = 0; i < taps.length; i++) {
            const content = this.callTap(i);
            code += content;
        }
        return code;
    }
    callTapsSeries() {
        let code = '';
        for (let i = 0; i < this.options.taps.length; i++) {
            const content = this.callTap(i);
            code += content;
        }
        return code;
    }
    callTap(tapIndex) {
        let code = '';
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
        let tapInfo = this.options.taps[tapIndex];
        switch (tapInfo.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
            case 'async':
                code += `_fn${tapIndex}(${this.args()},(function(){
                    if(--_counter === 0) _done();
                }));\n`;
                break;
            case 'promise':
                code += `
                var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
                _promise${tapIndex}.then((function(){
                    if(--_counter===0) _done();
                }));\n
                `;
                break;
            default:
                break;
        }
        return code;
    }
}
module.exports = HookCodeFactory;