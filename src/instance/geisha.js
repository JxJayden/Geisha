import apiMixin from '../api'
/**
 * 入口函数
 * @param {Object} options
 */
function Geisha(options) {
    this.$init(options)
}

/**
 * 挂载 api
 */
apiMixin(Geisha)

export default Geisha

