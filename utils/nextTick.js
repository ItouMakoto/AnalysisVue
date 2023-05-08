
let pending = false;
export function nextTick(){//第一次进来的时候在宏任务中放入flushCallbacks,随后nextTick就不会再产生宏任务，当flushCallbacks执行完时，callbacks中的回调已经收集完了
     callbacks.push(cb);
        if(!pending){
            timer(flushCallbacks)
        }

}
function flushCallbacks(){
    callbacks.forEach(cb=>cb());
    pending = false;

}
function timer(flushCallbacks) {
    let timerFn = () => {}
    if (Promise) {
        timerFn = () => {
            Promise.resolve().then(flushCallbacks)
        }
    } else if (MutationObserver) {
        let textNode = document.createTextNode(1);
        let observe = new MutationObserver(flushCallbacks);//创建一个监视器
        observe.observe(textNode, {//textNode改变时触发回调
            characterData: true
        })
        timerFn = () => {
            textNode.textContent = 3;//手动触发回调
        }
        // 微任务
    } else if (setImmediate) {
        timerFn = () => {
            setImmediate(flushCallbacks)
        }
    } else {
        timerFn = () => {
            setTimeout(flushCallbacks)
        }
    }
    timerFn();
}
