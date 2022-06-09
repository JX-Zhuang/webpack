# webpack
## 基本流程
1. 初始化参数，配置和shell比较参数，shell参数优先级高
2. 用配置的参数，初始化Compiler对象，该对象是单例的
3. 加载所有的plugin
4. 执行compiler对象的run方法，开始编译
5. 新建`Compilation`对象，根据`entry`找到入口文件
6. 从入口文件出发，调用所有`loader`规则，对模块进行编译
7. 再找出此模块的依赖模块，再递归本步骤依赖的模块进行编译
8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk
9. 把每个chunk转化成一个单独的文件加入到输出列表
10. 确定好输出内容后，会根据配置的输出的路径和文件名，把文件内容写到文件系统里
## loader
* 导出一个`JavaScript`函数。它接收上一个loader产生的结果或资源文件作为入参
* loader的叠加顺序：post(后置)+inline(内联)+normal(正常)+pre(前置)
* loader：从左往右执行loader.pitch，读到文件，再从右往左执行loader
* 如果loader.pitch有返回值，相当于该loader和它右边所有的loader执行结束
## tapable
## plugin
* 在webpack不同的生命周期，里做一些操作
```javascript
class DonePlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {

    }
}
module.exports = DonePlugin;
```
## 优化