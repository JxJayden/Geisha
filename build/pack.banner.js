/**
 * banner description
 */

var date = Date();
var regFristNewline = /\n/;
var year = (new Date()).getFullYear();
var version = require('../package.json').version;

function getBanner (library) {
	return `
/*!
 * ${library} v${version} (c) ${year} JxJayden
 * Released under the MIT license
 * ${date}
 */`
}

var outputConfig = {
	comments: function (node, comment) {
		// multiline comment
		return comment.type === 'comment2' && /JxJayden/i.test(comment.value);
	}
}

var Banner = getBanner('Geisha.js').replace(regFristNewline, '');


export { Banner, outputConfig }
