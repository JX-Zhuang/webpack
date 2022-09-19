const path = require('path');
module.exports = function (env, arg) {
    const { PROCESS_ENV } = env;
    console.log(PROCESS_ENV);
    return {
        output: {
            path: path.resolve(__dirname, "./dist")
        },
        entry: "./app.js",
        mode: "development"
    }
}