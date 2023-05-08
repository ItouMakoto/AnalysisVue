(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
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
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  var originArrayMethods = Object.create(Array.prototype);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (item) {
    originArrayMethods[item] = function () {
      var _originArrayMethods$i;
      console.log('数组方法被调用了');
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_originArrayMethods$i = originArrayMethods[item]).call.apply(_originArrayMethods$i, [this].concat(args));
      this.__ob__;
      switch (item) {
        case 'push':
        case 'unshift':
          a;
          break;
        case 'splice':
          args.slice(2);
      }
    };
  });

  //1.如果是对象，进行递归，如果是数组，进行数组的方法重写
  //2.如果是对象，需要对对象的每一个属性进行数据劫持
  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      //进行数据劫持
      // data.__ob__=this 会导致循环引用
      Object.defineProperty(data, '__ob__', {
        //写成不可枚举的属性，避免循环引用
        value: this,
        enumerable: false
      });
      if (Array.isArray(data)) {
        data.__prot__ = originArrayMethods;
        observerArray(data);
      }
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
  function observerArray(data) {
    data.forEach(function (item) {
      observer(item);
    });
  }
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
      //如果不是对象，就不用观测了观察数组也就是到这里递归结束
      return;
    }
    if (data.__ob__) return; //如果已经被观测过了，就不要再次观测了
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

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名称
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 用来获取的标签名的 match 结果，例如：<my:xx>
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配开始标签的
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配闭合标签的
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的键值对 id='app' id="app" id=app
  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的

  var root = null;
  var stack = [];
  function start(tagName, attrs) {
    var element = createASTElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    var currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
    stack.push(element);
  }
  function end(endTag) {
    var element = stack.pop();
    var currentParent = stack[stack.length - 1];
    if (element.tagName !== endTag) {
      throw new Error(endTag + '标签错误');
    }
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }
  function chars(text) {
    text = text.replace(/\s/g, '');
    var currentParent = stack[stack.length - 1];
    if (text) {
      currentParent.children.push({
        type: 3,
        text: text
      });
    }
  }
  function createASTElement(tagName, attrs) {
    return {
      tagName: tagName,
      type: 1,
      children: [],
      parent: null,
      attrs: attrs
    };
  }
  function parseHTML(html) {
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          //这个是标签名例如div start[0]是<div
          attrs: []
        };
        advance(start[0].length);
        var _end, attr;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          //截去匹配后，不是结尾标签并且是属性，继续匹配
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          }); //attr[1] attr[3]是属性的key-value键值对
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }
    while (html) {
      var textEnd = html.indexOf('<');
      if (textEnd == 0) {
        //当前文本开头是<符号，一种是开始标签，一种是结束标签
        var startTagMatch = parseStartTag(); //解析开始标签
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      var text = void 0;
      if (textEnd > 0) {
        text = html.substring(0, textEnd); //123</div>
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }
    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //["{{test}}","test"]
  function generator(root) {
    console.log('generator', root);
    var code = "_c('".concat(root.tag, "',").concat(root.attrs.length ? "{".concat(genProps(root.attrs), "}") : 'undefined', "\n    ").concat(root.children ? ",".concat(genChildren(root.children)) : '', ")");
    return code;
  }
  function genProps(attrs) {
    var str = '';
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === 'style') {
        //处理style属性
        var styleObj = {};
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          styleObj[key] = value;
        });
        attr.value = styleObj;
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value));
      if (i < attrs.length - 1) {
        str += ',';
      }
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    console.log('genProps', str);
    return str;
  }
  function genChildren(el) {
    var children = el.children;
    if (children) {
      return children.map(function (c) {
        return gen(c);
      }).join(',');
    } else {
      return false;
    }
  }
  function gen(el) {
    if (el.type === 1) {
      //如果是元素，则递归生成子元素element=1 text=3
      return generate(el);
    } else {
      var text = el.text;
      if (!defaultTagRE.test(text)) {
        //如果是普通文本
        return "_v(".concat(text, ")");
      } else {
        //hello {{name}} hello {{age}}=> hello +name+ hello + age
        var tokens = [];
        var match, index;
        var lastIndex = defaultTagRE.lastIndex = 0; //正则的exec和正则的/g冲突，需要手动设置lastIndex
        while (match = defaultTagRE.exec(text)) {
          //看有没有匹配到
          index = match.index; //匹配到的开始索引
          if (index > lastIndex) {
            //hello// 匹配到了
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")")); //JSON.stringify=_s()
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          //大括号匹配完了，但是字符串还有剩余
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }
  //_c('div',{},hello) eval可以将字符串转成函数但是性能不好

  function compileToFunctions(template) {
    var root = parseHTML(template);
    console.log('root', root);
    var code = generator(root);
    console.log('code', code);
    var render = new Function("with(this){return ".concat(code, "}")); //with(this)将this中的数据全部放到函数作用域中
    // let render = new Function(`with(this){return ${code}}`);
    // html=>ast语法树=>render函数=>虚拟dom(增加额外属性)=>真实dom
    console.log('render', render);
  }
  // {}

  function mountComponent(vm, el) {
    var updateComponent = function updateComponent() {
      //更新函数，数据变化后会再次调用此函数
      vm._render(); //生成虚拟dom
      vm._update(); //虚拟dom转换成真实dom
    };

    updateComponent();
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //window.vm.$options = options 为了全局都能访问到options
      // 初始化状态
      initState(vm);
      // 如果用户传入了el属性 需要将页面渲染出来,把数据挂载到页面上
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      console.log('mount');
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      if (!options.render) {
        var template = options.template;
        if (!template && el) {
          //没有模板就就用el中的内容
          template = el.outerHTML;
        }
        var render = compileToFunctions(template); //将模板编译成render函数
        options.render = render;
      }
      mountComponent(vm); //组件挂载
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue); //
  renderMixin(Vue); //渲染
  lifecycleMixin(Vue); //生命周期

  return Vue;

}));
//# sourceMappingURL=vue.js.map
