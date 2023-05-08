import { initState } from './state';
import {compileToFunctions} from "./compiler/parser";
import{createTextVnode,createElement} from "./vdom/index";
import {mountComponent} from "./lifecycle";
import {patch} from "./vdom/patch";
import {nextTick} from "../utils/nextTick";

export function  initMixin(Vue) {
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
        vm.$el=el;
        if (!options.render) {
            let template = options.template;
            if (!template && el) {//没有模板就就用el中的内容
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);//将模板编译成render函数
            options.render = render;
        }
        mountComponent(vm, el);//组件挂载
    }
}
export  function renderMixin(Vue) {
    Vue.prototype._c = function () {//创建元素的虚拟节点
        return createElement(this,...arguments);
    }
    Vue.prototype._s = function (val) {//将数据转换成字符串
        return val == null ? '' : (typeof val === 'object') ? JSON.stringify(val) : val;
    }
    Vue.prototype._v = function (text) {//创建文本的虚拟节点
        return createTextVnode(this,text);
    }
    Vue.prototype._render = function () {
        const vm = this;
        const {render} = vm.$options;
        let vnode = render.call(vm);
        return vnode;
    }
}

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this;
        vm.$el = patch(vm.$el, vnode);
    }
    Vue.prototype._nextTick =nextTick()
}
