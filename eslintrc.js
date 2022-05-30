module.exports = {
    //解析器
    parser: 'babel-eslint',
    extends: 'airbnb',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: '2015'
    },
    env: {
        browser: true,
        node:true
    },
    rules: {
        indent: 'off',
        quotes: 'off',
        'no-console': 'off'
    }
}