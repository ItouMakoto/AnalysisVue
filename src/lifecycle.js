import {Watcher} from "./observer/watcher";

// export function mountComponent(vm,el){
//     let updateComponent=()=>{//更新函数，数据变化后会再次调用此函数
//          vm._render();//生成虚拟dom
//         vm._update();//虚拟dom转换成真实dom
//     }
//     updateComponent()
//
// }
//
export function mountComponent(vm, el) {
    let updateComponent = () => {
        vm._update(vm._render());//渲染页面
    }
    new Watcher(vm, updateComponent, () => {
        console.log('更新视图了')
    }, true);//渲染watcher,还有其他的watcher
}
