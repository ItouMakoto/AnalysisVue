import { nextTick } from 'utils/nextTick';
let queue = [];
let has = {};//检查  列表中是否有重复的watcher
let waiting = false;

export function queueWatcher(watcher) { // 当前执行栈中代码执行完毕后，会先清空微任务，在清空宏任务， 我希望尽早更新页面
    const id = watcher.id; // name 和 age的id 是同一个
    if (has[id] == null) {
        queue.push(watcher);
        has[id] = true;
        // 开启一次更新操作  批处理 （防抖）
        if(!waiting){
            nextTick(flushSchedulerQueue, 0);//同步代码执行完毕后（多次queue.push(watcher)）后执行，此时watcher都是最新的状态
            waiting = true;
        }
    }
}
function flushSchedulerQueue(){
    for(let i=0;i<queue.length;i++){
        queue[i].run();
    }
    queue=[];
    has={};
    waiting=false;
}
