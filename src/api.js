import compilerMixin from './compiler'
import stateMixin from './instance/state'
import initMixin from './instance/init'

export default function (Geisha) {
    initMixin(Geisha)
    stateMixin(Geisha)
    compilerMixin(Geisha)
}
