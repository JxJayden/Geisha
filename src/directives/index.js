import utils from '../utils';
import config from '../config';

export default {
    'class': function (value) {
        if (this.arg) {
            utils[value ? 'addClass' : 'removeClass'](this.el, this.arg);
        } else {
            utils.removeClass(this.el);
        }
    },
    'text': {
        bind: function () {
            this.attr = this.el.nodeType === 3 ?
                'nodeValue' :
                'textContent';
        },
        update: function (value) {
            this.el.nodeValue = value;
        }
    }
};
