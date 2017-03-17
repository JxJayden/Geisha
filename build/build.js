/**
 * 基于 vue v1.0 的 build.js 修改
 * base on vue v1.0
 */

const
    fs = require('fs')
rollup = require('rollup')
uglify = require('uglify-js')
babel = require('rollup-plugin-babel')
replace = require('rollup-plugin-replace')
zlib = require('zlib')
version = process.env.VERSION || require('../package.json').version
banner =
    '/*!\n' +
    ' * Geisha.js v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Jayden Jiang\n' +
    ' * Released under the MIT License.\n' +
    ' */\n';

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
        entry: 'src/index.js',
        plugins: [
            babel({
                "presets": ["es2015-rollup"]
            })
        ]
    })
    .then(function (bundle) {
        return write('dist/geisha.common.js', bundle.generate({
            format: 'cjs',
            banner: banner
        }).code)
    })
    // Standalone Dev Build
    .then(function () {
        return rollup.rollup({
                entry: 'src/index.js',
                plugins: [
                    replace({
                        'process.env.NODE_ENV': "'development'"
                    }),
                    babel({
                "presets": ["es2015-rollup"]
            })
                ]
            })
            .then(function (bundle) {
                return write('dist/geisha.js', bundle.generate({
                    format: 'umd',
                    banner: banner,
                    moduleName: 'Geisha'
                }).code)
            })
    })
    .then(function () {
        // Standalone Production Build
        return rollup.rollup({
                entry: 'src/index.js',
                plugins: [
                    replace({
                        'process.env.NODE_ENV': "'production'"
                    }),
                    babel({
                "presets": ["es2015-rollup"]
            })
                ]
            })
            .then(function (bundle) {
                var code = bundle.generate({
                    format: 'umd',
                    moduleName: 'Geisha'
                }).code
                var minified = banner + '\n' + uglify.minify(code, {
                    fromString: true
                }).code
                return write('dist/geisha.min.js', minified)
            })
            .then(zip)
    })
    .catch(logError)

function write(dest, code) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(dest, code, function (err) {
            if (err) return reject(err)
            console.log(blue(dest) + ' ' + getSize(code))
            resolve()
        })
    })
}

function zip() {
    return new Promise(function (resolve, reject) {
        fs.readFile('dist/geisha.min.js', function (err, buf) {
            if (err) return reject(err)
            zlib.gzip(buf, function (err, buf) {
                if (err) return reject(err)
                write('dist/geisha.min.js.gz', buf).then(resolve)
            })
        })
    })
}

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
    console.log(e)
}

function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
