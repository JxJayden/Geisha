const utils = require('./utils'),
    parser = require('./parser'),
    config = require('./config'),
    observer = require('./observer'),
    directives = require('./directives'),
    Compiler = require('./compiler');



function Geisha (opitons) {
    new Compiler(this, opitons);
}

module.exports = Geisha;
