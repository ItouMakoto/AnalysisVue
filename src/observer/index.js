//使用类的方式来实现数据劫持，类有类型，检查是否被绑定可以同过检查时候为Observer的实例
import {isObject} from "../../utils/type";
import {originArrayMethods} from "./array";
//1.如果是对象，进行递归，如果是数组，进行数组的方法重写
//2.如果是对象，需要对对象的每一个属性进行数据劫持
class Observer{
    constructor(data){//进行数据劫持
       // data.__ob__=this 会导致循环引用
        Object.defineProperty(data,'__ob__',{//写成不可枚举的属性，避免循环引用
            value:this,
            enumerable:false
        })
        if(Array.isArray(data)){
            data.__prot__=originArrayMethods
            observerArray(data)
        }
       this.walk(data);
    }
    walk(data){
        Object.keys(data).forEach(key=>{
            defineReactive(data,key,data[key]);
        })
    }
}
function observerArray(data){
    data.forEach(item=>{
        observer(item)
    })
}
function defineReactive(data, key, value) {
    // value有可能是对象递归,这个也是vue2的缺点性能很差 ，如果是数组，数组的每一项也要进行数据劫持
    observer(value)
    Object.defineProperty(data, key, {
        get() {
            console.log('get', key);
            return value;
        },
        set(newValue) {
            console.log('set', key);
            if (newValue !== value) {
                observer(newValue);
                value = newValue;
            }
        }
    });
}

export  function observer (data){
    if(!isObject(data)){//如果不是对象，就不用观测了观察数组也就是到这里递归结束
        return;
    }
    if(data.__ob__)return //如果已经被观测过了，就不要再次观测了
    return new Observer(data);

}
