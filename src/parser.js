import {isFun, warn} from './utils';
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
    return expression;
}

export default {
    dir: dir,
    exp: exp
};
