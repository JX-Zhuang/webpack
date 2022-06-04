function test(options, fn) {
    var args = '';
    if (typeof options === 'object') {
        args = [];
        for (const key in options) {
            args.push(`${key}:'${options[key]}'`);
        }
        args = args.join(',');
        args = `{${args}}`;
    }
    var f = new Function('', `
        var args = ${args};\n
        var _fn = ${fn};\n
        console.log('before');\n
        (_fn(args));\n
        console.log('after');\n
    `);
    f();
}
test({ name: 'zjx', age: 12 }, function (options) {
    console.log(options);
})