import config from './config'
import Emitter from './emitter'

const hasClassList = 'classList' in document.documentElement

/**
 * element 的子节点转换成文档片段（element 将会被清空）
 * @param {Element} el
 * @returns fragment
 */
export function nodeToFragment(el) {
    let child = el.firstChild,
        fragment = document.createDocumentFragment()

    while (child) {
        fragment.appendChild(child)
        child = el.firstChild
    }

    return fragment
}

/**
 * 判断是否为字符串
 * @param {any} value
 * @returns
 */
export function isString(value) {
    return value && typeof (value) === 'string'
}

/**
 * 判断是否为数组
 * @param {any} value
 * @returns
 */
export function isArray(value) {
    return Array.isArray(value) || toString.call(value) === '[object Array]'
}

/**
 * 判断是否为字符串
 * @param {any} value
 * @returns
 */
export function isObject(value) {
    return value && Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 判断是否为函数
 * @param {Function} fn
 * @returns
 */
export function isFun(fn) {
    return fn && typeof (fn) === 'function'
}

/**
 * 是否是合法指令
 * @param   {String}   directive
 * @return  {Boolean}
 */
export function isDirective(directive) {
    return directive.indexOf(config.prefix) === 0
}

export function getDirective(directive) {
    return directive.slice(config.prefix.length)
}
/**
 * debug 模式则打印信息
 * @param {String} msg
 */
export function log(msg) {
    if (config.silent && console) console.log(msg)
}

/**
 * debug 模式则打印警告
 * @param {String} msg
 */
export function warn(msg) {
    if (config.silent && console) console.warn(msg)
}

export function def(obj, key, val, enumerable, writable) {
    if (obj.hasOwnProperty(key)) return
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: !!writable,
        configurable: true
    })
}

export function extend(obj, ext, protective) {
    for (var key in ext) {
        if ((protective && obj[key]) || obj[key] === ext[key]) continue
        obj[key] = ext[key]
    }
    return obj
}

export function removeClass(el, value) {
    if (hasClassList) {
        el.classList.remove(value)
    } else {
        var cur = ' ' + el.className + ' ',
            tar = ' ' + value + ' '
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ')
        }
        el.className = cur.trim()
    }
}

export function addClass(el, value, old) {
    if (hasClassList) {
        el.classList.remove(old)
        el.classList.add(value)
    } else {
        var cur = ' ' + el.className + ' '
        if (cur.indexOf(' ' + old + ' ') > 0) {
            removeClass(el, old)
            el.className = (cur + value).trim()
        } else if (cur.indexOf(' ' + value + ' ') < 0) {
            el.className = (cur + value).trim()

        }
    }
}

let utils = {
    nodeToFragment: nodeToFragment,
    isString: isString,
    isArray: isArray,
    isObject: isObject,
    isFun: isFun,
    log: log,
    warn: warn,
    isDirective: isDirective,
    addClass: addClass,
    removeClass: removeClass,
    def: def,
    extend: extend,
    getDirective: getDirective
}

export default utils
