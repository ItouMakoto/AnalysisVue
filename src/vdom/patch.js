
export function patch(oldNode,vnode){
    if(oldNode.nodeType===1){//如果是元素
        const parent=oldNode.parentNode;
        let el=createElm(vnode);
        parent.insertBefore(el,oldNode.nextSibling);
        parent.removeChild(oldNode);
        return el;
    }else {//如果是文本
        if (oldNode.text !== vnode.text) {

        }
    }
}
 function createElm(vnode){
    let {tag, children,text,key,data}=vnode;
    if(typeof tag==='string'){//如果是标签
        vnode.el=document.createElement(tag);
        updateProperties(vnode);
        children.forEach(child=>{//递归创建儿子节点，将儿子节点扔到父节点中
            vnode.el.appendChild(createElm(child));
        })
    }else {//如果是文本
        vnode.el=document.createTextNode(text);
    }
    return vnode.el;
 }
