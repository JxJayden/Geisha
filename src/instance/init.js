import { log } from '../utils'
export default function (Geisha) {
    Geisha.prototype.$init = function (options) {
        log('.   start init')
        this.$options = options || {} // 复制选项

        this.$el = document.querySelector(options.el)

        this._watchers = [] // 所有的 watchers

        this._directives = [] // 所有的指令

        this._events = {} // 所有的事件

        this._frag = null // 存放文档片段

        this.$data = {}

        this.$initState()

        // this._initEvents()

        if (this.$el) {
            this.$mount()
        }
    }
}



// function bind(target, obj) {
//     var keys = Object.keys(obj)

//     if (keys) {
//         keys.forEach(function ()) {}
//     }
// }
