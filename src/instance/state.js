import {
    log,
    warn,
    extend
} from '../utils'
import observer from '../observer'

export default function (Geisha) {
    Geisha.prototype._initState = function () {
        log('begin _initState')
        log(this)

        extend(this.$data, this.$options.data)
        observeData(this.$data)
    }
}

function observeData(data) {
    observer.observe(data)
}
