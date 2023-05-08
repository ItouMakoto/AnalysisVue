//watcher和dep的关系
//将更新函数封装到watcher中，渲染页面不同的属性就会产生不同的dep，将当前组件的watcher放入到Dep中
//取值时，给每个属性都加了个dep属性，用于存储这个渲染watcher(同一个watcher?会对应多个dep)
//每个属性可能对应多个视图(多个视图肯定是多个watcher)一个属性要对应多个watcher
//dep.depend（）=>通知dep存放watcher=>Dep.target.addDep（）=>通知watcher存放dep
let id=0
import {pushTarget,popTarget} from "./dep";
export class Watcher {//一个组件对应一个watcher,组建中有多个属性（{{name}}），一个属性对应一个dep
  constructor(vm, expOrFn, cb,options) {
    //expOrFn是一个函数或者是一个表达式 在这里是upDateComponent

    this.vm = vm;
    this.cb = cb;
    this.id=id++;
    this.options = options;
    this.deps= [];
    this.depsId = new Set();
    this.expOrFn=expOrFn;
    this.getter = expOrFn;
     this.get();
  }

  get() {
   //一个属性可以对于多个watcher，一个watcher可以对应多个属性
    pushTarget(this);//Dep.target = watcher
    this.getter()//渲染的时候会调用get方法，会取值，会触发属性的get方法
    popTarget();//Dep.target = null   //防止vm.aa 这样在模板中取值的时候，也会触发get方法
  }
  addDep(dep){
    let id = dep.id;//<div>{{a}} {{b}} {{c}}</div>  会分别创建三个dep,放在watcher中
    if(!this.depsId.has(id)){//因为每次取值都会触发get方法，所以会重复的将watcher存放到dep中，所以需要去重
        this.deps.push(dep);
        this.depsId.add(id);
    }

  }
  run(){//不同watcher中的update方法是不一样的,run方法是watcher中的update方法，不用get是因为不同的watcher在get前可有其他操作
    this.get();
  }

  update() {
    const oldValue = this.value;
    this.value = this.get();
    queueWatcher(this);// name=1 name2 name=3 多次更新，只会执行最后一次
    this.cb.call(this.vm, this.value, oldValue);
  }
}
