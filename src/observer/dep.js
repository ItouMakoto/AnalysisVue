let id=0
class Dep{//每个属性都有一个dep实例，dep实例中存放着watcher实例,watcher实例中存放着dep实例
    constructor(){
        this.subs = []
        this.id=id++
    }

    depend(){//watcher要存放dep，dep也要存放watcher
        if(Dep.target){
            Dep.target.addDep(this)//Dep.target是watcher,watcher中有一个addDep方法存放dep
        }

    }
    addDep(dep){
        this.subs.push(dep)
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
       notify(){
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
Dep.target=null
export function pushTarget(watcher){
    Dep.target=watcher
}
export function popTarget(){
    Dep.target=null
}
export default Dep
