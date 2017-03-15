const config = require('./config'),
    Emitter = require('./emitter'),
    hasClassList = 'classList' in document.documentElement;
let instances;
/**
 * element 的子节点转换成文档片段（element 将会被清空）
 * @param {Element} el
 * @returns fragment
 */
function nodeToFragment(el) {
    let child = el.firstChild,
        fragment = document.createDocumentFragment();

    while (child) {
        fragment.appendChild(child);
        child = el.firstChild;
    }

    return fragment;
}

/**
 * 判断是否为字符串
 * @param {any} value
 * @returns
 */
function isString(value) {
    return value && typeof (value) === 'string';
}

/**
 * 判断是否为数组
 * @param {any} value
 * @returns
 */
function isArray(value) {
    if (Array.isArray) {
        return Array.isArray(value);
    } else {
        return value && Object.prototype.toString.call(value) === '[object Array]';
    }
}

/**
 * 判断是否为字符串
 * @param {any} value
 * @returns
 */
function isObject(value) {
    return value && Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 判断是否为函数
 * @param {Function} fn
 * @returns
 */
function isFun(fn) {
    return fn && typeof (value) === 'function';
}

/**
 * 是否是合法指令
 * @param   {String}   directive
 * @return  {Boolean}
 */
function isDirective(directive) {
    return directive.indexOf(config.prefix) === 0;
}

/**
 * debug 模式则打印信息
 * @param {String} msg
 */
function log(msg) {
    if (config.debug && console) console.log(msg);
}

/**
 * debug 模式则打印警告
 * @param {String} msg
 */
function warn(msg) {
    if (config.debug && console) console.warn(msg);
}

function createEmitter() {
    if (instances) {
        return instances;
    } else {
        instances = new Emitter;
        return  instances;
    }
}

function defProtected(obj, key, val, enumerable, writable) {
    if (obj.hasOwnProperty(key)) return;
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: !!writable,
        configurable: true
    });
}

function extend(obj, ext, protective) {
    for (var key in ext) {
        if ((protective && obj[key]) || obj[key] === ext[key]) continue;
        obj[key] = ext[key];
    }
    return obj;
}

function removeClass(el, value) {
    if (hasClassList) {
        el.classList.remove(value);
    } else {
        var cur = ' ' + el.className + ' ',
            tar = ' ' + value + ' ';
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ');
        }
        el.className = cur.trim();
    }
}

function addClass(el, value) {
    if (hasClassList) {
        el.classList.add(value);
    } else {
        var cur = ' ' + el.className + ' ';
        if (cur.indexOf(' ' + value + ' ') < 0) {
            el.className = (cur + value).trim();
        }
    }
}
var utils = module.exports = {
    nodeToFragment: nodeToFragment,
    isString: isString,
    isArray: isArray,
    isObject: isObject,
    isFun: isFun,
    log: log,
    warn: warn,
    isDirective: isDirective,
    createEmitter: createEmitter,
    addClass: addClass,
    removeClass: removeClass,
    defProtected: defProtected,
    extend: extend
};
