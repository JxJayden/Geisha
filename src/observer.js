import {isArray, log } from './utils'
import Emitter from './emitter'

function observer(obj, key) {
    log('observer Object: \n' + obj)
    if (isArray(obj, key)) {
        observerArray(obj)
    } else {
        if (key) {
            convert(obj, key)
        } else {
            walk(obj)
        }
    }
}

function walk(obj) {
    let value

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            value = obj[key]

            typeof value === 'object' ?
                walk(value) :
                convert(obj, key)
        }
    }
}

function convert(obj, key) {
    var oldVal = obj[key]

    if (isArray(oldVal)) {
        observerArray(oldVal)
    } else {
        Object.defineProperty(obj, key, {
            get: function () {
                Emitter.emit(`get ${key}`, oldVal)
                return oldVal
            },
            set: function (newVal) {
                if (oldVal !== newVal) {
                    if (!newVal) {
                        newVal = null
                    }

                    if (typeof newVal === 'object' && newVal !== null) {
                        newVal = walk(newVal)
                    }

                    Emitter.emit(`set ${key}`, newVal, oldVal)
                }
                oldVal = newVal

            }
        })
    }
}


function observerArray(arr) {
    // TODO reset Array mothod
}

export default {
    observe: observer
}
