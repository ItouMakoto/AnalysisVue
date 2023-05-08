import {parseHTML} from "./index";
import {generator} from "./generator";

export function compileToFunctions(template) {
    let root=parseHTML(template);
    console.log('root',root)
    let code=generator(root)
    console.log('code',code)
    let render=new Function( `with(this){return ${code}}` );//with(this)将this中的数据全部放到函数作用域中
   // let render = new Function(`with(this){return ${code}}`);
     // html=>ast语法树=>render函数=>虚拟dom(增加额外属性)=>真实dom
    console.log('render',render)
}
function render( ast){

}
// {}
