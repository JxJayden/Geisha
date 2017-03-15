class Emitter {
    constructor() {
        this.subscribers = new Map([
            ['default', []]
        ]);
        this.on = this.addEventListener;
        this.remove = this.removeEventListener;
    }

    emit(type, ...args) {
        console.log(`${type} is emit`);
        if (!this.subscribers.has(type)) {
            console.log(`${type} is not exist`);
        } else {
            for (let fn of this.subscribers.get(type)) {
                fn.apply(null, args);
            }
        }
        return this;
    }

    addEventListener(type = 'default', fn) {
        console.log(`${type} is create`);
        let sub = this.subscribers;

        if (!sub) {
            sub = new Map();
        }

        if (!sub.has(type)) {
            sub.set(type, [fn]);
        } else {
            sub.get(type).push(fn);
        }
        return this;
    }

    removeEventListener(type) {
        let sub = this.subscribers;

        if (!sub.has(type)) {
            console.log(`${type} is not exist`);
        } else {
            sub.delete(type);
            console.log('delete success');
        }
        return this;
    }

    once(type, fn) {
        let a = true;

        function tmp(...args) {
            if (a) {
                a = false;
                fn.apply(null, args);
            }
        }
        this.addEventListener(type, tmp);
    }

    emitAll(...args) {
        this.subscribers.forEach((fns, key) => {
            fns.forEach((fn) => {
                fn && fn.apply(null, args);
            });
        });
    }
}

module.exports = Emitter;
