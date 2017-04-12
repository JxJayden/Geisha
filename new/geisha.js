import Compiler from '../compiler/index'
import apiMixin from '../main'
/**
 * 入口函数
 * @param {Object} options
 */
function Geisha(options) {
    this._init(options)
}

/**
 * 挂载 api
 */
apiMixin(Geisha)

export default Geisha
