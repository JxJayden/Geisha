const utils = require('./utils'),
    directives = require('./directives');

function dir(dirname, exp, context, node) {
    if (directives[dirname] && utils.isFun(directives[dirname])) {
        return {
            name: dirname,
            exp: exp,
            '_update': directives[dirname],
            el: node
        };
    } else {
        utils.warn(`${dirname} is not exist`);
    }
}

function exp(expression) {
    return expression;
}

module.exports = {
    dir: dir,
    exp: exp
};
