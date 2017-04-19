import {
    log,
    warn,
    error,
    logE,
    logS,
    nodeToFragment,
    isEmpty,
    isFun,
    addClass,
    removeClass
} from './utils'
import textParser from './parser/text'
import Watcher from './watcher'
import config from './config'

var $$id = 0,
    slice = [].slice

export default function (Geisha) {
    Geisha.prototype.$mount = function () {
        logS('begin compiler')
        this._frag = nodeToFragment(this.$el)
        this._compiler(this._frag)
        this.$el.appendChild(this._frag)
        logE()
    }

    Geisha.prototype._compiler = function (node, scope) {
        var nodes = slice.call(node.childNodes)
        scope = scope || this
        node.$id = $$id++; // eslint-disable-line semi
        if (node.childNodes.length <= 0) {
            log('    └── no childNodes')
            return false
        }
        log('    └── compiler childNodes')

        for (var i = 0; i < nodes.length; i++) {
            var child = nodes[i]
            if (child.nodeType === 3) {
                this._compilerTextNode(child, scope)
            } else {
                if (child.hasChildNodes()) {
                    this._compiler(child)
                }
                this._compileElementNode(child, scope)
            }
        }
    }

    Geisha.prototype._compilerTextNode = function (node, scope) {
        var nodeText = node.textContent.trim()

        if (!nodeText) return

        var values = textParser(nodeText, this.$data),
            self = this,
            data = this.$data,
            el
        if (!values) return
        for (var i = 0; i < values.length; i++) {
            if (!values[i].key) {
                el = document.createTextNode(values[i])
            } else {
                if (!data[values[i].key]) {
                    warn(`${values[i].key} must be set in data`)
                } else {
                    el = document.createTextNode('')
                    handler.text(el, scope, values[i].key)
                }
            }
            node.parentNode.insertBefore(el, node)
        }
        node.parentNode.removeChild(node)
    }

    Geisha.prototype._compileElementNode = function (node, scope) {
        if (!node.hasAttributes()) return

        var attrs = slice.call(node.attributes),
            self = this,
            dirname, exp, directive,
            lazyCompileDir = '',
            lazyCompileExp = ''

        scope = scope || this

        attrs.forEach(function (attr) {
            var attrName = attr.name,
                exp = attr.value,
                dir = getDirective(attrName)

            if (dir.type) {
                if (dir.type === 'for' || dir.type === 'if') {
                    // later for v-for & v-if
                    lazyCompileDir = dir.type
                    lazyCompileExp = exp
                } else {
                    if (!handler[dir.type] || !isFun(handler[dir.type])) {
                        error('找不到' + dir.type + '指令')
                    } else {
                        handler[dir.type].call(self, node, scope, exp, dir.prop)
                    }
                }
                node.removeAttribute(attrName)
            }
        })
    }
}
var handler = {
    // text 指令 v-text="expression"
    text: function (node, scope, exp) {
        bindWatcher(node, scope, exp, 'text')
    },
    html: function (node, scope, exp) {
        bindWatcher(node, scope, exp, 'html')
    },
    // 属性指令 v-bind:id="id", v-bind:class="class"
    bind: function (node, scope, exp, attr) {
        switch (attr) {
        case 'class':
            bindClassDir(node, scope, exp)
            break
        case 'style':
            bindStyleDir(node, scope, exp)
            break
        default:
            bindWatcher(node, scope, exp, 'attr', attr)
            break
        }
    },
    on: function (node, scope, eventName, eventType) {
        if (!eventType) {
            error('v-bind 使用错误')
            return
        }
        let fn = scope._events[eventName]
        if (fn && isFun(fn)) {
            node.addEventListener(eventType, fn.bind(scope))
        } else {
            /**
             * @todo 解析绑定的表达式
             */
            error('未定义 ' + eventName + '方法')
        }
    }
}

var directives = {
    text: function (node, newVal, oldVal) {
        node.textContent = isEmpty(newVal) ? '' : newVal + ''
    },
    html: function (node, newVal, oldVal) {
        node.innerHTML = isEmpty(newVal) ? '' : newVal
    },
    attr: function (node, newVal, oldVal, attrName) {
        node.setAttribute(attrName, isEmpty(newVal) ? '' : newVal)
    },
    class: function (node, newVal, oldVal) {
        if (newVal) {
            addClass(node, newVal, oldVal)
        } else {
            removeClass(node, oldVal)
        }
    }
}

function bindWatcher(node, scope, exp, dir, prop) {
    var dirFn = directives[dir]

    return new Watcher(exp, scope, function (newVal, oldVal) {
        dirFn && dirFn(node, newVal, oldVal, prop)
    })
}

function getDirective(attrName) {
    var dir = {},
        parse
    if (attrName.indexOf(config.prefix) === 0) {
        parse = attrName.substring(2).split(':')
        dir.type = parse[0]
        dir.prop = parse[1]
    } else if (attrName.indexOf('@') === 0) {
        dir.type = 'on'
        dir.prop = attrName.substring(1)
    } else if (attrName.indexOf(':') === 0) {
        dir.type = 'bind'
        dir.prop = attrName.substring(1)
    }
    return dir
}

/**
 * <div v-bind:class="classObject"></div>
 * @todo <div class="static" v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
 * @todo <div v-bind:class="[isActive ? activeClass : '', errorClass]">
 */
function bindClassDir(node, scope, exp) {
    if (!exp) {
        return
    }

    var regObj = /\{(.+?)\}/g,
        regArr = /\[(.+?)\]/g

    if (exp.indexOf('{') === -1 || exp.indexOf('[') === -1) {
        if (!scope.$data[exp]) {
            error('未定义 ' + exp + ' 属性')
        } else {
            bindWatcher(node, scope, exp, 'class')
        }
    }
    return
}

function bindStyleDir() {

}
