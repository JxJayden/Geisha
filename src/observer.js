import {
    isArray,
    log
} from './utils'
import Dep from './Dependence'

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
    var dep = new Dep()
    var oldVal = obj[key]

    if (isArray(oldVal)) {
        observerArray(oldVal)
    } else {
        Object.defineProperty(obj, key, {
            get: function () {
                Dep.target && dep.addSub(Dep.target)
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
                    oldVal = newVal
                    dep.notify()
                }

            }
        })
    }
}


function observerArray(arr) {
    // TODO reset Array mothod
}


export default function observer(obj, key) {
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
