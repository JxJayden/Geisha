import Compiler from '../compiler/index'
import initMixin from './init'

/**
 * 入口函数
 * @param {Object} options
 */
function Geisha(options) {
    this._init(options)
}

/**
 * 挂载 _init 方法
 * 参考 vue 1.0.10 版本
 */
initMixin(Geisha)

export default Geisha

