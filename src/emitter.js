import {
    log,
    warn
} from './utils'

class Emitter {
    constructor() {
        this.subscribers = new Map([
            ['default', []]
        ])
        this.on = this.addEventListener
        this.remove = this.removeEventListener
    }

    emit(t, ...args) {
        log(`${t} is emit`)
        if (!this.subscribers.has(t)) {
            log(`${t} is not exist`)
        } else {
            for (let fn of this.subscribers.get(t)) {
                fn.apply(null, args)
            }
        }
        return this
    }

    addEventListener(type = 'default', fn) {
        log(`${type} is create`)
        let sub = this.subscribers

        if (!sub) {
            sub = new Map()
        }

        if (!sub.has(type)) {
            sub.set(type, [fn])
        } else {
            sub.get(type).push(fn)
        }
        return this
    }

    removeEventListener(type) {
        let sub = this.subscribers

        if (!sub.has(type)) {
            log(`${type} is not exist`)
        } else {
            sub.delete(type)
            log('delete success')
        }
        return this
    }

    once(type, fn) {
        let a = true

        function tmp(...args) {
            if (a) {
                a = false
                fn.apply(null, args)
            }
        }
        this.addEventListener(type, tmp)
    }

    emitAll(...args) {
        console.log(this.subscribers)
        this.subscribers.forEach(function (fns, key) {
            console.log(fns)
            fns.forEach(function (fn) {
                fn && fn.apply(null, args)
            })
        })
    }
}

export default new Emitter
