module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true
    },
    "globals": {
        "gulp": true,
        "DEBUG": true
    },
    "extends": [
        "kaola/esnext"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module", // 将script改为module，方便webpack使用别名打包
        "ecmaFeatures": {
            "arrowFunctions": true, // 箭头函数
            "destructuring": true, // 解构赋值
            "classes": true, // 类 class 标识符
            "defaultParams": true, // 默认参数
            "blockBindings": true, // 块级作用域，允许使用let const
            "modules": true, // 允许使用模块，模块内默认严格模式
            "objectLiteralComputedProperties": true, // 允许字面量定义对象时，用表达式做属性名
            "experimentalObjectRestSpread": true, // ES7对象的扩展运算符
            "objectLiteralShorthandProperties": true, // 允许对象字面量方法名简写
            "restParams": true, // rest参数
            "spread": true, // ...扩展运算符
            "forOf": true,
            "generators": true,
            "templateStrings": true,
            "superInFunctions": true,
            "sourceType": "module",
            "allowImportExportEverywhere": true
        }
    },
    "plugins": [
        "html",
        "promise"
    ],
    "rules": {
        "prefer-template": "warn",
        "no-empty-function": 0,
        "no-use-before-define": ["error", {"functions": false, "classes": true}],
        "indent": 0,

        // promise: error ------------------------
        "promise/param-names": "error", // newPromise时，函数命名上只允许 resolve 和 reject
        "promise/catch-or-return": "warn", // 未return的promise需要加上catch，eg: promise中直接reject了
        "promise/no-callback-in-promise": "error", // promise里边不要写 callback 回调函数
        "promise/no-new-statics": "error", // 静态函数不可以new，如 Promise.all 不可写成 new Promise.all,类似的 race，resolve，reject也不行
        "promise/no-promise-in-callback": "error", // 回调中不允许出现promise
        "promise/no-return-in-finally": "error", // finally中不可以return
        // promise: warning ------------------------
        "promise/no-return-wrap": "warn", // 警告多余的包裹，eg: p.then(() => {return Promise.resolve(123)}); 而应该直接return结果
        "promise/no-native": "off", // 使用Promise之前强制使用垫片补丁，如bluebird
        "promise/no-nesting": "warn", // 嵌套时报警
        "promise/valid-params": "warn" // then，resolve，reject，catch，finally等函数的入参检查
    }
};
