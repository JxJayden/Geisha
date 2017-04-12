import {
    log
} from '../utils'

var BINDING_RE = /\{\{\{?(.+?)\}?\}\}/

export default function (text) {
    if (!BINDING_RE.test(text)) return

    let m = text.match(BINDING_RE),
        values = [],
        i, value

    while (m) {
        i = m.index
        if (i > 0) {
            values.push(text.slice(0, i))
        }
        value = {
            key: m[1].trim()
        }
        values.push(value)
        text = text.slice(i + m[0].length)
        m = text.match(BINDING_RE)
    }
    if (text.length) values.push(text)
    return values
}
