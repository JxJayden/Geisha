import Compiler from '../compiler/index'
import Emitter from '../emitter'

export default function (Geisha) {
    Geisha.prototype._init = function (options) {
        this.$options = options || {} // 复制选项

        this._watchers = [] // 所有的 watchers

        this._directives = [] // 所有的指令

        this._events = {} // 所有的事件

        this._frag = null // 存放文档片段

        this.$data = {}

        this._emitter = Emitter

        this._initState(Geisha)

        // this._initEvents()

        new Compiler(this, options)
    }
}



// function bind(target, obj) {
//     var keys = Object.keys(obj)

//     if (keys) {
//         keys.forEach(function ()) {}
//     }
// }
