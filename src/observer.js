const utils = require('./utils'),
    Emitter = utils.createEmitter(),
    isArray = utils.isArray,
    log = utils.log;

function observer(obj, key) {
    log('observer Object: \n' + obj);
    if (isArray(obj, key)) {
        observerArray(obj);
    } else {
        if (key) {
            convert(obj, key);
        } else {
            walk(obj);
        }
    }
}

function walk(obj) {
    let value;

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            value = obj[key];

            typeof value === 'object' ?
                walk(value) :
                convert(obj, key);
        }
    }
}

function convert(obj, key) {
    var oldVal = obj[key];

    if (isArray(oldVal)) {
        observerArray(oldVal);
    } else {
        Object.defineProperty(obj, key, {
            get: function () {
                utils.log(`emit: get ${key}`);
                Emitter.emit(`get ${key}`, oldVal);
                return oldVal;
            },
            set: function (newVal) {

                if (oldVal !== newVal) {
                    if (typeof newVal === 'object') {
                        newVal = walk(newVal);
                    }
                    utils.log(`emit: set ${key}`);
                    Emitter.emit(`set ${key}`, newVal);
                }
                oldVal = newVal;

            }
        });
    }
}


function observerArray(arr) {
    // TODO reset Array mothod;
}

module.exports = {
    observe: observer
};
