import {
    log,
    logE,
    logS,
    warn,
    extend
} from '../utils'
import observer from '../observer'

export default function (Geisha) {
    Geisha.prototype.$initState = function () {
        logS('begin initState')

        extend(this.$data, this.$options.data)
        observer(this.$data)

        logE()
    }
}
