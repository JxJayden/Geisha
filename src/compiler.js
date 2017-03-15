const
    utils = require('./utils'),
    parser = require('./parser'),
    config = require('./config'),
    observer = require('./observer'),
    directives = require('./directives'),

    slice = [].slice,
    BINDING_RE = /\{\{\{?(.+?)\}?\}\}/,

    Emitter = utils.createEmitter(),

    log = utils.log,
    def = utils.defProtected,
    expend = utils.extend;

function Compiler(vm, options) {
    let data = this.$data = vm.$data = {};

    this.$el = vm.$el = document.querySelector(options.el);
    // this.$frag = this.nodeToFrag(this.$el);
    this.bindings = {};

    this.comile(this.$el, true);

    expend(data, options.data);

    this.observeData(data);

    // this.appendFrag(this.$frag, this.$el);
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

coPro.comileNode = function (node) {

};

coPro.comileTextNode = function (node) {
    log('comileTextNode: ' + node.nodeName);

    let compiler = this,
        values = textParser(node.nodeValue),
        el;
    if (!values) return;
    log('textParser Value: \n', values);
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

module.exports = Compiler;
