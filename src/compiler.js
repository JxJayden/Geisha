import {utils, log, def, extend, warn, createEmitter} from './utils';
import parser from './parser';
import observer from './observer';
import directives from './directives';

const
    slice = [].slice,
    BINDING_RE = /\{\{\{?(.+?)\}?\}\}/,

    Emitter = createEmitter();

function Compiler(vm, options) {
    let data = this.$data = vm.$data = {};

    this.$el = vm.$el = document.querySelector(options.el);
    this.$frag = this.nodeToFrag(this.$el);
    this.$vm = vm;
    this.bindings = Object.create(null);
    this.dirs = [];

    this.comile(this.$frag, true);

    extend(data, options.data);

    this.observeData(data);

    this.appendFrag(this.$frag, this.$el);
}

let coPro = Compiler.prototype;

coPro.nodeToFrag = function (el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while (child) {
        fragment.appendChild(child);
        child = el.firstChild;
    }
    return fragment;
};

coPro.observeData = function (data) {
    observer.observe(data);
};

coPro.comile = function (node, root) {
    log('comile element: ' + node.nodeName);

    if (node.nodeType === 1) {
        this.comileNode(node);
    } else if (node.nodeType === 3) {
        this.comileTextNode(node);
    }
    if (node.hasChildNodes()) {
        for (var i = 0; i < node.childNodes.length; i++) {
            this.comile(node.childNodes[i]);
        }
    }
};

coPro.comileNode = function (node, scope) {
    if (!node.hasAttributes()) return;

    let attrs = slice.call(node.attributes),
        sco = scope || this.$vm,
        compiler = this,
        attrname, dirname, exp, directive;

    attrs.forEach((attr) => {
        if (utils.isDirective(attrname)) {
            dirname = utils.getDirective(attrname);
            exp = attr.value;
            directive = parser.dir(dirname, exp, sco, node);

            if (!directive) return;
            if (directive['_update'] && utils.isFun(directive['_update'])) {
                compiler.dirs.push(directive);
            }
        }
    });

};

coPro.comileTextNode = function (node) {
    log('comileTextNode: ' + node.nodeName);

    let compiler = this,
        values = textParser(node.nodeValue),
        el;
    if (!values) return;

    for (let i = 0; i < values.length; i++) {
        if (!values[i].key) {
            el = document.createTextNode(values[i]);
        } else {
            el = document.createTextNode('');
            createTextDirective(values[i].key, el, compiler);
        }
        node.parentNode.insertBefore(el, node);
    }
    node.parentNode.removeChild(node);
};

coPro.appendFrag = function (frag, el) {
    el.appendChild(frag);
};

function textParser(text) {
    if (!BINDING_RE.test(text)) return;

    let m = text.match(BINDING_RE),
        values = [],
        i, value;

    while (m) {
        i = m.index;
        if (i > 0) {
            values.push(text.slice(0, i));
        }
        value = {
            key: m[1].trim()
        };
        values.push(value);
        text = text.slice(i + m[0].length);
        m = text.match(BINDING_RE);
    }
    if (text.length) values.push(text);
    return values;
}

function createTextDirective(key, el, comiler) {
    log('createTextDirective: ' + key);
    observer.observe(comiler.$data, key);
    Emitter.on(`set ${key}`, function (value) {
        el.textContent = value;
    });
}

export default Compiler;
