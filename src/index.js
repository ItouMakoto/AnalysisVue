import {initMixin} from './init.js'

function Vue(options){
    this._init(options);
}

initMixin(Vue)//
renderMixin(Vue)//渲染
lifecycleMixin(Vue)//生命周期
export default Vue
