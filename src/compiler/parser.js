import {parseHTML} from "./index";
import {generator} from "./generator";

export function compileToFunctions(template) {
    let root=parseHTML(template);
    console.log('root',root)
    generator(root)
     // html=>ast语法树=>render函数=>虚拟dom(增加额外属性)=>真实dom

}
function render( ast){

}
// {}
