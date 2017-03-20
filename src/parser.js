import {isFun, warn, log} from './utils';
import directives from'./directives/index';

function dir(dirname, exp, context, node) {
    if (directives[dirname] && isFun(directives[dirname])) {
        return {
            name: dirname,
            exp: exp,
            '_update': directives[dirname],
            el: node
        };
    } else {
        warn(`${dirname} is not exist`);
    }
}

function exp(expression) {
    var exp = expression.match(/\{(.+?)\}/);
    return exp[1].trim();
}

export default {
    dir: dir,
    exp: exp
};
