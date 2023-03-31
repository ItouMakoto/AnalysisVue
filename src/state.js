import {observer} from "./observer/index";
import {isFunction} from "../utils/type";

export function initState(vm){
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if(opts.data){
        initData(vm,opts.data);
    }
    // if (opts.computed) {
    //     initComputed(vm, opts.computed);
    // }
    // if (opts.watch) {
    //     initWatch(vm, opts.watch);
    // }

}
function initData(vm,data){
    //vue2通过Object.defineProperty来实现数据劫持
    typeof isFunction(data) && (data=vm._data = data.call(vm));//将data的值赋值给vm._data，data和vm._data都执行被劫持的值
    observer(data)
    //vue3通过proxy来实现数据劫持
    console.log('initData',data)
    // const keys = Object.keys(data);
    // let i = keys.length;
    // while (i--) {
    //     proxy(vm, `_data`, keys[i]);
    // }
    // observe(data);
}

