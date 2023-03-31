export const originArrayMethods=Object.create(Array.prototype);
let methods=['push','shift','unshift','pop','reverse','sort','splice']
methods.forEach((item)=>{
    originArrayMethods[item]=function (...args) {
        console.log('数组方法被调用了')
         originArrayMethods[item].call(this,...args)
        const ob=this.__ob__;
        let inserted;
        switch (item) {
            case 'push':
            case 'unshift':a
                inserted=args;
                break;
            case 'splice':
                inserted=args.slice(2);//获取splice第三个参数，才是新增的元素
            default:break
            if(inserted){
                ob.observer(inserted)
            }
        }
    }
})
