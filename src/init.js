import { initState } from './state';
import {compileToFunctions} from "./compiler/parser";
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;//window.vm.$options = options 为了全局都能访问到options
        // 初始化状态
        initState(vm);
        // 如果用户传入了el属性 需要将页面渲染出来,把数据挂载到页面上
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };
    Vue.prototype.$mount = function (el) {
        console.log('mount')
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        if (!options.render) {
            let template = options.template;
            if (!template && el) {//没有模板就就用el中的内容
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);//将模板编译成render函数
            options.render = render;
        }
    }
}
