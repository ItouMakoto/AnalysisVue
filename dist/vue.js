(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  function isFunction(val) {
    return typeof val === 'function';
  }
  function isObject(val) {
    return val !== null && _typeof(val) === 'object';
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      //进行数据劫持
      this.walk(data);
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);
    return Observer;
  }();
  function defineReactive(data, key, value) {
    // value有可能是对象递归,这个也是vue2的缺点性能很差 ，如果是数组，数组的每一项也要进行数据劫持
    observer(value);
    Object.defineProperty(data, key, {
      get: function get() {
        console.log('get', key);
        return value;
      },
      set: function set(newValue) {
        console.log('set', key);
        if (newValue !== value) {
          observer(newValue);
          value = newValue;
        }
      }
    });
  }
  function observer(data) {
    if (!isObject(data)) {
      return;
    }
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;
    if (opts.props) {
      initProps(vm);
    }
    if (opts.data) {
      initData(vm, opts.data);
    }
    // if (opts.computed) {
    //     initComputed(vm, opts.computed);
    // }
    // if (opts.watch) {
    //     initWatch(vm, opts.watch);
    // }
  }

  function initData(vm, data) {
    //vue2通过Object.defineProperty来实现数据劫持
    _typeof(isFunction(data)) && (data = vm._data = data.call(vm)); //将data的值赋值给vm._data，data和vm._data都执行被劫持的值
    observer(data);
    //vue3通过proxy来实现数据劫持
    console.log('initData', data);
    // const keys = Object.keys(data);
    // let i = keys.length;
    // while (i--) {
    //     proxy(vm, `_data`, keys[i]);
    // }
    // observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //window.vm.$options = options 为了全局都能访问到options
      // 初始化状态
      initState(vm);
      // 如果用户传入了el属性 需要将页面渲染出来
      // if (vm.$options.el) {
      //     vm.$mount(vm.$options.el);
      // }
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
