import utils from '../utils'
import config from '../config'

export default {
    'class': function (el, newVal, oldVal) {
        if (newVal) {
            utils[newVal ? 'addClass' : 'removeClass'](el, newVal, oldVal)
        } else {
            utils.removeClass(el)
        }
    },
    'id': function (el, newVal, oldVal) {
        el.id = newVal
    },
    'text': {
        bind: function () {
            this.attr = this.el.nodeType === 3 ?
                'nodeValue' :
                'textContent'
        },
        update: function (value) {
            this.el.nodeValue = value
        }
    }
}
