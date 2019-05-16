export default { // 依赖注入的抽象接口
    dependencies: {}, // 存储被依赖的模块
    register: function(key, value) { // 注册初始化被依赖的模块
        this.dependencies[key] = value 
    },
    resolve: function(func,deps) { //注入到依赖的模块中，注入应该接受一个函数，并返回一个我们需要的函数
        var fun = new func();
        var paramNames = fun.injector // 取得参数名
        var dependencies = Object.assign(this.dependencies,deps)

        for (const key in paramNames) {// 通过参数名在dependencies中取出相应的依赖
            if (paramNames[key] in dependencies) {
                fun[paramNames[key]] = dependencies[paramNames[key]]
            } else {    
                throw new Error('缺失的依赖：' + paramNames[key])   
            }  
        }// 注入依赖,执行,并返回一个我们需要的函数
        return fun;
    }
}