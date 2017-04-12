import Dep from './Dependence'
import {
    isObject,
    isEqual
} from './utils'

// copy from vueux https://github.com/qieguo2016/Vueuv/blob/master/src/Watcher.js & will be refactor
var $uid = 0

export default function Watcher(exp, scope, callback) {
    this.exp = exp
    this.scope = scope
    this.callback = callback || function () {}

    //初始化时，触发添加到监听队列
    this.value = null
    this.uid = $uid++

    ;this.update()
}

Watcher.prototype = {
    get: function () {
        Dep.target = this
        var value = this.getValue(this.exp, this.scope)
        Dep.target = null
        return value
    },
    update: function (options) {
        var newVal = this.get()
        // 这里有可能是对象/数组，所以不能直接比较，可以借助JSON来转换成字符串对比
        if (!isEqual(this.value, newVal)) {
            this.callback && this.callback(newVal, this.value, options)
            this.value = deepCopy(newVal)
        }
    },
    getValue(key, scope) {
        return scope.$data[key]
    }
}

function deepCopy(from) {
    var r
    if (isObject(from)) {
        r = JSON.parse(JSON.stringify(from))
    } else {
        r = from
    }
    return r
}
