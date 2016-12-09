/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(5);
	__webpack_require__(6);
	module.exports = __webpack_require__(7);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * built in 2016-10-10:21 version 2.1.16 by 司徒正美
	 * https://github.com/RubyLouvre/avalon/tree/2.1.7
	 *     fix parseExpr BUG #1768 与 #1765
	 *     优化ms-effect指令,与ms-css指令共同相同的diff
	 *     data-duplex-changed回调支持更多参数
	 *     处理$watch监听复杂数BUG #1762
	 *     处理date过滤器不解析 BUG
	 *     重构ms-important后面的指令不执行的BUG
	 *     改成es6 modules组织依赖,rollup.js打包
	 */
	;;;
	
	(function (global, factory) {
		   if (true)
			module.exports = factory()
		else if (typeof define === 'function' && define.amd)
			define([], factory)
		else if (typeof exports === 'object')
			exports.avalon = factory()
		else
			global.avalon = factory()
	} (this, function () {
	
		   //avalon的核心,这里都是一些不存在异议的*核心*方法与属性
		   function avalon(el) {
			return new avalon.init(el)
		   }
	
		   avalon.init = function (el) {
			this[0] = this.element = el
		   }
	
		   avalon.fn = avalon.prototype = avalon.init.prototype
	
		   avalon.shadowCopy = function (destination, source) {
			for (var property in source) {
				destination[property] = source[property]
			}
			return destination
		   }
		   var cssHooks = {}
		   var rhyphen = /([a-z\d])([A-Z]+)/g
		   var rcamelize = /[-_][^-_]/g
		   var rhashcode = /\d\.\d{4}/
		   var rescape = /[-.*+?^${}()|[\]\/\\]/g
	
		   var _slice = [].slice
		   function defaultParse(cur, pre, binding) {
			cur[binding.name] = avalon.parseExpr(binding)
		   }
		   var rword = /[^, ]+/g
	
		   var hasConsole = typeof console === 'object'
	
		   avalon.shadowCopy(avalon, {
			noop: function () {
			},
			version: "2.1.16",
			//切割字符串为一个个小块，以空格或逗号分开它们，结合replace实现字符串的forEach
			rword: rword,
			inspect: ({}).toString,
			ohasOwn: ({}).hasOwnProperty,
			caches: {}, //avalon2.0 新增
			vmodels: {},
			filters: {},
			components: {}, //放置组件的类
			directives: {},
			eventHooks: {},
			eventListeners: {},
			validators: {},
			scopes: {},
			effects: {},
			cssHooks: cssHooks,
			parsers: {
				number: function (a) {
					return a === '' ? '' : parseFloat(a) || 0
				},
				string: function (a) {
					return a === null || a === void 0 ? '' : a + ''
				},
				boolean: function (a) {
					if (a === '')
						return a
					return a === 'true' || a === '1'
				}
			},
			log: function () {
				if (hasConsole && avalon.config.debug) {
					// http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
					Function.apply.call(console.log, console, arguments)
				}
			},
			warn: function () {
				/* istanbul ignore if*/
				if (hasConsole && avalon.config.debug) {
					var method = console.warn || console.log
					// http://qiang106.iteye.com/blog/1721425
					Function.apply.call(method, console, arguments)
				}
			},
			error: function (str, e) {
				throw (e || Error)(str)
			},
			//将一个以空格或逗号隔开的字符串或数组,转换成一个键值都为1的对象
			oneObject: function (array, val) {
				/* istanbul ignore if*/
				if (typeof array === 'string') {
					array = array.match(rword) || []
				}
				var result = {},
					value = val !== void 0 ? val : 1
				for (var i = 0, n = array.length; i < n; i++) {
					result[array[i]] = value
				}
				return result
			},
			isObject: function (a) {
				return a !== null && typeof a === 'object'
			},
			/* avalon.range(10)
			 => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
			 avalon.range(1, 11)
			 => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			 avalon.range(0, 30, 5)
			 => [0, 5, 10, 15, 20, 25]
			 avalon.range(0, -10, -1)
			 => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
			 avalon.range(0)
			 => []*/
			range: function (start, end, step) { // 用于生成整数数组
				step || (step = 1)
				if (end == null) {
					end = start || 0
					start = 0
				}
				var index = - 1,
					length = Math.max(0, Math.ceil((end - start) / step)),
					result = new Array(length)
				while (++index < length) {
					result[index] = start
					start += step
				}
				return result
			},
			hyphen: function (target) {
				//转换为连字符线风格
				return target.replace(rhyphen, '$1-$2').toLowerCase()
			},
			camelize: function (target) {
				//提前判断，提高getStyle等的效率
				if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
					return target
				}
				//转换为驼峰风格
				return target.replace(rcamelize, function (match) {
					return match.charAt(1).toUpperCase()
				})
			},
			slice: function (nodes, start, end) {
				return _slice.call(nodes, start, end)
			},
			css: function (node, name, value, fn) {
				//读写删除元素节点的样式
				if (node instanceof avalon) {
					node = node[0]
				}
				if (node.nodeType !== 1) {
					return
				}
				var prop = avalon.camelize(name)
				name = avalon.cssName(prop) || /* istanbul ignore next*/ prop
				if (value === void 0 || typeof value === 'boolean') { //获取样式
					fn = cssHooks[prop + ':get'] || cssHooks['@:get']
					if (name === 'background') {
						name = 'backgroundColor'
					}
					var val = fn(node, name)
					return value === true ? parseFloat(val) || 0 : val
				} else if (value === '') { //请除样式
					node.style[name] = ''
				} else { //设置样式
					if (value == null || value !== value) {
						return
					}
					if (isFinite(value) && !avalon.cssNumber[prop]) {
						value += 'px'
					}
					fn = cssHooks[prop + ':set'] || cssHooks['@:set']
					fn(node, name, value)
				}
			},
			directive: function (name, definition) {
				definition.parse = definition.parse || /* istanbul ignore next*/ defaultParse
				return this.directives[name] = definition
			},
			//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
			makeHashCode: function (prefix) {
				/* istanbul ignore next*/
				prefix = prefix || 'avalon'
				/* istanbul ignore next*/
				return String(Math.random() + Math.random()).replace(rhashcode, prefix)
			},
			escapeRegExp: function (target) {
				//http://stevenlevithan.com/regex/xregexp/
				//将字符串安全格式化为正则表达式的源码
				return (target + '').replace(rescape, '\\$&')
			},
			Array: {
				merge: function (target, other) {
					//合并两个数组 avalon2新增
					target.push.apply(target, other)
				},
				ensure: function (target, item) {
					//只有当前数组不存在此元素时只添加它
					if (target.indexOf(item) === - 1) {
						return target.push(item)
					}
				},
				removeAt: function (target, index) {
					//移除数组中指定位置的元素，返回布尔表示成功与否
					return !!target.splice(index, 1).length
				},
				remove: function (target, item) {
					//移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否
					var index = target.indexOf(item)
					if (~index)
						return avalon.Array.removeAt(target, index)
					return false
				}
			}
		   })
	
		/**
		 * 此模块不依赖任何模块,用于修复语言的底层缺陷
		 */
	
		   var ohasOwn = Object.prototype.hasOwnProperty
		   function isNative(fn) {
		       return /\[native code\]/.test(fn)
		   }
		   /* istanbul ignore if*/
		   if (!isNative('司徒正美'.trim)) {
		       var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
		       String.prototype.trim = function () {
		           return this.replace(rtrim, '')
		       }
		   }
		   var hasDontEnumBug = !({
		       'toString': null
		   }).propertyIsEnumerable('toString');
		   var hasProtoEnumBug = (function () {
		}).propertyIsEnumerable('prototype')
		   var dontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		]
		   var dontEnumsLength = dontEnums.length
		   /* istanbul ignore if*/
		   if (!isNative(Object.keys)) {
		       Object.keys = function (object) { //ecma262v5 15.2.3.14
		           var theKeys = []
		           var skipProto = hasProtoEnumBug && typeof object === 'function'
		           if (typeof object === 'string' || (object && object.callee)) {
		               for (var i = 0; i < object.length; ++i) {
		                   theKeys.push(String(i))
		               }
		           } else {
		               for (var name in object) {
		                   if (!(skipProto && name === 'prototype') &&
							ohasOwn.call(object, name)) {
		                       theKeys.push(String(name))
		                   }
		               }
		           }
	
		           if (hasDontEnumBug) {
		               var ctor = object.constructor,
						skipConstructor = ctor && ctor.prototype === object
		               for (var j = 0; j < dontEnumsLength; j++) {
		                   var dontEnum = dontEnums[j]
		                   if (!(skipConstructor && dontEnum === 'constructor') && ohasOwn.call(object, dontEnum)) {
		                       theKeys.push(dontEnum)
		                   }
		               }
		           }
		           return theKeys
		       }
		   }
		   /* istanbul ignore if*/
		   if (!isNative(Array.isArray)) {
		       Array.isArray = function (a) {
		           return Object.prototype.toString.call(a) === '[object Array]'
		       }
		   }
		   /* istanbul ignore if*/
		   if (!isNative(isNative.bind)) {
		       Function.prototype.bind = function (scope) {
		           if (arguments.length < 2 && scope === void 0)
		               return this
		           var fn = this,
					argv = arguments
		           return function () {
		               var args = [],
						i
		               for (i = 1; i < argv.length; i++)
		                   args.push(argv[i])
		               for (i = 0; i < arguments.length; i++)
		                   args.push(arguments[i])
		               return fn.apply(scope, args)
		           }
		       }
		   }
		   //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
		/**
		* Shim for "fixing" IE's lack of support (IE < 9) for applying slice
		* on host objects like NamedNodeMap, NodeList, and HTMLCollection
		* (technically, since host objects have been implementation-dependent,
		* at least before ES6, IE hasn't needed to work this way).
		* Also works on strings, fixes IE < 9 to allow an explicit undefined
		* for the 2nd argument (as in Firefox), and prevents errors when
		* called on other DOM objects.
		*/
		   var ap = Array.prototype
	
		   var _slice$1 = ap.slice
		   try {
		       // Can't be used with DOM elements in IE < 9
		       _slice$1.call(document.documentElement)
		   } catch (e) { // Fails in IE < 9
		       // This will work for genuine arrays, array-like objects,
		       // NamedNodeMap (attributes, entities, notations),
		       // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
		       // and will not fail on other DOM objects (as do DOM elements in IE < 9)
		       ap.slice = function (begin, end) {
		           // IE < 9 gets unhappy with an undefined end argument
		           end = (typeof end !== 'undefined') ? end : this.length
	
		           // For native Array objects, we use the native slice function
		           if (Array.isArray(this)) {
		               return _slice$1.call(this, begin, end)
		           }
	
		           // For array like object we handle it ourselves.
		           var i, cloned = [],
					size, len = this.length
	
		           // Handle negative value for "begin"
		           var start = begin || 0
		           start = (start >= 0) ? start : len + start
	
		           // Handle negative value for "end"
		           var upTo = (end) ? end : len
		           if (end < 0) {
		               upTo = len + end
		           }
	
		           // Actual expected size of the slice
		           size = upTo - start
	
		           if (size > 0) {
		               cloned = new Array(size)
		               if (this.charAt) {
		                   for (i = 0; i < size; i++) {
		                       cloned[i] = this.charAt(start + i)
		                   }
		               } else {
		                   for (i = 0; i < size; i++) {
		                       cloned[i] = this[start + i]
		                   }
		               }
		           }
	
		           return cloned
		       }
		   }
	
		   function iterator(vars, body, ret) {
		       var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' +
				body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') +
				'}' + ret
		       /* jshint ignore:start */
		       return Function('fn,scope', fun)
		       /* jshint ignore:end */
		   }
		   /* istanbul ignore if*/
		   if (!isNative(ap.map)) {
		       var shim = {
		           //定位操作，返回数组中第一个等于给定参数的元素的索引值。
		           indexOf: function (item, index) {
		               var n = this.length,
						i = ~~index
		               if (i < 0)
		                   i += n
		               for (; i < n; i++)
		                   if (this[i] === item)
		                       return i
		               return -1
		           },
		           //定位操作，同上，不过是从后遍历。
		           lastIndexOf: function (item, index) {
		               var n = this.length,
						i = index == null ? n - 1 : index
		               if (i < 0)
		                   i = Math.max(0, n + i)
		               for (; i >= 0; i--)
		                   if (this[i] === item)
		                       return i
		               return -1
		           },
		           //迭代操作，将数组的元素挨个儿传入一个函数中执行。Prototype.js的对应名字为each。
		           forEach: iterator('', '_', ''),
		           //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
		           filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
		           //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Prototype.js的对应名字为collect。
		           map: iterator('r=[],', 'r[i]=_', 'return r'),
		           //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Prototype.js的对应名字为any。
		           some: iterator('', 'if(_)return true', 'return false'),
		           //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Prototype.js的对应名字为all。
		           every: iterator('', 'if(!_)return false', 'return true')
		       }
	
		       for (var i in shim) {
		           ap[i] = shim[i]
		       }
		   }
	
		   var window = Function(' return this')() || this
		   var browser = {
		       window: window,
		       document: {//方便在nodejs环境不会报错
		           createElement: Object,
		           createElementNS: Object,
		           contains: Boolean
		       },
		       root: {
		           outerHTML: 'x'
		       },
		       msie: NaN,
		       browser: false,
		       modern: true,
		       avalonDiv: {},
		       avalonFragment: null
		   }
		   window.avalon = avalon
		   /* istanbul ignore if  */
		   if (window.location && window.navigator && window.window) {
		       var doc = window.document
		       browser.inBrowser = true
		       browser.document = doc
		       browser.root = doc.documentElement
		       browser.avalonDiv = doc.createElement('div')
		       browser.avalonFragment = doc.createDocumentFragment()
		       if (window.VBArray) {
		           browser.msie = doc.documentMode || (window.XMLHttpRequest ? 7 : 6)
		           browser.modern = browser.msie > 8
		       } else {
		           browser.modern = true
		       }
		   }
	
		   avalon.shadowCopy(avalon, browser)
	
		   avalon.quote = typeof JSON !== 'undefined' ? JSON.stringify : new function () {
			//https://github.com/bestiejs/json3/blob/master/lib/json3.js
		       var Escapes = {
		           92: "\\\\",
		           34: '\\"',
		           8: "\\b",
		           12: "\\f",
		           10: "\\n",
		           13: "\\r",
		           9: "\\t"
		       }
	
		       var leadingZeroes = '000000'
		       var toPaddedString = function (width, value) {
		           return (leadingZeroes + (value || 0)).slice(-width)
		       };
		       var unicodePrefix = '\\u00'
		       var escapeChar = function (character) {
		           var charCode = character.charCodeAt(0), escaped = Escapes[charCode]
		           if (escaped) {
		               return escaped
		           }
		           return unicodePrefix + toPaddedString(2, charCode.toString(16))
		       };
		       var reEscape = /[\x00-\x1f\x22\x5c]/g
		       return function (value) {
		           reEscape.lastIndex = 0
		           return '"' + (reEscape.test(value) ? String(value).replace(reEscape, escapeChar) : value) + '"'
		       }
		   }
	
	
	
		   var tos = avalon.inspect
		   var class2type = {}
		   'Boolean Number String Function Array Date RegExp Object Error'.replace(avalon.rword, function (name) {
		       class2type['[object ' + name + ']'] = name.toLowerCase()
		   })
	
		   avalon.type = function (obj) { //取得目标的类型
		       if (obj == null) {
		           return String(obj)
		       }
		       // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
		       return typeof obj === 'object' || typeof obj === 'function' ?
				class2type[tos.call(obj)] || 'object' :
				typeof obj
		   }
	
	
	
	
	
		   var rfunction = /^\s*\bfunction\b/
	
		   avalon.isFunction = typeof alert === 'object' ? function (fn) {
		       try {
		           return rfunction.test(fn + '')
		       } catch (e) {
		           return false
		       }
		   } : function (fn) {
		       return tos.call(fn) === '[object Function]'
		   }
	
	
	
	
		   function isWindowCompact(obj) {
		       if (!obj)
		           return false
		       // 利用IE678 window == document为true,document == window竟然为false的神奇特性
		       // 标准浏览器及IE9，IE10等使用 正则检测
		       return obj == obj.document && obj.document != obj //jshint ignore:line
		   }
	
		   var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/
		   function isWindowModern(obj) {
		       return rwindow.test(tos.call(obj))
		   }
	
		   avalon.isWindow = isWindowModern(avalon.window) ?
			isWindowModern : isWindowCompact
	
	
		   var enu;
		   var enumerateBUG;
		   for (enu in avalon({})) {
		       break
		   }
	
		   var ohasOwn= avalon.ohasOwn
		   enumerateBUG = enu !== '0' //IE6下为true, 其他为false
	
		   /*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/
		   function isPlainObjectCompact(obj, key) {
		       if (!obj || avalon.type(obj) !== 'object' || obj.nodeType || avalon.isWindow(obj)) {
		           return false
		       }
		       try { //IE内置对象没有constructor
		           if (obj.constructor &&
					!ohasOwn.call(obj, 'constructor') &&
					!ohasOwn.call(obj.constructor.prototype || {}, 'isPrototypeOf')) {
		               return false
		           }
		       } catch (e) { //IE8 9会在这里抛错
		           return false
		       }
		       if (enumerateBUG) {
		           for (key in obj) {
		               return ohasOwn.call(obj, key)
		           }
		       }
		       for (key in obj) {
		       }
		       return key === void 0 || ohasOwn.call(obj, key)
		   }
	
		   function isPlainObjectModern(obj) {
		       // 简单的 typeof obj === 'object'检测，会致使用isPlainObject(window)在opera下通不过
		       return tos.call(obj) === '[object Object]' &&
				Object.getPrototypeOf(obj) === Object.prototype
		   }
	
		   avalon.isPlainObject = /\[native code\]/.test(Object.getPrototypeOf) ?
			isPlainObjectModern : isPlainObjectCompact
	
	
		   //与jQuery.extend方法，可用于浅拷贝，深拷贝
		   avalon.mix = avalon.fn.mix = function () {
		       var options, name, src, copy, copyIsArray, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false
	
		       // 如果第一个参数为布尔,判定是否深拷贝
		       if (typeof target === 'boolean') {
		           deep = target
		           target = arguments[1] || {}
		           i++
		       }
	
		       //确保接受方为一个复杂的数据类型
		       if (typeof target !== 'object' && !avalon.isFunction(target)) {
		           target = {}
		       }
	
		       //如果只有一个参数，那么新成员添加于mix所在的对象上
		       if (i === length) {
		           target = this
		           i--
		       }
	
		       for (; i < length; i++) {
		           //只处理非空参数
		           if ((options = arguments[i]) != null) {
		               for (name in options) {
		                   try {
		                       src = target[name]
		                       copy = options[name] //当options为VBS对象时报错
		                   } catch (e) {
		                       continue
		                   }
	
		                   // 防止环引用
		                   if (target === copy) {
		                       continue
		                   }
		                   if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
	
		                       if (copyIsArray) {
		                           copyIsArray = false
		                           clone = src && Array.isArray(src) ? src : []
	
		                       } else {
		                           clone = src && avalon.isPlainObject(src) ? src : {}
		                       }
	
		                       target[name] = avalon.mix(deep, clone, copy)
		                   } else if (copy !== void 0) {
		                       target[name] = copy
		                   }
		               }
		           }
		       }
		       return target
		   }
	
		   var rarraylike = /(Array|List|Collection|Map|Arguments)\]$/
		   /*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
		   function isArrayLike(obj) {
		       if (!obj)
		           return false
		       var n = obj.length
		       /* istanbul ignore if*/
		       if (n === (n >>> 0)) { //检测length属性是否为非负整数
		           var type = tos.call(obj).slice(8, -1)
		           if (rarraylike.test(type))
		               return false
		           if (type === 'Array')
		               return true
		           try {
		               if ({}.propertyIsEnumerable.call(obj, 'length') === false) { //如果是原生对象
		                   return rfunction.test(obj.item || obj.callee)
		               }
		               return true
		           } catch (e) { //IE的NodeList直接抛错
		               return !obj.window //IE6-8 window
		           }
		       }
		       return false
		   }
	
	
		   avalon.each = function (obj, fn) {
		       if (obj) { //排除null, undefined
		           var i = 0
		           if (isArrayLike(obj)) {
		               for (var n = obj.length; i < n; i++) {
		                   if (fn(i, obj[i]) === false)
		                       break
		               }
		           } else {
		               for (i in obj) {
		                   if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
		                       break
		                   }
		               }
		           }
		       }
		   }
	
		   new function welcome() {
		       var welcomeIntro = ["%cavalon.js %c" + avalon.version + " %cin debug mode, %cmore...", "color: rgb(114, 157, 52); font-weight: normal;", "color: rgb(85, 85, 85); font-weight: normal;", "color: rgb(85, 85, 85); font-weight: normal;", "color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;"];
		       var welcomeMessage = "You're running avalon in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\n" +
				'To disable debug mode, add this line at the start of your app:\n\n  avalon.config({debug: false});\n\n' +
				'Debug mode also automatically shut down amicably when your app is minified.\n\n' +
				"Get help and support:\n  https://segmentfault.com/t/avalon\n  http://avalonjs.coding.me/\n  http://www.baidu-x.com/?q=avalonjs\n  http://www.avalon.org.cn/\n\nFound a bug? Raise an issue:\n  https://github.com/RubyLouvre/avalon/issues\n\n";
		       if (typeof console === 'object') {
		           var con = console
		           var method = con.groupCollapsed || con.log
		           Function.apply.call(method, con, welcomeIntro)
		           con.log(welcomeMessage)
		           if (method !== console.log) {
		               con.groupEnd(welcomeIntro);
		           }
		       }
		   }
	
		/*
		 https://github.com/rsms/js-lru
		 entry             entry             entry             entry        
		 ______            ______            ______            ______       
		 | head |.newer => |      |.newer => |      |.newer => | tail |      
		 |  A   |          |  B   |          |  C   |          |  D   |      
		 |______| <= older.|______| <= older.|______| <= older.|______|      
		 
		 removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added 
		 */
		   function Cache(maxLength) {
		       // 标识当前缓存数组的大小
		       this.size = 0
		       // 标识缓存数组能达到的最大长度
		       this.limit = maxLength
		       //  head（最不常用的项），tail（最常用的项）全部初始化为undefined
	
		       this.head = this.tail = void 0
		       this._keymap = {}
		   }
	
		   var p = Cache.prototype
	
		   p.put = function (key, value) {
		       var entry = {
		           key: key,
		           value: value
		       }
		       this._keymap[key] = entry
		       if (this.tail) {
		           // 如果存在tail（缓存数组的长度不为0），将tail指向新的 entry
		           this.tail.newer = entry
		           entry.older = this.tail
		       } else {
		           // 如果缓存数组的长度为0，将head指向新的entry
		           this.head = entry
		       }
		       this.tail = entry
		       // 如果缓存数组达到上限，则先删除 head 指向的缓存对象
		       /* istanbul ignore if */
		       if (this.size === this.limit) {
		           this.shift()
		       } else {
		           this.size++
		       }
		       return value
		   }
	
		   p.shift = function () {
		       /* istanbul ignore next */
		       var entry = this.head
		       /* istanbul ignore if */
		       if (entry) {
		           // 删除 head ，并改变指向
		           this.head = this.head.newer
		           // 同步更新 _keymap 里面的属性值
		           this.head.older =
					entry.newer =
					entry.older =
					this._keymap[entry.key] =
					void 0
		           delete this._keymap[entry.key] //#1029
		           // 同步更新 缓存数组的长度
		           this.size--
		       }
		   }
		   p.get = function (key) {
		       var entry = this._keymap[key]
		       // 如果查找不到含有`key`这个属性的缓存对象
		       if (entry === void 0)
		           return
		       // 如果查找到的缓存对象已经是 tail (最近使用过的)
		       /* istanbul ignore if */
		       if (entry === this.tail) {
		           return entry.value
		       }
		       // HEAD--------------TAIL
		       //   <.older   .newer>
		       //  <--- add direction --
		       //   A  B  C  <D>  E
		       if (entry.newer) {
		           // 处理 newer 指向
		           if (entry === this.head) {
		               // 如果查找到的缓存对象是 head (最近最少使用过的)
		               // 则将 head 指向原 head 的 newer 所指向的缓存对象
		               this.head = entry.newer
		           }
		           // 将所查找的缓存对象的下一级的 older 指向所查找的缓存对象的older所指向的值
		           // 例如：A B C D E
		           // 如果查找到的是D，那么将E指向C，不再指向D
		           entry.newer.older = entry.older // C <-- E.
		       }
		       if (entry.older) {
		           // 处理 older 指向
		           // 如果查找到的是D，那么C指向E，不再指向D
		           entry.older.newer = entry.newer // C. --> E
		       }
		       // 处理所查找到的对象的 newer 以及 older 指向
		       entry.newer = void 0 // D --x
		       // older指向之前使用过的变量，即D指向E
		       entry.older = this.tail // D. --> E
		       if (this.tail) {
		           // 将E的newer指向D
		           this.tail.newer = entry // E. <-- D
		       }
		       // 改变 tail 为D 
		       this.tail = entry
		       return entry.value
		   }
	
		/* 
		 * 对html实体进行转义
		 * https://github.com/substack/node-ent
		 * http://www.cnblogs.com/xdp-gacl/p/3722642.html
		 * http://www.stefankrause.net/js-frameworks-benchmark2/webdriver-java/table.html
		 */
	
		   var rentities = /&[a-z0-9#]{2,10};/
		   var temp = avalon.avalonDiv
		   avalon.shadowCopy(avalon, {
		       evaluatorPool: new Cache(888),
		       _decode: function (str) {
		           if (rentities.test(str)) {
		               temp.innerHTML = str
		               return temp.innerText || temp.textContent
		           }
		           return str
		       }
		   })
	
		   var directives = avalon.directives
	
		   //export default avalon
		   //生成事件回调的UUID(用户通过ms-on指令)
		   function markID(fn) {
		       /* istanbul ignore next */
		       return fn.uuid || (fn.uuid = avalon.makeHashCode('e'))
		   }
		   var UUID = 1
		   //生成事件回调的UUID(用户通过avalon.bind)
		   function markID$1(fn) {
		       /* istanbul ignore next */
		       return fn.uuid || (fn.uuid = '_' + (++UUID))
		   }
		   var quote = avalon.quote
		   var win = avalon.window
		   var doc$1 = avalon.document
		   var root$1 = avalon.root
		   var W3C = avalon.modern
		   var eventHooks = avalon.eventHooks
	
		   function config(settings) {
		       for (var p in settings) {
				/* istanbul ignore if */
		           if (!avalon.ohasOwn.call(settings, p))
		               continue
		           var val = settings[p]
		           if (typeof config.plugins[p] === 'function') {
		               config.plugins[p](val)
		           } else {
		               config[p] = val
		           }
		       }
		       return this
		   }
	
		   avalon.config = config
	
		   var plugins = {
		       interpolate: function (array) {
		           var openTag = array[0]
		           var closeTag = array[1]
		           /*eslint-disable */
				/* istanbul ignore if */
		           if (openTag === closeTag) {
		               throw new SyntaxError('openTag!==closeTag')
		           }
		           var test = openTag + 'test' + closeTag
		           var div = avalon.avalonDiv
		           div.innerHTML = test
				/* istanbul ignore if */
		           if (div.innerHTML !== test && div.innerHTML.indexOf('&lt;') > -1) {
		               throw new SyntaxError('此定界符不合法')
		           }
		           div.innerHTML = ''
		           /*eslint-enable */
		           config.openTag = openTag
		           config.closeTag = closeTag
		           var o = avalon.escapeRegExp(openTag)
		           var c = avalon.escapeRegExp(closeTag)
		           config.rexpr = new RegExp(o + '([\\s\\S]*)' + c)
		       }
		   }
		   config.plugins = plugins
		   avalon.config({
		       interpolate: ['{{', '}}'],
		       debug: true
		   })
	
		   function numberFilter(number, decimals, point, thousands) {
			//form http://phpjs.org/functions/number_format/
			//number 必需，要格式化的数字
			//decimals 可选，规定多少个小数位。
			//point 可选，规定用作小数点的字符串（默认为 . ）。
			//thousands 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
			number = (number + '')
				.replace(/[^0-9+\-Ee.]/g, '')
			var n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
				sep = thousands || ",",
				dec = point || ".",
				s = '',
				toFixedFix = function (n, prec) {
					var k = Math.pow(10, prec)
					return '' + (Math.round(n * k) / k)
						.toFixed(prec)
				}
			// Fix for IE parseFloat(0.55).toFixed(0) = 0;
			s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
				.split('.')
			if (s[0].length > 3) {
				s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
			}
			if ((s[1] || '')
				.length < prec) {
				s[1] = s[1] || ''
				s[1] += new Array(prec - s[1].length + 1)
					.join('0')
			}
			return s.join(dec)
		   }
	
		   var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim
		   var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g
		   var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/ig
		   var rsanitize = {
		       a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/ig,
		       img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/ig,
		       form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/ig
		   }
	
		   //https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
		   //    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a> 
		   //    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
		   //    <a href="jav	ascript:alert('XSS');">IE67chrome</a>
		   //    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
		   //    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
		   function sanitizeFilter(str) {
		       return str.replace(rscripts, "").replace(ropen, function (a, b) {
		           var match = a.toLowerCase().match(/<(\w+)\s/)
		           if (match) { //处理a标签的href属性，img标签的src属性，form标签的action属性
		               var reg = rsanitize[match[1]]
		               if (reg) {
		                   a = a.replace(reg, function (s, name, value) {
		                       var quote = value.charAt(0)
		                       return name + "=" + quote + "javascript:void(0)" + quote// jshint ignore:line
		                   })
		               }
		           }
		           return a.replace(ron, " ").replace(/\s+/g, " ") //移除onXXX事件
		       })
		   }
	
		/*
		 'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
		 'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
		 'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
		 'MMMM': Month in year (January-December)
		 'MMM': Month in year (Jan-Dec)
		 'MM': Month in year, padded (01-12)
		 'M': Month in year (1-12)
		 'dd': Day in month, padded (01-31)
		 'd': Day in month (1-31)
		 'EEEE': Day in Week,(Sunday-Saturday)
		 'EEE': Day in Week, (Sun-Sat)
		 'HH': Hour in day, padded (00-23)
		 'H': Hour in day (0-23)
		 'hh': Hour in am/pm, padded (01-12)
		 'h': Hour in am/pm, (1-12)
		 'mm': Minute in hour, padded (00-59)
		 'm': Minute in hour (0-59)
		 'ss': Second in minute, padded (00-59)
		 's': Second in minute (0-59)
		 'a': am/pm marker
		 'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
		 format string can also be one of the following predefined localizable formats:
		 
		 'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
		 'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
		 'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
		 'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
		 'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
		 'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
		 'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
		 'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
		 */
	
		   function toInt(str) {
		       return parseInt(str, 10) || 0
		   }
	
		   function padNumber(num, digits, trim) {
		       var neg = ''
		       /* istanbul ignore if*/
		       if (num < 0) {
		           neg = '-'
		           num = -num
		       }
		       num = '' + num
		       while (num.length < digits)
		           num = '0' + num
		       if (trim)
		           num = num.substr(num.length - digits)
		       return neg + num
		   }
	
		   function dateGetter(name, size, offset, trim) {
		       return function (date) {
		           var value = date["get" + name]()
		           if (offset > 0 || value > -offset)
		               value += offset
		           if (value === 0 && offset === -12) {
		               /* istanbul ignore next*/
		               value = 12
		           }
		           return padNumber(value, size, trim)
		       }
		   }
	
		   function dateStrGetter(name, shortForm) {
		       return function (date, formats) {
		           var value = date["get" + name]()
		           var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
		           return formats[get][value]
		       }
		   }
	
		   function timeZoneGetter(date) {
		       var zone = -1 * date.getTimezoneOffset()
		       var paddedZone = (zone >= 0) ? "+" : ""
		       paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
		       return paddedZone
		   }
		   //取得上午下午
		   function ampmGetter(date, formats) {
		       return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
		   }
		   var DATE_FORMATS = {
		       yyyy: dateGetter("FullYear", 4),
		       yy: dateGetter("FullYear", 2, 0, true),
		       y: dateGetter("FullYear", 1),
		       MMMM: dateStrGetter("Month"),
		       MMM: dateStrGetter("Month", true),
		       MM: dateGetter("Month", 2, 1),
		       M: dateGetter("Month", 1, 1),
		       dd: dateGetter("Date", 2),
		       d: dateGetter("Date", 1),
		       HH: dateGetter("Hours", 2),
		       H: dateGetter("Hours", 1),
		       hh: dateGetter("Hours", 2, -12),
		       h: dateGetter("Hours", 1, -12),
		       mm: dateGetter("Minutes", 2),
		       m: dateGetter("Minutes", 1),
		       ss: dateGetter("Seconds", 2),
		       s: dateGetter("Seconds", 1),
		       sss: dateGetter("Milliseconds", 3),
		       EEEE: dateStrGetter("Day"),
		       EEE: dateStrGetter("Day", true),
		       a: ampmGetter,
		       Z: timeZoneGetter
		   }
		   var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
		   var raspnetjson = /^\/Date\((\d+)\)\/$/
		   function dateFilter(date, format) {
		       var locate = dateFilter.locate,
		           text = "",
		           parts = [],
		           fn, match
		       format = format || "mediumDate"
		       format = locate[format] || format
		       if (typeof date === "string") {
		           if (/^\d+$/.test(date)) {
		               date = toInt(date)
		           } else if (raspnetjson.test(date)) {
		               date = +RegExp.$1
		           } else {
		               var trimDate = date.trim()
		               var dateArray = [0, 0, 0, 0, 0, 0, 0]
		               var oDate = new Date(0)
		               //取得年月日
		               trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function (_, a, b, c) {
		                   var array = c.length === 4 ? [c, a, b] : [a, b, c]
		                   dateArray[0] = toInt(array[0])     //年
		                   dateArray[1] = toInt(array[1]) - 1 //月
		                   dateArray[2] = toInt(array[2])     //日
		                   return ""
		               })
		               var dateSetter = oDate.setFullYear
		               var timeSetter = oDate.setHours
		               trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function (_, a, b, c, d) {
		                   dateArray[3] = toInt(a) //小时
		                   dateArray[4] = toInt(b) //分钟
		                   dateArray[5] = toInt(c) //秒
		                   if (d) {                //毫秒
		                       dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
		                   }
		                   return ""
		               })
		               var tzHour = 0
		               var tzMin = 0
		               trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function (z, symbol, c, d) {
		                   dateSetter = oDate.setUTCFullYear
		                   timeSetter = oDate.setUTCHours
		                   if (symbol) {
		                       tzHour = toInt(symbol + c)
		                       tzMin = toInt(symbol + d)
		                   }
		                   return ''
		               })
	
		               dateArray[3] -= tzHour
		               dateArray[4] -= tzMin
		               dateSetter.apply(oDate, dateArray.slice(0, 3))
		               timeSetter.apply(oDate, dateArray.slice(3))
		               date = oDate
		           }
		       }
		       if (typeof date === 'number') {
		           date = new Date(date)
		       }
	
		       while (format) {
		           match = rdateFormat.exec(format)
		           /* istanbul ignore else */
		           if (match) {
		               parts = parts.concat(match.slice(1))
		               format = parts.pop()
		           } else {
		               parts.push(format)
		               format = null
		           }
		       }
		       parts.forEach(function (value) {
		           fn = DATE_FORMATS[value]
		           text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
		       })
		       return text
		   }
	
	
		   var locate = {
		       AMPMS: {
		           0: '上午',
		           1: '下午'
		       },
		       DAY: {
		           0: '星期日',
		           1: '星期一',
		           2: '星期二',
		           3: '星期三',
		           4: '星期四',
		           5: '星期五',
		           6: '星期六'
		       },
		       MONTH: {
		           0: '1月',
		           1: '2月',
		           2: '3月',
		           3: '4月',
		           4: '5月',
		           5: '6月',
		           6: '7月',
		           7: '8月',
		           8: '9月',
		           9: '10月',
		           10: '11月',
		           11: '12月'
		       },
		       SHORTDAY: {
		           '0': '周日',
		           '1': '周一',
		           '2': '周二',
		           '3': '周三',
		           '4': '周四',
		           '5': '周五',
		           '6': '周六'
		       },
		       fullDate: 'y年M月d日EEEE',
		       longDate: 'y年M月d日',
		       medium: 'yyyy-M-d H:mm:ss',
		       mediumDate: 'yyyy-M-d',
		       mediumTime: 'H:mm:ss',
		       'short': 'yy-M-d ah:mm',
		       shortDate: 'yy-M-d',
		       shortTime: 'ah:mm'
		   }
		   locate.SHORTMONTH = locate.MONTH
		   dateFilter.locate = locate
	
		   function orderBy(array, criteria, reverse) {
		       var type = avalon.type(array)
		       if (type !== 'array' && type !== 'object')
		           throw 'orderBy只能处理对象或数组'
		       var order = (reverse && reverse < 0) ? -1 : 1
	
		       if (typeof criteria === 'string') {
		           var key = criteria
		           criteria = function (a) {
		               return a && a[key]
		           }
		       }
		       array = convertArray(array)
		       array.forEach(function (el) {
		           el.order = criteria(el.value, el.key)
		       })
		       array.sort(function (left, right) {
		           var a = left.order
		           var b = right.order
		           /* istanbul ignore if */
		           if (Number.isNaN(a) && Number.isNaN(b)) {
		               return 0
		           }
		           return a === b ? 0 : a > b ? order : -order
		       })
		       var isArray = type === 'array'
		       var target = isArray ? [] : {}
		       return recovery(target, array, function (el) {
		           if (isArray) {
		               target.push(el.value)
		           } else {
		               target[el.key] = el.value
		           }
		       })
		   }
	
		   function filterBy(array, search) {
		       var type = avalon.type(array)
		       if (type !== 'array' && type !== 'object')
		           throw 'filterBy只能处理对象或数组'
		       var args = avalon.slice(arguments, 2)
		       var stype = avalon.type(search)
		       if (stype === 'function') {
		           var criteria = search
		       } else if (stype === 'string' || stype === 'number') {
		           if (search === '') {
		               return array
		           } else {
		               var reg = new RegExp(avalon.escapeRegExp(search), 'i')
		               criteria = function (el) {
		                   return reg.test(el)
		               }
		           }
		       } else {
		           return array
		       }
	
		       array = convertArray(array).filter(function (el, i) {
		           return !!criteria.apply(el, [el.value, i].concat(args))
		       })
	
		       var isArray = type === 'array'
		       var target = isArray ? [] : {}
		       return recovery(target, array, function (el) {
		           if (isArray) {
		               target.push(el.value)
		           } else {
		               target[el.key] = el.value
		           }
		       })
		   }
	
		   function selectBy(data, array, defaults) {
		       if (avalon.isObject(data) && !Array.isArray(data)) {
		           var target = []
		           return recovery(target, array, function (name) {
		               target.push(data.hasOwnProperty(name) ? data[name] : defaults ? defaults[name] : '')
		           })
		       } else {
		           return data
		       }
		   }
	
		   Number.isNaN = Number.isNaN || /* istanbul ignore next*/ function (a) {
		       return a !== a
		   }
	
		   function limitBy(input, limit, begin) {
		       var type = avalon.type(input)
		       if (type !== 'array' && type !== 'object')
		           throw 'limitBy只能处理对象或数组'
		       //必须是数值
		       if (typeof limit !== 'number') {
		           return input
		       }
		       //不能为NaN
		       if (Number.isNaN(limit)) {
		           return input
		       }
		       //将目标转换为数组
		       if (type === 'object') {
		           input = convertArray(input)
		       }
		       var n = input.length
		       limit = Math.floor(Math.min(n, limit))
		       begin = typeof begin === 'number' ? begin : 0
		       if (begin < 0) {
		           begin = Math.max(0, n + begin)
		       }
		       var data = []
		       for (var i = begin; i < n; i++) {
		           if (data.length === limit) {
		               break
		           }
		           data.push(input[i])
		       }
		       var isArray = type === 'array'
		       if (isArray) {
		           return data
		       }
		       var target = {}
		       return recovery(target, data, function (el) {
		           target[el.key] = el.value
		       })
		   }
	
		   function recovery(ret, array, callback) {
		       for (var i = 0, n = array.length; i < n; i++) {
		           callback(array[i])
		       }
		       return ret
		   }
	
	
		   function convertArray(array) {
		       var ret = [], i = 0
		       avalon.each(array, function (key, value) {
		           ret[i++] = {
		               value: value,
		               key: key
		           }
		       })
		       return ret
		   }
	
		var arrayFilters = Object.freeze({
		       orderBy: orderBy,
		       filterBy: filterBy,
		       selectBy: selectBy,
		       limitBy: limitBy
		   });
	
		   var eventFilters = {
		       stop: function (e) {
		           e.stopPropagation()
		           return e
		       },
		       prevent: function (e) {
		           e.preventDefault()
		           return e
		       }
		   }
		   var keys = {
		       esc: 27,
		       tab: 9,
		       enter: 13,
		       space: 32,
		       del: 46,
		       up: 38,
		       left: 37,
		       right: 39,
		       down: 40
		   }
		   for (var name in keys) {
		       (function (filter, key) {
		           eventFilters[filter] = function (e) {
		               if (e.which !== key) {
		                   e.$return = true
		               }
		               return e
		           }
		       })(name, keys[name])
		   }
	
		   //https://github.com/teppeis/htmlspecialchars
		   function escapeFilter(str) {
		       if (str == null)
		           return ''
	
		       return String(str).
		           replace(/&/g, '&amp;').
		           replace(/</g, '&lt;').
		           replace(/>/g, '&gt;').
		           replace(/"/g, '&quot;').
		           replace(/'/g, '&#39;')
		   }
	
		   var filters = avalon.filters
	
		   function K(a) {
		       /* istanbul ignore next*/
		       return a
		   }
		   avalon.escapeHtml = escapeFilter
	
		   avalon.__format__ = function (name) {
		       var fn = filters[name]
		       if (fn) {
		           return fn
		       }
		       return K
		   }
	
		   avalon.mix(filters, {
		       uppercase: function (str) {
		           return String(str).toUpperCase()
		       },
		       lowercase: function (str) {
		           return String(str).toLowerCase()
		       },
		       truncate: function (str, length, end) {
		           //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
		           if (!str) {
		               return ''
		           }
		           str = String(str)
		           if (isNaN(length)) {
		               length = 30
		           }
		           end = typeof end === "string" ? end : "..."
		           return str.length > length ?
		               str.slice(0, length - end.length) + end :/* istanbul ignore else*/
		               str
		       },
		       camelize: avalon.camelize,
		       date: dateFilter,
		       escape: escapeFilter,
		       sanitize: sanitizeFilter,
		       number: numberFilter,
		       currency: function (amount, symbol, fractionSize) {
		           return (symbol || '\u00a5') +
		               numberFilter(amount,
		                   isFinite(fractionSize) ?/* istanbul ignore else*/ fractionSize : 2)
		       }
		   }, arrayFilters, eventFilters)
	
		   function VText(text) {
		       this.nodeName = '#text'
		       this.nodeValue = text
		       this.skipContent = !avalon.config.rexpr.test(text)
		   }
	
		   VText.prototype = {
		       constructor: VText,
		       toDOM: function () {
		           /* istanbul ignore if*/
		           if (this.dom)
		               return this.dom
		           var v = avalon._decode(this.nodeValue)
		           return this.dom = document.createTextNode(v)
		       },
		       toHTML: function () {
		           return this.nodeValue
		       }
		   }
	
		   function VComment(text) {
		       this.nodeName = '#comment'
		       this.nodeValue = text
		   }
		   VComment.prototype = {
		       constructor: VComment,
		       toDOM: function () {
		           return this.dom = document.createComment(this.nodeValue)
		       },
		       toHTML: function () {
		           return '<!--' + this.nodeValue + '-->'
		       }
		   }
	
		   function VElement(type, props, children) {
		       this.nodeName = type
		       this.props = props
		       this.children = children
		   }
	
		   function skipFalseAndFunction(a) {
		       return a !== false && (Object(a) !== a)
		   }
	
		   var specalAttrs = {
		       "class": function (dom, val) {
		           dom.className = val
		       },
		       style: function (dom, val) {
		           dom.style.cssText = val
		       },
		       type: function (dom, val) {
		           try { //textarea,button 元素在IE6,7设置 type 属性会抛错
		               dom.type = val
		           } catch (e) { }
		       },
		       'for': function (dom, val) {
		           dom.htmlFor = val
		       }
		   }
	
		   VElement.prototype = {
		       constructor: VElement,
		       toDOM: function () {
		           if (this.dom)
		               return this.dom
		           var dom, tagName = this.nodeName
		           if (avalon.modern && svgTags[tagName]) {
		               dom = createSVG(tagName)
		           } else if (!avalon.modern && (VMLTags[tagName] || rvml.test(tagName))) {
		               dom = createVML(tagName)
		           } else {
		               dom = document.createElement(tagName)
		           }
	
		           var props = this.props || {}
		           var wid = (props['ms-important'] ||
					props['ms-controller'] || this.wid)
		           if (wid) {
		               var scope = avalon.scopes[wid]
		               var element = scope && scope.vmodel && scope.vmodel.$element
		               if (element) {
		                   var oldVdom = element.vtree[0]
		                   if (oldVdom.children) {
		                       this.children = oldVdom.children
		                   }
		                   return element
		               }
		           }
		           for (var i in props) {
		               var val = props[i]
		               if (skipFalseAndFunction(val)) {
		                   if (specalAttrs[i] && avalon.msie < 8) {
		                       specalAttrs[i](dom, val)
		                   } else {
		                       dom.setAttribute(i, val + '')
		                   }
		               }
		           }
		           var c = this.children || []
		           var template = c[0] ? c[0].nodeValue : ''
		           switch (this.nodeName) {
		               case 'script':
		                   dom.text = template
		                   break
		               case 'style':
		                   if ('styleSheet' in dom) {
		                       dom.setAttribute('type', 'text/css')
		                       dom.styleSheet.cssText = template
		                   } else {
		                       dom.innerHTML = template
		                   }
		                   break
		               case 'xmp'://IE6-8,XMP元素里面只能有文本节点,不能使用innerHTML
		               case 'noscript':
		                   dom.innerText = dom.textContent = template
		                   break
		               case 'template':
		                   dom.innerHTML = template
		                   break
		               default:
		                   if (!this.isVoidTag) {
		                       this.children.forEach(function (c) {
		                           c && dom.appendChild(avalon.vdom(c, 'toDOM'))
		                       })
		                   }
		                   break
		           }
		           return this.dom = dom
		       },
		       toHTML: function () {
		           var arr = []
		           var props = this.props || {}
		           for (var i in props) {
		               var val = props[i]
		               if (skipFalseAndFunction(val)) {
		                   arr.push(i + '=' + avalon.quote(props[i] + ''))
		               }
		           }
		           arr = arr.length ? ' ' + arr.join(' ') : ''
		           var str = '<' + this.nodeName + arr
		           if (this.isVoidTag) {
		               return str + '/>'
		           }
		           str += '>'
		           if (this.children) {
		               str += this.children.map(function (c) {
		                   return c ? avalon.vdom(c, 'toHTML') : ''
		               }).join('')
		           }
		           return str + '</' + this.nodeName + '>'
		       }
		   }
		   function createSVG(type) {
		       return document.createElementNS('http://www.w3.org/2000/svg', type)
		   }
		   var svgTags = avalon.oneObject('circle,defs,ellipse,image,line,' +
			'path,polygon,polyline,rect,symbol,text,use,g,svg')
	
		   var rvml = /^\w+\:\w+/
	
		   function createVML(type) {
		       if (document.styleSheets.length < 31) {
		           document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
		       } else {
		           // no more room, add to the existing one
		           // http://msdn.microsoft.com/en-us/library/ms531194%28VS.85%29.aspx
		           document.styleSheets[0].addRule(".rvml", "behavior:url(#default#VML)");
		       }
		       var arr = type.split(':')
		       if (arr.length === 1) {
		           arr.unshift('v')
		       }
		       var tag = arr[1]
		       var ns = arr[0]
		       if (!document.namespaces[ns]) {
		           document.namespaces.add(ns, "urn:schemas-microsoft-com:vml")
		       }
		       return document.createElement('<' + ns + ':' + tag + ' class="rvml">');
		   }
	
		   var VMLTags = avalon.oneObject('shape,line,polyline,rect,roundrect,oval,arc,' +
			'curve,background,image,shapetype,group,fill,' +
			'stroke,shadow, extrusion, textbox, imagedata, textpath')
	
		   function VFragment(a) {
		       this.nodeName = '#document-fragment'
		       this.children = a
		   }
	
		   VFragment.prototype = {
		       constructor: VFragment,
		       toDOM: function () {
		           if (this.dom)
		               return this.dom
		           var f = document.createDocumentFragment()
		           for (var i = 0, el; el = this.children[i++];) {
		               f.appendChild(avalon.vdom(el, 'toDOM'))
		           }
		           this.split = f.lastChild
		           return this.dom = f
		       },
		       toHTML: function () {
		           return this.children.map(function (a) {
		               return avalon.vdom(a, 'toHTML')
		           }).join('')
		       }
		   }
	
		   avalon.vdom = avalon.vdomAdaptor = function (obj, method) {
		       if (!obj) {//obj在ms-for循环里面可能是null
		           return method === "toHTML" ? '' : document.createDocumentFragment()
		       }
		       switch (obj.nodeName) {
		           case '#text':
		               return VText.prototype[method].call(obj)
		           case '#comment':
		               return VComment.prototype[method].call(obj)
		           case '#document-fragment':
		               return VFragment.prototype[method].call(obj)
		           case void (0):
		               return (new VFragment(obj))[method]()
		           default:
		               return VElement.prototype[method].call(obj)
		       }
		   }
		   var mix = {
		       VText: VText,
		       VComment: VComment,
		       VElement: VElement,
		       VFragment: VFragment
		   }
	
		   avalon.shadowCopy(avalon.vdom, mix)
	
	
		   avalon.domize = function (a) {
		       return avalon.vdom(a, 'toDOM')
		   }
	
		   var rcheckedType = /radio|checkbox/
	
		   function fix(dest, src) {
		       if (dest.nodeType !== 1) {
		           return
		       }
		       var nodeName = dest.nodeName.toLowerCase()
		       if (nodeName === 'object') {
		           if (dest.parentNode) {
		               dest.outerHTML = src.outerHTML
		           }
	
		       } else if (nodeName === 'input' && rcheckedType.test(src.nodeName)) {
	
		           dest.defaultChecked = dest.checked = src.checked
	
		           if (dest.value !== src.value) {
		               dest.value = src.value
		           }
	
		       } else if (nodeName === 'option') {
		           dest.defaultSelected = dest.selected = src.defaultSelected
		       } else if (nodeName === 'input' || nodeName === 'textarea') {
		           dest.defaultValue = src.defaultValue
		       }
		   }
	
	
		   function getAll(context) {
		       return typeof context.getElementsByTagName !== 'undefined' ?
				context.getElementsByTagName('*') :
				typeof context.querySelectorAll !== 'undefined' ?
		               context.querySelectorAll('*') : []
		   }
	
		   function fixCloneNode(src) {
		       var target = src.cloneNode(true)
		       var t = getAll(target)
		       var s = getAll(src)
		       for (var i = 0; i < s.length; i++) {
		           fix(t[i], s[i])
		       }
		       return target
		   }
	
		   avalon.cloneNode = function (a) {
		       return a.cloneNode(true)
		   }
	
		   function fixContains(root, el) {
		       try { //IE6-8,游离于DOM树外的文本节点，访问parentNode有时会抛错
		           while ((el = el.parentNode))
		               if (el === root)
		                   return true
		           return false
		       } catch (e) {
		           return false
		       }
		   }
	
		   avalon.contains = fixContains
		   //IE6-11的文档对象没有contains
		   if (avalon.browser) {
		       if (avalon.msie < 10) {
		           avalon.cloneNode = fixCloneNode
		       }
		       if (!document.contains) {
		           document.contains = function (b) {
		               return fixContains(document, b)
		           }
		       }
		       if (window.Node && !document.createTextNode('x').contains) {
		           Node.prototype.contains = function (arg) {//IE6-8没有Node对象
		               return !!(this.compareDocumentPosition(arg) & 16)
		           }
		       }
	
			//firefox 到11时才有outerHTML
		       if (window.HTMLElement && !avalon.root.outerHTML) {
		           HTMLElement.prototype.__defineGetter__('outerHTML', function () {
		               var div = document.createElement('div')
		               div.appendChild(this)
		               return div.innerHTML
		           })
		       }
	
		   }
	
		   var rnowhite = /\S+/g
		   var fakeClassListMethods = {
		       _toString: function () {
		           var node = this.node
		           var cls = node.className
		           var str = typeof cls === 'string' ? cls : cls.baseVal
		           var match = str.match(rnowhite)
		           return match ? match.join(' ') : ''
		       },
		       _contains: function (cls) {
		           return (' ' + this + ' ').indexOf(' ' + cls + ' ') > -1
		       },
		       _add: function (cls) {
		           if (!this.contains(cls)) {
		               this._set(this + ' ' + cls)
		           }
		       },
		       _remove: function (cls) {
		           this._set((' ' + this + ' ').replace(' ' + cls + ' ', ' '))
		       },
		       __set: function (cls) {
		           cls = cls.trim()
		           var node = this.node
		           if (typeof node.className === 'object') {
		               //SVG元素的className是一个对象 SVGAnimatedString { baseVal='', animVal=''}，只能通过set/getAttribute操作
		               node.setAttribute('class', cls)
		           } else {
		               node.className = cls
		           }
		       } //toggle存在版本差异，因此不使用它
		   }
	
		   function fakeClassList(node) {
		       if (!('classList' in node)) {
		           node.classList = {
		               node: node
		           }
		           for (var k in fakeClassListMethods) {
		               node.classList[k.slice(1)] = fakeClassListMethods[k]
		           }
		       }
		       return node.classList
		   }
	
	
		   'add,remove'.replace(avalon.rword, function (method) {
		       avalon.fn[method + 'Class'] = function (cls) {
		           var el = this[0] || {}
		           //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
		           if (cls && typeof cls === 'string' && el.nodeType === 1) {
		               cls.replace(rnowhite, function (c) {
		                   fakeClassList(el)[method](c)
		               })
		           }
		           return this
		       }
		   })
	
		   avalon.shadowCopy(avalon.fn, {
		       hasClass: function (cls) {
		           var el = this[0] || {}
		           return el.nodeType === 1 && fakeClassList(el).contains(cls)
		       },
		       toggleClass: function (value, stateVal) {
		           var isBool = typeof stateVal === 'boolean'
		           var me = this
		           String(value).replace(rnowhite, function (c) {
		               var state = isBool ? stateVal : !me.hasClass(c)
		               me[state ? 'addClass' : 'removeClass'](c)
		           })
		           return this
		       }
		   })
	
		   var propMap = {//不规则的属性名映射
		       'accept-charset': 'acceptCharset',
		       'char': 'ch',
		       charoff: 'chOff',
		       'class': 'className',
		       'for': 'htmlFor',
		       'http-equiv': 'httpEquiv'
		   }
		/*
		contenteditable不是布尔属性
		http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/
		contenteditable=''
		contenteditable='events'
		contenteditable='caret'
		contenteditable='plaintext-only'
		contenteditable='true'
		contenteditable='false'
		 */
		   var bools = ['autofocus,autoplay,async,allowTransparency,checked,controls',
		       'declare,disabled,defer,defaultChecked,defaultSelected,',
		       'isMap,loop,multiple,noHref,noResize,noShade',
		       'open,readOnly,selected'
		   ].join(',')
	
		   bools.replace(/\w+/g, function (name) {
		       propMap[name.toLowerCase()] = name
		   })
	
		   var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan',
		       'dateTime,defaultValue,contentEditable,frameBorder,longDesc,maxLength,' +
		       'marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'
		   ].join(',')
	
		   anomaly.replace(/\w+/g, function (name) {
		       propMap[name.toLowerCase()] = name
		   })
	
		   //module.exports = propMap
	
		   function isVML(src) {
		       var nodeName = src.nodeName
		       return nodeName.toLowerCase() === nodeName && src.scopeName && src.outerText === ''
		   }
	
		   var rsvg = /^\[object SVG\w*Element\]$/
		   var ramp = /&amp;/g
	
		   function attrUpdate(node, vnode) {
			/* istanbul ignore if*/
		       if (!node || node.nodeType !== 1) {
		           return
		       }
		       vnode.dynamic['ms-attr'] = 1
		       var attrs = vnode['ms-attr']
		       for (var attrName in attrs) {
		           var val = attrs[attrName]
		           // 处理路径属性
		           /* istanbul ignore if*/
		           if (attrName === 'href' || attrName === 'src') {
		               if (!node.hasAttribute) {
		                   val = String(val).replace(ramp, '&') //处理IE67自动转义的问题
		               }
		               node[attrName] = val
		               /* istanbul ignore if*/
		               if (window.chrome && node.tagName === 'EMBED') {
		                   var parent = node.parentNode //#525  chrome1-37下embed标签动态设置src不能发生请求
		                   var comment = document.createComment('ms-src')
		                   parent.replaceChild(comment, node)
		                   parent.replaceChild(node, comment)
		               }
		               //处理HTML5 data-*属性
		           } else if (attrName.indexOf('data-') === 0) {
		               node.setAttribute(attrName, val)
	
		           } else {
		               var propName = propMap[attrName] || attrName
		               if (typeof node[propName] === 'boolean') {
		                   node[propName] = !!val
	
		                   //布尔属性必须使用el.xxx = true|false方式设值
		                   //如果为false, IE全系列下相当于setAttribute(xxx,''),
		                   //会影响到样式,需要进一步处理
		               }
	
		               if (val === false) {//移除属性
		                   node.removeAttribute(propName)
		                   continue
		               }
		               //SVG只能使用setAttribute(xxx, yyy), VML只能使用node.xxx = yyy ,
		               //HTML的固有属性必须node.xxx = yyy
	
		               var isInnate = rsvg.test(node) ? false :
						(!avalon.modern && isVML(node)) ? true :
		                       attrName in node.cloneNode(false)
		               if (isInnate) {
		                   node[propName] = val + ''
		               } else {
		                   node.setAttribute(attrName, val)
		               }
		           }
		       }
		   }
		   var rvalidchars = /^[\],:{}\s]*$/;
		   var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
		   var rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g;
		   var rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
		   avalon.parseJSON = typeof JSON === 'object' ? JSON.parse : function (data) {
		       if (typeof data === 'string') {
		           data = data.trim()
		           if (data) {
		               if (rvalidchars.test(data.replace(rvalidescape, '@')
						.replace(rvalidtokens, ']')
						.replace(rvalidbraces, ''))) {
		                   return (new Function('return ' + data))() // jshint ignore:line
		               }
		           }
		           avalon.error('Invalid JSON: ' + data)
		       }
		       return data
		   }
	
	
		   avalon.fn.attr = function (name, value) {
		       if (arguments.length === 2) {
		           this[0].setAttribute(name, value)
		           return this
		       } else {
		           return this[0].getAttribute(name)
		       }
		   }
	
		   var cssHooks$1 = avalon.cssHooks
		   var cssMap = {
		       'float': 'cssFloat'
		   }
		   avalon.cssNumber = avalon.oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom')
		   var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-']
	
		   avalon.cssName = function (name, host, camelCase) {
		       if (cssMap[name]) {
		           return cssMap[name]
		       }
		       host = host || avalon.root.style || {}
		       for (var i = 0, n = prefixes.length; i < n; i++) {
		           camelCase = avalon.camelize(prefixes[i] + name)
		           if (camelCase in host) {
		               return (cssMap[name] = camelCase)
		           }
		       }
		       return null
		   }
	
	
		   avalon.fn.css = function (name, value) {
		       if (avalon.isPlainObject(name)) {
		           for (var i in name) {
		               avalon.css(this, i, name[i])
		           }
		       } else {
		           var ret = avalon.css(this, name, value)
		       }
		       return ret !== void 0 ? ret : this
		   }
	
		   avalon.fn.position = function () {
		       var offsetParent, offset,
		           elem = this[0],
		           parentOffset = {
		               top: 0,
		               left: 0
		           }
		       if (!elem) {
		           return parentOffset
		       }
		       /* istanbul ignore if */
		       /* istanbul ignore else */
		       if (this.css('position') === 'fixed') {
		           offset = elem.getBoundingClientRect()
		       } else {
		           offsetParent = this.offsetParent() //得到真正的offsetParent
		           offset = this.offset() // 得到正确的offsetParent
		           if (offsetParent[0].tagName !== 'HTML') {
		               parentOffset = offsetParent.offset()
		           }
		           parentOffset.top += avalon.css(offsetParent[0], 'borderTopWidth', true)
		           parentOffset.left += avalon.css(offsetParent[0], 'borderLeftWidth', true)
	
		           // Subtract offsetParent scroll positions
		           parentOffset.top -= offsetParent.scrollTop()
		           parentOffset.left -= offsetParent.scrollLeft()
		       }
		       return {
		           top: offset.top - parentOffset.top - avalon.css(elem, 'marginTop', true),
		           left: offset.left - parentOffset.left - avalon.css(elem, 'marginLeft', true)
		       }
		   }
	
		   avalon.fn.offsetParent = function () {
		       var offsetParent = this[0].offsetParent
		       while (offsetParent && avalon.css(offsetParent, 'position') === 'static') {
		           offsetParent = offsetParent.offsetParent
		       }
		       return avalon(offsetParent || avalon.root)
		   }
	
	
	
		   cssHooks$1['@:set'] = function (node, name, value) {
		       try {
		           //node.style.width = NaN;node.style.width = 'xxxxxxx';
		           //node.style.width = undefine 在旧式IE下会抛异常
		           node.style[name] = value
		       } catch (e) {
		       }
		   }
	
		   cssHooks$1['@:get'] = function (node, name) {
		       if (!node || !node.style) {
		           throw new Error('getComputedStyle要求传入一个节点 ' + node)
		       }
		       var ret, styles = getComputedStyle(node, null)
		       if (styles) {
		           ret = name === 'filter' ? styles.getPropertyValue(name) : styles[name]
		           if (ret === '') {
		               ret = node.style[name] //其他浏览器需要我们手动取内联样式
		           }
		       }
		       return ret
		   }
	
		   cssHooks$1['opacity:get'] = function (node) {
		       var ret = cssHooks$1['@:get'](node, 'opacity')
		       return ret === '' ? '1' : ret
		   }
	
		   'top,left'.replace(avalon.rword, function (name) {
		       cssHooks$1[name + ':get'] = function (node) {
		           var computed = cssHooks$1['@:get'](node, name)
		           return /px$/.test(computed) ? computed :
		               avalon(node).position()[name] + 'px'
		       }
		   })
	
	
		   var cssShow = {
		       position: 'absolute',
		       visibility: 'hidden',
		       display: 'block'
		   }
	
		   var rdisplayswap = /^(none|table(?!-c[ea]).+)/
	
		   function showHidden(node, array) {
		       //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
		       /* istanbul ignore if*/
		       if (node.offsetWidth <= 0) { //opera.offsetWidth可能小于0
		           if (rdisplayswap.test(cssHooks$1['@:get'](node, 'display'))) {
		               var obj = {
		                   node: node
		               }
		               for (var name in cssShow) {
		                   obj[name] = node.style[name]
		                   node.style[name] = cssShow[name]
		               }
		               array.push(obj)
		           }
		           var parent = node.parentNode
		           if (parent && parent.nodeType === 1) {
		               showHidden(parent, array)
		           }
		       }
		   }
	
		   avalon.each({
		       Width: 'width',
		       Height: 'height'
		   }, function (name, method) {
		       var clientProp = 'client' + name,
		           scrollProp = 'scroll' + name,
		           offsetProp = 'offset' + name
		       cssHooks$1[method + ':get'] = function (node, which, override) {
		           var boxSizing = -4
		           if (typeof override === 'number') {
		               boxSizing = override
		           }
		           which = name === 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom']
		           var ret = node[offsetProp] // border-box 0
		           if (boxSizing === 2) { // margin-box 2
		               return ret + avalon.css(node, 'margin' + which[0], true) + avalon.css(node, 'margin' + which[1], true)
		           }
		           if (boxSizing < 0) { // padding-box  -2
		               ret = ret - avalon.css(node, 'border' + which[0] + 'Width', true) - avalon.css(node, 'border' + which[1] + 'Width', true)
		           }
		           if (boxSizing === -4) { // content-box -4
		               ret = ret - avalon.css(node, 'padding' + which[0], true) - avalon.css(node, 'padding' + which[1], true)
		           }
		           return ret
		       }
		       cssHooks$1[method + '&get'] = function (node) {
		           var hidden = []
		           showHidden(node, hidden)
		           var val = cssHooks$1[method + ':get'](node)
		           for (var i = 0, obj; obj = hidden[i++];) {
		               node = obj.node
		               for (var n in obj) {
		                   if (typeof obj[n] === 'string') {
		                       node.style[n] = obj[n]
		                   }
		               }
		           }
		           return val
		       }
		       avalon.fn[method] = function (value) { //会忽视其display
		           var node = this[0]
		           if (arguments.length === 0) {
		               if (node.setTimeout) { //取得窗口尺寸
		                   return node['inner' + name] ||
		                       node.document.documentElement[clientProp] ||
		                       node.document.body[clientProp] //IE6下前两个分别为undefined,0
		               }
		               if (node.nodeType === 9) { //取得页面尺寸
		                   var doc = node.documentElement
		                   //FF chrome    html.scrollHeight< body.scrollHeight
		                   //IE 标准模式 : html.scrollHeight> body.scrollHeight
		                   //IE 怪异模式 : html.scrollHeight 最大等于可视窗口多一点？
		                   return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
		               }
		               return cssHooks$1[method + '&get'](node)
		           } else {
		               return this.css(method, value)
		           }
		       }
		       avalon.fn['inner' + name] = function () {
		           return cssHooks$1[method + ':get'](this[0], void 0, -2)
		       }
		       avalon.fn['outer' + name] = function (includeMargin) {
		           return cssHooks$1[method + ':get'](this[0], void 0, includeMargin === true ? 2 : 0)
		       }
		   })
	
		   /* istanbul ignore if */
		   if (avalon.msie < 9) {
		       cssMap['float'] = 'styleFloat'
		       var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
		       var rposition = /^(top|right|bottom|left)$/
		       var ralpha = /alpha\([^)]*\)/i
		       var ie8 = avalon.msie === 8
		       var salpha = 'DXImageTransform.Microsoft.Alpha'
		       var border = {
		           thin: ie8 ? '1px' : '2px',
		           medium: ie8 ? '3px' : '4px',
		           thick: ie8 ? '5px' : '6px'
		       }
		       cssHooks$1['@:get'] = function (node, name) {
		           //取得精确值，不过它有可能是带em,pc,mm,pt,%等单位
		           var currentStyle = node.currentStyle
		           var ret = currentStyle[name]
		           if ((rnumnonpx.test(ret) && !rposition.test(ret))) {
		               //①，保存原有的style.left, runtimeStyle.left,
		               var style = node.style,
		                   left = style.left,
		                   rsLeft = node.runtimeStyle.left
		               //②由于③处的style.left = xxx会影响到currentStyle.left，
		               //因此把它currentStyle.left放到runtimeStyle.left，
		               //runtimeStyle.left拥有最高优先级，不会style.left影响
		               node.runtimeStyle.left = currentStyle.left
		               //③将精确值赋给到style.left，然后通过IE的另一个私有属性 style.pixelLeft
		               //得到单位为px的结果；fontSize的分支见http://bugs.jquery.com/ticket/760
		               style.left = name === 'fontSize' ? '1em' : (ret || 0)
		               ret = style.pixelLeft + 'px'
		               //④还原 style.left，runtimeStyle.left
		               style.left = left
		               node.runtimeStyle.left = rsLeft
		           }
		           if (ret === 'medium') {
		               name = name.replace('Width', 'Style')
		               //border width 默认值为medium，即使其为0'
		               if (currentStyle[name] === 'none') {
		                   ret = '0px'
		               }
		           }
		           return ret === '' ? 'auto' : border[ret] || ret
		       }
		       cssHooks$1['opacity:set'] = function (node, name, value) {
		           var style = node.style
		           var opacity = isFinite(value) && value <= 1 ? 'alpha(opacity=' + value * 100 + ')' : ''
		           var filter = style.filter || ''
		           style.zoom = 1
		           //不能使用以下方式设置透明度
		           //node.filters.alpha.opacity = value * 100
		           style.filter = (ralpha.test(filter) ?
		               filter.replace(ralpha, opacity) :
		               filter + ' ' + opacity).trim()
		           if (!style.filter) {
		               style.removeAttribute('filter')
		           }
		       }
		       cssHooks$1['opacity:get'] = function (node) {
		           //这是最快的获取IE透明值的方式，不需要动用正则了！
		           var alpha = node.filters.alpha || node.filters[salpha],
		               op = alpha && alpha.enabled ? alpha.opacity : 100
		           return (op / 100) + '' //确保返回的是字符串
		       }
		   }
	
	
		   avalon.fn.offset = function () { //取得距离页面左右角的坐标
		       var node = this[0],
		           box = {
		               left: 0,
		               top: 0
		           }
		       if (!node || !node.tagName || !node.ownerDocument) {
		           return box
		       }
		       var doc = node.ownerDocument,
		           body = doc.body,
		           root = doc.documentElement,
		           win = doc.defaultView || doc.parentWindow
		       if (!avalon.contains(root, node)) {
		           return box
		       }
		       //http://hkom.blog1.fc2.com/?mode=m&no=750 body的偏移量是不包含margin的
		       //我们可以通过getBoundingClientRect来获得元素相对于client的rect.
		       //http://msdn.microsoft.com/en-us/library/ms536433.aspx
		       if (node.getBoundingClientRect) {
		           box = node.getBoundingClientRect() // BlackBerry 5, iOS 3 (original iPhone)
		       }
		       //chrome/IE6: body.scrollTop, firefox/other: root.scrollTop
		       var clientTop = root.clientTop || body.clientTop,
		           clientLeft = root.clientLeft || body.clientLeft,
		           scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
		           scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft)
		       // 把滚动距离加到left,top中去。
		       // IE一些版本中会自动为HTML元素加上2px的border，我们需要去掉它
		       // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
		       return {
		           top: box.top + scrollTop - clientTop,
		           left: box.left + scrollLeft - clientLeft
		       }
		   }
	
		   //生成avalon.fn.scrollLeft, avalon.fn.scrollTop方法
		   avalon.each({
		       scrollLeft: 'pageXOffset',
		       scrollTop: 'pageYOffset'
		   }, function (method, prop) {
		       avalon.fn[method] = function (val) {
		           var node = this[0] || {},
		               win = getWindow(node),
		               top = method === 'scrollTop'
		           if (!arguments.length) {
		               return win ? (prop in win) ? win[prop] : root[method] : node[method]
		           } else {
		               if (win) {
		                   win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
		               } else {
		                   node[method] = val
		               }
		           }
		       }
		   })
	
		   function getWindow(node) {
		       return node.window || node.defaultView || node.parentWindow || false
		   }
	
		   function getValType(elem) {
		       var ret = elem.tagName.toLowerCase()
		       return ret === 'input' && rcheckedType.test(elem.type) ? 'checked' : ret
		   }
		   var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
		   var valHooks = {
		       'option:get': avalon.msie ? function (node) {
		           //在IE11及W3C，如果没有指定value，那么node.value默认为node.text（存在trim作），但IE9-10则是取innerHTML(没trim操作)
		           //specified并不可靠，因此通过分析outerHTML判定用户有没有显示定义value
		           return roption.test(node.outerHTML) ? node.value : node.text.trim()
		       } : function (node) {
		           return node.value
		       },
		       'select:get': function (node, value) {
		           var option, options = node.options,
					index = node.selectedIndex,
					getter = valHooks['option:get'],
					one = node.type === 'select-one' || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ? max : one ? index : 0
		           for (; i < max; i++) {
		               option = options[i]
		               //IE6-9在reset后不会改变selected，需要改用i === index判定
		               //我们过滤所有disabled的option元素，但在safari5下，
		               //如果设置optgroup为disable，那么其所有孩子都disable
		               //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
		               if ((option.selected || i === index) && !option.disabled &&
						(!option.parentNode.disabled || option.parentNode.tagName !== 'OPTGROUP')
					) {
		                   value = getter(option)
		                   if (one) {
		                       return value
		                   }
		                   //收集所有selected值组成数组返回
		                   values.push(value)
		               }
		           }
		           return values
		       },
		       'select:set': function (node, values, optionSet) {
		           values = [].concat(values) //强制转换为数组
		           var getter = valHooks['option:get']
		           for (var i = 0, el; el = node.options[i++];) {
		               if ((el.selected = values.indexOf(getter(el)) > -1)) {
		                   optionSet = true
		               }
		           }
		           if (!optionSet) {
		               node.selectedIndex = -1
		           }
		       }
		   }
	
		   avalon.fn.val = function (value) {
		       var node = this[0]
		       if (node && node.nodeType === 1) {
		           var get = arguments.length === 0
		           var access = get ? ':get' : ':set'
		           var fn = valHooks[getValType(node) + access]
		           if (fn) {
		               var val = fn(node, value)
		           } else if (get) {
		               return (node.value || '').replace(/\r/g, '')
		           } else {
		               node.value = value
		           }
		       }
		       return get ? val : this
		   }
	
		   var rhtml = /<|&#?\w+;/
		   var htmlCache = new Cache(128)
		   var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig
	
		   avalon.parseHTML = function (html) {
		       var fragment = avalon.avalonFragment.cloneNode(false)
		       //处理非字符串
		       if (typeof html !== 'string') {
		           return fragment
		       }
		       //处理非HTML字符串
		       if (!rhtml.test(html)) {
		           return document.createTextNode(html)
		       }
	
		       html = html.replace(rxhtml, '<$1></$2>').trim()
		       var hasCache = htmlCache.get(html)
		       if (hasCache) {
		           return avalon.cloneNode(hasCache)
		       }
		       var vnodes = avalon.lexer(html)
		       for (var i = 0, el; el = vnodes[i++];) {
		           fragment.appendChild(avalon.vdom(el, 'toDOM'))
		       }
		       if (html.length < 1024) {
		           htmlCache.put(html, fragment)
		       }
		       return fragment
		   }
	
		   avalon.innerHTML = function (node, html) {
	
		       var parsed = this.parseHTML(html)
		       this.clearHTML(node).appendChild(parsed)
		   }
	
		   //https://github.com/karloespiritu/escapehtmlent/blob/master/index.js
		   avalon.unescapeHTML = function (html) {
		       return String(html)
				.replace(/&quot;/g, '"')
				.replace(/&#39;/g, '\'')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&amp;/g, '&')
		   }
	
	
	
		   avalon.clearHTML = function (node) {
		       node.textContent = ''
		       /* istanbul ignore next */
		       while (node.lastChild) {
		           node.removeChild(node.lastChild)
		       }
		       return node
		   }
	
		   //http://www.feiesoft.com/html/events.html
		   //http://segmentfault.com/q/1010000000687977/a-1020000000688757
		   var canBubbleUp = {
		       click: true,
		       dblclick: true,
		       keydown: true,
		       keypress: true,
		       keyup: true,
		       mousedown: true,
		       mousemove: true,
		       mouseup: true,
		       mouseover: true,
		       mouseout: true,
		       wheel: true,
		       mousewheel: true,
		       input: true,
		       change: true,
		       beforeinput: true,
		       compositionstart: true,
		       compositionupdate: true,
		       compositionend: true,
		       select: true,
		       //http://blog.csdn.net/lee_magnum/article/details/17761441
		       cut: true,
		       copy: true,
		       paste: true,
		       beforecut: true,
		       beforecopy: true,
		       beforepaste: true,
		       focusin: true,
		       focusout: true,
		       DOMFocusIn: true,
		       DOMFocusOut: true,
		       DOMActivate: true,
		       dragend: true,
		       datasetchanged: true
		   }
	
		   var hackSafari = avalon.modern && doc$1.ontouchstart
	
		   //添加fn.bind, fn.unbind, bind, unbind
		   avalon.fn.bind = function (type, fn, phase) {
		       if (this[0]) { //此方法不会链
		           return avalon.bind(this[0], type, fn, phase)
		       }
		   }
	
		   avalon.fn.unbind = function (type, fn, phase) {
		       if (this[0]) {
		           avalon.unbind(this[0], type, fn, phase)
		       }
		       return this
		   }
	
		   /*绑定事件*/
		   avalon.bind = function (elem, type, fn) {
		       if (elem.nodeType === 1) {
		           var value = elem.getAttribute('avalon-events') || ''
		           //如果是使用ms-on-*绑定的回调,其uuid格式为e12122324,
		           //如果是使用bind方法绑定的回调,其uuid格式为_12
		           var uuid = markID$1(fn)
		           var hook = eventHooks[type]
		           if (type === 'click' && hackSafari) {
		               elem.addEventListener('click', avalon.noop)
		           }
		           if (hook) {
		               type = hook.type || type
		               if (hook.fix) {
		                   fn = hook.fix(elem, fn)
		                   fn.uuid = uuid
		               }
		           }
		           var key = type + ':' + uuid
		           avalon.eventListeners[fn.uuid] = fn
		           if (value.indexOf(type + ':') === -1) {//同一种事件只绑定一次
		               if (canBubbleUp[type] || (avalon.modern && focusBlur[type])) {
		                   delegateEvent(type)
		               } else {
		                   avalon._nativeBind(elem, type, dispatch)
		               }
		           }
		           var keys = value.split(',')
		           if (keys[0] === '') {
		               keys.shift()
		           }
		           if (keys.indexOf(key) === -1) {
		               keys.push(key)
		               elem.setAttribute('avalon-events', keys.join(','))
		               //将令牌放进avalon-events属性中
		           }
	
		       } else {
		           avalon._nativeBind(elem, type, fn)
		       }
		       return fn //兼容之前的版本
		   }
	
		   avalon.unbind = function (elem, type, fn) {
		       if (elem.nodeType === 1) {
		           var value = elem.getAttribute('avalon-events') || ''
		           switch (arguments.length) {
		               case 1:
		                   avalon._nativeUnBind(elem, type, dispatch)
		                   elem.removeAttribute('avalon-events')
		                   break
		               case 2:
		                   value = value.split(',').filter(function (str) {
		                       return str.indexOf(type + ':') === -1
		                   }).join(',')
		                   elem.setAttribute('avalon-events', value)
		                   break
		               default:
		                   var search = type + ':' + fn.uuid
		                   value = value.split(',').filter(function (str) {
		                       return str !== search
		                   }).join(',')
		                   elem.setAttribute('avalon-events', value)
		                   delete avalon.eventListeners[fn.uuid]
		                   break
		           }
		       } else {
		           avalon._nativeUnBind(elem, type, fn)
		       }
		   }
	
		   var typeRegExp = {}
		   function collectHandlers(elem, type, handlers) {
		       var value = elem.getAttribute('avalon-events')
		       if (value && (elem.disabled !== true || type !== 'click')) {
		           var uuids = []
		           var reg = typeRegExp[type] || (typeRegExp[type] = new RegExp("\\b" + type + '\\:([^,\\s]+)', 'g'))
		           value.replace(reg, function (a, b) {
		               uuids.push(b)
		               return a
		           })
		           if (uuids.length) {
		               handlers.push({
		                   elem: elem,
		                   uuids: uuids
		               })
		           }
		       }
		       elem = elem.parentNode
		       var g = avalon.gestureEvents || {}
		       if (elem && elem.getAttribute && (canBubbleUp[type] || g[type])) {
		           collectHandlers(elem, type, handlers)
		       }
		   }
	
		   var rhandleHasVm = /^e/
		   var stopImmediate = false
		   function dispatch(event) {
		       event = new avEvent(event)
		       var type = event.type
		       var elem = event.target
		       var handlers = []
		       collectHandlers(elem, type, handlers)
		       var i = 0, j, uuid, handler
		       while ((handler = handlers[i++]) && !event.cancelBubble) {
		           var host = event.currentTarget = handler.elem
		           j = 0
		           while ((uuid = handler.uuids[j++])) {
		               if (stopImmediate) {
		                   stopImmediate = false
		                   break
		               }
		               var fn = avalon.eventListeners[uuid]
		               if (fn) {
		                   var vm = rhandleHasVm.test(uuid) ? handler.elem._ms_context_ : 0
		                   if (vm && vm.$hashcode === false) {
		                       return avalon.unbind(elem, type, fn)
		                   }
		                   var ret = fn.call(vm || elem, event, host._ms_local)
	
		                   if (ret === false) {
		                       event.preventDefault()
		                       event.stopPropagation()
		                   }
		               }
		           }
		       }
		   }
	
		   var focusBlur = {
		       focus: true,
		       blur: true
		   }
	
		   function delegateEvent(type) {
		       var value = root$1.getAttribute('delegate-events') || ''
		       if (value.indexOf(type) === -1) {
		           var arr = value.match(avalon.rword) || []
		           arr.push(type)
		           root$1.setAttribute('delegate-events', arr.join(','))
		           avalon._nativeBind(root$1, type, dispatch, !!focusBlur[type])
		       }
		   }
	
		   var rconstant = /^[A-Z_]+$/
		   function avEvent(event) {
		       if (event.originalEvent) {
		           return this
		       }
		       for (var i in event) {
		           if (!rconstant.test(i) && typeof event[i] !== 'function') {
		               this[i] = event[i]
		           }
		       }
		       if (!this.target) {
		           this.target = event.srcElement
		       }
		       var target = this.target
		       this.fixEvent()
		       this.timeStamp = new Date() - 0
		       this.originalEvent = event
		   }
	
		   avEvent.prototype = {
		       fixEvent: function () { },
		       preventDefault: function () {
		           var e = this.originalEvent || {}
		           e.returnValue = this.returnValue = false
		           if (e.preventDefault) {
		               e.preventDefault()
		           }
		       },
		       stopPropagation: function () {
		           var e = this.originalEvent || {}
		           e.cancelBubble = this.cancelBubble = true
		           if (e.stopPropagation) {
		               e.stopPropagation()
		           }
		       },
		       stopImmediatePropagation: function () {
		           stopImmediate = true;
		           this.stopPropagation()
		       },
		       toString: function () {
		           return '[object Event]'//#1619
		       }
		   }
	
	
		   //针对firefox, chrome修正mouseenter, mouseleave
		   /* istanbul ignore if */
		   if (!('onmouseenter' in root$1)) {
		       avalon.each({
		           mouseenter: 'mouseover',
		           mouseleave: 'mouseout'
		       }, function (origType, fixType) {
		           eventHooks[origType] = {
		               type: fixType,
		               fix: function (elem, fn) {
		                   return function (e) {
		                       var t = e.relatedTarget
		                       if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
		                           delete e.type
		                           e.type = origType
		                           return fn.apply(this, arguments)
		                       }
		                   }
		               }
		           }
		       })
		   }
		   //针对IE9+, w3c修正animationend
		   avalon.each({
		       AnimationEvent: 'animationend',
		       WebKitAnimationEvent: 'webkitAnimationEnd'
		   }, function (construct, fixType) {
		       if (win[construct] && !eventHooks.animationend) {
		           eventHooks.animationend = {
		               type: fixType
		           }
		       }
		   })
	
		   /* istanbul ignore if */
		   if (doc$1.onmousewheel === void 0) {
			/* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
			 firefox DOMMouseScroll detail 下3 上-3
			 firefox wheel detlaY 下3 上-3
			 IE9-11 wheel deltaY 下40 上-40
			 chrome wheel deltaY 下100 上-100 */
		       var fixWheelType = doc$1.onwheel !== void 0 ? 'wheel' : 'DOMMouseScroll'
		       var fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail'
		       eventHooks.mousewheel = {
		           type: fixWheelType,
		           fix: function (elem, fn) {
		               return function (e) {
		                   var delta = e[fixWheelDelta] > 0 ? -120 : 120
		                   e.wheelDelta = ~~elem._ms_wheel_ + delta
		                   elem._ms_wheel_ = e.wheelDeltaY = e.wheelDelta
	
		                   e.wheelDeltaX = 0
		                   if (Object.defineProperty) {
		                       Object.defineProperty(e, 'type', {
		                           value: 'mousewheel'
		                       })
		                   }
		                   return fn.apply(this, arguments)
		               }
		           }
		       }
		   }
	
		   if (!W3C) {
		       delete canBubbleUp.change
		       delete canBubbleUp.select
		   }
	
	
		   avalon._nativeBind = W3C ? function (el, type, fn, capture) {
		       el.addEventListener(type, fn, capture)
		   } : function (el, type, fn) {
		       el.attachEvent('on' + type, fn)
		   }
	
		   avalon._nativeUnBind = W3C ? function (el, type, fn) {
		       el.removeEventListener(type, fn)
		   } : function (el, type, fn) {
		       el.detachEvent('on' + type, fn)
		   }
	
		   avalon.fireDom = function (elem, type, opts) {
		       /* istanbul ignore else */
		       if (doc$1.createEvent) {
		           var hackEvent = doc$1.createEvent('Events')
		           hackEvent.initEvent(type, true, true, opts)
		           avalon.shadowCopy(hackEvent, opts)
		           elem.dispatchEvent(hackEvent)
		       } else if (root$1.contains(elem)) {//IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
		           hackEvent = doc$1.createEventObject()
		           avalon.shadowCopy(hackEvent, opts)
		           elem.fireEvent('on' + type, hackEvent)
		       }
		   }
	
		   var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/
		   avEvent.prototype.fixEvent = function () {
		       if (this.which == null && event.type.indexOf('key') === 0) {
		           this.which = event.charCode != null ? event.charCode : event.keyCode
		       } else if (rmouseEvent.test(event.type) && !('pageX' in this)) {
		           var DOC = target.ownerDocument || doc$1
		           var box = DOC.compatMode === 'BackCompat' ? DOC.body : DOC.documentElement
		           this.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
		           this.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
		           this.wheelDeltaY = this.wheelDelta
		           this.wheelDeltaX = 0
		       }
		   }
	
		   //针对IE6-8修正input
		   /* istanbul ignore if */
		   if (!('oninput' in doc$1.createElement('input'))) {
		       eventHooks.input = {
		           type: 'propertychange',
		           fix: function (elem, fn) {
		               return function (e) {
		                   if (e.propertyName === 'value') {
		                       e.type = 'input'
		                       return fn.apply(this, arguments)
		                   }
		               }
		           }
		       }
		   }
	
		   var voidTag = {
			area: 1,
			base: 1,
			basefont: 1,
			bgsound: 1,
			br: 1,
			col: 1,
			command: 1,
			embed: 1,
			frame: 1,
			hr: 1,
			img: 1,
			input: 1,
			keygen: 1,
			link: 1,
			meta: 1,
			param: 1,
			source: 1,
			track: 1,
			wbr: 1
		   }
	
		   function markNode(node) {
		       var ret = {}
		       var type = node.nodeName.toLowerCase()
		       ret.nodeName = type
		       ret.dom = node
		       if (type.charAt(0) === '#') {//2, 8
		           var nodeValue = node.nodeValue
		           if (/\S/.test(nodeValue)) {
		               ret.nodeValue = nodeValue
		           }
		       } else {
		           var props = markProps(node)
		           if (voidTag[type]) {
		               ret.isVoidTag = true
		           }
	
		           ret.children = markChildren(node)
	
		           if (props) {
		               if ('selectedIndex' in props) {
		                   node.selectedIndex = props.selectedIndex
		                   delete props.selectedIndex
		               }
		               ret.props = props
		           }
		       }
		       return ret
		   }
	
		   var rformElement = /input|textarea|select/i
		   var rcolon = /^\:/
		   function markProps(node) {
		       var attrs = node.attributes, ret = {}
		       for (var i = 0, n = attrs.length; i < n; i++) {
		           var attr = attrs[i]
		           if (attr.specified) {
		               var name = attr.name
		               if (name.charAt(0) === ':') {
		                   name = name.replace(rcolon, 'ms-')
		               }
		               ret[name] = attr.value
		           }
		       }
		       if (rformElement.test(node.nodeName)) {
		           ret.type = node.type
		       }
		       var style = node.style.cssText
		       if (style) {
		           ret.style = style
		       }
		       //类名 = 去重(静态类名+动态类名+ hover类名? + active类名)
		       if (ret.type === 'select-one') {
		           ret.selectedIndex = node.selectedIndex
		       }
		       if (isEmpty(ret)) {
		           return null
		       }
		       return ret
		   }
	
		   function isEmpty(a) {
		       for (var i in a) {
		           return false
		       }
		       return true
		   }
	
	
		   //将当前元素的孩子转换成VDOM
		   function markChildren(parent) {
		       var arr = []
		       var node = parent.firstChild
		       if (!node) {
		           return arr
		       }
		       do {
		           var next = node.nextSibling
		           switch (node.nodeType) {
		               case 1:
		                   var a = node.getAttributeNode(':for') || node.getAttributeNode('ms-for')
	
		                   if (a) {
		                       var start = document.createComment('ms-for:' + a.value)
		                       var end = document.createComment('ms-for-end:')
		                       node.removeAttributeNode(a)
	
		                       if (parent) {
		                           parent.insertBefore(end, node.nextSibling)
		                           parent.insertBefore(start, node)
		                       }
		                       arr.push(markNode(start), markNode(node), markNode(end))
	
		                   } else {
		                       arr.push(markNode(node))
		                   }
		                   break
		               case 3:
		                   if (/\S/.test(node.nodeValue)) {
		                       arr.push(markNode(node))
		                   } else {
		                       var p = node.parentNode
		                       if (p) {
		                           p.removeChild(node)
		                       }
		                   }
		                   break
		               case 8:
		                   arr.push(markNode(node))
	
		           }
		           node = next
	
		       } while (node)
		       return arr
		   }
	
		   avalon.scan = function (a) {
			/* istanbul ignore if */
			if (!a || !a.nodeType) {
				avalon.warn('[avalon.scan] first argument must be element , documentFragment, or document')
				return
			}
			scanNodes([a])
		   }
		   avalon._hydrate = markNode
		   var onceWarn = true //只警告一次
	
		   function scanNodes(nodes) {
			for (var i = 0, elem; elem = nodes[i++];) {
				if (elem.nodeType === 1) {
					var $id = getController(elem)
	
					var vm = avalon.vmodels[$id]
					if (vm && !vm.$element) {
						vm.$element = elem
						/* istanbul ignore if */
						if (avalon.serverTemplates && avalon.serverTemplates[$id]) {
							var tmpl = avalon.serverTemplates[$id]
							var oldTree = avalon.speedUp(avalon.lexer(tmpl))
							var render = avalon.render(oldTree)
							var vtree = render(vm)
							var dom = avalon.vdom(vtree[0], 'toDOM')
							vm.$element = dom
							dom.vtree = vtree
							vm.$render = render
							elem.parentNode.replaceChild(dom, elem)
							avalon.diff(vtree, vtree)
							continue
						}
	
						//IE6-8下元素的outerHTML前面会有空白
						//第一次扫描就清空所有空白节点,并生成最初的vtree
						var vtree = [markNode(elem)]
						var now = new Date()
						elem.vtree = avalon.speedUp(vtree)
	
						var now2 = new Date()
						onceWarn && avalon.log('构建虚拟DOM耗时', now2 - now, 'ms')
	
						vm.$render = avalon.render(elem.vtree)
						avalon.scopes[vm.$id] = {
							vmodel: vm,
							local: {},
							isTemp: true
						}
						var now3 = new Date()
						if (onceWarn && (now3 - now2 > 100)) {
							avalon.log('构建当前vm的$render方法耗时 ', now3 - now2, 'ms\n',
								'如果此时间太长,达100ms以上\n',
								'建议将当前ms-controller拆分成多个ms-controller,减少每个vm管辖的区域')
							onceWarn = false
						}
						avalon.rerenderStart = now3
						avalon.batch($id)
	
					} else if (!$id) {
						scanNodes(elem.childNodes)
					}
				}
			}
		   }
	
		   function getController(a) {
			return a.getAttribute('ms-controller') ||
				a.getAttribute(':controller')
		   }
	
		   var readyList = [];
		   var isReady;
		   var fireReady = function (fn) {
		       isReady = true
	
		       while (fn = readyList.shift()) {
		           fn(avalon)
		       }
		   }
		   avalon.ready = function (fn) {
		       if (!isReady) {
		           readyList.push(fn)
		       } else {
		           fn(avalon)
		       }
		   }
	
		   avalon.ready(function () {
		       avalon.scan(doc$1.body)
		   })
	
		   new function () {
		       if (!avalon.inBrowser)
		           return
	
		       function doScrollCheck() {
		           try { //IE下通过doScrollCheck检测DOM树是否建完
		               root$1.doScroll('left')
		               fireReady()
		           } catch (e) {
		               setTimeout(doScrollCheck)
		           }
		       }
	
		       if (doc$1.readyState === 'complete') {
		           setTimeout(fireReady) //如果在domReady之外加载
		       } else if (doc$1.addEventListener) {
		           doc$1.addEventListener('DOMContentLoaded', fireReady)
		       } else if (doc$1.attachEvent) {
		           doc$1.attachEvent('onreadystatechange', function () {
		               if (doc$1.readyState === 'complete') {
		                   fireReady()
		               }
		           })
		           try {
		               var isTop = win.frameElement === null
		           } catch (e) {
		           }
		           if (root$1.doScroll && isTop && win.external) {//fix IE iframe BUG
		               doScrollCheck()
		           }
		       }
	
		       avalon.bind(win, 'load', fireReady)
		   }
	
		/**
		 * 这是一个非常重要的内部对象，构建一个vm用到的内部方法都将放在它上面
		 * 然后由它构建4大工厂 
		 */
		   var warlords = {}
	
		/**
		 * 调整到正确的VM
		 */
		   function adjustVm(vm, expr) {
		       var toppath = expr.split(".")[0], other
		       try {
		           if (vm.hasOwnProperty(toppath)) {
		               if (vm.$accessors) {
		                   other = vm.$accessors[toppath].get.heirloom.__vmodel__
		               } else {
		                   other = Object.getOwnPropertyDescriptor(vm, toppath).get.heirloom.__vmodel__
		               }
	
		           }
		       } catch (e) {
		       }
		       return other || vm
		   }
	
	
		/**
		 * 添加$watch回调
		 */
		   function $watch(expr, callback) {
		       var fuzzy = expr.indexOf('.*') > 0 || expr === '*'
		       var vm = fuzzy ? this : $watch.adjust(this, expr)
		       var hive = this.$events
		       var list = hive[expr] || (hive[expr] = [])
		       if (fuzzy) {
		           list.reg = list.reg || toRegExp(expr)
		       }
		       addFuzzy(fuzzy, hive, expr)
		       if (vm !== this) {
		           addFuzzy(fuzzy, this.$events, expr)
		       }
	
		       avalon.Array.ensure(list, callback)
	
		       return function () {
		           avalon.Array.remove(list, callback)
		       }
		   }
	
		   $watch.adjust = adjustVm
		/**
		 * $fire 方法的内部实现
		 * 
		 * @param {Array} list 订阅者数组
		 * @param {Component} vm
		 * @param {String} path 监听属性名或路径
		 * @param {Any} a 当前值 
		 * @param {Any} b 过去值
		 * @param {Number} i 如果抛错,让下一个继续执行
		 * @returns {undefined}
		 */
		   function $emit(list, vm, path, a, b, i) {
		       if (list && list.length) {
		           try {
		               for (i = i || list.length - 1; i >= 0; i--) {
		                   var callback = list[i]
		                   callback.call(vm, a, b, path)
		               }
		           } catch (e) {
		               if (i - 1 > 0)
		                   $emit(list, vm, path, a, b, i - 1)
		               avalon.log(e, path)
		           }
	
		       }
		   }
	
		   function toRegExp(expr) {
		       var arr = expr.split('.')
		       return new RegExp("^" + arr.map(function (el) {
		           return el === '*' ? '(?:[^.]+)' : el
		       }).join('\\.') + '$', 'i')
		   }
	
		   function addFuzzy(add, obj, expr) {
		       if (add) {
		           if (obj.__fuzzy__) {
		               if (obj.__fuzzy__.indexOf(',' + expr) === -1) {
		                   obj.__fuzzy__ += ',' + expr
		               }
		           } else {
		               obj.__fuzzy__ = expr
		           }
		       }
		   }
	
		   var $$skipArray$1 = avalon.oneObject('$id,$render,$track,$element,$watch,$fire,$events,$skipArray,$accessors,$hashcode,$run,$wait,__proxy__,__data__,__const__')
	
		   function notifySize(array, size) {
		       if (array.length !== size) {
		           array.notify('length', array.length, size, true)
		       }
		   }
	
		   var __array__ = {
		       set: function (index, val) {
		           if (((index >>> 0) === index) && this[index] !== val) {
		               if (index > this.length) {
		                   throw Error(index + 'set方法的第一个参数不能大于原数组长度')
		               }
		               this.splice(index, 1, val)
		           }
		       },
		       contains: function (el) { //判定是否包含
		           return this.indexOf(el) !== -1
		       },
		       ensure: function (el) {
		           if (!this.contains(el)) { //只有不存在才push
		               this.push(el)
		           }
		           return this
		       },
		       pushArray: function (arr) {
		           return this.push.apply(this, arr)
		       },
		       remove: function (el) { //移除第一个等于给定值的元素
		           return this.removeAt(this.indexOf(el))
		       },
		       removeAt: function (index) { //移除指定索引上的元素
		           if ((index >>> 0) === index) {
		               return this.splice(index, 1)
		           }
		           return []
		       },
		       clear: function () {
		           this.removeAll()
		           return this
		       }
		   }
	
	
	
		   var ap$1 = Array.prototype
		   var _splice = ap$1.splice
		   __array__.removeAll = function (all) { //移除N个元素
		       var size = this.length
		       if (Array.isArray(all)) {
		           for (var i = this.length - 1; i >= 0; i--) {
		               if (all.indexOf(this[i]) !== -1) {
		                   _splice.call(this, i, 1)
		               }
		           }
		       } else if (typeof all === 'function') {
		           for (i = this.length - 1; i >= 0; i--) {
		               var el = this[i]
		               if (all(el, i)) {
		                   _splice.call(this, i, 1)
		               }
		           }
		       } else {
		           _splice.call(this, 0, this.length)
		       }
		       warlords.toModel(this)
		       notifySize(this, size)
		       this.notify()
		   }
	
	
		   var __method__ = ['push', 'pop', 'shift', 'unshift', 'splice']
	
		   __method__.forEach(function (method) {
		       var original = ap$1[method]
		       __array__[method] = function (a, b) {
		           // 继续尝试劫持数组元素的属性
		           var args = [], size = this.length
	
		           if (method === 'splice' && Object(this[0]) === this[0]) {
		               var old = this.slice(a, b)
		               var neo = ap$1.slice.call(arguments, 2)
		               var args = [a, b]
		               for (var j = 0, jn = neo.length; j < jn; j++) {
		                   var item = old[j]
	
		                   args[j + 2] = warlords.modelAdaptor(neo[j], item, (item && item.$events || {}), {
		                       id: this.$id + '.*',
		                       master: true
		                   })
		               }
	
		           } else {
		               for (var i = 0, n = arguments.length; i < n; i++) {
		                   args[i] = warlords.modelAdaptor(arguments[i], 0, {}, {
		                       id: this.$id + '.*',
		                       master: true
		                   })
		               }
		           }
		           var result = original.apply(this, args)
		           warlords.toModel(this)
		           notifySize(this, size)
		           this.notify()
		           return result
		       }
		   })
	
		   'sort,reverse'.replace(/\w+/g, function (method) {
		       __array__[method] = function () {
		           ap$1[method].apply(this, arguments)
		           warlords.toModel(this)
		           this.notify()
		           return this
		       }
		   })
	
		   var rskip = /function|window|date|regexp|element/i
		/**
		 * 判定此属性是否能转换为访问器属性
		 * 不能以$开头， 不位于skipArray数组内，
		 * 类型不能为函数，window, date, regexp, 元素
		 * ？？？
		 * 
		 * 以后将反向操作 ，要求类型只能是array, object, undefined, null, boolean, number, string
		 */
		   function isSkip$1(key, value, skipArray) {
		       // 判定此属性能否转换访问器
		       return key.charAt(0) === '$' ||
				skipArray[key] ||
				(rskip.test(avalon.type(value))) ||
				(value && value.nodeName && value.nodeType > 0)
		   }
	
		   warlords.isSkip = isSkip$1
	
		/**
		 * 将属性值再进行转换
		 */
		   function modelAdaptor(definition, old, heirloom, options) {
		       var type = avalon.type(definition)
		       switch (type) {
		           case 'array':
					return warlords.arrayFactory(definition, old, heirloom, options)
		           case 'object':
					if (old && old.$id) {
		                   ++avalon.suspendUpdate
		                   //1.5带来的优化方案
		                   if (old.$track !== Object.keys(definition).sort().join(';;')) {
		                       var vm = warlords.slaveFactory(old, definition, heirloom, options)
		                   } else {
		                       vm = old
		                   }
		                   for (var i in definition) {
		                       if ($$skipArray$1[i])
		                           continue
		                       vm[i] = definition[i]
		                   }
		                   --avalon.suspendUpdate
		                   return vm
		               } else {
		                   vm = warlords.masterFactory(definition, heirloom, options)
		                   return vm
		               }
				default:
					return definition
		       }
		   }
	
		   warlords.modelAdaptor = modelAdaptor
	
		/**
		 * 生成访问器属性的定义对象
		 * 依赖于
		 * $emit
		 * modelAdaptor
		 * emitWidget
		 * emitArray
		 * emitWildcard
		 * batchUpdateView
		 * 
		 */
		   function makeAccessor$1(sid, spath, heirloom) {
		       var old = NaN
		       function get() {
		           return old
		       }
		       get.heirloom = heirloom
		       return {
		           get: get,
		           set: function (val) {
		               if (old === val) {
		                   return
		               }
		               var older = old
		               if (older && older.$model) {
						older = older.$model
		               }
		               var vm = heirloom.__vmodel__
		               if (val && typeof val === 'object') {
		                   val = modelAdaptor(val, old, heirloom, {
		                       pathname: spath,
		                       id: sid
		                   })
		               }
		               old = val
		               if (this.$hashcode && vm) {
		                   vm.$events.$$dirty$$ = true
		                   if (vm.$events.$$wait$$)
		                       return
		                   //★★确保切换到新的events中(这个events可能是来自oldProxy)               
		                   if (heirloom !== vm.$events) {
		                       get.heirloom = vm.$events
		                   }
	
		                   //如果这个属性是组件配置对象中的属性,那么它需要触发组件的回调
		                   emitWidget(get.$decompose, spath, val, older)
		                   //触发普通属性的回调
		                   if (spath.indexOf('*') === -1) {
		                       $emit(get.heirloom[spath], vm, spath, val, older)
		                   }
		                   //如果这个属性是数组元素上的属性
		                   emitArray(sid + '', vm, spath, val, older)
		                   //如果这个属性存在通配符
		                   emitWildcard(get.heirloom, vm, spath, val, older)
		                   vm.$events.$$dirty$$ = false
		                   batchUpdateView(vm.$id)
		               }
		           },
		           enumerable: true,
		           configurable: true
		       }
		   }
	
		   warlords.makeAccessor = makeAccessor$1
	
		   function batchUpdateView(id) {
		       avalon.rerenderStart = new Date
		       var dotIndex = id.indexOf('.')
		       if (dotIndex > 0) {
		           avalon.batch(id.slice(0, dotIndex))
		       } else {
		           avalon.batch(id)
		       }
		   }
	
	
		   avalon.define = function (definition) {
		       var $id = definition.$id
		       if (!$id) {
		           avalon.warn('vm.$id must be specified')
		       }
		       if (avalon.vmodels[$id]) {
		           throw Error('error:[' + $id + '] had defined!')
		       }
		       var vm = warlords.masterFactory(definition, {}, {
		           pathname: '',
		           id: $id,
		           master: true
		       })
		       return avalon.vmodels[$id] = vm
		   }
	
	
		   function arrayFactory(array, old, heirloom, options) {
		       if (old && old.splice) {
		           var args = [0, old.length].concat(array)
		           ++avalon.suspendUpdate
		           avalon.callArray = options.pathname
		           old.splice.apply(old, args)
		           --avalon.suspendUpdate
		           return old
		       } else {
		           for (var i in __array__) {
		               array[i] = __array__[i]
		           }
	
		           array.notify = function (a, b, c, d) {
		               var vm = heirloom.__vmodel__
		               if (vm) {
		                   var path = a === null || a === void 0 ?
							options.pathname :
							options.pathname + '.' + a
		                   vm.$fire(path, b, c)
		                   if (!d && !heirloom.$$wait$$ && !avalon.suspendUpdate) {
		                       avalon.callArray = path
		                       batchUpdateView(vm.$id)
		                       delete avalon.callArray
		                   }
		               }
		           }
	
		           var hashcode = avalon.makeHashCode('$')
		           options.array = true
		           options.hashcode = hashcode
		           options.id = options.id || hashcode
		           warlords.initViewModel(array, heirloom, {}, {}, options)
	
		           for (var j = 0, n = array.length; j < n; j++) {
		               array[j] = modelAdaptor(array[j], 0, {}, {
		                   id: array.$id + '.*',
		                   master: true
		               })
		           }
		           return array
		       }
		   }
	
		   warlords.arrayFactory = arrayFactory
	
		   //======inner start
		   var rtopsub = /([^.]+)\.(.+)/
		   function emitArray(sid, vm, spath, val, older) {
		       if (sid.indexOf('.*.') > 0) {
		           var arr = sid.match(rtopsub)
		           var top = avalon.vmodels[arr[1]]
		           if (top) {
		               var path = arr[2]
		               $emit(top.$events[path], vm, spath, val, older)
		           }
		       }
		   }
	
		   function emitWidget(whole, spath, val, older) {
		       if (whole && whole[spath]) {
		           var wvm = whole[spath]
		           if (!wvm.$hashcode) {
		               delete whole[spath]
		           } else {
		               var wpath = spath.replace(/^[^.]+\./, '')
		               if (wpath !== spath) {
		                   $emit(wvm.$events[wpath], wvm, wpath, val, older)
		               }
		           }
		       }
		   }
	
		   function emitWildcard(obj, vm, spath, val, older) {
		       if (obj.__fuzzy__) {
		           obj.__fuzzy__.replace(avalon.rword, function (expr) {
		               var list = obj[expr]
		               var reg = list.reg
		               if (reg && reg.test(spath)) {
		                   $emit(list, vm, spath, val, older)
		               }
		               return expr
		           })
		       }
		   }
	
		   //======inner end
	
		   warlords.$$skipArray = $$skipArray$1
		   //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
		   //标准浏览器使用__defineGetter__, __defineSetter__实现
		   var canHideProperty = true
		   try {
		       Object.defineProperty({}, '_', {
		           value: 'x'
		       })
		   } catch (e) {
		       /* istanbul ignore next*/
		       canHideProperty = false
		   }
	
		   warlords.canHideProperty = canHideProperty
	
		   function toJson(val) {
		       switch (avalon.type(val)) {
		           case 'array':
		               var array = []
		               for (var i = 0; i < val.length; i++) {
		                   array[i] = toJson(val[i])
		               }
		               return array
		           case 'object':
		               var obj = {}
		               for (i in val) {
		                   if (i === '__proxy__' || i === '__data__' || i === '__const__')
		                       continue
		                   if (val.hasOwnProperty(i)) {
		                       var value = val[i]
		                       obj[i] = value && value.nodeType ? value : toJson(value)
		                   }
		               }
		               return obj
		           default:
		               return val
		       }
		   }
	
		   warlords.toJson = toJson
		   warlords.toModel = function (obj) {
		       if (!avalon.modern) {
		           obj.$model = toJson(obj)
		       }
		   }
	
		   function hideProperty(host, name, value) {
		       if (canHideProperty) {
		           Object.defineProperty(host, name, {
		               value: value,
		               writable: true,
		               enumerable: false,
		               configurable: true
		           })
		       } else {
		           host[name] = value
		       }
		   }
	
		   warlords.hideProperty = hideProperty
	
		   var modelAccessor$1 = {
		       get: function () {
		           return toJson(this)
		       },
		       set: avalon.noop,
		       enumerable: false,
		       configurable: true
		   }
	
		   warlords.modelAccessor = modelAccessor$1
	
		   function initViewModel$1($vmodel, heirloom, keys, accessors, options) {
		       if (options.array) {
		           if (avalon.modern) {
		               Object.defineProperty($vmodel, '$model', modelAccessor$1)
		           } else {
		               $vmodel.$model = toJson($vmodel)
		           }
		       } else {
		           hideProperty($vmodel, '$accessors', accessors)
		           hideProperty($vmodel, 'hasOwnProperty', function (key) {
		               return keys[key] === true
		           })
		           hideProperty($vmodel, '$track', Object.keys(keys).sort().join(';;'))
		       }
		       hideProperty($vmodel, '$id', options.id)
		       hideProperty($vmodel, '$hashcode', options.hashcode)
		       if (options.master === true) {
		           hideProperty($vmodel, '$run', function () {
		               run.call($vmodel)
		           })
		           hideProperty($vmodel, '$wait', function () {
		               wait.call($vmodel)
		           })
		           hideProperty($vmodel, '$element', null)
		           hideProperty($vmodel, '$render', 0)
		           heirloom.__vmodel__ = $vmodel
		           hideProperty($vmodel, '$events', heirloom)
		           hideProperty($vmodel, '$watch', function () {
		               return $watch.apply($vmodel, arguments)
		           })
		           hideProperty($vmodel, '$fire', function (expr, a, b) {
		               var list = $vmodel.$events[expr]
		               $emit(list, $vmodel, expr, a, b)
		           })
		       }
		   }
	
		   warlords.initViewModel = initViewModel$1
	
		   function wait() {
		       this.$events.$$wait$$ = true
		   }
	
		   function run() {
		       var host = this.$events
		       delete host.$$wait$$
		       if (host.$$dirty$$) {
		           delete host.$$dirty$$
		           avalon.rerenderStart = new Date
		           var id = this.$id
		           var dotIndex = id.indexOf('.')
		           if (dotIndex > 0) {
		               avalon.batch(id.slice(0, dotIndex))
		           } else {
		               avalon.batch(id)
		           }
		       }
		   }
	
		   var defineProperties = Object.defineProperties
		   var defineProperty
	
		   var timeBucket = new Date() - 0
		   /* istanbul ignore if*/
		   if (!canHideProperty) {
		       if ('__defineGetter__' in avalon) {
		           defineProperty = function (obj, prop, desc) {
		               if ('value' in desc) {
		                   obj[prop] = desc.value
		               }
		               if ('get' in desc) {
		                   obj.__defineGetter__(prop, desc.get)
		               }
		               if ('set' in desc) {
		                   obj.__defineSetter__(prop, desc.set)
		               }
		               return obj
		           }
		           defineProperties = function (obj, descs) {
		               for (var prop in descs) {
		                   if (descs.hasOwnProperty(prop)) {
		                       defineProperty(obj, prop, descs[prop])
		                   }
		               }
		               return obj
		           }
		       }
		       /* istanbul ignore if*/
		       if (avalon.msie < 9) {
		           var VBClassPool = {}
		           window.execScript([// jshint ignore:line
		               'Function parseVB(code)',
		               '\tExecuteGlobal(code)',
		               'End Function' //转换一段文本为VB代码
		           ].join('\n'), 'VBScript');
	
		           var VBMediator = function (instance, accessors, name, value) {// jshint ignore:line
		               var accessor = accessors[name]
		               if (arguments.length === 4) {
		                   accessor.set.call(instance, value)
		               } else {
		                   return accessor.get.call(instance)
		               }
		           }
		           defineProperties = function (name, accessors, properties) {
		               // jshint ignore:line
		               var buffer = []
		               buffer.push(
		                   '\r\n\tPrivate [__data__], [__proxy__]',
		                   '\tPublic Default Function [__const__](d' + timeBucket + ', p' + timeBucket + ')',
		                   '\t\tSet [__data__] = d' + timeBucket + ': set [__proxy__] = p' + timeBucket,
		                   '\t\tSet [__const__] = Me', //链式调用
		                   '\tEnd Function')
		               //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
		               var uniq = {
		                   __proxy__: true,
		                   __data__: true,
		                   __const__: true
		               }
	
		               //添加访问器属性 
		               for (name in accessors) {
		                   if (uniq[name] || $$skipArray$1[name]) {
		                       continue
		                   }
		                   uniq[name] = true
		                   buffer.push(
		                       //由于不知对方会传入什么,因此set, let都用上
		                       '\tPublic Property Let [' + name + '](val' + timeBucket + ')', //setter
		                       '\t\tCall [__proxy__](Me,[__data__], "' + name + '", val' + timeBucket + ')',
		                       '\tEnd Property',
		                       '\tPublic Property Set [' + name + '](val' + timeBucket + ')', //setter
		                       '\t\tCall [__proxy__](Me,[__data__], "' + name + '", val' + timeBucket + ')',
		                       '\tEnd Property',
		                       '\tPublic Property Get [' + name + ']', //getter
		                       '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
		                       '\t\tSet[' + name + '] = [__proxy__](Me,[__data__],"' + name + '")',
		                       '\tIf Err.Number <> 0 Then',
		                       '\t\t[' + name + '] = [__proxy__](Me,[__data__],"' + name + '")',
		                       '\tEnd If',
		                       '\tOn Error Goto 0',
		                       '\tEnd Property')
	
		               }
		               for (name in properties) {
		                   if (uniq[name] || $$skipArray$1[name]) {
		                       continue
		                   }
		                   uniq[name] = true
		                   buffer.push('\tPublic [' + name + ']')
		               }
		               for (name in $$skipArray$1) {
		                   if (!uniq[name]) {
		                       buffer.push('\tPublic [' + name + ']')
		                   }
		               }
		               buffer.push('\tPublic [' + 'hasOwnProperty' + ']')
		               buffer.push('End Class')
		               var body = buffer.join('\r\n')
		               var className = VBClassPool[body]
		               if (!className) {
		                   className = avalon.makeHashCode('VBClass')
		                   window.parseVB('Class ' + className + body)
		                   window.parseVB([
		                       'Function ' + className + 'Factory(a, b)', //创建实例并传入两个关键的参数
		                       '\tDim o',
		                       '\tSet o = (New ' + className + ')(a, b)',
		                       '\tSet ' + className + 'Factory = o',
		                       'End Function'
		                   ].join('\r\n'))
		                   VBClassPool[body] = className
		               }
		               var ret = window[className + 'Factory'](accessors, VBMediator) //得到其产品
		               return ret //得到其产品
		           }
		       }
		   }
	
		   warlords.createViewModel = defineProperties
		/**
		 * 
		 * 
		 * 在routes.php中进行路由设置，；
		作为访问的统一入口，是控制器的统一调度；
		没有配置路由，就没有正确地访问路径；
		路由需要自己规定一定的规则，方便自己查看、使用、理解；
	
		必用参数
		Route::get('/blog/{name}',function($name){
			return $name; // 返回name显示
		});
		即除了 /blog/{name}的路由类型，都不能进来
	
		可选参数
		Route::get('/blog/{name?}',function($name = 'name'){
			return $name; // 返回name显示,如果没设置就取默认值
		});
	
		正则参数
		正则可以更灵活些，匹配更多需求。
		Route::get('/blog/{id?}',function($id="1"){
			return "{$id}";//输出blog的ID，
		})->where('name','^\d+$');//正则匹配为只能是数字，不然将无法找到路由；
	
		https://segmentfault.com/a/1190000004186135
		 */
	
		   var isSkip = warlords.isSkip
		   var $$skipArray = warlords.$$skipArray
		   if (warlords.canHideProperty) {
		       delete $$skipArray.$accessors
		       delete $$skipArray.__data__
		       delete $$skipArray.__proxy__
		       delete $$skipArray.__const__
		   }
	
		   var makeAccessor = warlords.makeAccessor
		   var modelAccessor = warlords.modelAccessor
		   var createViewModel = warlords.createViewModel
		   var initViewModel = warlords.initViewModel
	
		   var makeHashCode = avalon.makeHashCode
	
	
		   //一个vm总是为Observer的实例
		   function Observer() {
		   }
	
		   function masterFactory(definition, heirloom, options) {
	
		       var $skipArray = {}
		       if (definition.$skipArray) {//收集所有不可监听属性
		           $skipArray = avalon.oneObject(definition.$skipArray)
		           delete definition.$skipArray
		       }
	
		       var keys = {}
		       options = options || {}
		       heirloom = heirloom || {}
		       var accessors = {}
		       var hashcode = makeHashCode('$')
		       var pathname = options.pathname || ''
		       options.id = options.id || hashcode
		       options.hashcode = options.hashcode || hashcode
		       var key, sid, spath
		       for (key in definition) {
		           if ($$skipArray[key])
		               continue
		           var val = keys[key] = definition[key]
		           if (!isSkip(key, val, $skipArray)) {
		               sid = options.id + '.' + key
		               spath = pathname ? pathname + '.' + key : key
		               accessors[key] = makeAccessor(sid, spath, heirloom)
		           }
		       }
	
		       accessors.$model = modelAccessor
		       var $vmodel = new Observer()
		       $vmodel = createViewModel($vmodel, accessors, definition)
	
		       for (key in keys) {
		           //对普通监控属性或访问器属性进行赋值
		           $vmodel[key] = keys[key]
	
		           //删除系统属性
		           if (key in $skipArray) {
		               delete keys[key]
		           } else {
		               keys[key] = true
		           }
		       }
		       initViewModel($vmodel, heirloom, keys, accessors, options)
	
		       return $vmodel
		   }
	
		   warlords.masterFactory = masterFactory
		   var empty = {}
		   function slaveFactory(before, after, heirloom, options) {
		       var keys = {}
		       var skips = {}
		       var accessors = {}
		       heirloom = heirloom || {}
		       var pathname = options.pathname
		       var resue = before.$accessors || {}
		       var key, sid, spath
		       for (key in after) {
		           if ($$skipArray[key])
		               continue
		           keys[key] = true//包括可监控与不可监控的
		           if (!isSkip(key, after[key], empty)) {
		               if (resue[key]) {
		                   accessors[key] = resue[key]
		               } else {
		                   sid = options.id + '.' + key
		                   spath = pathname ? pathname + '.' + key : key
		                   accessors[key] = makeAccessor(sid, spath, heirloom)
		               }
		           } else {
		               skips[key] = after[key]
		               delete after[key]
		           }
		       }
	
		       options.hashcode = before.$hashcode || makeHashCode('$')
		       accessors.$model = modelAccessor
		       var $vmodel = new Observer()
		       $vmodel = createViewModel($vmodel, accessors, skips)
	
		       for (key in skips) {
		           $vmodel[key] = skips[key]
		       }
	
		       initViewModel($vmodel, heirloom, keys, accessors, options)
	
		       return $vmodel
		   }
	
		   warlords.slaveFactory = slaveFactory
	
		   function mediatorFactory(before, after) {
		       var keys = {}, key
		       var accessors = {}//新vm的访问器
		       var unresolve = {}//需要转换的属性集合
		       var heirloom = {}
		       var arr = avalon.slice(arguments)
		       var $skipArray = {}
		       var isWidget = typeof this === 'function' && this.isWidget
		       var config
		       var configName
		       for (var i = 0; i < arr.length; i++) {
		           var obj = arr[i]
		           //收集所有键值对及访问器属性
		           var $accessors = obj.$accessors
		           for (var key in obj) {
		               if (!obj.hasOwnProperty(key)) {
		                   continue
		               }
		               var cur = obj[key]
		               if (key === '$skipArray') {//处理$skipArray
		                   if (Array.isArray(cur)) {
		                       cur.forEach(function (el) {
		                           $skipArray[el] = 1
		                       })
		                   }
		                   continue
		               }
	
		               if (isWidget && arr.indexOf(cur) !== -1) {//处理配置对象
		                   config = cur
		                   configName = key
		                   continue
		               }
	
		               keys[key] = cur
		               if (accessors[key] && avalon.isObject(cur)) {//处理子vm
		                   delete accessors[key]
		               }
		               if ($accessors && $accessors[key]) {
		                   accessors[key] = $accessors[key]
		               } else if (typeof keys[key] !== 'function') {
		                   unresolve[key] = 1
		               }
		           }
		       }
	
	
		       if (typeof this === 'function') {
		           this(keys, unresolve)
		       }
		       for (key in unresolve) {
		           //系统属性跳过,已经有访问器的属性跳过
		           if ($$skipArray[key] || accessors[key])
		               continue
		           if (!isSkip(key, keys[key], $skipArray)) {
	
		               accessors[key] = makeAccessor(before.$id, key, heirloom)
		               accessors[key].set(keys[key])
		           }
		       }
	
		       var $vmodel = new Observer()
		       $vmodel = createViewModel($vmodel, accessors, keys)
		       for (key in keys) {
		           if (!accessors[key]) {//添加不可监控的属性
	
		               $vmodel[key] = keys[key]
		           }
		           //用于通过配置对象触发组件的$watch回调
		           if (isWidget && config && accessors[key] && config.hasOwnProperty(key)) {
		               var GET = accessors[key].get
		               //  GET.heirloom = heirloom
		               if (!GET.$decompose) {
		                   GET.$decompose = {}
		               }
		               GET.$decompose[configName + '.' + key] = $vmodel
		           }
	
		           if (key in $$skipArray) {
		               delete keys[key]
		           } else {
		               keys[key] = true
		           }
	
		       }
	
		       initViewModel($vmodel, heirloom, keys, accessors, {
		           id: before.$id,
		           hashcode: makeHashCode('$'),
		           master: true
		       })
	
		       return $vmodel
		   }
	
	
		   avalon.mediatorFactory = mediatorFactory
	
		   function update(vdom, update, hookName) {
		       if (hookName) {
		           vdom.afterChange = vdom.afterChange || []
		           avalon.Array.ensure(vdom.afterChange, update)
		       } else {
		           var dom = vdom.dom
		           update(vdom.dom, vdom, dom && dom.parentNode)
		       }
		   }
	
		   avalon.directive('important', {
		       priority: 1,
		       parse: function (copy, src, binding) {
		           var quoted = quote(binding.expr)
		           copy.local = '{}'
		           copy.vmodel = '__vmodel__'
		           copy[binding.name] = 1
		           //如果important没有定义可以进入
		           //如果important定义了,并且__vmodel__== important也可以进入
		           src.$prepend = ['(function(__top__){',
		               'var __i = avalon.scopes[' + quoted + ']',
		               'var ok = !__i || __i.vmodel === __top__',
		               'if( !ok ){',
		               'vnodes.push({skipContent:true,nodeName:"' + copy.nodeName + '"})',
		               'avalon.log("不进入"+' + quoted + ');return }',
		               'var __vmodel__ = avalon.vmodels[' + quoted + '];'
	
		           ].join('\n') + '\n'
		           src.$append = '\n})(__vmodel__);'
		       },
		       diff: function (copy, src, name) {
		           if (!src.dynamic[name]) {
		               src.local = copy.local
		               src.vmodel = copy.vmodel
		               update(src, this.update)
		           }
		       },
		       update: function (dom, vdom, parent) {
		           avalon.directives.controller.update(dom, vdom, parent, 'important')
		       }
		   })
	
		   var cacheMediator = {}
		   avalon.mediatorFactoryCache = function (top, $id) {
		       var vm = avalon.vmodels[$id]
		       if (vm && top && vm !== top) {
		           var a = top.$hashcode
		           var b = vm.$hashcode
		           var id = a + b
		           if (cacheMediator[id]) {
		               return cacheMediator[id]
		           }
		           var c = avalon.mediatorFactory(top, vm)
		           return cacheMediator[id] = c
		       } else {
		           return top
		       }
		   }
		   avalon.directive('controller', {
		       priority: 2,
		       parse: function (copy, src, binding) {
		           var quoted = quote(binding.expr)
		           copy.local = '__local__'
		           copy.vmodel = '__vmodel__'
		           copy[binding.name] = 1
	
		           src.$prepend = '(function(__top__){\n' +
		               'var __vmodel__ = avalon.mediatorFactoryCache(__top__,' + quoted + ')\n'
		           src.$append = '\n})(__vmodel__);'
		       },
		       diff: function (copy, src, name) {
		           if (!src.dynamic[name]) {
		               src.local = copy.local
		               src.vmodel = copy.vmodel
	
		               update(src, this.update)
		           }
		       },
		       update: function (dom, vdom, parent, important) {
		           var vmodel = vdom.vmodel
		           var local = vdom.local
		           var name = important ? 'ms-important' : 'ms-controller'
		           vdom.dynamic[name] = 1
		           var id = vdom.props[name]
		           var scope = avalon.scopes[id]
		           if (scope) {
		               return
		           }
	
		           var top = avalon.vmodels[id]
		           if (vmodel.$element && vmodel.$element.vtree[0] === vdom) {
		               var render = vmodel.$render
		           } else {
		               render = avalon.render([vdom], local)
		           }
		           vmodel.$render = render
		           vmodel.$element = dom
		           dom.vtree = [vdom]
		           if (top !== vmodel) {
		               top.$render = top.$render || render
		               top.$element = top.$element || dom
		           }
		           var needFire = important ? vmodel : top
		           var scope = avalon.scopes[id] = {
		               vmodel: vmodel,
		               local: local
		           }
		           update(vdom, function () {
		               avalon(dom).removeClass('ms-controller')
		               dom.setAttribute('wid', id)
		               if (avalon._disposeComponent)
						avalon._disposeComponent(dom)
		               var events = needFire.$events["onReady"]
		               if (events) {
		                   needFire.$fire('onReady')
		                   delete needFire.$events.onReady
		               }
		               scope.isMount = true
		           }, 'afterChange')
	
		       }
		   })
	
		   var cssDir = avalon.directive('css', {
		       diff: function (copy, src, name) {
		           var a = copy[name]
		           var p = src[name]
		           if (Object(a) === a) {
		               a = a.$model || a//安全的遍历VBscript
		               if (Array.isArray(a)) {//转换成对象
		                   var b = {}
		                   a.forEach(function (el) {
		                       el && avalon.shadowCopy(b, el)
		                   })
		                   a = b
		               }
		               var hasChange = false
		               if (!src.dynamic[name] || !p) {//如果一开始为空
		                   src[name] = a
		                   hasChange = true
		               } else {
		                   var patch = {}
		                   for (var i in a) {//diff差异点
		                       if (a[i] !== p[i]) {
		                           hasChange = true
		                       }
		                       patch[i] = a[i]
		                   }
		                   for (var i in p) {
		                       if (!(i in patch)) {
		                           hasChange = true
		                           patch[i] = ''
		                       }
		                   }
		                   src[name] = patch
		               }
		               if (hasChange) {
		                   if (name === 'ms-effect') {
		                       src[name] = a
		                   }
		                   update(src, this.update)
		               }
		           }
		           delete copy[name]//释放内存
		       },
		       update: function (dom, vdom) {
		           if (dom && dom.nodeType === 1) {
		               var wrap = avalon(dom)
		               vdom.dynamic['ms-css'] = 1
		               var change = vdom['ms-css']
		               for (var name in change) {
		                   wrap.css(name, change[name])
		               }
		           }
		       }
		   })
	
		   var cssDiff = cssDir.diff
	
		   avalon.directive('attr', {
		       diff: cssDiff,
		       //dom, vnode
		       update: attrUpdate
		   })
	
		   var none = 'none'
		   function parseDisplay(elem, val) {
		       //用于取得此类标签的默认display值
		       var doc = elem.ownerDocument
		       var nodeName = elem.nodeName
		       var key = '_' + nodeName
		       if (!parseDisplay[key]) {
		           var temp = doc.body.appendChild(doc.createElement(nodeName))
		           val = avalon.css(temp, 'display')
		           doc.body.removeChild(temp)
		           if (val === none) {
		               val = 'block'
		           }
		           parseDisplay[key] = val
		       }
		       return parseDisplay[key]
		   }
	
		   avalon.parseDisplay = parseDisplay
	
		   avalon.directive('visible', {
		       diff: function (copy, src, name) {
		           var c = !!copy[name]
		           if (!src.dynamic[name] || c !== src[name]) {
		               src[name] = c
		               update(src, this.update)
		           }
		       },
		       update: function (dom, vdom) {
		           if (dom && dom.nodeType === 1) {
		               vdom.dynamic['ms-visible'] = 1
		               var show = vdom['ms-visible']
		               var display = dom.style.display
		               var value
		               if (show) {
		                   if (display === none) {
		                       value = vdom.displayValue
		                       if (!value) {
		                           dom.style.display = ''
		                       }
		                   }
		                   if (dom.style.display === '' && avalon(dom).css('display') === none &&
		                       // fix firefox BUG,必须挂到页面上
		                       avalon.contains(dom.ownerDocument, dom)) {
	
		                       value = parseDisplay(dom)
		                   }
		               } else {
		                   if (display !== none) {
		                       value = none
		                       vdom.displayValue = display
		                   }
		               }
		               var cb = function () {
		                   if (value !== void 0) {
		                       dom.style.display = value
		                   }
		               }
		               avalon.applyEffect(dom, vdom, {
		                   hook: show ? 'onEnterDone' : 'onLeaveDone',
		                   cb: cb
		               })
		           }
	
		       }
		   })
	
		   avalon.directive('expr', {
		       parse: avalon.noop
		   })
	
		   avalon.directive('text', {
		       parse: function (copy, src, binding) {
		           copy[binding.name] = 1
		           src.children = []
		           copy.children = '[{\nnodeName:"#text",\ndynamic:true,' +
					'\nnodeValue:avalon.parsers.string(' +
					avalon.parseExpr(binding) + ')}]'
		       },
		       diff: function (copy, src) {
		           if (!src.children.length) {
					update(src, this.update)
		           }
		       },
		       update: function (dom, vdom) {
		           if (dom && !vdom.isVoidTag) {
		               var parent = dom
		               while (parent.firstChild) {
		                   parent.removeChild(parent.firstChild)
		               }
		               var dom = document.createTextNode('x')
		               parent.appendChild(dom)
		               var a = { nodeType: 3, nodeName: '#text', dom: dom }
		               vdom.children.push(a)
		           }
		       }
		   })
	
		   avalon.directive('html', {
		       parse: function (copy, src, binding) {
		           if (!src.isVoidTag) {
		               //将渲染函数的某一部分存起来,渲在c方法中转换为函数
		               copy[binding.name] = avalon.parseExpr(binding)
		               copy.vmodel = '__vmodel__'
		               copy.local = '__local__'
		           } else {
		               copy.children = '[]'
		           }
		       },
		       diff: function (copy, src, name) {
		           var copyValue = copy[name] + ''
	
		           if (!src.dynamic['ms-html'] || !src.render || copyValue !== src[name]) {
		               src[name] = copyValue
	
		               var oldTree = avalon.speedUp(avalon.lexer(copyValue))
	
		               var render = avalon.render(oldTree, copy.local)
		               src.render = render
	
		               var newTree = render(copy.vmodel, copy.local)
	
		               src.children = copy.children = newTree
		               update(src, this.update)
		           } else if (src.render) {
		               var newTree = src.render(copy.vmodel, copy.local)
		               copy.children = newTree
		           }
		       },
		       update: function (dom, vdom) {
		           vdom.dynamic['ms-html'] = 1
		           avalon.clearHTML(dom)
		           dom.appendChild(avalon.domize(vdom.children))
		       }
		   })
	
		   function classNames() {
		       var classes = []
		       for (var i = 0; i < arguments.length; i++) {
		           var arg = arguments[i]
		           var argType = typeof arg
		           if (argType === 'string' || argType === 'number' || arg === true) {
		               classes.push(arg)
		           } else if (Array.isArray(arg)) {
		               classes.push(classNames.apply(null, arg))
		           } else if (argType === 'object') {
		               for (var key in arg) {
		                   if (arg.hasOwnProperty(key) && arg[key]) {
		                       classes.push(key)
		                   }
		               }
		           }
		       }
	
		       return classes.join(' ')
		   }
	
	
		   avalon.directive('class', {
		       diff: function (copy, src, name) {
		           var type = name.slice(3)
		           var copyValue = copy[name]
		           var srcValue = src[name] || ''
		           var classEvent = src.classEvent || {}
		           if (type === 'hover') {//在移出移入时切换类名
		               classEvent.mouseenter = activateClass
		               classEvent.mouseleave = abandonClass
		           } else if (type === 'active') {//在获得焦点时切换类名
		               src.props.tabindex = copy.props.tabindex || -1
		               classEvent.tabIndex = src.props.tabindex
		               classEvent.mousedown = activateClass
		               classEvent.mouseup = abandonClass
		               classEvent.mouseleave = abandonClass
		           }
		           src.classEvent = classEvent
	
		           var className = classNames(copyValue)
	
		           if (!src.dynamic[name] || srcValue !== className) {
		               src[name] = className
		               src['change-' + type] = className
		               update(src, this.update, type)
		           }
		       },
		       update: function (dom, vdom) {
		           if (!dom || dom.nodeType !== 1)
		               return
	
		           var classEvent = vdom.classEvent
		           if (classEvent) {
		               for (var i in classEvent) {
		                   if (i === 'tabIndex') {
		                       dom[i] = classEvent[i]
		                   } else {
		                       avalon.bind(dom, i, classEvent[i])
		                   }
		               }
		               vdom.classEvent = {}
		           }
		           var names = ['class', 'hover', 'active']
		           names.forEach(function (type) {
		               var name = 'change-' + type
		               var value = vdom[name]
		               if (value === void 0)
		                   return
		               vdom.dynamic['ms-' + type] = 1
		               if (type === 'class') {
		                   dom && setClass(dom, vdom)
		               } else {
		                   var oldType = dom.getAttribute('change-' + type)
		                   if (oldType) {
		                       avalon(dom).removeClass(oldType)
		                   }
		                   dom.setAttribute(name, value)
		               }
		           })
		       }
		   })
	
		   directives.active = directives.hover = directives['class']
	
	
		   var classMap = {
		       mouseenter: 'change-hover',
		       mouseleave: 'change-hover',
		       mousedown: 'change-active',
		       mouseup: 'change-active'
		   }
	
		   function activateClass(e) {
		       var elem = e.target
		       avalon(elem).addClass(elem.getAttribute(classMap[e.type]) || '')
		   }
	
		   function abandonClass(e) {
		       var elem = e.target
		       var name = classMap[e.type]
		       avalon(elem).removeClass(elem.getAttribute(name) || '')
		       if (name !== 'change-active') {
		           avalon(elem).removeClass(elem.getAttribute('change-active') || '')
		       }
		   }
	
		   function setClass(dom, vdom) {
		       var old = dom.getAttribute('old-change-class')
		       var neo = vdom['ms-class']
		       if (old !== neo) {
		           avalon(dom).removeClass(old).addClass(neo)
		           dom.setAttribute('old-change-class', neo)
		       }
	
		   }
	
		   markID(activateClass)
		   markID(abandonClass)
	
		   //Ref: http://developers.whatwg.org/webappapis.html#event-handler-idl-attributes
		   // The assumption is that future DOM event attribute names will begin with
		   // 'on' and be composed of only English letters.
		   var rmson = /^ms\-on\-(\w+)/
		   //基于事件代理的高性能事件绑定
		   avalon.directive('on', {
		       priority: 3000,
		       parse: function (copy, src, binding) {
		           var underline = binding.name.replace('ms-on-', 'e').replace('-', '_')
		           var uuid = underline + '_' + binding.expr.
					replace(/\s/g, '').
					replace(/[^$a-z]/ig, function (e) {
						return e.charCodeAt(0)
					})
	
		           var quoted = avalon.quote(uuid)
		           var fn = '(function(){\n' +
					'var fn610 = ' +
					avalon.parseExpr(binding) +
					'\nfn610.uuid =' + quoted + ';\nreturn fn610})()'
		           copy.vmodel = '__vmodel__'
		           copy.local = '__local__'
		           copy[binding.name] = fn
	
		       },
		       diff: function (copy, src, name) {
		           var fn = copy[name]
		           var uuid = fn.uuid
		           var srcFn = src[name] || {}
		           var hasChange = false
	
		           if (!src.dynamic[name] || srcFn.uuid !== uuid) {
		               src[name] = fn
		               avalon.eventListeners[uuid] = fn
		               hasChange = true
		           }
	
		           if (diffObj(src.local || {}, copy.local)) {
		               hasChange = true
		           }
		           if (hasChange) {
		               src.local = copy.local
		               src.vmodel = copy.vmodel
		               update(src, this.update)
		           } else if (src.dom) {
		               src.dom._ms_local = copy.local
		           }
		       },
		       update: function (dom, vdom) {
		           if (dom && dom.nodeType === 1) { //在循环绑定中，这里为null
		               var key, listener
		               dom._ms_context_ = vdom.vmodel
		               dom._ms_local = vdom.local
		               for (key in vdom) {
		                   var match = key.match(rmson)
		                   if (match) {
		                       listener = vdom[key]
		                       vdom.dynamic[key] = 1
		                       avalon.bind(dom, match[1], listener)
		                   }
		               }
		           }
		       }
		   })
	
		   function diffObj(a, b) {
		       for (var i in a) {//diff差异点
		           if (a[i] !== b[i]) {
		               return true
		           }
		       }
		       return false
		   }
	
		   var keyMap = avalon.oneObject("break,case,catch,continue,debugger,default,delete,do,else,false," +
		       "finally,for,function,if,in,instanceof,new,null,return,switch,this," +
		       "throw,true,try,typeof,var,void,while,with," + /* 关键字*/
		       "abstract,boolean,byte,char,class,const,double,enum,export,extends," +
		       "final,float,goto,implements,import,int,interface,long,native," +
		       "package,private,protected,public,short,static,super,synchronized," +
		       "throws,transient,volatile")
		   avalon.keyMap = keyMap
		   var quoted = {
		       nodeName: 1,
		       forExpr: 1,
		       type: 1,
		       template: 1,
		       nodeValue: 1,
		       signature: 1,
		       wid: 1
		   }
	
		   var rneedQuote = /[W\:-]/
		   function fixKey(k) {
		       return (rneedQuote.test(k) || keyMap[k]) ? quote(k) : k
		   }
	
		   function stringify(obj) {
		       var arr1 = []
		       //字符不用东西包起来就变成变量
		       for (var i in obj) {
		           var type = typeof obj[i]
		           if (type === 'object') {
		               if (i === 'props') {
		                   var arr2 = []
		                   for (var k in obj.props) {
		                       var kv = obj.props[k]
		                       if (typeof kv === 'string') {
		                           kv = quote(kv)
		                       }
		                       arr2.push(fixKey(k) + ': ' + kv)
		                   }
		                   arr1.push(i + ': {' + arr2.join(',\n') + '}')
	
		               } else if (i === 'children') {
		                   arr1.push('children: [' + obj[i].map(function (a) {
		                       return stringify(a)
		                   }) + ']')
		               }
		           } else if (obj.hasOwnProperty(i)) {
		               var v = obj[i]
		               if (type === 'string') {
		                   v = quoted[i] ? quote(v) : v
		               }
		               arr1.push(fixKey(i) + ':' + v)
		           }
		       }
		       return '{\n' + arr1.join(',\n') + '}'
		   }
	
		   var updateModelMethods = {
		       input: function (prop) {//处理单个value值处理
		           var data = this
		           prop = prop || 'value'
		           var dom = data.dom
		           var rawValue = dom[prop]
		           var parsedValue = data.parse(rawValue)
	
		           //有时候parse后一致,vm不会改变,但input里面的值
		           data.value = rawValue
		           data.set(data.vmodel, parsedValue)
		           callback(data)
		           var pos = data.pos
		           if (dom.caret) {
		               data.setCaret(dom, pos)
		           }
		           //vm.aaa = '1234567890'
		           //处理 <input ms-duplex='@aaa|limitBy(8)'/>{{@aaa}} 这种格式化同步不一致的情况 
	
		       },
		       radio: function () {
		           var data = this
		           if (data.isChecked) {
		               var val = !data.value
		               data.set(data.vmodel, val)
		               callback(data)
		           } else {
		               updateModelMethods.input.call(data)
		               data.value = NaN
		           }
		       },
		       checkbox: function () {
		           var data = this
		           var array = data.value
		           if (!Array.isArray(array)) {
		               avalon.warn('ms-duplex应用于checkbox上要对应一个数组')
		               array = [array]
		           }
		           var method = data.dom.checked ? 'ensure' : 'remove'
		           if (array[method]) {
		               var val = data.parse(data.dom.value)
		               array[method](val)
		               callback(data)
		           }
	
		       },
		       select: function () {
		           var data = this
		           var val = avalon(data.dom).val() //字符串或字符串数组
		           if (val + '' !== this.value + '') {
		               if (Array.isArray(val)) { //转换布尔数组或其他
		                   val = val.map(function (v) {
		                       return data.parse(v)
		                   })
		               } else {
		                   val = data.parse(val)
		               }
		               data.set(data.vmodel, val)
		               callback(data)
		           }
		       },
		       contenteditable: function () {
		           updateModelMethods.input.call(this, 'innerHTML')
		       }
		   }
	
		   function callback(data) {
		       if (data.callback) {
		           data.callback.call(data.vmodel, {
		               type: 'changed',
		               target: data.dom
		           }, data.local)
		       }
		   }
	
		   function updateModelHandle(event) {
		       var elem = this
		       var field = this.__ms_duplex__
		       if (elem.composing) {
		           //防止onpropertychange引发爆栈
		           return
		       }
		       if (elem.value === field.value) {
		           return
		       }
		       if (elem.caret) {
		           try {
		               var pos = field.getCaret(elem)
		               field.pos = pos
		           } catch (e) {
		           }
		       }
	
		       if (field.debounceTime > 4) {
		           var timestamp = new Date()
		           var left = timestamp - field.time || 0
		           field.time = timestamp
		           if (left >= field.debounceTime) {
		               updateModelMethods[field.type].call(field)
		           } else {
		               clearTimeout(field.debounceID)
		               field.debounceID = setTimeout(function () {
		                   updateModelMethods[field.type].call(field)
		               }, left)
		           }
		       } else {
		           updateModelMethods[field.type].call(field)
		       }
		   }
	
		   var msie = avalon.msie
	
		   function updateModelByEvent(node, vnode) {
		       var events = {}
		       var data = vnode['ms-duplex']
		       data.update = updateModelHandle
		       //添加需要监听的事件
		       switch (data.type) {
		           case 'radio':
		           case 'checkbox':
		               events.click = updateModelHandle
		               break
		           case 'select':
		               events.change = updateModelHandle
		               break
		           case 'contenteditable':
		               if (data.isChanged) {
		                   events.blur = updateModelHandle
		               } else {
		                   if (avalon.modern) {
		                       if (win.webkitURL) {
		                           // http://code.metager.de/source/xref/WebKit/LayoutTests/fast/events/
		                           // https://bugs.webkit.org/show_bug.cgi?id=110742
		                           events.webkitEditableContentChanged = updateModelHandle
		                       } else if (win.MutationEvent) {
		                           events.DOMCharacterDataModified = updateModelHandle
		                       }
		                       events.input = updateModelHandle
		                   } else {
		                       events.keydown = updateModelKeyDown
		                       events.paste = updateModelDelay
		                       events.cut = updateModelDelay
		                       events.focus = closeComposition
		                       events.blur = openComposition
		                   }
	
		               }
		               break
		           case 'input':
		               if (data.isChanged) {
		                   events.change = updateModelHandle
		               } else {
		                   //http://www.cnblogs.com/rubylouvre/archive/2013/02/17/2914604.html
		                   //http://www.matts411.com/post/internet-explorer-9-oninput/
		                   if (msie) {//处理输入法问题
		                       events.keyup = updateModelKeyDown
		                   }
	
		                   if (msie < 9) {
		                       events.propertychange = updateModelHack
		                       events.paste = updateModelDelay
		                       events.cut = updateModelDelay
		                   } else {
		                       events.input = updateModelHandle
		                   }
		                   //IE6-8的propertychange有BUG,第一次用JS修改值时不会触发,而且你是全部清空value也不会触发
		                   //IE9的propertychange不支持自动完成,退格,删除,复制,贴粘,剪切或点击右边的小X的清空操作
		                   //IE11微软拼音好像才会触发compositionstart 不会触发compositionend
		                   //https://github.com/RubyLouvre/avalon/issues/1368#issuecomment-220503284
		                   if (!msie || msie > 9) {
		                       events.compositionstart = openComposition
		                       events.compositionend = closeComposition
		                   }
		                   if (!msie) {
	
		                       //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
		                       //如果当前浏览器支持Int8Array,那么我们就不需要以下这些事件来打补丁了
		                       if (!/\[native code\]/.test(win.Int8Array)) {
		                           events.keydown = updateModelKeyDown //safari < 5 opera < 11
		                           events.paste = updateModelDelay//safari < 5
		                           events.cut = updateModelDelay//safari < 5 
		                           if (win.netscape) {
		                               // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
		                               events.DOMAutoComplete = updateModelHandle
		                           }
		                       }
		                   }
		               }
		               break
		       }
	
		       if (/password|text/.test(vnode.props.type)) {
		           events.focus = openCaret //判定是否使用光标修正功能 
		           events.blur = closeCaret
		           data.getCaret = getCaret
		           data.setCaret = setCaret
		       }
	
		       for (var name in events) {
		           avalon.bind(node, name, events[name])
		       }
		   }
	
	
		   function updateModelHack(e) {
		       if (e.propertyName === 'value') {
		           updateModelHandle.call(this, e)
		       }
		   }
	
		   function updateModelDelay(e) {
		       var elem = this
		       setTimeout(function () {
		           updateModelHandle.call(elem, e)
		       }, 0)
		   }
	
	
		   function openCaret() {
		       this.caret = true
		   }
	
		   function closeCaret() {
		       this.caret = false
		   }
		   function openComposition() {
		       this.composing = true
		   }
	
		   function closeComposition(e) {
		       this.composing = false
		       updateModelDelay.call(this, e)
		   }
	
		   function updateModelKeyDown(e) {
		       var key = e.keyCode
		       // ignore
		       //    command            modifiers                   arrows
		       if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
		           return
		       updateModelHandle.call(this, e)
		   }
	
		   markID$1(openCaret)
		   markID$1(closeCaret)
		   markID$1(openComposition)
		   markID$1(closeComposition)
		   markID$1(updateModelHandle)
		   markID$1(updateModelHack)
		   markID$1(updateModelDelay)
		   markID$1(updateModelKeyDown)
	
		   //IE6-8要处理光标时需要异步
		   var mayBeAsync = function (fn) {
		       setTimeout(fn, 0)
		   }
		   var setCaret = function (target, cursorPosition) {
		       var range
		       if (target.createTextRange) {
		           mayBeAsync(function () {
		               target.focus()
		               range = target.createTextRange()
		               range.collapse(true)
		               range.moveEnd('character', cursorPosition)
		               range.moveStart('character', cursorPosition)
		               range.select()
		           })
		       } else {
		           target.focus()
		           if (target.selectionStart !== undefined) {
		               target.setSelectionRange(cursorPosition, cursorPosition)
		           }
		       }
		   }
	
		   var getCaret = function (target) {
		       var start = 0
		       var normalizedValue
		       var range
		       var textInputRange
		       var len
		       var endRange
	
		       if (typeof target.selectionStart == 'number' && typeof target.selectionEnd == 'number') {
		           start = target.selectionStart
		       } else {
		           range = doc$1.selection.createRange()
	
		           if (range && range.parentElement() == target) {
		               len = target.value.length
		               normalizedValue = target.value.replace(/\r\n/g, '\n')
	
		               textInputRange = target.createTextRange()
		               textInputRange.moveToBookmark(range.getBookmark())
	
		               endRange = target.createTextRange()
		               endRange.collapse(false)
	
		               if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
		                   start = len
		               } else {
		                   start = -textInputRange.moveStart('character', -len)
		                   start += normalizedValue.slice(0, start).split('\n').length - 1
		               }
		           }
		       }
	
		       return start
		   }
	
		   var valueHijack = false
		   try { //#272 IE9-IE11, firefox
	
		       var setters = {}
		       var aproto = HTMLInputElement.prototype
		       var bproto = HTMLTextAreaElement.prototype
		       var newSetter = function (value) { // jshint ignore:line
		           setters[this.tagName].call(this, value)
		           var data = this.__ms_duplex__
		           if (!this.caret && data && data.isString) {
		               data.update.call(this, { type: 'setter' })
		           }
		       }
		       var inputProto = HTMLInputElement.prototype
		       Object.getOwnPropertyNames(inputProto) //故意引发IE6-8等浏览器报错
		       setters['INPUT'] = Object.getOwnPropertyDescriptor(aproto, 'value').set
	
		       Object.defineProperty(aproto, 'value', {
		           set: newSetter
		       })
		       setters['TEXTAREA'] = Object.getOwnPropertyDescriptor(bproto, 'value').set
		       Object.defineProperty(bproto, 'value', {
		           set: newSetter
		       })
		       valueHijack = true
		   } catch (e) {
		       //在chrome 43中 ms-duplex终于不需要使用定时器实现双向绑定了
		       // http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype
		       // https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
		   }
	
		   var updateView = {
		       input: function () {//处理单个value值处理
		           this.dom.value = this.value
		       },
		       radio: function () {//处理单个checked属性
		           var checked
		           if (this.isChecked) {
		               checked = !!this.value
		           } else {
		               checked = this.value + '' === this.dom.value
		           }
		           var dom = this.dom
		           if (avalon.msie === 6) {
		               setTimeout(function () {
		                   //IE8 checkbox, radio是使用defaultChecked控制选中状态，
		                   //并且要先设置defaultChecked后设置checked
		                   //并且必须设置延迟
		                   dom.defaultChecked = checked
		                   dom.checked = checked
		               }, 31)
		           } else {
		               dom.checked = checked
		           }
		       },
		       checkbox: function () {//处理多个checked属性
		           var checked = false
		           var dom = this.dom
		           var value = dom.value
		           for (var i = 0; i < this.value.length; i++) {
		               var el = this.value[i]
		               if (el + '' === value) {
		                   checked = true
		               }
		           }
		           dom.checked = checked
		       },
		       select: function () {//处理子级的selected属性
		           var a = Array.isArray(this.value) ?
		               this.value.map(String) : this.value + ''
		           avalon(this.dom).val(a)
		       },
		       contenteditable: function () {//处理单个innerHTML
		           this.dom.innerHTML = this.value
		           this.update.call(this.dom)
		       }
		   }
	
		   function addField(node, vnode) {
		       var field = node.__ms_duplex__
		       var rules = vnode['ms-rules']
		       if (rules && !field.validator) {
		           while (node && node.nodeType === 1) {
		               var validator = node._ms_validator_
		               if (validator) {
		                   field.rules = rules
		                   field.validator = validator
		                   if (avalon.Array.ensure(validator.fields, field)) {
		                       validator.addField(field)
		                   }
		                   break
		               }
		               node = node.parentNode
		           }
		       }
		   }
	
		   var rchangeFilter = /\|\s*change\b/
		   var rcheckedType$1 = /^(?:checkbox|radio)$/
		   var rdebounceFilter = /\|\s*debounce(?:\(([^)]+)\))?/
		   var duplexDir = 'ms-duplex'
	
	
		   avalon.directive('duplex', {
		       priority: 2000,
		       parse: function (copy, src, binding) {
		           var expr = binding.expr
		           var etype = src.props.type
		           //处理数据转换器
		           var parsers = binding.param, dtype
		           var isChecked = false
		           parsers = parsers ? parsers.split('-').map(function (a) {
		               if (a === 'checked') {
		                   isChecked = true
		               }
		               return a
		           }) : []
	
		           if (rcheckedType$1.test(etype) && isChecked) {
		               //如果是radio, checkbox,判定用户使用了checked格式函数没有
		               parsers = []
		               dtype = 'radio'
		           }
	
		           if (!/input|textarea|select/.test(src.nodeName)) {
		               if ('contenteditable' in src.props) {
		                   dtype = 'contenteditable'
		               }
		           } else if (!dtype) {
		               dtype = src.nodeName === 'select' ? 'select' :
		                   etype === 'checkbox' ? 'checkbox' :
		                       etype === 'radio' ? 'radio' :
		                           'input'
		           }
		           var isChanged = false, debounceTime = 0
		           //判定是否使用了 change debounce 过滤器
		           if (dtype === 'input' || dtype === 'contenteditable') {
		               var isString = true
		               if (rchangeFilter.test(expr)) {
		                   isChanged = true
		               }
		               if (!isChanged) {
		                   var match = expr.match(rdebounceFilter)
		                   if (match) {
		                       debounceTime = parseInt(match[1], 10) || 300
		                   }
		               }
		           }
	
	
		           var changed = copy.props['data-duplex-changed']
		           var get = avalon.parseExpr(binding)// 输出原始数据
		           var quoted = parsers.map(function (a) {
		               return avalon.quote(a)
		           })
		           copy[duplexDir] = stringify({
		               type: dtype, //这个决定绑定什么事件
		               vmodel: '__vmodel__',
		               local: '__local__',
		               debug: avalon.quote(binding.name + '=' + binding.expr),
		               isChecked: isChecked,
		               parsers: '[' + quoted + ']',
		               isString: !!isString,
		               isChanged: isChanged, //这个决定同步的频数
		               debounceTime: debounceTime, //这个决定同步的频数
		               get: get,
		               set: avalon.evaluatorPool.get('duplex:set:' + expr),
		               callback: changed ? avalon.parseExpr({ expr: changed, type: 'on' }) : 'avalon.noop'
		           })
	
		       },
		       diff: function (copy, src) {
		           if (!src.dynamic[duplexDir]) {
		               //第一次为原始虚拟DOM添加duplexData
		               var data = src[duplexDir] = copy[duplexDir]
		               data.parse = parseValue
		           } else {
		               data = src[duplexDir]
		           }
		           if (copy !== src) {//释放内存
		               copy[duplexDir] = null
		           }
	
		           var curValue = data.get(data.vmodel)
		           var preValue = data.value
		           if (data.isString) {//减少不必要的视图渲染
		               curValue = data.parse(curValue)
		               curValue += ''
		               if (curValue === preValue) {
		                   return
		               }
		           } else if (Array.isArray(curValue)) {
		               var hack = true
		               if (curValue + '' === data.arrayHack) {
		                   return
		               }
		           }
		           data.value = curValue
		           //如果是curValue是一个数组,当我们改变vm中的数组,
		           //那么这个data.value也是跟着改变,因此必须保持一份副本才能用于比较 
		           if (hack) {
		               data.arayHack = curValue + ''
		           }
		           update(src, this.update, 'afterChange')
		       },
		       update: function (dom, vdom) {
		           if (dom && dom.nodeType === 1) {
		               //vdom.dynamic变成字符串{}
		               vdom.dynamic[duplexDir] = 1
		               if (!dom.__ms_duplex__) {
		                   dom.__ms_duplex__ = avalon.mix(vdom[duplexDir], { dom: dom })
		                   //绑定事件
		                   updateModelByEvent(dom, vdom)
		                   //添加验证
		                   addField(dom, vdom)
		               }
	
		               var data = dom.__ms_duplex__
		               data.dom = dom
		               //如果不支持input.value的Object.defineProperty的属性支持,
		               //需要通过轮询同步, chrome 42及以下版本需要这个hack
		               if (data.isString
		                   && !avalon.msie
		                   && valueHijack === false
		                   && !dom.valueHijack) {
	
		                   dom.valueHijack = updateModelHandle
		                   var intervalID = setInterval(function () {
		                       if (!avalon.contains(avalon.root, dom)) {
		                           clearInterval(intervalID)
		                       } else {
		                           dom.valueHijack({ type: 'poll' })
		                       }
		                   }, 30)
		               }
		               //更新视图
		               updateView[data.type].call(data)
		           }
		       }
		   })
	
		   function parseValue(val) {
		       for (var i = 0, k; k = this.parsers[i++];) {
		           var fn = avalon.parsers[k]
		           if (fn) {
		               val = fn.call(this, val)
		           }
		       }
		       return val
		   }
	
		   var valiDir = avalon.directive('validate', {
		       //验证单个表单元素
		       diff: function (copy, src, name) {
		           var validator = copy[name]
		           var p = src[name]
		           /* istanbul ignore if */
		           /* istanbul ignore else */
		           if (p && p.onError && p.addField) {
		               return
		           } else if (Object(validator) === validator) {
		               src.vmValidator = validator
		               if (validator.$id) {//转换为普通对象
		                   validator = validator.$model
		               }
	
		               src[name] = validator
		               for (var name in valiDir.defaults) {
		                   if (!validator.hasOwnProperty(name)) {
		                       validator[name] = valiDir.defaults[name]
		                   }
		               }
		               validator.fields = validator.fields || []
		               update(src, this.update)
	
		           }
		       },
		       update: function (dom, vdom) {
		           var validator = vdom['ms-validate']
		           dom._ms_validator_ = validator
		           validator.dom = dom
		           var v = vdom.vmValidator
		           try {
		               v.onManual = onManual
		           } catch (e) {
		           }
		           delete vdom.vmValidator
		           dom.setAttribute('novalidate', 'novalidate')
		           function onManual() {
		               valiDir.validateAll.call(validator, validator.onValidateAll)
		           }
		           /* istanbul ignore if */
		           if (validator.validateAllInSubmit) {
		               avalon.bind(dom, 'submit', function (e) {
		                   e.preventDefault()
		                   onManual()
		               })
		           }
		           /* istanbul ignore if */
		           if (typeof validator.onInit === 'function') { //vmodels是不包括vmodel的
		               validator.onInit.call(dom, {
		                   type: 'init',
		                   target: dom,
		                   validator: validator
		               })
		           }
		       },
		       validateAll: function (callback) {
		           var validator = this
		           var fn = typeof callback === 'function' ? callback : validator.onValidateAll
		           var promise = validator.fields.filter(function (field) {
		               var el = field.dom
		               return el && !el.disabled && validator.dom.contains(el)
		           }).map(function (field) {
		               return valiDir.validate(field, true)
		           })
	
		           return Promise.all(promise).then(function (array) {
		               var reasons = array.concat.apply([], array)
		               if (validator.deduplicateInValidateAll) {
		                   var uniq = {}
		                   reasons = reasons.filter(function (reason) {
		                       var el = reason.element
		                       var uuid = el.uniqueID || (el.uniqueID = setTimeout('1'))
		                       if (uniq[uuid]) {
		                           return false
		                       } else {
		                           return uniq[uuid] = true
		                       }
		                   })
		               }
		               fn.call(validator.dom, reasons) //这里只放置未通过验证的组件
		           })
		       },
		       addField: function (field) {
		           var validator = this
		           var node = field.dom
		           /* istanbul ignore if */
		           if (validator.validateInKeyup && (!field.isChanged && !field.debounceTime)) {
		               avalon.bind(node, 'keyup', function (e) {
		                   validator.validate(field, 0, e)
		               })
		           }
		           /* istanbul ignore if */
		           if (validator.validateInBlur) {
		               avalon.bind(node, 'blur', function (e) {
		                   validator.validate(field, 0, e)
		               })
		           }
		           /* istanbul ignore if */
		           if (validator.resetInFocus) {
		               avalon.bind(node, 'focus', function (e) {
		                   validator.onReset.call(node, e, field)
		               })
		           }
		       },
		       validate: function (field, isValidateAll, event) {
		           var promises = []
		           var value = field.value
		           var elem = field.dom
		           var validator = field.validator
		           /* istanbul ignore if */
		           if (typeof Promise !== 'function') {
		               avalon.error('please npm install avalon-promise or bluebird')
		           }
		           /* istanbul ignore if */
		           if (elem.disabled)
		               return
		           var rules = field.rules
		           if (!(rules.norequired && value === '')) {
		               for (var ruleName in rules) {
		                   var ruleValue = rules[ruleName]
		                   if (ruleValue === false)
		                       continue
		                   var hook = avalon.validators[ruleName]
		                   var resolve, reject
		                   promises.push(new Promise(function (a, b) {
		                       resolve = a
		                       reject = b
		                   }))
		                   var next = function (a) {
		                       if (a) {
		                           resolve(true)
		                       } else {
		                           var reason = {
		                               element: elem,
		                               data: field.data,
		                               message: elem.getAttribute('data-' + ruleName + '-message') || elem.getAttribute('data-message') || hook.message,
		                               validateRule: ruleName,
		                               getMessage: getMessage
		                           }
		                           resolve(reason)
		                       }
		                   }
		                   field.data = {}
		                   field.data[ruleName] = ruleValue
		                   hook.get(value, field, next)
		               }
		           }
	
		           //如果promises不为空，说明经过验证拦截器
		           return Promise.all(promises).then(function (array) {
		               var reasons = array.filter(function (el) {
		                   return typeof el === 'object'
		               })
		               if (!isValidateAll) {
		                   if (reasons.length) {
		                       validator.onError.call(elem, reasons, event)
		                   } else {
		                       validator.onSuccess.call(elem, reasons, event)
		                   }
		                   validator.onComplete.call(elem, reasons, event)
		               }
		               return reasons
		           })
		       }
		   })
	
		   var rformat = /\\?{{([^{}]+)\}}/gm
	
		   function getMessage() {
		       var data = this.data || {}
		       return this.message.replace(rformat, function (_, name) {
		           return data[name] == null ? '' : data[name]
		       })
		   }
		   valiDir.defaults = {
		       addField: valiDir.addField, //供内部使用,收集此元素底下的所有ms-duplex的域对象
		       onError: avalon.noop,
		       onSuccess: avalon.noop,
		       onComplete: avalon.noop,
		       onManual: avalon.noop,
		       onReset: avalon.noop,
		       onValidateAll: avalon.noop,
		       validateInBlur: true, //@config {Boolean} true，在blur事件中进行验证,触发onSuccess, onError, onComplete回调
		       validateInKeyup: true, //@config {Boolean} true，在keyup事件中进行验证,触发onSuccess, onError, onComplete回调
		       validateAllInSubmit: true, //@config {Boolean} true，在submit事件中执行onValidateAll回调
		       resetInFocus: true, //@config {Boolean} true，在focus事件中执行onReset回调,
		       deduplicateInValidateAll: false //@config {Boolean} false，在validateAll回调中对reason数组根据元素节点进行去重
		   }
	
		   avalon.directive('rules', {
		       diff: function (copy, src, name) {
		           var neo = copy[name]
		           if (neo && Object.prototype.toString.call(neo) === '[object Object]') {
		               src[name] = neo.$model || neo
		               var field = src.dom && src.dom.__ms_duplex__
		               if (field) {
		                   field.rules = copy[name]
		               }
		           }
		       }
		   })
		   function isRegExp(value) {
		       return avalon.type(value) === 'regexp'
		   }
		   var rmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i
		   var rurl = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
		   function isCorrectDate(value) {
		       if (typeof value === "string" && value) { //是字符串但不能是空字符
		           var arr = value.split("-") //可以被-切成3份，并且第1个是4个字符
		           if (arr.length === 3 && arr[0].length === 4) {
		               var year = ~~arr[0] //全部转换为非负整数
		               var month = ~~arr[1] - 1
		               var date = ~~arr[2]
		               var d = new Date(year, month, date)
		               return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date
		           }
		       }
		       return false
		   }
		   //https://github.com/adform/validator.js/blob/master/validator.js
		   avalon.shadowCopy(avalon.validators, {
		       pattern: {
		           message: '必须匹配{{pattern}}这样的格式',
		           get: function (value, field, next) {
		               var elem = field.dom
		               var data = field.data
		               if (!isRegExp(data.pattern)) {
		                   var h5pattern = elem.getAttribute("pattern")
		                   data.pattern = new RegExp('^(?:' + h5pattern + ')$')
		               }
		               next(data.pattern.test(value))
		               return value
		           }
		       },
		       digits: {
		           message: '必须整数',
		           get: function (value, field, next) {//整数
		               next(/^\-?\d+$/.test(value))
		               return value
		           }
		       },
		       number: {
		           message: '必须数字',
		           get: function (value, field, next) {//数值
		               next(!!value && isFinite(value))// isFinite('') --> true
		               return value
		           }
		       },
		       norequired: {
		           message: '',
		           get: function (value, field, next) {
		               next(true)
		               return value
		           }
		       },
		       required: {
		           message: '必须填写',
		           get: function (value, field, next) {
		               next(value !== '')
		               return value
		           }
		       },
		       equalto: {
		           message: '密码输入不一致',
		           get: function (value, field, next) {
		               var id = String(field.data.equalto)
		               var other = avalon(document.getElementById(id)).val() || ""
		               next(value === other)
		               return value
		           }
		       },
		       date: {
		           message: '日期格式不正确',
		           get: function (value, field, next) {
		               var data = field.data
		               if (isRegExp(data.date)) {
		                   next(data.date.test(value))
		               } else {
		                   next(isCorrectDate(value))
		               }
		               return value
		           }
		       },
		       url: {
		           message: 'URL格式不正确',
		           get: function (value, field, next) {
		               next(rurl.test(value))
		               return value
		           }
		       },
		       email: {
		           message: 'email格式不正确',
		           get: function (value, field, next) {
		               next(rmail.test(value))
		               return value
		           }
		       },
		       minlength: {
		           message: '最少输入{{minlength}}个字',
		           get: function (value, field, next) {
		               var num = parseInt(field.data.minlength, 10)
		               next(value.length >= num)
		               return value
		           }
		       },
		       maxlength: {
		           message: '最多输入{{maxlength}}个字',
		           get: function (value, field, next) {
		               var num = parseInt(field.data.maxlength, 10)
		               next(value.length <= num)
		               return value
		           }
		       },
		       min: {
		           message: '输入值不能小于{{min}}',
		           get: function (value, field, next) {
		               var num = parseInt(field.data.min, 10)
		               next(parseFloat(value) >= num)
		               return value
		           }
		       },
		       max: {
		           message: '输入值不能大于{{max}}',
		           get: function (value, field, next) {
		               var num = parseInt(field.data.max, 10)
		               next(parseFloat(value) <= num)
		               return value
		           }
		       },
		       chs: {
		           message: '必须是中文字符',
		           get: function (value, field, next) {
		               next(/^[\u4e00-\u9fa5]+$/.test(value))
		               return value
		           }
		       }
		   })
	
		   avalon.directive('if', {
		       priority: 6,
		       diff: function (copy, src, name, copys, sources, index) {
		           var cur = !!copy[name]
		           src[name] = cur
		           update(src, this.update)
		       },
		       update: function (dom, vdom, parent) {
		           var show = vdom['ms-if']
		           if (vdom.dynamic['ms-if']) {
		               vdom.dynamic['ms-if'] = vdom.nodeName
		           }
		           if (show) {
		               if (vdom.nodeName === '#comment') {
		                   vdom.nodeName = vdom.dynamic['ms-if']
		                   delete vdom.nodeValue
		                   var comment = vdom.comment
		                   if (!comment) {
		                       return
		                   }
		                   parent = comment.parentNode
		                   if (parent)
		                       parent.replaceChild(dom, comment)
		                   delete vdom.comment
		                   avalon.applyEffect(dom, vdom, {
		                       hook: 'onEnterDone'
		                   })
		               }
		           } else {
		               //要移除元素节点,在对应位置上插入注释节点
		               if (!vdom.comment) {
		                   vdom.comment = document.createComment('if')
		               }
		               vdom.nodeName = '#comment'
		               vdom.nodeValue = 'if'
		               avalon.applyEffect(dom, vdom, {
		                   hook: 'onLeaveDone',
		                   cb: function () {
		                       //去掉注释节点临时添加的ms-effect
		                       //https://github.com/RubyLouvre/avalon/issues/1577
		                       //这里必须设置nodeValue为ms-if,否则会在节点对齐算法中出现乱删节点的BUG
		                       if (!parent || parent.nodeType === 11) {
		                           parent = dom.parentNode
		                           if (!parent || parent.nodeType === 11) {
		                               return
		                           }
		                       }
		                       parent.replaceChild(vdom.comment, dom)
		                   }
		               })
		           }
		       }
		   })
	
		   var rforAs = /\s+as\s+([$\w]+)/
		   var rident = /^[$a-zA-Z_][$a-zA-Z0-9_]*$/
		   var rinvalid = /^(null|undefined|NaN|window|this|\$index|\$id)$/
		   var rargs = /[$\w_]+/g
	
		   function getTraceKey(item) {
		       var type = typeof item
		       return item && type === 'object' ? item.$hashcode : type + ':' + item
		   }
	
		   avalon._each = function (obj, fn, local, vnodes) {
		       var repeat = []
		       vnodes.push(repeat)
		       var arr = (fn + '').slice(0, 40).match(rargs)
	
		       arr.shift()
	
		       if (Array.isArray(obj)) {
		           for (var i = 0; i < obj.length; i++) {
		               iterator$1(i, obj[i], local, fn, arr[0], arr[1], repeat, true)
		           }
		       } else {
		           for (var i in obj) {
		               if (obj.hasOwnProperty(i)) {
		                   iterator$1(i, obj[i], local, fn, arr[0], arr[1], repeat)
		               }
		           }
		       }
		   }
	
		   function iterator$1(index, item, vars, fn, k1, k2, repeat, isArray) {
		       var key = isArray ? getTraceKey(item) : index
		       var local = {}
		       local[k1] = index
		       local[k2] = item
		       for (var k in vars) {
		           if (!(k in local)) {
		               local[k] = vars[k]
		           }
		       }
		       fn(index, item, key, local, repeat)
		   }
	
	
		   avalon.directive('for', {
		       priority: 3,
		       parse: function (copy, src) {
		           var str = src.forExpr, aliasAs
		           str = str.replace(rforAs, function (a, b) {
		               /* istanbul ignore if */
		               if (!rident.test(b) || rinvalid.test(b)) {
		                   avalon.error('alias ' + b + ' is invalid --- must be a valid JS identifier which is not a reserved name.')
		               } else {
		                   aliasAs = b
		               }
		               return ''
		           })
	
		           var arr = str.split(' in ')
		           var binding = {
		               expr: arr[1].trim(),
		               type: 'for'
		           }
		           var getLoop = avalon.parseExpr(binding)
		           var kv = (arr[0] + ' traceKey __local__ vnodes').match(rargs)
		           if (kv.length === 4) {//确保avalon._each的回调有三个参数
		               kv.unshift('$key')
		           }
		           src.$append = Array('var loop = ' + getLoop + ';',
		               'avalon._each(loop, function(' + kv + '){',
		               '__local__[' + quote(aliasAs || 'valueOf') + '] = loop',
		               'vnodes.push({',
		               '\tnodeName: "#document-fragment",',
		               '\tindex   : arguments[0],',
		               '\tkey     : traceKey,',
		               '\tchildren: new function(){\nvar vnodes = []\n').join('\n')
	
		       },
		       diff: function (copy, src, cpList, spList, index) {
		           //将curRepeat转换成一个个可以比较的component,并求得compareText
		           //如果这个元素没有插入
		           if (avalon.callArray) {
		               if (src.list && src.forExpr.indexOf(avalon.callArray) === -1) {
		                   return
		               }
		           }
	
		           var srcRepeat = spList[index + 1]
		           var curRepeat = cpList[index + 1]
		           var end = cpList[index + 2]
		           //preRepeat不为空时
		           var cache = src.cache || {}
		           //for指令只做添加删除操作
		           var i, c, p
		           var removes = []
		           if (!srcRepeat.length) {//一维数组最开始初始化时
		               src.action = 'init'
	
		               /* eslint-disable no-cond-assign */
		               spList[index + 1] = curRepeat
		               curRepeat.forEach(function (c, i) {
		                   srcRepeat[i] = c
		                   saveInCache(cache, c)
		               })
		               src.cache = cache
		           } else if (srcRepeat === curRepeat) {
		               curRepeat.forEach(function (c) {
		                   c.action = 'move'
		                   saveInCache(cache, c)
		               })
		               src.cache = cache
		               var noUpdate = true
		           } else {
		               src.action = 'update'
		               var newCache = {}
		               /* eslint-disable no-cond-assign */
		               var fuzzy = []
		               for (i = 0; c = curRepeat[i]; i++) {
		                   var p = isInCache(cache, c.key)
		                   if (p) {
		                       p.oldIndex = p.index
		                       p.index = c.index
		                       saveInCache(newCache, p)
		                   } else {
		                       //如果找不到就进行模糊搜索
		                       fuzzy.push(c)
		                   }
		               }
		               for (var i = 0, c; c = fuzzy[i]; i++) {
		                   p = fuzzyMatchCache(cache, c.key)
		                   if (p) {
		                       p.oldIndex = p.index
		                       p.index = c.index
		                       p.key = c.key
		                   } else {
		                       p = c
		                       srcRepeat.push(p)
		                   }
	
		                   saveInCache(newCache, p)
		               }
		               srcRepeat.sort(function (a, b) {
		                   return a.index - b.index
		               })
	
		               src.cache = newCache
		               for (var i in cache) {
		                   p = cache[i]
		                   p.action = 'leave'
		                   avalon.Array.remove(srcRepeat, p)
		                   removes.push(p)
		                   if (p.arr) {
		                       p.arr.forEach(function (m) {
		                           m.action = 'leave'
		                           removes.push(m)
		                       })
		                       delete p.arr
		                   }
		               }
	
		           }
		           /* istanbul ignore if */
		           if (removes.length > 1) {
		               removes.sort(function (a, b) {
		                   return a.index - b.index
		               })
		           }
		           src.removes = removes
		           var cb = avalon.caches[src.wid]
		           var vm = copy.vmodel
		           if (end && cb) {
		               end.afterChange = [function (dom) {
		                   cb.call(vm, {
		                       type: 'rendered',
		                       target: dom,
		                       signature: src.signature
		                   })
		               }]
		           }
		           if (!noUpdate) {
		               src.list = srcRepeat
		               update(src, this.update)
		           }
		           return true
	
		       },
		       update: function (dom, vdom, parent) {
		           if (vdom.action === 'init') {
		               var b = parent
		               parent = document.createDocumentFragment()
		           }
		           var before = dom
		           var signature = vdom.signature
	
		           for (var i = 0, item; item = vdom.removes[i++];) {
		               if (item.dom) {
	
		                   delete item.split
		                   /* istanbul ignore if*/
		                   /* istanbul ignore else*/
		                   if (vdom.hasEffect) {
		                       !function (obj) {
		                           var nodes = moveItem(obj)
		                           var children = obj.children.concat()
		                           obj.children.length = 0
		                           applyEffects(nodes, children, {
		                               hook: 'onLeaveDone',
		                               staggerKey: signature + 'leave',
		                               cb: function (node) {
		                                   if (node.parentNode) {
		                                       node.parentNode.removeChild(node)
		                                   }
		                               }
		                           })
		                       } (item)
		                   } else {
		                       moveItem(item, 'add')
		                   }
	
		               }
		           }
		           vdom.list.forEach(function (el, i) {
		               if (el.action === 'leave')
		                   return
		               if (!el.dom) {
		                   el.dom = avalon.domize(el)
		               }
		               var f = el.dom
		               if (el.oldIndex === void 0) {
		                   if (vdom.hasEffect)
		                       var nodes = avalon.slice(f.childNodes)
		                   if (i === 0 && vdom.action === 'init') {
		                       parent.appendChild(f)
		                   } else {
		                       parent.insertBefore(f, before.nextSibling)
		                   }
		                   if (vdom.hasEffect) {
		                       applyEffects(nodes, el.children, {
		                           hook: 'onEnterDone',
		                           staggerKey: signature + 'enter'
		                       })
		                   }
		               } else if (el.index !== el.oldIndex) {
		                   var nodes = moveItem(el, 'add')
		                   parent.insertBefore(el.dom, before.nextSibling)
		                   vdom.hasEffect && applyEffects(nodes, el.children, {
		                       hook: 'onMoveDone',
		                       staggerKey: signature + 'move'
		                   })
		               }
	
		               before = el.split
		           })
		           if (vdom.action === 'init') {
		               b.insertBefore(parent, dom.nextSibling)
		           }
		       }
	
		   })
	
		   function moveItem(item, addToFragment) {
		       var nodes = item.children.map(function (el) {
		           return el['ms-if'] ? el.comment : el.dom
		       })
		       if (addToFragment) {
		           nodes.forEach(function (el) {
		               item.dom.appendChild(el)
		           })
		       }
		       return nodes
		   }
	
	
	
		   function fuzzyMatchCache(cache) {
		       var key
		       for (var id in cache) {
		           var key = id
		           break
		       }
		       if (key) {
		           return isInCache(cache, key)
		       }
		   }
	
	
	
		   // 新位置: 旧位置
		   function isInCache(cache, id) {
		       var c = cache[id]
		       if (c) {
		           var arr = c.arr
		           /* istanbul ignore if*/
		           if (arr) {
		               var r = arr.pop()
		               if (!arr.length) {
		                   c.arr = 0
		               }
		               return r
		           }
		           delete cache[id]
		           return c
		       }
		   }
		   //[1,1,1] number1 number1_ number1__
		   function saveInCache(cache, component) {
		       var trackId = component.key
		       if (!cache[trackId]) {
		           cache[trackId] = component
		       } else {
		           var c = cache[trackId]
		           var arr = c.arr || (c.arr = [])
		           arr.push(component)
		       }
		   }
	
		   var applyEffects = function (nodes, vnodes, opts) {
		       vnodes.forEach(function (vdom, i) {
		           avalon.applyEffect(nodes[i], vdom, opts)
		       })
		   }
	
		/**
		 * ------------------------------------------------------------
		 * 检测浏览器对CSS动画的支持与API名
		 * ------------------------------------------------------------
		 */
		   function effectDetect(transitionDuration, animationDuration, window) {
	
		       var checker = {
		           TransitionEvent: 'transitionend',
		           WebKitTransitionEvent: 'webkitTransitionEnd',
		           OTransitionEvent: 'oTransitionEnd',
		           otransitionEvent: 'otransitionEnd'
		       }
	
		       var tran
		       //有的浏览器同时支持私有实现与标准写法，比如webkit支持前两种，Opera支持1、3、4
		       for (var name in checker) {
		           if (window[name]) {
		               tran = checker[name]
		               break
		           }
		           try {
		               var a = document.createEvent(name)
		               tran = checker[name]
		               break
		           } catch (e) {
		           }
		       }
		       if (typeof tran === 'string') {
		           var transition = true
		           var css = true
		           var transitionEndEvent = tran
		       }
	
		       //animationend有两个可用形态
		       //IE10+, Firefox 16+ & Opera 12.1+: animationend
		       //Chrome/Safari: webkitAnimationEnd
		       //http://blogs.msdn.com/b/davrous/archive/2011/12/06/introduction-to-css3-animat ions.aspx
		       //IE10也可以使用MSAnimationEnd监听，但是回调里的事件 type依然为animationend
		       //  el.addEventListener('MSAnimationEnd', function(e) {
		       //     alert(e.type)// animationend！！！
		       // })
		       checker = {
		           'AnimationEvent': 'animationend',
		           'WebKitAnimationEvent': 'webkitAnimationEnd'
		       }
		       var ani
		       for (name in checker) {
		           if (window[name]) {
		               ani = checker[name]
		               break
		           }
		       }
		       if (typeof ani === 'string') {
		           var animation = true
		           css = true
		           var animationEndEvent = ani
		       }
		       return {
		           css: css,
		           animation: animation,
		           transition: transition,
		           animationEndEvent: animationEndEvent,
		           transitionEndEvent: transitionEndEvent,
		           transitionDuration: transitionDuration,
		           animationDuration: animationDuration
		       }
		   }
	
		   var support = effectDetect(
		       avalon.cssName('transition-duration'),
		       avalon.cssName('animation-duration'),
		       avalon.window
		   )
	
		   avalon.directive('effect', {
		       priority: 5,
		       diff: function (copy, src, name) {
	
				var is = copy[name]
		           if (typeof is === 'string') {
		               copy[name] = {
		                   is: is
		               }
		               avalon.warn('ms-effect的指令值不再支持字符串,必须是一个对象')
		           }
		           cssDiff.call(this, copy, src, name, 'afterChange')
		       },
		       update: function (dom, vdom, parent, opts) {
				/* istanbul ignore if */
		           if (dom && dom.nodeType === 1) {
		               var name = 'ms-effect'
		               var option = vdom[name] || opts || {}
		               vdom.dynamic[name] = 1
		               var type = option.is
		               /* istanbul ignore if */
		               if (!type) {//如果没有指定类型
		                   return avalon.warn('need is option')
		               }
		               var effects = avalon.effects
		               /* istanbul ignore if */
		               if (support.css && !effects[type]) {
		                   avalon.effect(type)
		               }
		               var globalOption = effects[type]
		               /* istanbul ignore if */
		               if (!globalOption) {//如果没有定义特效
		                   return avalon.warn(type + ' effect is undefined')
		               }
		               var finalOption = {}
		               var action = option.action
		               if (typeof action === 'boolean') {
		                   finalOption.action = action ? 'enter' : 'leave'
		               }
		               var Effect = avalon.Effect
		               /* istanbul ignore if */
	
		               var effect = new Effect(dom)
		               avalon.mix(finalOption, globalOption, option)
		               dom.animating = finalOption.action
		               /* istanbul ignore if */
		               /* istanbul ignore else */
		               if (finalOption.queue) {
		                   animationQueue.push(function () {
		                       effect[action](finalOption)
		                   })
		                   callNextAnimation()
		               } else {
		                   setTimeout(function () {
		                       effect[action](finalOption)
		                   }, 4)
		               }
		           }
	
		       }
		   })
	
	
		   var animationQueue = []
		   function callNextAnimation() {
		       var fn = animationQueue[0]
		       if (fn) {
		           fn()
		       }
		   }
	
	
		   avalon.effect = function (name, opts) {
		       var definition = avalon.effects[name] = (opts || {})
		       if (support.css && definition.css !== false) {
		           patchObject(definition, 'enterClass', name + '-enter')
		           patchObject(definition, 'enterActiveClass', definition.enterClass + '-active')
		           patchObject(definition, 'leaveClass', name + '-leave')
		           patchObject(definition, 'leaveActiveClass', definition.leaveClass + '-active')
	
		       }
		       patchObject(definition, 'action', 'enter')
	
		   }
	
		   function patchObject(obj, name, value) {
		       if (!obj[name]) {
		           obj[name] = value
		       }
		   }
	
		   var Effect = function (el) {
		       this.el = el
		   }
	
		   avalon.Effect = Effect
	
		   Effect.prototype = {
		       enter: createAction('Enter'),
		       leave: createAction('Leave'),
		       move: createAction('Move')
		   }
	
		   var rsecond = /\d+s$/
		   function toMillisecond(str) {
		       var ratio = rsecond.test(str) ? 1000 : 1
		       return parseFloat(str) * ratio
		   }
	
		   function execHooks(options, name, el) {
		       var list = options[name]
		       list = Array.isArray(list) ? list : typeof list === 'function' ? [list] : []
		       list.forEach(function (fn) {
		           fn && fn(el)
		       })
		   }
		   var staggerCache = new Cache(128)
	
		   function createAction(action) {
		       var lower = action.toLowerCase()
		       return function (option) {
		           var elem = this.el
		           var $el = avalon(elem)
		           var isAnimateDone
		           var staggerTime = isFinite(option.stagger) ? option.stagger * 1000 : 0
		           /* istanbul ignore if */
		           if (staggerTime) {
		               if (option.staggerKey) {
		                   var stagger = staggerCache.get(option.staggerKey) ||
							staggerCache.put(option.staggerKey, {
								count: 0,
								items: 0
							})
		                   stagger.count++
		                   stagger.items++
		               }
		           }
		           var staggerIndex = stagger && stagger.count || 0
		           var animationDone = function (e) {
		               var isOk = e !== false
		               if (--elem.__ms_effect_ === 0) {
		                   avalon.unbind(elem, support.transitionEndEvent)
		                   avalon.unbind(elem, support.animationEndEvent)
		               }
		               elem.animating = void 0
		               isAnimateDone = true
		               var dirWord = isOk ? 'Done' : 'Abort'
		               execHooks(option, 'on' + action + dirWord, elem)
	
		               if (stagger) {
		                   if (--stagger.items === 0) {
		                       stagger.count = 0
		                   }
		               }
		               if (option.queue) {
		                   animationQueue.shift()
		                   callNextAnimation()
		               }
		           }
		           execHooks(option, 'onBefore' + action, elem)
		           /* istanbul ignore if */
		           /* istanbul ignore else */
		           if (option[lower]) {
		               option[lower](elem, function (ok) {
		                   animationDone(ok !== false)
		               })
		           } else if (support.css) {
		               $el.addClass(option[lower + 'Class'])
		               if (lower === 'leave') {
		                   $el.removeClass(option.enterClass + ' ' + option.enterActiveClass)
		               } else if (lower === 'enter') {
		                   $el.removeClass(option.leaveClass + ' ' + option.leaveActiveClass)
		               }
		               if (!elem.__ms_effect_) {
		                   $el.bind(support.transitionEndEvent, animationDone)
		                   $el.bind(support.animationEndEvent, animationDone)
		                   elem.__ms_effect_ = 1
		               } else {
		                   elem.__ms_effect_++
		               }
		               setTimeout(function () {
		                   isAnimateDone = avalon.root.offsetWidth === NaN
		                   $el.addClass(option[lower + 'ActiveClass'])
		                   var computedStyles = window.getComputedStyle(elem)
		                   var tranDuration = computedStyles[support.transitionDuration]
		                   var animDuration = computedStyles[support.animationDuration]
		                   var time = toMillisecond(tranDuration) || toMillisecond(animDuration)
		                   if (!time === 0) {
		                       animationDone(false)
		                   } else if (!staggerTime) {
		                       setTimeout(function () {
		                           if (!isAnimateDone) {
		                               animationDone(false)
		                           }
		                       }, time + 32)
		                   }
		               }, 17 + staggerTime * staggerIndex)// = 1000/60
		           }
		       }
		   }
	
		   avalon.applyEffect = function (node, vnode, opts) {
		       var cb = opts.cb
		       var curEffect = vnode['ms-effect']
		       if (curEffect && node && node.nodeType === 1) {
		           var hook = opts.hook
		           var old = curEffect[hook]
		           if (cb) {
		               if (Array.isArray(old)) {
		                   old.push(cb)
		               } else if (old) {
		                   curEffect[hook] = [old, cb]
		               } else {
		                   curEffect[hook] = [cb]
		               }
		           }
		           getAction(opts)
		           avalon.directives.effect.update(node, vnode, 0, avalon.shadowCopy({}, opts))
	
		       } else if (cb) {
		           cb(node)
		       }
		   }
	
		   function getAction(opts) {
		       if (!opts.acton) {
		           opts.action = opts.hook.replace(/^on/, '').replace(/Done$/, '').toLowerCase()
		       }
		   }
	
		/* 
		 * 将要检测的字符串的字符串替换成??123这样的格式
		 */
		   var stringNum = 0
		   var stringPool = {
		       map: {}
		   }
		   var rfill = /\?\?\d+/g
		   function dig(a) {
		       var key = '??' + stringNum++
		       stringPool.map[key] = a
		       return key + ' '
		   }
		   function fill(a) {
		       var val = stringPool.map[a]
		       return val
		   }
		   function clearString(str) {
		       var array = readString(str)
		       for (var i = 0, n = array.length; i < n; i++) {
		           str = str.replace(array[i], dig)
		       }
		       return str
		   }
	
		   function readString(str) {
		       var end, s = 0
		       var ret = []
		       for (var i = 0, n = str.length; i < n; i++) {
		           var c = str.charAt(i)
		           if (!end) {
		               if (c === "'") {
		                   end = "'"
		                   s = i
		               } else if (c === '"') {
		                   end = '"'
		                   s = i
		               }
		           } else {
		               if (c === '\\') {
		                   i += 1
		                   continue
		               }
		               if (c === end) {
		                   ret.push(str.slice(s, i + 1))
		                   end = false
		               }
		           }
		       }
		       return ret
		   }
	
		   //如果直接将tr元素写table下面,那么浏览器将将它们(相邻的那几个),放到一个动态创建的tbody底下
		   function addTbody(nodes) {
		       var tbody, needAddTbody = false, count = 0, start = 0, n = nodes.length
		       for (var i = 0; i < n; i++) {
		           var node = nodes[i]
		           if (!tbody) {
		               if ((node.type || node.nodeName) === 'tr') {
		                   //收集tr及tr两旁的注释节点
		                   tbody = {
		                       nodeName: 'tbody',
		                       children: []
		                   }
		                   tbody.children.push(node)
		                   if (node.type) {
		                       delete node.type
		                   }
		                   needAddTbody = true
		                   if (start === 0)
		                       start = i
		                   nodes[i] = tbody
		               }
		           } else {
		               if (node.nodeName !== 'tr' && node.children) {
		                   tbody = false
		               } else {
		                   tbody.children.push(node)
		                   count++
		                   nodes[i] = 0
		               }
		           }
		       }
	
		       if (needAddTbody) {
		           for (i = start; i < n; i++) {
		               if (nodes[i] === 0) {
		                   nodes.splice(i, 1)
		                   i--
		                   count--
		                   if (count === 0) {
		                       break
		                   }
		               }
		           }
		       }
		   }
	
		/* 
		 *  处理一些特殊情况, 只用于文本转虚拟DOM
		 */
	
	
		   function variantSpecial(node, nodeName, innerHTML) {
		       switch (nodeName) {
		           case 'style':
		           case 'script':
		           case 'noscript':
		           case 'template':
		           case 'xmp':
		               node.children = [{
		                   nodeName: '#text',
		                   skipContent: true,
		                   nodeValue: innerHTML
		               }]
		               break
		           case 'textarea':
		               var props = node.props
		               props.type = nodeName
		               props.value = innerHTML
		               node.children = [{
		                   nodeName: '#text',
		                   nodeValue: innerHTML
		               }]
		               break
		           case 'option':
		               node.children = [{
		                   nodeName: '#text',
		                   nodeValue: trimHTML(innerHTML)
		               }]
		               break
		       }
	
		   }
	
		   //专门用于处理option标签里面的标签
		   var rtrimHTML = /<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi
		   function trimHTML(v) {
		       return String(v).replace(rtrimHTML, '').trim()
		   }
	
		   var specialTag = avalon.oneObject('script,style,textarea,xmp,noscript,option,template')
	
		   var ropenTag = /^<([-A-Za-z0-9_]+)\s*([^>]*?)(\/?)>/
		   var rendTag = /^<\/([^>]+)>/
		   //https://github.com/rviscomi/trunk8/blob/master/trunk8.js
		   //判定里面有没有内容
		   var rcontent = /\S/
		   function makeNode(str) {
		       stringPool.map = {}
		       str = clearString(str)
		       var stack = []
		       stack.last = function () {
		           return stack[stack.length - 1]
		       }
		       var ret = []
	
		       var breakIndex = 100000
		       do {
		           var node = false
		           if (str.charAt(0) !== '<') {//处理文本节点
		               var i = str.indexOf('<')
		               i = i === -1 ? str.length : i
		               var nodeValue = str.slice(0, i).replace(rfill, fill)
		               str = str.slice(i)
		               node = {
		                   nodeName: '#text',
		                   nodeValue: nodeValue
		               }
		               if (rcontent.test(nodeValue)) {
		                   makeChildren(node, stack, ret)//不收集空白节点
		               }
		           }
		           if (!node) {
		               var i = str.indexOf('<!--')//处理注释节点
		               /* istanbul ignore if*/
		               if (i === 0) {
		                   var l = str.indexOf('-->')
		                   if (l === -1) {
		                       avalon.error('注释节点没有闭合' + str)
		                   }
		                   var nodeValue = str.slice(4, l).replace(rfill, fill)
		                   str = str.slice(l + 3)
		                   node = {
		                       nodeName: '#comment',
		                       nodeValue: nodeValue
		                   }
		                   makeChildren(node, stack, ret)
		               }
	
		           }
		           if (!node) {
		               var match = str.match(ropenTag)//处理元素节点开始部分
		               if (match) {
		                   var nodeName = match[1].toLowerCase()
		                   var isVoidTag = voidTag[nodeName] || match[3] === '\/'
		                   node = {
		                       nodeName: nodeName,
		                       props: {},
		                       children: [],
		                       isVoidTag: isVoidTag
		                   }
	
		                   var attrs = match[2]
		                   if (attrs) {
		                       makeProps(attrs, node.props)
		                   }
		                   makeChildren(node, stack, ret)
		                   str = str.slice(match[0].length)
		                   if (isVoidTag) {
		                       node.end = true
		                   } else {
		                       stack.push(node)
		                       if (specialTag[nodeName]) {
		                           var index = str.indexOf('</' + nodeName + '>')
		                           var innerHTML = str.slice(0, index).trim()
		                           str = str.slice(index)
	
		                           variantSpecial(node, nodeName, nomalString(innerHTML))
	
		                       }
		                   }
		               }
		           }
		           if (!node) {
		               var match = str.match(rendTag)//处理元素节点结束部分
		               if (match) {
		                   var nodeName = match[1].toLowerCase()
		                   var last = stack.last()
		                   /* istanbul ignore if*/
		                   /* istanbul ignore else*/
		                   if (!last) {
		                       avalon.error(match[0] + '前面缺少<' + nodeName + '>')
		                   } else if (last.nodeName !== nodeName) {
		                       avalon.error(last.nodeName + '没有闭合')
		                   }
		                   node = stack.pop()
		                   node.end = true
		                   str = str.slice(match[0].length)
		               }
		           }
	
		           if (!node || --breakIndex === 0) {
		               break
		           }
		           if (node.end) {
		               makeTbody(node, stack, ret)
		               delete node.end
		           }
	
		       } while (str.length);
	
		       return ret
	
		   }
	
	
	
		   function makeTbody(node, stack, ret) {
		       var nodeName = node.nodeName
		       var props = node.props
		       if (nodeName === 'table') {
		           addTbody(node.children)
		       }
		       var forExpr = props['ms-for']
		       //tr两旁的注释节点还会在addTbody中挪一下位置
		       if (forExpr) {
		           delete props['ms-for']
		           var p = stack.last()
		           var arr = p ? p.children : ret
		           arr.splice(arr.length - 1, 1, {
		               nodeName: '#comment',
		               nodeValue: 'ms-for:' + forExpr,
		               type: nodeName
		           }, node, {
		                   nodeName: '#comment',
		                   nodeValue: 'ms-for-end:',
		                   type: nodeName
		               })
	
		       }
		   }
	
	
		   function makeChildren(node, stack, ret) {
		       var p = stack.last()
		       if (p) {
		           p.children.push(node)
		       } else {
		           ret.push(node)
		       }
		   }
	
		   var rlineSp = /[\n\r]s*/g
		   var rattrs = /([^=\s]+)(?:\s*=\s*(\S+))?/
		   function makeProps(attrs, props) {
		       while (attrs) {
		           var arr = rattrs.exec(attrs)
		           if (arr) {
		               var name = arr[1]
		               var value = arr[2] || ''
		               attrs = attrs.replace(arr[0], '')
		               if (name.charAt(0) === ':') {
		                   name = 'ms-' + name.slice(1)
		               }
		               if (value) {
		                   if (value.indexOf('??') === 0) {
		                       value = nomalString(value).
		                           replace(rlineSp, '').
		                           slice(1, -1)
		                   }
		               }
		               if (!(name in props)) {
		                   props[name] = value
		               }
		           } else {
		               break
		           }
		       }
		   }
	
		   function nomalString(str) {
		       return avalon.unescapeHTML(str.replace(rfill, fill))
		   }
	
		   // 防止被引用
		   var emptyObj = function () {
		       return {
		           children: [], props: {}
		       }
		   }
		   var rbinding = /^ms-(\w+)-?(.*)/
	
		   function diff(copys, sources) {
		       for (var i = 0; i < copys.length; i++) {
		           var copy = copys[i]
		           var src = sources[i] || copys[i]
		           switch (copy.nodeName) {
		               case '#text':
		                   if (copy.dynamic) {
		                       var curValue = copy.nodeValue + ''
		                       if (curValue !== src.nodeValue) {
		                           src.nodeValue = curValue
		                           if (src.dom) {
		                               src.dom.nodeValue = curValue
		                           }
		                       }
		                   }
		                   break
		               case '#comment':
		                   if (copy.forExpr) {//比较循环区域的元素位置
		                       directives['for'].diff(copy, src, copys, sources, i)
		                   } else if (copy.afterChange) {
		                       execHooks$1(src, copy.afterChange)
		                   }
		                   break
		               case void (0):
		                   diff(copy, src)//比较循环区域的内容
		                   break
		               case '#document-fragment':
		                   diff(copy.children, src.children)//比较循环区域的内容
		                   break
		               default:
		                   if (copy.dynamic) {
		                       var index = i
		                       if (copy['ms-widget']) {
		                           directives['widget'].diff(copy, src, 'ms-widget', copys, sources, index)
		                           copy = copys[i]
		                           src = sources[i] || emptyObj()
		                           delete copy['ms-widget']
		                       }
	
		                       if ('ms-if' in copy) {
		                           directives['if'].diff(copy, src, 'ms-if', copys, sources, index)
		                           copy = copys[i]
		                           src = sources[i] || emptyObj()
		                           delete copy['ms-if']
		                       }
		                       diffProps(copy, src)
		                   }
	
		                   if (/^\w/.test(copy.nodeName) && !copy.skipContent && !copy.isVoidTag) {
		                       diff(copy.children, src.children || [])
		                   }
	
		                   if (src.afterChange) {
		                       execHooks$1(src, src.afterChange)
		                   }
		                   break
		           }
		       }
		   }
	
		   function execHooks$1(el, hooks) {
		       if (hooks.length) {
		           for (var hook, i = 0; hook = hooks[i++];) {
		               hook(el.dom, el)
		           }
		       }
		       delete el.afterChange
		   }
	
		   function diffProps(copy, source) {
		       try {
		           for (var name in copy) {
		               var match = name.match(rbinding)
		               var type = match && match[1]
		               if (directives[type]) {
		                   directives[type].diff(copy, source, name)
		               }
		           }
	
		       } catch (e) {
		           avalon.warn(type, e, e.stack || e.message, 'diffProps error')
		       }
		   }
	
		   //如果正在更新一个子树,那么将它放到
		   var needRenderIds = []
		   var renderingID = false
		   avalon.suspendUpdate = 0
	
		   function batchUpdate(id) {
		       if (renderingID) {
		           return avalon.Array.ensure(needRenderIds, id)
		       } else {
		           renderingID = id
		       }
		       var scope = avalon.scopes[id]
		       if (!scope || !document.nodeName || avalon.suspendUpdate) {
		           return renderingID = null
		       }
		       var vm = scope.vmodel
		       var dom = vm.$element
		       var source = dom.vtree || []
		       var renderFn = vm.$render
		       var copy = renderFn(scope.vmodel, scope.local)
		       if (scope.isTemp) {
		           //在最开始时,替换作用域的所有节点,确保虚拟DOM与真实DOM是对齐的
		           delete avalon.scopes[id]
		       }
	
		       avalon.diff(copy, source)
	
	
		       var index = needRenderIds.indexOf(renderingID)
		       renderingID = 0
		       if (index > -1) {
		           var removed = needRenderIds.splice(index, 1)
		           return batchUpdate(removed[0])
		       }
	
		       var more = needRenderIds.shift()
		       if (more) {
		           batchUpdate(more)
		       }
		   }
	
		   var rbinding$1 = /^(\:|ms\-)\w+/
		   var eventMap = avalon.oneObject('animationend,blur,change,input,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit')
	
		   function extractBindings(cur, props) {
		       var bindings = []
		       var attrs = {}
		       var skip = 'ms-skip' in props//old
		       var uniq = {}
		       for (var i in props) {
		           var value = props[i], match
		           attrs[i] = props[i]
		           if ((match = i.match(rbinding$1))) {
		               /* istanbul ignore if  */
		               if (skip)
		                   continue
	
		               var arr = i.replace(match[1], '').split('-')
	
		               if (eventMap[arr[0]]) {
		                   arr.unshift('on')
		               }
		               if (arr[0] === 'on') {
		                   arr[2] = parseFloat(arr[2]) || 0
		               }
		               arr.unshift('ms')
		               var type = arr[1]
		               if (directives[type]) {
		                   var binding = {
		                       type: type,
		                       param: arr[2],
		                       name: arr.join('-'),
		                       expr: value,
		                       priority: directives[type].priority || type.charCodeAt(0) * 100
		                   }
	
		                   if (type === 'on') {
		                       binding.priority += arr[3]
		                   }
		                   if (!uniq[binding.name]) {
		                       uniq[binding.name] = value
		                       bindings.push(binding)
		                   }
		               }
		           }
		       }
	
		       cur.props = attrs
	
		       bindings.sort(byPriority)
	
		       return bindings
		   }
	
		   function byPriority(a, b) {
		       return a.priority - b.priority
		   }
	
		   var config$1 = avalon.config
		   var quote$1 = avalon.quote
		   var rident$1 = /^[$a-zA-Z_][$a-zA-Z0-9_]*$/
		   var rstatement = /^\s*var\s+([$\w]+)\s*\=\s*\S+/
		   var skips = { __local__: 1, vmode: 1, dom: 1 }
		   function parseNodes(source, inner) {
		       //ms-important， ms-controller ， ms-for 不可复制，省得死循环
		       //ms-important --> ms-controller --> ms-for --> ms-widget --> ms-effect --> ms-if
		       var buffer = inner ? [] : ['\nvar vnodes = [];']
	
		       for (var i = 0, el; el = source[i++];) {
		           var vnode = parseNode(el)
		           if (el.$prepend) {
		               buffer.push(el.$prepend)
		           }
		           var append = el.$append
		           delete el.$append
		           delete el.$prepend
		           if (vnode) {
		               buffer.push(vnode + '\n')
		           }
		           if (append) {
		               buffer.push(append)
		           }
		       }
		       if (!inner) {
		           buffer.push('return vnodes\n')
		       }
		       return buffer.join('\n')
		   }
	
	
	
		   function parseNode(vdom) {
		       if (!vdom.nodeName)
		           return false
		       switch (vdom.nodeName) {
		           case '#text':
		               if (vdom.dynamic) {
		                   return add(parseText(vdom))
		               } else {
		                   return addTag(vdom)
		               }
	
		           case '#comment':
		               var nodeValue = vdom.nodeValue
		               /* istanbul ignore else  */
		               if (vdom.forExpr) {// 处理ms-for指令
		                   var copy = {
		                       dynamic: true,
		                       vmodel: '__vmodel__'
		                   }
		                   for (var i in vdom) {
		                       if (vdom.hasOwnProperty(i) && !skips[i]) {
		                           copy[i] = vdom[i]
		                       }
		                   }
		                   avalon.directives['for'].parse(copy, vdom, vdom)
	
		                   vdom.$append += avalon.caches[vdom.signature] //vdom.template
		                   return addTag(copy)
		               } else if (nodeValue === 'ms-for-end:') {
		                   vdom.$append = addTag({
		                       nodeName: '#comment',
		                       nodeValue: vdom.signature
	
		                   }) +
		                       ' return vnodes}\n })\n},__local__,vnodes)\n' +
		                       addTag({
		                           nodeName: "#comment",
		                           signature: vdom.signature,
		                           nodeValue: "ms-for-end:"
		                       }) + '\n'
		                   return ''
		               } else if (nodeValue.indexOf('ms-js:') === 0) {//插入JS声明语句
		                   var statement = avalon.parseExpr({
		                       type: 'js',
		                       expr: nodeValue.replace('ms-js:', '')
		                   }) + '\n'
		                   var ret = addTag(vdom)
		                   var match = statement.match(rstatement)
		                   if (match && match[1]) {
		                       vdom.$append = (vdom.$append || '') + statement +
		                           "\n__local__." + match[1] + ' = ' + match[1] + '\n'
		                   } else {
		                       avalon.warn(nodeValue + ' parse fail!')
		                   }
		                   return ret
		               } else {
		                   return addTag(vdom)
		               }
		           default:
		               if (!vdom.dynamic && vdom.skipContent) {
		                   return addTag(vdom)
		               }
	
		               var copy = {
		                   nodeName: vdom.nodeName
		               }
		               var props = vdom.props
		               if (vdom.dynamic) {
		                   copy.dynamic = '{}'
	
		                   var bindings = extractBindings(copy, props)
		                   bindings.map(function (b) {
		                       //将ms-*的值变成函数,并赋给copy.props[ms-*]
		                       //如果涉及到修改结构,则在source添加$append,$prepend
		                       avalon.directives[b.type].parse(copy, vdom, b)
		                       return b.name
		                   })
	
		               } else if (props) {
		                   copy.props = {}
		                   for (var i in props) {
		                       copy.props[i] = props[i]
		                   }
		               }
	
		               if (vdom.isVoidTag) {
		                   copy.isVoidTag = true
		               } else {
		                   if (!('children' in copy)) {
		                       var c = vdom.children
		                       if (c) {
		                           if (vdom.skipContent) {
		                               copy.children = '[' + c.map(function (a) {
		                                   return stringify(a)
		                               }) + ']'
		                           } else if (c.length === 1 && c[0].nodeName === '#text') {
	
		                               if (c[0].dynamic) {
		                                   copy.children = '[' + parseText(c[0]) + ']'
		                               } else {
		                                   copy.children = '[' + stringify(c[0]) + ']'
		                               }
	
		                           } else {
	
		                               copy.children = '(function(){' + parseNodes(c) + '})()'
		                           }
		                       }
		                   }
		               }
		               if (vdom.template)
		                   copy.template = vdom.template
		               if (vdom.skipContent)
		                   copy.skipContent = true
	
		               return addTag(copy)
	
		       }
	
		   }
	
	
	
		   function wrapDelimiter(expr) {
		       return rident$1.test(expr) ? expr : avalon.parseExpr({
		           expr: expr,
		           type: 'text'
		       })
		   }
	
		   function add(a) {
		       return 'vnodes.push(' + a + ');'
		   }
		   function addTag(obj) {
		       return add(stringify(obj))
		   }
	
		   function parseText(el) {
		       var array = extractExpr(el.nodeValue)//返回一个数组
		       var nodeValue = ''
		       if (array.length === 1) {
		           nodeValue = wrapDelimiter(array[0].expr)
		       } else {
		           var token = array.map(function (el) {
		               return el.type ? wrapDelimiter(el.expr) : quote$1(el.expr)
		           }).join(' + ')
		           nodeValue = 'String(' + token + ')'
		       }
		       return '{\nnodeName: "#text",\ndynamic:true,\nnodeValue: ' + nodeValue + '\n}'
		   }
	
		   var rlineSp$1 = /\n\s*/g
	
		   function extractExpr(str) {
		       var ret = []
		       do {//aaa{{@bbb}}ccc
		           var index = str.indexOf(config$1.openTag)
		           index = index === -1 ? str.length : index
		           var value = str.slice(0, index)
		           if (/\S/.test(value)) {
		               ret.push({ expr: avalon._decode(value) })
		           }
		           str = str.slice(index + config$1.openTag.length)
		           if (str) {
		               index = str.indexOf(config$1.closeTag)
		               var value = str.slice(0, index)
		               ret.push({
		                   expr: avalon.unescapeHTML(value.replace(rlineSp$1, '')),
		                   type: 'text'
		               })
		               str = str.slice(index + config$1.closeTag.length)
		           }
		       } while (str.length)
		       return ret
		   }
	
		   var rmsForStart = /^\s*ms\-for\:\s*/
		   var rmsForEnd = /^\s*ms\-for\-end/
		   function variantCommon(array) {
		       hasDirectives(array)
		       return array
		   }
		   //variantCommon
		   var hasDirectives = function (arr) {
		       var nodes = [], hasDir = false
		       for (var i = 0; i < arr.length; i++) {
		           var el = arr[i]
		           var isComment = el.nodeName === '#comment'
		           if (isComment && rmsForStart.test(el.nodeValue)) {
		               hasDir = true//在startRepeat节点前添加一个数组,收集后面的节点
		               nodes.push(el)
		               var old = nodes
		               nodes = []
		               nodes.list = old
		               nodes.start = el
		           } else if (isComment && rmsForEnd.test(el.nodeValue)) {
		               var old = nodes
		               nodes = old.list
		               var start = old.start
		               delete old.list
		               delete old.start
		               nodes.push(old, el)
		               el.dynamic = true
		               var uuid = start.signature || (start.signature = avalon.makeHashCode('for'))
		               el.signature = uuid
	
		               start.forExpr = start.nodeValue.replace(rmsForStart, '')
		               if (old.length === 1) {
		                   var element = old[0]
		                   if (element.props) {
		                       if (element.props.slot) {
		                           start.props = '{slot: "' + element.props.slot + '"}'
		                       }
		                       var cb = element.props['data-for-rendered']
		                       if (cb) {
		                           delete element.props['data-for-rendered']
		                           var wid = cb + ':cb'
		                           if (!avalon.caches[wid]) {
		                               avalon.caches[wid] = Function('return ' + avalon.parseExpr({
		                                   type: 'on',
		                                   expr: cb
		                               }))()
		                           }
		                           start.wid = wid
		                       }
		                   }
		               }
		               for (var j = 0; j < old.length; j++) {
		                   var el = old[j]
		                   var elem = el.dom
		                   if (elem && elem.parentNode) {//移除真实节点
		                       elem.parentNode.removeChild(elem)
		                   }
		               }
		               start.hasEffect = hasEffect(old)
		               hasDirectives(old)
		               if (!avalon.caches[uuid]) {
		                   avalon.caches[uuid] = parseNodes(old, true)
		               }
		               old.length = 0
		           } else {
		               if (hasDirective(el)) {
		                   hasDir = true
		               }
		               nodes.push(el)
		           }
		       }
		       arr.length = 0
		       arr.push.apply(arr, nodes)
		       return hasDir
		   }
	
	
	
		   function hasDirective(node) {
	
		       var nodeName = node.nodeName
		       switch (nodeName) {
		           case '#text':
		               if (avalon.config.rexpr.test(node.nodeValue)) {
		                   return node.dynamic = true
		               } else {
		                   return false
		               }
		           case '#comment':
		               if (node.dynamic) {
		                   return true
		               }
		               return false
		           case void 0:
		               return true
		           default:
		               var props = node.props || {}
		               if ('ms-skip' in props) {
		                   node.skipContent = true
		                   return false
		               }
		               var flag = false
		               if (nodeName === 'input') {
		                   if (!props.type) {
		                       props.type = 'text'
		                   }
		               } else if (/xmp|wbr|template/.test(nodeName)) {
		                   if (!props['ms-widget'] && props.is) {
		                       props['ms-widget'] = '{is:"' + props.is + '"}'
		                   }
	
		               } else if (nodeName === 'select') {
		                   var postfix = props.hasOwnProperty('multiple') ? 'multiple' : 'one'
		                   props.type = nodeName + '-' + postfix
		               } else if (nodeName.indexOf('ms-') === 0) {
		                   if (!props['ms-widget']) {
		                       props.is = nodeName
		                       props['ms-widget'] = '{is:"' + nodeName + '"}'
		                   }
		               }
		               var childDir = false
		               if (props['ms-widget']) {
		                   childDir = true
		                   delDir(props, 'html', 'widget')
		                   delDir(props, 'text', 'widget')
		                   var clone = avalon.mix({}, node)
		                   var cprops = avalon.mix({}, node.props)
		                   delete cprops['ms-widget']
		                   delete clone.isVoidTag
		                   clone.nodeName = "cheng"
		                   clone.props = cprops
		                   node.template = avalon.vdom(clone, 'toHTML')
		                   if (!node.isVoidTag)
		                       node.children = []
		               }
		               if (props['ms-text']) {
		                   childDir = true
		                   delDir(props, 'html', 'text')
		                   if (!node.isVoidTag) {
		                       node.children = []
		                   }
		               }
		               if (props['ms-html']) {
		                   childDir = true
		                   if (!node.isVoidTag) {
		                       node.children = []
		                   }
		               }
		               var hasProps = false
		               for (var i in props) {
		                   hasProps = true
		                   if (i.indexOf('ms-') === 0) {
		                       flag = true
		                       node.dynamic = {}
		                       break
		                   }
		               }
		               if (hasProps) {
		                   node.props = props
		               }
		               if (node.children) {
		                   var r = hasDirectives(node.children)
		                   if (r) {
		                       delete node.skipContent
		                       return true
		                   }
		                   if (!childDir) {
		                       node.skipContent = true
		                   } else {
		                       delete node.skipContent
		                   }
		               }
		               return flag
		       }
		   }
	
		   function delDir(props, a, b) {
		       if (props['ms-' + a]) {
		           avalon.warn(a, '指令不能与', b, '指令共存于同一个元素')
		           delete props['ms-' + a]
		       }
		   }
	
		   function hasEffect(arr) {
		       for (var i = 0, el; el = arr[i++];) {
		           if (el.props && el.props['ms-effect']) {
		               return true
		           }
		       }
		       return false
		   }
	
		   var pool = avalon.evaluatorPool
	
	
		   var brackets = /\(([^)]*)\)/
		   var rshortCircuit = /\|\|/g
		   var rpipeline = /\|(?=\?\?)/
		   var ruselessSp = /\s*(\.|\|)\s*/g
		   var rhandleName = /^__vmodel__\.[$\w\.]+$/i
	
		   var rguide = /(^|[^\w\u00c0-\uFFFF_])(@|##)(?=[$\w])/g
		   var robjectProperty = /\.[\w\.\$]+/g
		   var rvar = /[$a-zA-Z_][$a-zA-Z0-9_]*/g
		   var rregexp = /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/g
	
	
		   //传入一个包含name, type, expr的对象, 将会返回一个字符串,
		   //并为原对象添加paths, locals属性
		   function parseExpr(binding) {
		       var str = binding.expr
		       var category = binding.type
		       var cache = pool.get(category + ':' + str)
		       if (cache) {
		           avalon.shadowCopy(binding, cache)
		           return cache.text
		       }
		       /* istanbul ignore else  */
		       stringPool.map = {}
		       var paths = {}
		       var locals = {}
		       var input = str.replace(rregexp, dig)//移除所有正则
		       input = clearString(input)      //移除所有字符串
		       input = input.replace(rshortCircuit, dig).//移除所有短路运算符
		           replace(ruselessSp, '$1').//移除.|两端空白
		           replace(rguide, '$1__vmodel__.').//转换@与##
		           replace(/(\b[\$\w]+\s*):/g, dig).
		           replace(/\|(\w+)/g, function (a, b) {//移除所有过滤器的名字
		               return '|' + dig(b)
		           }).
		           replace(/__vmodel__\.([\$\w\.]+)/g, function (_, b) {
		               paths[b] = 1      //收集路径
		               return _
		           })
		       //收集本地变量
		       collectLocal(input, locals)
		       //处理过滤器
		       var filters = input.split(rpipeline)
		       var _body = filters.shift()
		       var body = _body.replace(rfill, fill)
		       //  .replace(rfill, fill)//这里必须fix 两次
		       if (category === 'js') {
		           //<!--ms-js:xxx-->指令不存在过滤器,并且只需要替换@与##
		           return cacheData(binding, body, paths, locals)
		       }
		       if (filters.length) {
		           filters = filters.map(function (filter) {
		               var bracketArgs = '(__value__'
		               filter = filter.replace(brackets, function (a, b) {
		                   if (/\S/.test(b)) {
		                       bracketArgs += ',' + b//还原字符串,正则,短路运算符
		                   }
		                   return ''
		               }).replace(rfill, fill)
		               return (filter.replace(/^(\w+)/, '__value__ =  avalon.__format__("$1")') +
		                   bracketArgs + ')')
		           })
		       }
	
		       var ret = []
		       if (category === 'on') {
		           if (rhandleName.test(body)) {
		               body = body + '($event)'
		           }
		           filters = filters.map(function (el) {
		               return el.replace(/__value__/g, '$event')
		           })
		           if (filters.length) {
		               filters.push('if($event.$return){\n\treturn;\n}')
		           }
		           /* istanbul ignore if  */
		           if (!avalon.modern) {
		               body = body.replace(/__vmodel__\.([^(]+)\(([^)]*)\)/, function (a, b, c) {
		                   return '__vmodel__.' + b + ".call(__vmodel__" + (/\S/.test(c) ? ',' + c : "") + ")"
		               })
		           }
		           ret = ['function ($event, __local__){',
		               'try{',
		               extLocal(locals).join('\n'),
		               '\tvar __vmodel__ = this;',
		               '\t' + body,
		               '}catch(e){',
		               quoteError(str, category),
		               '}',
		               '}']
		           filters.unshift(2, 0)
		       } else if (category === 'duplex') {
		           //给vm同步某个属性
		           var setterBody = [
		               'function (__vmodel__,__value__){',
		               'try{',
		               '\t' + body + ' = __value__',
		               '}catch(e){',
		               quoteError(str, category).replace('parse', 'set'),
		               '}',
		               '}']
		           pool.put('duplex:set:' + binding.expr, setterBody.join('\n').replace(rfill, fill))
		           //对某个值进行格式化
		           var getterBody = [
		               'function (__vmodel__){',
		               'try{',
		               'var __value__ = ' + body,
		               filters.join('\n'),
		               'return __value__',
		               '}catch(e){',
		               quoteError(str, category).replace('parse', 'get'),
		               '}',
		               '}'].join('\n')
		           return cacheData(binding, getterBody, locals, paths)
		       } else {
		           ret = [
		               '(function (){',
		               'try{',
		               'var __value__ = ' + body.replace(rfill, fill),
		               (category === 'text' ?
		                   'return avalon.parsers.string(__value__)' :
		                   'return __value__'),
		               '}catch(e){',
		               quoteError(str, category),
		               '\treturn ""',
		               '}',
		               '})()'
		           ]
		           filters.unshift(3, 0)
		       }
		       ret.splice.apply(ret, filters)
		       return cacheData(binding, ret.join('\n'), locals, paths)
		   }
	
		   function cacheData(binding, text, locals, paths) {
		       text = text.replace(rfill, fill)
		       var obj = {
		           text: text,
		           locals: Object.keys(locals).join(','),
		           paths: Object.keys(paths).join(',')
		       }
		       var key = binding.type + ":" + binding.expr
		       binding.locals = obj.locals
		       binding.paths = obj.paths
		       pool.put(key, obj)
		       return text
		   }
	
		   function collectLocal(str, local) {
		       str.replace(/__vmodel__/, ' ').
		           replace(robjectProperty, ' ').
		           replace(rvar, function (el) {
		               if (el !== '$event' && !avalon.keyMap[el]) {
		                   local[el] = 1
		               }
		           })
		   }
	
		   function extLocal(ret) {
		       var arr = []
		       for (var i in ret) {
		           arr.push('var ' + i + ' = __local__[' + avalon.quote(i) + ']')
		       }
		       return arr
		   }
	
		   function quoteError(str, type) {
		       return '\tavalon.warn(e, ' +
		           avalon.quote('parse ' + type + ' binding【 ' + str + ' 】fail')
		           + ')'
		   }
	
		   avalon.lexer = makeNode
		   avalon.diff = diff
		   avalon.batch = batchUpdate
		   avalon.speedUp = variantCommon
		   avalon.parseExpr = parseExpr
	
	
		   // dispatch与patch 为内置模块
	
		   var rquoteEscapes = /\\\\(['"])/g
		   function render(vtree, local) {
		       var _body = Array.isArray(vtree) ? parseNodes(vtree) : vtree
		       var _local = []
		       if (local) {
		           for (var i in local) {
		               _local.push('var ' + i + ' = __local__[' + quote(i) + ']')
		           }
		       }
		       //处理 props: {"ms-effect": "{is:\\'star\\',action:@action}" 的情况 
		       _body = _body.replace(rquoteEscapes, "$1")
		       var body = '__local__ = __local__ || {};\n' +
		           _local.join(';\n') + '\n' + _body
	
		       try {
		           var fn = Function('__vmodel__', '__local__', body)
		       } catch (e) {
		           avalon.warn(_body, 'render parse error')
		       }
		       return fn
		   }
	
		   avalon.render = render
	
		   var legalTags = { wbr: 1, xmp: 1, template: 1 }
		   var events = 'onInit,onReady,onViewChange,onDispose'
		   var componentEvents = avalon.oneObject(events)
		   var immunity = events.split(',').concat('is', 'define')
		   var onceWarn$1 = true
	
		   function initComponent(src, rawOption, local, template) {
		       var tag = src.nodeName
		       var is = src.props.is
		       //判定用户传入的标签名是否符合规格
		       /* istanbul ignore if */
		       if (!legalTags[tag] && !isCustomTag(tag)) {
		           avalon.warn(tag + '不合适做组件的标签')
		           return
		       }
		       //开始初始化组件
		       var hooks = {}
		       //用户只能操作顶层VM
		       //只有$id,is的对象就是emptyOption
		       /* istanbul ignore if */
		       if (!rawOption) {
		           options = []
		       } else {
		           var options = [].concat(rawOption)
		           options.forEach(function (a) {
		               if (a && typeof a === 'object') {
		                   mixinHooks(hooks, (a.$model || a), true)
		               }
		           })
		       }
		       var definition = avalon.components[is]
		       //如果连组件的定义都没有加载回来,应该立即返回 
		       /* istanbul ignore if */
		       if (!definition) {
		           return
		       }
	
	
		       //得到组件在顶层vm的配置对象名
		       var id = hooks.id || hooks.$id
		       if (!id && onceWarn$1) {
		           avalon.warn('warning!', is, '组件最好在ms-widget配置对象中指定全局不重复的$id以提高性能!\n',
		               '若在ms-for循环中可以利用 ($index,el) in @array 中的$index拼写你的$id\n',
		               '如 ms-widget="{is:\'ms-button\',id:\'btn\'+$index}"'
		           )
		           onceWarn$1 = false
		       }
		       if (hooks.define) {
		           delete hooks.define
		           avalon.warn('warning! 组件的define配置项已经被废掉')
		       }
		       var define = avalon.directives.widget.define
		       //生成组件VM
		       var $id = id || src.props.id || 'w' + (new Date - 0)
		       var defaults = avalon.mix(true, {}, definition.defaults)
		       mixinHooks(hooks, defaults, false)//src.vmodel,
		       var skipProps = immunity.concat()
		       function sweeper(a, b) {
		           skipProps.forEach(function (k) {
		               delete a[k]
		               delete b[k]
		           })
		       }
	
		       sweeper.isWidget = true
		       var vmodel = define.apply(sweeper, [src.vmodel, defaults].concat(options))
		       //增强对IE的兼容
		       /* istanbul ignore if */
		       if (!avalon.modern) {
		           for (var i in vmodel) {
		               if (!$$skipArray$1[i] && typeof vmodel[i] === 'function') {
		                   vmodel[i] = vmodel[i].bind(vmodel)
		               }
		           }
		       }
	
		       vmodel.$id = $id
		       avalon.vmodels[$id] = vmodel
	
		       //绑定组件的生命周期钩子
		       for (var e in componentEvents) {
		           if (hooks[e]) {
		               hooks[e].forEach(function (fn) {
		                   vmodel.$watch(e, fn)
		               })
		           }
		       }
		       // 生成外部的渲染函数
		       // template保存着最原始的组件容器信息
		       // 我们先将它转换成虚拟DOM,如果是xmp, template,
		       // 它们内部是一个纯文本节点, 需要继续转换为虚拟DOM
		       var shell = avalon.lexer(template)
	
	
		       var shellRoot = shell[0]
		       shellRoot.children = shellRoot.children || []
		       shellRoot.props.is = is
		       shellRoot.props.wid = $id
		       avalon.speedUp(shell)
	
		       var render = avalon.render(shell, local)
	
		       //生成内部的渲染函数
		       var finalTemplate = definition.template.trim()
		       if (typeof definition.getTemplate === 'function') {
		           finalTemplate = definition.getTemplate(vmodel, finalTemplate)
		       }
		       var vtree = avalon.lexer(finalTemplate)
	
		       if (vtree.length > 1) {
		           avalon.error('组件必须用一个元素包起来')
		       }
		       var soleSlot = definition.soleSlot
		       replaceSlot(vtree, soleSlot)
		       avalon.speedUp(vtree)
	
		       var render2 = avalon.render(vtree)
	
		       //生成最终的组件渲染函数
		       var str = fnTemplate + ''
		       var zzzzz = soleSlot ? avalon.quote(soleSlot) : "null"
		       str = str.
		           replace('XXXXX', stringifyAnonymous(render)).
		           replace('YYYYY', stringifyAnonymous(render2)).
		           replace('ZZZZZ', zzzzz)
		       var begin = str.indexOf('{') + 1
		       var end = str.lastIndexOf("}")
	
		       var lastFn = Function('vm', 'local', str.slice(begin, end))
	
		       vmodel.$render = lastFn
	
		       src['component-vm:' + is] = vmodel
	
		       return vmodel.$render = lastFn
	
		   }
	
		   function stringifyAnonymous(fn) {
		       return fn.toString().replace('anonymous', '')
		           .replace(/\s*\/\*\*\//g, '')
		   }
	
	
		   function fnTemplate() {
		       var shell = (XXXXX)(vm, local);
		       var shellRoot = shell[0]
		       var vtree = (YYYYY)(vm, local);
		       var component = vtree[0]
	
		       //处理diff
	
		       for (var i in shellRoot) {
		           if (i !== 'children' && i !== 'nodeName') {
		               if (i === 'props') {
		                   avalon.mix(component.props, shellRoot.props)
		               } else {
		                   component[i] = shellRoot[i]
		               }
		           }
		       }
	
	
		       var soleSlot = ZZZZZ
		       var slots = avalon.collectSlots(shellRoot, soleSlot)
		       if (soleSlot && (!slots[soleSlot] || !slots[soleSlot].length)) {
		           slots[soleSlot] = [{
		               nodeName: '#text',
		               nodeValue: vm[soleSlot],
		               dynamic: true
		           }]
		       }
		       avalon.insertSlots(vtree, slots)
	
		       delete component.skipAttrs
		       delete component.skipContent
		       return vtree
	
		   }
	
		   function replaceSlot(vtree, slotName) {
		       for (var i = 0, el; el = vtree[i]; i++) {
		           if (el.nodeName === 'slot') {
		               var name = el.props.name || slotName
	
		               vtree.splice(i, 1, {
		                   nodeName: '#comment',
		                   nodeValue: 'slot:' + name,
		                   dynamic: true,
		                   type: name
		               }, {
		                       nodeName: '#comment',
		                       nodeValue: 'slot-end:'
		                   })
		               i++
		           } else if (el.children) {
		               replaceSlot(el.children, slotName)
		           }
		       }
		   }
	
		   avalon.insertSlots = function (vtree, slots) {
		       for (var i = 0, el; el = vtree[i]; i++) {
		           if (el.nodeName === '#comment' && slots[el.type]) {
		               var args = [i + 1, 0].concat(slots[el.type])
		               vtree.splice.apply(vtree, args)
		               i += slots[el.type].length
		           } else if (el.children) {
		               avalon.insertSlots(el.children, slots)
		           }
		       }
		   }
	
		   avalon.collectSlots = function (node, soleSlot) {
		       var slots = {}
		       if (soleSlot) {
		           slots[soleSlot] = node.children
		           slots.__sole__ = soleSlot
		       } else {
		           node.children.forEach(function (el, i) {
		               var name = el.props && el.props.slot
		               if (!name)
		                   return
		               if (el.forExpr) {
		                   slots[name] = node.children.slice(i, i + 2)
		               } else {
		                   if (Array.isArray(slots[name])) {
		                       slots[name].push(el)
		                   } else {
		                       slots[name] = [el]
		                   }
		               }
		           })
		       }
		       return slots
		   }
	
	
		   //必须以字母开头,结尾以字母或数字结束,中间至少出现一次"-",
		   //并且不能大写字母,特殊符号,"_","$",汉字
		   var rcustomTag = /^[a-z]([a-z\d]+\-)+[a-z\d]+$/
	
		   function isCustomTag(type) {
		       return rcustomTag.test(type) || avalon.components[type]
		   }
	
		   function mixinHooks(target, option, overwrite) {
		       for (var k in option) {
		           var v = option[k]
		           //如果是生命周期钩子,总是不断收集
		           if (componentEvents[k]) {
		               if (k in target) {
		                   target[k].push(v)
		               } else {
		                   target[k] = [option[k]]
		               }
		           } else {
		               if (overwrite) {
		                   target[k] = v
		               }
		           }
		       }
		   }
	
		   function inDomTree(el) {
		       while (el) {
		           if (el.nodeType === 9) {
		               return true
		           }
		           el = el.parentNode
		       }
		       return false
		   }
	
		   function fireDisposeHook(el) {
		       if (el.nodeType === 1 && el.getAttribute('wid') && !inDomTree(el)) {
		           var wid = el.getAttribute('wid')
		           var docker = avalon.scopes[wid]
	
		           if (!docker)
		               return
		           var elemID = el.getAttribute('ms-controller') || el.getAttribute('ms-important')
		           var vm = elemID && avalon.vmodels[elemID] || docker.vmodel
		           vm.$fire("onDispose", {
		               type: 'dispose',
		               target: el,
		               vmodel: vm
		           })
		           if (elemID) {
		               return
		           }
		           if (!el.getAttribute('cached')) {
		               delete docker.vmodel
		               delete avalon.scopes[wid]
		               var v = el.vtree
		               detachEvents(v)
		               var is = el.getAttribute('is')
		               if (v) {
		                   v[0][is + '-mount'] = false
		                   v[0]['component-ready:' + is] = false
		               }
		           }
		           return false
		       }
		   }
		   var rtag = /^\w/
		   function detachEvents(arr) {
		       for (var i in arr) {
		           var el = arr[i]
		           if (rtag.test(el.nodeName)) {
		               for (var i in el) {
		                   if (i.indexOf('ms-on') === 0) {
		                       delete el[i]
		                   }
		               }
		               if (el.children) {
		                   detachEvents(el.children)
		               }
		           }
		       }
		   }
		   function fireDisposeHookDelay(a) {
		       setTimeout(function () {
		           fireDisposeHook(a)
		       }, 4)
		   }
		   function fireDisposeHooks(nodes) {
		       for (var i = 0, el; el = nodes[i++];) {
		           fireDisposeHook(el)
		       }
		   }
	
	
	
		   //http://stackoverflow.com/questions/11425209/are-dom-mutation-observers-slower-than-dom-mutation-events
		   //http://stackoverflow.com/questions/31798816/simple-mutationobserver-version-of-domnoderemovedfromdocument
		   function byMutationEvent(dom) {
		       dom.addEventListener("DOMNodeRemovedFromDocument", function () {
		           fireDisposeHookDelay(dom)
		       })
		   }
		   //用于IE8+, firefox
		   function byRewritePrototype() {
		       if (byRewritePrototype.execute) {
		           return
		       }
		       //https://www.web-tinker.com/article/20618.html?utm_source=tuicool&utm_medium=referral
		       //IE6-8虽然暴露了Element.prototype,但无法重写已有的DOM API
		       byRewritePrototype.execute = true
		       var p = Node.prototype
		       function rewite(name, fn) {
		           var cb = p[name]
		           p[name] = function (a, b) {
		               return fn.call(this, cb, a, b)
		           }
		       }
		       rewite('removeChild', function (fn, a, b) {
		           fn.call(this, a, b)
		           if (a.nodeType === 1) {
		               fireDisposeHookDelay(a)
		           }
		           return a
		       })
	
		       rewite('replaceChild', function (fn, a, b) {
		           fn.call(this, a, b)
		           if (b.nodeType === 1) {
		               fireDisposeHookDelay(b)
		           }
		           return a
		       })
		       //访问器属性需要用getOwnPropertyDescriptor处理
		       var ep = Element.prototype, oldSetter
		       function newSetter(html) {
		           var all = avalon.slice(this.getElementsByTagName('*'))
		           oldSetter.call(this, html)
		           fireDisposeHooks(all)
		       }
		       try {
		           var obj = Object.getOwnPropertyDescriptor(ep, 'innerHTML')
		           var oldSetter = obj.set
		           obj.set = newSetter
		           Object.defineProperty(ep, 'innerHTML', obj)
		       } catch (e) {
		           //safari 9.1.2使用Object.defineProperty重写innerHTML会抛
		           // Attempting to change the setter of an unconfigurable property.
		           if (ep && ep.__lookupSetter__) {
		               oldSetter = ep.__lookupSetter__('innerHTML')
		               ep.__defineSetter__('innerHTML', newSetter)
		           } else {
		               throw e
		           }
		       }
	
		       rewite('appendChild', function (fn, a) {
		           fn.call(this, a)
		           if (a.nodeType === 1 && this.nodeType === 11) {
		               fireDisposeHookDelay(a)
		           }
		           return a
		       })
	
		       rewite('insertBefore', function (fn, a, b) {
		           fn.call(this, a, b)
		           if (a.nodeType === 1 && this.nodeType === 11) {
		               fireDisposeHookDelay(a)
		           }
		           return a
		       })
		   }
	
		   //用于IE6~8
		   var checkDisposeNodes = []
		   var checkID = 0
		   function byPolling(dom) {
		       avalon.Array.ensure(checkDisposeNodes, dom)
		       if (!checkID) {
		           checkID = setInterval(function () {
		               for (var i = 0, el; el = checkDisposeNodes[i];) {
		                   if (false === fireDisposeHook(el)) {
		                       avalon.Array.removeAt(checkDisposeNodes, i)
		                   } else {
		                       i++
		                   }
		               }
		               if (checkDisposeNodes.length == 0) {
		                   clearInterval(checkID)
		                   checkID = 0
		               }
		           }, 700)
		       }
		   }
	
	
		   function disposeComponent(dom) {
		       if (window.chrome && window.MutationEvent) {
		           byMutationEvent(dom)
		       } else {
		           try {
		               byRewritePrototype(dom)
		           } catch (e) {
		               byPolling(dom)
		           }
		       }
		   }
		   disposeComponent.byMutationEvent = byMutationEvent
		   disposeComponent.byRewritePrototype = byRewritePrototype
		   disposeComponent.byPolling = byPolling
	
		   avalon._disposeComponent = disposeComponent
	
		   avalon.component = function (name, definition) {
		       //这是定义组件的分支,并将列队中的同类型对象移除
		       /* istanbul ignore if */
		       if (!avalon.components[name]) {
		           avalon.components[name] = definition
		       }//这里没有返回值
		   }
		   avalon.directive('widget', {
		       priority: 4,
		       parse: function (copy, src, binding) {
		           src.props.wid = src.props.wid || avalon.makeHashCode('w')
		           //将渲染函数的某一部分存起来,渲在c方法中转换为函数
		           copy[binding.name] = avalon.parseExpr(binding)
		           copy.template = src.template
		           copy.vmodel = '__vmodel__'
		           copy.local = '__local__'
		       },
		       define: function () {
		           return avalon.mediatorFactory.apply(this, arguments)
		       },
		       diff: function (copy, src, name, copyList, srcList, index) {
		           var a = copy[name]
		           /* istanbul ignore else */
		           if (Object(a) === a) {
		               //有三个地方可以设置is, 属性,标签名,配置对象
	
		               var is = src.props.is || (/^ms\-/.test(src.nodeName) ? src.nodeName : 0)
	
		               if (!is) {//开始大费周章地获取组件的类型
		                   a = a.$model || a//安全的遍历VBscript
		                   if (Array.isArray(a)) {//转换成对象
		                       a.unshift({})// 防止污染旧数据
		                       avalon.mix.apply(0, a)
		                       a = a.shift()
		                   }
		                   is = a.is
		               }
		               var vmName = 'component-vm:' + is
	
		               src.props.is = is
		               src.vmodel = copy.vmodel
		               //如果组件没有初始化,那么先初始化(生成对应的vm,$render)
		               if (!src[vmName]) {
		                   /* istanbul ignore if */
		                   if (!initComponent(src, copy[name], copy.local, copy.template)) {
		                       //替换成注释节点
		                       src.nodeValue = 'unresolved component placeholder'
		                       copyList[index] = src
		                       update(src, this.mountComment)
		                       return
		                   }
		               }
	
		               //如果已经存在于avalon.scopes
		               var comVm = src[vmName]
		               var scope = avalon.scopes[comVm.$id]
		               if (scope && scope.vmodel) {
		                   var com = scope.vmodel.$element
		                   if (src.dom !== com) {
		                       var component = com.vtree[0]
		                       srcList[index] = copyList[index] = component
		                       src.com = com
		                       if (!component.skipContent) {
		                           component.skipContent = 'optimize'
		                       }
	
		                       update(src, this.replaceCachedComponent)
	
		                       update(component, function () {
		                           if (component.skipContent === 'optimize') {
		                               component.skipContent = true
		                           }
		                       }, 'afterChange')
		                       return
		                   }
		               }
		               var render = comVm.$render
		               var tree = render(comVm, copy.local)
		               var component = tree[0]
		               /* istanbul ignore if */
		               /* istanbul ignore else */
		               if (component && isComponentReady(component)) {
		                   component.local = copy.local
		                   Array(
		                       vmName,
		                       'component-html:' + is,
		                       'component-ready:' + is,
		                       'dom', 'dynamic'
		                   ).forEach(function (name) {
		                       component[name] = src[name]
		                   })
		                   component.vmodel = comVm
		                   copyList[index] = component
		                   // 如果与ms-if配合使用, 会跑这分支
		                   if (src.comment && src.nodeValue) {
		                       component.dom = src.comment
		                   }
		                   if (src.nodeName !== component.nodeName) {
		                       srcList[index] = component
		                       update(component, this.mountComponent)
		                   } else {
		                       update(src, this.updateComponent)
		                   }
		               } else {
	
		                   src.nodeValue = 'unresolved component placeholder'
		                   copyList[index] = {
		                       nodeValue: 'unresolved component placeholder',
		                       nodeName: '#comment'
		                   }
		                   update(src, this.mountComment)
		               }
		           } else {
		               if (src.props.is === copy.props.is) {
		                   update(src, this.updateComponent)
		               }
		           }
		       },
		       replaceCachedComponent: function (dom, vdom, parent) {
		           var com = vdom.com
		           parent.replaceChild(com, dom)
		           vdom.dom = com
		           delete vdom.com
		       },
		       mountComment: function (dom, vdom, parent) {
		           var comment = document.createComment(vdom.nodeValue)
		           vdom.dom = comment
		           parent.replaceChild(comment, dom)
		       },
		       updateComponent: function (dom, vdom) {
		           var vm = vdom["component-vm:" + vdom.props.is]
		           var viewChangeObservers = vm.$events.onViewChange
		           if (viewChangeObservers && viewChangeObservers.length) {
		               update(vdom, viewChangeHandle, 'afterChange')
		           }
		       },
		       mountComponent: function (dom, vdom, parent) {
		           delete vdom.dom
		           var com = avalon.vdom(vdom, 'toDOM')
	
		           var is = vdom.props.is
		           var vm = vdom['component-vm:' + is]
		           vm.$fire('onInit', {
		               type: 'init',
		               vmodel: vm,
		               is: is
		           })
	
		           parent.replaceChild(com, dom)
	
		           vdom.dom = vm.$element = com
		           com.vtree = [vdom]
		           avalon._disposeComponent(com)
		           vdom['component-ready:' + is] = true
		           //--------------
		           avalon.scopes[vm.$id] = {
		               vmodel: vm,
		               top: vdom.vmodel,
		               local: vdom.local
		           }
		           //--------------
		           update(vdom, function () {
		               vm.$fire('onReady', {
		                   type: 'ready',
		                   target: com,
		                   vmodel: vm,
		                   is: is
		               })
		           }, 'afterChange')
	
		           update(vdom, function () {
		               vdom['component-html:' + is] = avalon.vdom(vdom, 'toHTML')
		           }, 'afterChange')
		       }
		   })
	
	
	
		   function viewChangeHandle(dom, vdom) {
		       var is = vdom.props.is
		       var vm = vdom['component-vm:' + is]
		       var html = 'component-html:' + is
		       var preHTML = vdom[html]
		       var curHTML = avalon.vdom(vdom, 'toHTML')
		       if (preHTML !== curHTML) {
		           vdom[html] = curHTML
		           vm.$fire('onViewChange', {
		               type: 'viewchange',
		               target: dom,
		               vmodel: vm,
		               is: is
		           })
		       }
		   }
	
	
	
		   function isComponentReady(vnode) {
		       var isReady = true
		       try {
		           hasUnresolvedComponent(vnode)
		       } catch (e) {
		           isReady = false
		       }
		       return isReady
		   }
	
		   function hasUnresolvedComponent(vnode) {
		       vnode.children.forEach(function (el) {
		           if (el.nodeName === '#comment') {
		               if (el.nodeValue === 'unresolved component placeholder') {
		                   throw 'unresolved'
		               }
		           } else if (el.children) {
		               hasUnresolvedComponent(el)
		           }
		       })
		   }
	
		   return avalon;
	
	}));
	


/***/ },
/* 2 */
/***/ function(module, exports) {

	/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	
	
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {
	
		/*
		 * 
		 * version 1.0
		 * built in 2015.11.19
		 */
	
		var mmHistory = __webpack_require__(6)
		var storage = __webpack_require__(7)
	
		function Router() {
		    this.rules = []
		}
	
	
		var placeholder = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g
		Router.prototype = storage
		avalon.mix(storage, {
		    error: function (callback) {
		        this.errorback = callback
		    },
		    _pathToRegExp: function (pattern, opts) {
		        var keys = opts.keys = [],
		                //      segments = opts.segments = [],
		                compiled = '^', last = 0, m, name, regexp, segment;
	
		        while ((m = placeholder.exec(pattern))) {
		            name = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
		            regexp = m[4] || (m[1] == '*' ? '.*' : 'string')
		            segment = pattern.substring(last, m.index);
		            var type = this.$types[regexp]
		            var key = {
		                name: name
		            }
		            if (type) {
		                regexp = type.pattern
		                key.decode = type.decode
		            }
		            keys.push(key)
		            compiled += quoteRegExp(segment, regexp, false)
		            //  segments.push(segment)
		            last = placeholder.lastIndex
		        }
		        segment = pattern.substring(last);
		        compiled += quoteRegExp(segment) + (opts.strict ? opts.last : "\/?") + '$';
		        var sensitive = typeof opts.caseInsensitive === "boolean" ? opts.caseInsensitive : true
		        //  segments.push(segment);
		        opts.regexp = new RegExp(compiled, sensitive ? 'i' : undefined);
		        return opts
	
		    },
		    //添加一个路由规则
		    add: function (path, callback, opts) {
		        var array = this.rules
		        if (path.charAt(0) !== "/") {
		            avalon.error("avalon.router.add的第一个参数必须以/开头")
		        }
		        opts = opts || {}
		        opts.callback = callback
		        if (path.length > 2 && path.charAt(path.length - 1) === "/") {
		            path = path.slice(0, -1)
		            opts.last = "/"
		        }
		        avalon.Array.ensure(array, this._pathToRegExp(path, opts))
		    },
		    //判定当前URL与已有状态对象的路由规则是否符合
		    route: function (path, query) {
		        path = path.trim()
		        var rules = this.rules
		        for (var i = 0, el; el = rules[i++]; ) {
		            var args = path.match(el.regexp)
		            if (args) {
		                el.query = query || {}
		                el.path = path
		                el.params = {}
		                var keys = el.keys
		                args.shift()
		                if (keys.length) {
		                    this._parseArgs(args, el)
		                }
		                return  el.callback.apply(el, args)
		            }
		        }
		        if (this.errorback) {
		            this.errorback()
		        }
		    },
		    _parseArgs: function (match, stateObj) {
		        var keys = stateObj.keys
		        for (var j = 0, jn = keys.length; j < jn; j++) {
		            var key = keys[j]
		            var value = match[j] || ''
		            if (typeof key.decode === 'function') {//在这里尝试转换参数的类型
		                var val = key.decode(value)
		            } else {
		                try {
		                    val = JSON.parse(value)
		                } catch (e) {
		                    val = value
		                }
		            }
		            match[j] = stateObj.params[key.name] = val
		        }
		    },
		    /*
		     *  @interface avalon.router.navigate 设置历史(改变URL)
		     *  @param hash 访问的url hash   
		     */
		    navigate: function (hash, mode) {
		        var parsed = parseQuery(hash)
		        this.route(parsed.path, parsed.query)
		        //保存到本地储存或cookie
		        avalon.router.setLastPath(hash)
		        // 模式0, 不改变URL, 不产生历史实体, 执行回调
		        // 模式1, 改变URL, 不产生历史实体,   执行回调
		        // 模式2, 改变URL, 产生历史实体,    执行回调
		        if (mode === 1) {
		            avalon.history.setHash(hash, true)
		        } else if (mode === 2) {
		            avalon.history.setHash(hash)
		        }
		    },
		    /*
		     *  @interface avalon.router.when 配置重定向规则
		     *  @param path 被重定向的表达式，可以是字符串或者数组
		     *  @param redirect 重定向的表示式或者url
		     */
		    when: function (path, redirect) {
		        var me = this,
		                path = path instanceof Array ? path : [path]
		        avalon.each(path, function (index, p) {
		            me.add(p, function () {
		                var info = me.urlFormate(redirect, this.params, this.query)
		                me.navigate(info.path + info.query)
		            })
		        })
		        return this
		    },
		    urlFormate: function (url, params, query) {
		        var query = query ? queryToString(query) : "",
		                hash = url.replace(placeholder, function (mat) {
		                    var key = mat.replace(/[\{\}]/g, '').split(":")
		                    key = key[0] ? key[0] : key[1]
		                    return params[key] !== undefined ? params[key] : ''
		                }).replace(/^\//g, '')
		        return {
		            path: hash,
		            query: query
		        }
		    },
		    /* *
		     `'/hello/'` - 匹配'/hello/'或'/hello'
		     `'/user/:id'` - 匹配 '/user/bob' 或 '/user/1234!!!' 或 '/user/' 但不匹配 '/user' 与 '/user/bob/details'
		     `'/user/{id}'` - 同上
		     `'/user/{id:[^/]*}'` - 同上
		     `'/user/{id:[0-9a-fA-F]{1,8}}'` - 要求ID匹配/[0-9a-fA-F]{1,8}/这个子正则
		     `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
		     path into the parameter 'path'.
		     `'/files/*path'` - ditto.
		     */
		    // avalon.router.get("/ddd/:dddID/",callback)
		    // avalon.router.get("/ddd/{dddID}/",callback)
		    // avalon.router.get("/ddd/{dddID:[0-9]{4}}/",callback)
		    // avalon.router.get("/ddd/{dddID:int}/",callback)
		    // 我们甚至可以在这里添加新的类型，avalon.router.$type.d4 = { pattern: '[0-9]{4}', decode: Number}
		    // avalon.router.get("/ddd/{dddID:d4}/",callback)
		    $types: {
		        date: {
		            pattern: "[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])",
		            decode: function (val) {
		                return new Date(val.replace(/\-/g, "/"))
		            }
		        },
		        string: {
		            pattern: "[^\\/]*",
		            decode: function (val) {
		                return val;
		            }
		        },
		        bool: {
		            decode: function (val) {
		                return parseInt(val, 10) === 0 ? false : true;
		            },
		            pattern: "0|1"
		        },
		        'int': {
		            decode: function (val) {
		                return parseInt(val, 10);
		            },
		            pattern: "\\d+"
		        }
		    }
		})
	
	
		module.exports = avalon.router = new Router
	
	
		function parseQuery(url) {
		    var array = url.split("?"), query = {}, path = array[0], querystring = array[1]
		    if (querystring) {
		        var seg = querystring.split("&"),
		                len = seg.length, i = 0, s;
		        for (; i < len; i++) {
		            if (!seg[i]) {
		                continue
		            }
		            s = seg[i].split("=")
		            query[decodeURIComponent(s[0])] = decodeURIComponent(s[1])
		        }
		    }
		    return {
		        path: path,
		        query: query
		    }
		}
	
	
		function queryToString(obj) {
		    if (typeof obj === 'string')
		        return obj
		    var str = []
		    for (var i in obj) {
		        if (i === "query")
		            continue
		        str.push(i + '=' + encodeURIComponent(obj[i]))
		    }
		    return str.length ? '?' + str.join("&") : ''
		}
	
	
		function quoteRegExp(string, pattern, isOptional) {
		    var result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
		    if (!pattern)
		        return result;
		    var flag = isOptional ? '?' : '';
		    return result + flag + '(' + pattern + ')' + flag;
		}
	
	
	/***/ },
	/* 1 */,
	/* 2 */,
	/* 3 */,
	/* 4 */,
	/* 5 */,
	/* 6 */
	/***/ function(module, exports) {
	
		/*!
		 * mmHistory
		 * 用于监听地址栏的变化
		 * https://github.com/flatiron/director/blob/master/lib/director/browser.js
		 * https://github.com/visionmedia/page.js/blob/master/page.js
		 */
	
		var location = document.location
		var oldIE = avalon.msie <= 7
		var supportPushState = !!(window.history.pushState)
		var supportHashChange = !!("onhashchange" in window && (!window.VBArray || !oldIE))
		var defaults = {
		    root: "/",
		    html5: false,
		    hashPrefix: "!",
		    iframeID: null, //IE6-7，如果有在页面写死了一个iframe，这样似乎刷新的时候不会丢掉之前的历史
		    interval: 50, //IE6-7,使用轮询，这是其时间时隔,
		    autoScroll: false
		}
		var mmHistory = {
		    hash: getHash(location.href),
		    check: function () {
		        var h = getHash(location.href)
		        if (h !== this.hash) {
		            this.hash = h
		            this.onHashChanged()
		        }
		    },
		    fire: function () {
		        switch (this.mode) {
		            case 'popstate':
		                window.onpopstate()
		                break
		            case 'hashchange':
		                window.onhashchange()
		                break
		            default:
		                this.onHashChanged()
		                break
		        }
	
		    },
		    start: function (options) {
		        if (this.started)
		            throw new Error('avalon.history has already been started')
		        this.started = true
		        //监听模式
		        if (typeof options === 'boolean') {
		            options = {
		                html5: options
		            }
		        }
	
		        options = avalon.mix({}, defaults, options || {})
		        if (options.fireAnchor) {
		            options.autoScroll = true
		        }
		        var rootPath = options.root
		        if (!/^\//.test(rootPath)) {
		            avalon.error('root配置项必须以/字符开始, 以非/字符结束')
		        }
		        if (rootPath.length > 1) {
		            options.root = rootPath.replace(/\/$/, '')
		        }
		        var html5Mode = options.html5
		        this.options = options
		        this.mode = html5Mode ? "popstate" : "hashchange"
		        if (!supportPushState) {
		            if (html5Mode) {
		                avalon.warn("浏览器不支持HTML5 pushState，平稳退化到onhashchange!")
		            }
		            this.mode = "hashchange"
		        }
		        if (!supportHashChange) {
		            this.mode = "iframepoll"
		        }
		        avalon.log('avalon run mmHistory in the ', this.mode, 'mode')
		        //IE6不支持maxHeight, IE7支持XMLHttpRequest, IE8支持window.Element，querySelector, 
		        //IE9支持window.Node, window.HTMLElement, IE10不支持条件注释
		        // 支持popstate 就监听popstate
		        // 支持hashchange 就监听hashchange(IE8,IE9,FF3)
		        // 否则的话只能每隔一段时间进行检测了(IE6, IE7)
		        switch (this.mode) {
		            case "popstate" :
		                // At least for now HTML5 history is available for 'modern' browsers only
		                // There is an old bug in Chrome that causes onpopstate to fire even
		                // upon initial page load. Since the handler is run manually in init(),
		                // this would cause Chrome to run it twise. Currently the only
		                // workaround seems to be to set the handler after the initial page load
		                // http://code.google.com/p/chromium/issues/detail?id=63040
		                setTimeout(function () {
		                    window.onpopstate = mmHistory.onHashChanged
		                }, 500)
		                break
		            case "hashchange":
		                window.onhashchange = mmHistory.onHashChanged
		                break
		            case "iframepoll":
		                avalon.ready(function () {
		                    var iframe = document.createElement('iframe')
		                    iframe.id = options.iframeID
		                    iframe.style.display = 'none'
		                    document.body.appendChild(iframe)
		                    mmHistory.iframe = iframe
		                    mmHistory.writeFrame('')
		                    if (avalon.msie) {
		                        function onPropertyChange() {
		                            if (event.propertyName === 'location') {
		                                mmHistory.check()
		                            }
		                        }
		                        document.attachEvent('onpropertychange', onPropertyChange)
		                        mmHistory.onPropertyChange = onPropertyChange
		                    }
	
		                    mmHistory.intervalID = window.setInterval(function () {
		                        mmHistory.check()
		                    }, options.interval)
	
		                })
		                break
		        }
		        //页面加载时触发onHashChanged
		        this.onHashChanged()
		    },
		    stop: function () {
		        switch (this.mode) {
		            case "popstate" :
		                window.onpopstate = avalon.noop
		                break
		            case "hashchange":
		                window.onhashchange = avalon.noop
		                break
		            case "iframepoll":
		                if (this.iframe) {
		                    document.body.removeChild(this.iframe)
		                    this.iframe = null
		                }
		                if (this.onPropertyChange) {
		                    document.detachEvent('onpropertychange', this.onPropertyChange)
		                }
		                clearInterval(this.intervalID)
		                break
		        }
		        this.started = false
		    },
		    setHash: function (s, replace) {
		        // Mozilla always adds an entry to the history
		        switch (this.mode) {
		            case 'iframepoll':
		                if (replace) {
		                    var iframe = this.iframe
		                    if (iframe) {
		//contentWindow 兼容各个浏览器，可取得子窗口的 window 对象。
		//contentDocument Firefox 支持，> ie8 的ie支持。可取得子窗口的 document 对象。
		                        iframe.contentWindow._hash = s
		                    }
		                } else {
		                    this.writeFrame(s)
		                }
		                break
		            case 'popstate':
		                //http://stackoverflow.com/questions/9235304/how-to-replace-the-location-hash-and-only-keep-the-last-history-entry
		                var path = (this.options.root + '/' + s).replace(/\/+/g, '/')
		                if (replace) {
		                    window.history.replaceState({}, document.title, path)
		                } else {
		                    window.history.pushState({}, document.title, path)
		                }
		                // Fire an onpopstate event manually since pushing does not obviously
		                // trigger the pop event.
		                this.fire()
		                break
		            default:
		                var newHash = this.options.hashPrefix + s
		                if (replace && location.hash !== newHash) {
		                    history.back()
		                }
		                location.hash = newHash
		                break
		        }
	
		        return this
		    },
		    writeFrame: function (s) {
		        // IE support...
		        var f = mmHistory.iframe
		        var d = f.contentDocument || f.contentWindow.document
		        d.open()
		        d.write("<script>_hash = '" + s + "'; onload = parent.avalon.history.syncHash;<script>")
		        d.close()
		    },
		    syncHash: function () {
		        // IE support...
		        var s = this._hash
		        if (s !== getHash(location.href)) {
		            location.hash = s
		        }
		        return this
		    },
		    getPath: function () {
		        var path = location.pathname
		        var path = path.split(this.options.root)[1]
		        if (path.charAt(0) !== '/') {
		            path = '/' + path
		        }
		        return path
		    },
		    onHashChanged: function (hash, onClick) {
		        if (!onClick) {
		            hash = mmHistory.mode === 'popstate' ? mmHistory.getPath() :
		                    location.href.replace(/.*#!?/, '')
		        }
		        hash = decodeURIComponent(hash)
	
		        hash = hash.charAt(0) === '/' ? hash : '/' + hash
		        if (hash !== mmHistory.hash) {
		            mmHistory.hash = hash
		            avalon.log('onHashChanged', hash)
		            if (onClick) {
		                mmHistory.setHash(hash)
		            }
		            if (avalon.router) {
		                avalon.router.navigate(hash, 0)
		            }
		            if (onClick && mmHistory.options.autoScroll) {
		                autoScroll(hash.slice(1))
		            }
		        }
	
		    }
		}
	
		function getHash(path) {
		    // IE6直接用location.hash取hash，可能会取少一部分内容
		    // 比如 http://www.cnblogs.com/rubylouvre#stream/xxxxx?lang=zh_c
		    // ie6 => location.hash = #stream/xxxxx
		    // 其他浏览器 => location.hash = #stream/xxxxx?lang=zh_c
		    // firefox 会自作多情对hash进行decodeURIComponent
		    // 又比如 http://www.cnblogs.com/rubylouvre/#!/home/q={%22thedate%22:%2220121010~20121010%22}
		    // firefox 15 => #!/home/q={"thedate":"20121010~20121010"}
		    // 其他浏览器 => #!/home/q={%22thedate%22:%2220121010~20121010%22}
		    var index = path.indexOf("#")
		    if (index === -1) {
		        return ''
		    }
		    return decodeURI(path.slice(index))
		}
		function which(e) {
		    return null === e.which ? e.button : e.which
		}
		function sameOrigin(href) {
		    var origin = location.protocol + '//' + location.hostname
		    if (location.port)
		        origin += ':' + location.port
		    return (href && (0 === href.indexOf(origin)))
		}
		//https://github.com/asual/jquery-address/blob/master/src/jquery.address.js
	
		//劫持页面上所有点击事件，如果事件源来自链接或其内部，
		//并且它不会跳出本页，并且以"#/"或"#!/"开头，那么触发updateLocation方法
		// 
		avalon.bind(document, "click", function (e) {
		    //https://github.com/angular/angular.js/blob/master/src/ng/location.js
		    //下面十种情况将阻止进入路由系列
		    //1. 路由器没有启动
		    if (!mmHistory.started) {
		        return
		    }
		    //2. 不是左键点击或使用组合键
		    if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2 || e.button === 2) {
		        return
		    }
		    //3. 此事件已经被阻止
		    if (e.returnValue === false) {
		        return
		    }
		    //4. 目标元素不A标签,或不在A标签之内
		    var el = e.path ? e.path[0] : e.target
		    while (el.nodeName !== "A") {
		        el = el.parentNode
		        if (!el || el.tagName === "BODY") {
		            return
		        }
		    }
		    //5. 没有定义href属性或在hash模式下,只有一个#
		    //IE6/7直接用getAttribute返回完整路径
		    var href = el.getAttribute('href', 2) || el.getAttribute("xlink:href") || ''
		    if (href.slice(0, 2) !== '#!') {
		        return
		    }
	
		    //6. 目标链接是用于下载资源或指向外部
		    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external')
		        return
	
		    //7. 只是邮箱地址
		    if (href.indexOf('mailto:') > -1) {
		        return
		    }
		    //8. 目标链接要新开窗口
		    if (el.target && el.target !== '_self') {
		        return
		    }
	
		    e.preventDefault()
		    mmHistory.onHashChanged(href.replace('#!', ''), true)
	
		})
	
		//得到页面第一个符合条件的A标签
		function getFirstAnchor(list) {
		    for (var i = 0, el; el = list[i++]; ) {
		        if (el.nodeName === "A") {
		            return el
		        }
		    }
		}
	
		function autoScroll(hash, el) {
		    //取得页面拥有相同ID的元素
		    var elem = document.getElementById(hash)
		    if (!elem) {
		        //取得页面拥有相同name的A元素
		        elem = getFirstAnchor(document.getElementsByName(hash))
		    }
		    if (elem) {
		        el.scrollIntoView()
		        var offset = avalon(el).offset()
		        var elemTop = elem.getBoundingClientRect().top
		        window.scrollBy(0, elemTop - offset.top)
		    } else {
		        window.scrollTo(0, 0)
		    }
		}
	
		function isHasHash() {
		    return !(location.hash === '' || location.hash === '#')
		}
	
	
		module.exports = avalon.history = mmHistory
	
	
	/***/ },
	/* 7 */
	/***/ function(module, exports) {
	
		
		function supportLocalStorage() {
		    try {
		        localStorage.setItem("avalon", 1)
		        localStorage.removeItem("avalon")
		        return true
		    } catch (e) {
		        return false
		    }
		}
		function escapeCookie(value) {
		    return String(value).replace(/[,;"\\=\s%]/g, function (character) {
		        return encodeURIComponent(character)
		    });
		}
		var ret = {}
		if (supportLocalStorage()) {
		    ret.getLastPath = function () {
		        return localStorage.getItem('msLastPath')
		    }
		    var cookieID
		    ret.setLastPath = function (path) {
		        if (cookieID) {
		            clearTimeout(cookieID)
		            cookieID = null
		        }
		        localStorage.setItem("msLastPath", path)
		        cookieID = setTimeout(function () {
		            localStorage.removItem("msLastPath")
		        }, 1000 * 60 * 60 * 24)
		    }
		} else {
	
		    ret.getLastPath = function () {
		        return getCookie.getItem('msLastPath')
		    }
		    ret.setLastPath = function (path) {
		        setCookie('msLastPath', path)
		    }
		    function setCookie(key, value) {
		        var date = new Date()//将date设置为1天以后的时间 
		        date.setTime(date.getTime() + 1000 * 60 * 60 * 24)
		        document.cookie = escapeCookie(key) + '=' + escapeCookie(value) + ';expires=' + date.toGMTString()
		    }
		    function getCookie(name) {
		        var m = String(document.cookie).match(new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')) || ["", ""]
		        return decodeURIComponent(m[1])
		    }
		}
	
		module.exports = ret
	
	/***/ }
	/******/ ]);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(4);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v1.12.4
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-05-20T17:17Z
	 */
	
	(function( global, factory ) {
	
		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}
	
	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var deletedIds = [];
	
	var document = window.document;
	
	var slice = deletedIds.slice;
	
	var concat = deletedIds.concat;
	
	var push = deletedIds.push;
	
	var indexOf = deletedIds.indexOf;
	
	var class2type = {};
	
	var toString = class2type.toString;
	
	var hasOwn = class2type.hasOwnProperty;
	
	var support = {};
	
	
	
	var
		version = "1.12.4",
	
		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
	
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},
	
		// Support: Android<4.1, IE<9
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	
		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,
	
		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};
	
	jQuery.fn = jQuery.prototype = {
	
		// The current version of jQuery being used
		jquery: version,
	
		constructor: jQuery,
	
		// Start with an empty selector
		selector: "",
	
		// The default length of a jQuery object is 0
		length: 0,
	
		toArray: function() {
			return slice.call( this );
		},
	
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?
	
				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :
	
				// Return all the elements in a clean array
				slice.call( this );
		},
	
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {
	
			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );
	
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;
	
			// Return the newly-formed element set
			return ret;
		},
	
		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},
	
		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},
	
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},
	
		first: function() {
			return this.eq( 0 );
		},
	
		last: function() {
			return this.eq( -1 );
		},
	
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},
	
		end: function() {
			return this.prevObject || this.constructor();
		},
	
		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: deletedIds.sort,
		splice: deletedIds.splice
	};
	
	jQuery.extend = jQuery.fn.extend = function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
	
			// skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}
	
		// extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}
	
		for ( ; i < length; i++ ) {
	
			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {
	
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {
	
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];
	
						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}
	
						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	
	jQuery.extend( {
	
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	
		// Assume jQuery is ready without the ready module
		isReady: true,
	
		error: function( msg ) {
			throw new Error( msg );
		},
	
		noop: function() {},
	
		// See test/unit/core.js for details concerning isFunction.
		// Since version 1.3, DOM methods and functions like alert
		// aren't supported. They return false on IE (#2968).
		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},
	
		isArray: Array.isArray || function( obj ) {
			return jQuery.type( obj ) === "array";
		},
	
		isWindow: function( obj ) {
			/* jshint eqeqeq: false */
			return obj != null && obj == obj.window;
		},
	
		isNumeric: function( obj ) {
	
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
		},
	
		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},
	
		isPlainObject: function( obj ) {
			var key;
	
			// Must be an Object.
			// Because of IE, we also have to check the presence of the constructor property.
			// Make sure that DOM nodes and window objects don't pass through, as well
			if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}
	
			try {
	
				// Not own constructor property must be Object
				if ( obj.constructor &&
					!hasOwn.call( obj, "constructor" ) &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
					return false;
				}
			} catch ( e ) {
	
				// IE8,9 Will throw exceptions on certain host objects #9897
				return false;
			}
	
			// Support: IE<9
			// Handle iteration over inherited properties before own properties.
			if ( !support.ownFirst ) {
				for ( key in obj ) {
					return hasOwn.call( obj, key );
				}
			}
	
			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
			for ( key in obj ) {}
	
			return key === undefined || hasOwn.call( obj, key );
		},
	
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},
	
		// Workarounds based on findings by Jim Driscoll
		// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
		globalEval: function( data ) {
			if ( data && jQuery.trim( data ) ) {
	
				// We use execScript on Internet Explorer
				// We use an anonymous function so that context is window
				// rather than jQuery in Firefox
				( window.execScript || function( data ) {
					window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
				} )( data );
			}
		},
	
		// Convert dashed to camelCase; used by the css and data modules
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},
	
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},
	
		each: function( obj, callback ) {
			var length, i = 0;
	
			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}
	
			return obj;
		},
	
		// Support: Android<4.1, IE<9
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
	
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];
	
			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}
	
			return ret;
		},
	
		inArray: function( elem, arr, i ) {
			var len;
	
			if ( arr ) {
				if ( indexOf ) {
					return indexOf.call( arr, elem, i );
				}
	
				len = arr.length;
				i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
	
				for ( ; i < len; i++ ) {
	
					// Skip accessing in sparse arrays
					if ( i in arr && arr[ i ] === elem ) {
						return i;
					}
				}
			}
	
			return -1;
		},
	
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;
	
			while ( j < len ) {
				first[ i++ ] = second[ j++ ];
			}
	
			// Support: IE<9
			// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
			if ( len !== len ) {
				while ( second[ j ] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}
	
			first.length = i;
	
			return first;
		},
	
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;
	
			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
	
			return matches;
		},
	
		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];
	
			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
	
			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
			}
	
			// Flatten any nested arrays
			return concat.apply( [], ret );
		},
	
		// A global GUID counter for objects
		guid: 1,
	
		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var args, proxy, tmp;
	
			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}
	
			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}
	
			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};
	
			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
			return proxy;
		},
	
		now: function() {
			return +( new Date() );
		},
	
		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );
	
	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
	}
	/* jshint ignore: end */
	
	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );
	
	function isArrayLike( obj ) {
	
		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );
	
		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */
	(function( window ) {
	
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,
	
		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,
	
		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},
	
		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,
	
		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},
	
		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	
		// Regular expressions
	
		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
	
		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	
		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",
	
		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",
	
		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	
		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	
		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	
		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),
	
		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},
	
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,
	
		rnative = /^[^{]+\{\s*\[native \w/,
	
		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
		rsibling = /[+~]/,
		rescape = /'|\\/g,
	
		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},
	
		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};
	
	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?
	
			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :
	
			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}
	
	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, nidselect, match, groups, newSelector,
			newContext = context && context.ownerDocument,
	
			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;
	
		results = results || [];
	
		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	
			return results;
		}
	
		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
	
			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;
	
			if ( documentIsHTML ) {
	
				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
	
					// ID selector
					if ( (m = match[1]) ) {
	
						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {
	
								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}
	
						// Element context
						} else {
	
							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {
	
								results.push( elem );
								return results;
							}
						}
	
					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;
	
					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {
	
						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}
	
				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
	
					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;
	
					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {
	
						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rescape, "\\$&" );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}
	
						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
						while ( i-- ) {
							groups[i] = nidselect + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );
	
						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}
	
					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}
	
		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}
	
	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];
	
		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}
	
	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}
	
	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");
	
		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}
	
	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;
	
		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}
	
	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );
	
		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}
	
		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}
	
		return a ? 1 : -1;
	}
	
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;
	
				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}
	
	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}
	
	// Expose support vars for convenience
	support = Sizzle.support = {};
	
	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};
	
	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;
	
		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}
	
		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );
	
		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( (parent = document.defaultView) && parent.top !== parent ) {
			// Support: IE 11
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );
	
			// Support: IE 9 - 10 only
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}
	
		/* Attributes
		---------------------------------------------------------------------- */
	
		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});
	
		/* getElement(s)By*
		---------------------------------------------------------------------- */
	
		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( document.createComment("") );
			return !div.getElementsByTagName("*").length;
		});
	
		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );
	
		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});
	
		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					return m ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];
	
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}
	
		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );
	
				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :
	
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );
	
				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}
	
					return tmp;
				}
				return results;
			};
	
		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};
	
		/* QSA/matchesSelector
		---------------------------------------------------------------------- */
	
		// QSA and matchesSelector support
	
		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];
	
		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];
	
		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";
	
				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}
	
				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}
	
				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}
	
				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
	
				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});
	
			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );
	
				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}
	
				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}
	
		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {
	
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );
	
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}
	
		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	
		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );
	
		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};
	
		/* Sorting
		---------------------------------------------------------------------- */
	
		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {
	
			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}
	
			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :
	
				// Otherwise we know they are disconnected
				1;
	
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
	
				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}
	
				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}
	
			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];
	
			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
	
			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}
	
			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}
	
			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}
	
			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :
	
				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};
	
		return document;
	};
	
	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};
	
	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );
	
		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
			try {
				var ret = matches.call( elem, expr );
	
				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}
	
		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};
	
	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};
	
	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;
	
		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};
	
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	
	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;
	
		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );
	
		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}
	
		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;
	
		return results;
	};
	
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
	
		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	
		return ret;
	};
	
	Expr = Sizzle.selectors = {
	
		// Can be adjusted by the user
		cacheLength: 50,
	
		createPseudo: markFunction,
	
		match: matchExpr,
	
		attrHandle: {},
	
		find: {},
	
		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},
	
		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );
	
				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
	
				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}
	
				return match.slice( 0, 4 );
			},
	
			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();
	
				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}
	
					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
	
				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}
	
				return match;
			},
	
			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];
	
				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}
	
				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";
	
				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
	
					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}
	
				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},
	
		filter: {
	
			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},
	
			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];
	
				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},
	
			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );
	
					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}
	
					result += "";
	
					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},
	
			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";
	
				return first === 1 && last === 0 ?
	
					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :
	
					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;
	
						if ( parent ) {
	
							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {
	
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}
	
							start = [ forward ? parent.firstChild : parent.lastChild ];
	
							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
	
								// Seek `elem` from a previously-cached index
	
								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});
	
								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});
	
								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];
	
								while ( (node = ++nodeIndex && node && node[ dir ] ||
	
									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {
	
									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}
	
							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});
	
									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});
	
									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}
	
								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {
	
										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {
	
											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});
	
												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});
	
												uniqueCache[ type ] = [ dirruns, diff ];
											}
	
											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}
	
							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},
	
			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );
	
				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}
	
				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}
	
				return fn;
			}
		},
	
		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );
	
				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;
	
						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),
	
			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),
	
			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),
	
			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
	
							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),
	
			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},
	
			"root": function( elem ) {
				return elem === docElem;
			},
	
			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},
	
			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},
	
			"disabled": function( elem ) {
				return elem.disabled === true;
			},
	
			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},
	
			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
	
				return elem.selected === true;
			},
	
			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},
	
			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},
	
			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},
	
			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},
	
			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},
	
			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
	
					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},
	
			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),
	
			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),
	
			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),
	
			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};
	
	Expr.pseudos["nth"] = Expr.pseudos["eq"];
	
	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}
	
	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();
	
	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];
	
		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}
	
		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;
	
		while ( soFar ) {
	
			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}
	
			matched = false;
	
			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}
	
			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}
	
			if ( !matched ) {
				break;
			}
		}
	
		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};
	
	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}
	
	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;
	
		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :
	
			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];
	
				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
	
							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});
	
							if ( (oldCache = uniqueCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
	
								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ dir ] = newCache;
	
								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}
	
	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}
	
	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}
	
	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;
	
		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}
	
		return newUnmatched;
	}
	
	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,
	
				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
	
				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,
	
				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
						// ...intermediate processing is necessary
						[] :
	
						// ...otherwise use results directly
						results :
					matcherIn;
	
			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}
	
			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );
	
				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}
	
			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}
	
					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
	
							seed[temp] = !(results[temp] = elem);
						}
					}
				}
	
			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}
	
	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,
	
			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];
	
		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
	
				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}
	
		return elementMatcher( matchers );
	}
	
	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;
	
				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}
	
				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}
	
					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}
	
						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}
	
				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;
	
				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}
	
					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}
	
						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}
	
					// Add matches to results
					push.apply( results, setMatched );
	
					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {
	
						Sizzle.uniqueSort( results );
					}
				}
	
				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}
	
				return unmatched;
			};
	
		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}
	
	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];
	
		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}
	
			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	
			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};
	
	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );
	
		results = results || [];
	
		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {
	
			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {
	
				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
	
				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}
	
				selector = selector.slice( tokens.shift().value.length );
			}
	
			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];
	
				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {
	
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
	
						break;
					}
				}
			}
		}
	
		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};
	
	// One-time assignments
	
	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
	
	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;
	
	// Initialize against the default document
	setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}
	
	return Sizzle;
	
	})( window );
	
	
	
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	
	
	
	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;
	
		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};
	
	
	var siblings = function( n, elem ) {
		var matched = [];
	
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}
	
		return matched;
	};
	
	
	var rneedsContext = jQuery.expr.match.needsContext;
	
	var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );
	
	
	
	var risSimple = /^.[^:#\[\.,]*$/;
	
	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
	
		}
	
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
	
		}
	
		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}
	
			qualifier = jQuery.filter( qualifier, elements );
		}
	
		return jQuery.grep( elements, function( elem ) {
			return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
		} );
	}
	
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];
	
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
	
		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			} ) );
	};
	
	jQuery.fn.extend( {
		find: function( selector ) {
			var i,
				ret = [],
				self = this,
				len = self.length;
	
			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}
	
			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}
	
			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,
	
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );
	
	
	// Initialize a jQuery object
	
	
	// A central reference to the root jQuery(document)
	var rootjQuery,
	
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	
		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;
	
			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}
	
			// init accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;
	
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector.charAt( 0 ) === "<" &&
					selector.charAt( selector.length - 1 ) === ">" &&
					selector.length >= 3 ) {
	
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = rquickExpr.exec( selector );
				}
	
				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;
	
						// scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
	
						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
	
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );
	
								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}
	
						return this;
	
					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );
	
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
	
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id !== match[ 2 ] ) {
								return rootjQuery.find( selector );
							}
	
							// Otherwise, we inject the element directly into the jQuery object
							this.length = 1;
							this[ 0 ] = elem;
						}
	
						this.context = document;
						this.selector = selector;
						return this;
					}
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[ 0 ] = selector;
				this.length = 1;
				return this;
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return typeof root.ready !== "undefined" ?
					root.ready( selector ) :
	
					// Execute immediately if ready is not present
					selector( jQuery );
			}
	
			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}
	
			return jQuery.makeArray( selector, this );
		};
	
	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;
	
	// Initialize central reference
	rootjQuery = jQuery( document );
	
	
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	
		// methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	
	jQuery.fn.extend( {
		has: function( target ) {
			var i,
				targets = jQuery( target, this ),
				len = targets.length;
	
			return this.filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},
	
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;
	
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
	
					// Always skip document fragments
					if ( cur.nodeType < 11 && ( pos ?
						pos.index( cur ) > -1 :
	
						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {
	
						matched.push( cur );
						break;
					}
				}
			}
	
			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},
	
		// Determine the position of an element within
		// the matched set of elements
		index: function( elem ) {
	
			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}
	
			// index in selector
			if ( typeof elem === "string" ) {
				return jQuery.inArray( this[ 0 ], jQuery( elem ) );
			}
	
			// Locate the position of the desired element
			return jQuery.inArray(
	
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem, this );
		},
	
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},
	
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );
	
	function sibling( cur, dir ) {
		do {
			cur = cur[ dir ];
		} while ( cur && cur.nodeType !== 1 );
	
		return cur;
	}
	
	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return jQuery.nodeName( elem, "iframe" ) ?
				elem.contentDocument || elem.contentWindow.document :
				jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var ret = jQuery.map( this, fn, until );
	
			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}
	
			if ( selector && typeof selector === "string" ) {
				ret = jQuery.filter( selector, ret );
			}
	
			if ( this.length > 1 ) {
	
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					ret = jQuery.uniqueSort( ret );
				}
	
				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					ret = ret.reverse();
				}
			}
	
			return this.pushStack( ret );
		};
	} );
	var rnotwhite = ( /\S+/g );
	
	
	
	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {
	
		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );
	
		var // Flag to know if list is currently firing
			firing,
	
			// Last fire value for non-forgettable lists
			memory,
	
			// Flag to know if list was already fired
			fired,
	
			// Flag to prevent firing
			locked,
	
			// Actual callback list
			list = [],
	
			// Queue of execution data for repeatable lists
			queue = [],
	
			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,
	
			// Fire callbacks
			fire = function() {
	
				// Enforce single-firing
				locked = options.once;
	
				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {
	
						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {
	
							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}
	
				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}
	
				firing = false;
	
				// Clean up if we're done firing for good
				if ( locked ) {
	
					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];
	
					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},
	
			// Actual Callbacks object
			self = {
	
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
	
						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}
	
						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {
	
									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );
	
						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
	
							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},
	
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},
	
				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},
	
				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},
	
				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = true;
					if ( !memory ) {
						self.disable();
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},
	
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
	
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};
	
		return self;
	};
	
	
	jQuery.extend( {
	
		Deferred: function( func ) {
			var tuples = [
	
					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
	
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this === promise ? newDefer.promise() : this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
	
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};
	
			// Keep pipe for back-compat
			promise.pipe = promise.then;
	
			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];
	
				// promise[ done | fail | progress ] = list.add
				promise[ tuple[ 1 ] ] = list.add;
	
				// Handle state
				if ( stateString ) {
					list.add( function() {
	
						// state = [ resolved | rejected ]
						state = stateString;
	
					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}
	
				// deferred[ resolve | reject | notify ]
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );
	
			// Make the deferred a promise
			promise.promise( deferred );
	
			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}
	
			// All done!
			return deferred;
		},
	
		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,
	
				// the count of uncompleted subordinates
				remaining = length !== 1 ||
					( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
	
				// the master Deferred.
				// If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
	
				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
	
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},
	
				progressValues, progressContexts, resolveContexts;
	
			// add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.progress( updateFunc( i, progressContexts, progressValues ) )
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject );
					} else {
						--remaining;
					}
				}
			}
	
			// if we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}
	
			return deferred.promise();
		}
	} );
	
	
	// The deferred used on DOM ready
	var readyList;
	
	jQuery.fn.ready = function( fn ) {
	
		// Add the callback
		jQuery.ready.promise().done( fn );
	
		return this;
	};
	
	jQuery.extend( {
	
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
	
		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,
	
		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},
	
		// Handle when the DOM is ready
		ready: function( wait ) {
	
			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}
	
			// Remember that the DOM is ready
			jQuery.isReady = true;
	
			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}
	
			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
	
			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	} );
	
	/**
	 * Clean-up method for dom ready events
	 */
	function detach() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed );
			window.removeEventListener( "load", completed );
	
		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	}
	
	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
	
		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener ||
			window.event.type === "load" ||
			document.readyState === "complete" ) {
	
			detach();
			jQuery.ready();
		}
	}
	
	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {
	
			readyList = jQuery.Deferred();
	
			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE6-10
			// Older IE sometimes signals "interactive" too soon
			if ( document.readyState === "complete" ||
				( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
	
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout( jQuery.ready );
	
			// Standards-based browsers support DOMContentLoaded
			} else if ( document.addEventListener ) {
	
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed );
	
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed );
	
			// If IE event model is used
			} else {
	
				// Ensure firing before onload, maybe late but safe also for iframes
				document.attachEvent( "onreadystatechange", completed );
	
				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", completed );
	
				// If IE and not a frame
				// continually check to see if the document is ready
				var top = false;
	
				try {
					top = window.frameElement == null && document.documentElement;
				} catch ( e ) {}
	
				if ( top && top.doScroll ) {
					( function doScrollCheck() {
						if ( !jQuery.isReady ) {
	
							try {
	
								// Use the trick by Diego Perini
								// http://javascript.nwbox.com/IEContentLoaded/
								top.doScroll( "left" );
							} catch ( e ) {
								return window.setTimeout( doScrollCheck, 50 );
							}
	
							// detach all dom ready events
							detach();
	
							// and execute any waiting functions
							jQuery.ready();
						}
					} )();
				}
			}
		}
		return readyList.promise( obj );
	};
	
	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();
	
	
	
	
	// Support: IE<9
	// Iteration over object's inherited properties before its own
	var i;
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownFirst = i === "0";
	
	// Note: most support tests are defined in their respective modules.
	// false until the test is run
	support.inlineBlockNeedsLayout = false;
	
	// Execute ASAP in case we need to set body.style.zoom
	jQuery( function() {
	
		// Minified: var a,b,c,d
		var val, div, body, container;
	
		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
	
			// Return for frameset docs that don't have a body
			return;
		}
	
		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );
	
		if ( typeof div.style.zoom !== "undefined" ) {
	
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";
	
			support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
			if ( val ) {
	
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}
	
		body.removeChild( container );
	} );
	
	
	( function() {
		var div = document.createElement( "div" );
	
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch ( e ) {
			support.deleteExpando = false;
		}
	
		// Null elements to avoid leaks in IE.
		div = null;
	} )();
	var acceptData = function( elem ) {
		var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
			nodeType = +elem.nodeType || 1;
	
		// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
		return nodeType !== 1 && nodeType !== 9 ?
			false :
	
			// Nodes accept data unless otherwise specified; rejection can be conditional
			!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
	};
	
	
	
	
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /([A-Z])/g;
	
	function dataAttr( elem, key, data ) {
	
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
	
			var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
	
			data = elem.getAttribute( name );
	
			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
	
						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch ( e ) {}
	
				// Make sure we set the data so it isn't changed later
				jQuery.data( elem, key, data );
	
			} else {
				data = undefined;
			}
		}
	
		return data;
	}
	
	// checks a cache object for emptiness
	function isEmptyDataObject( obj ) {
		var name;
		for ( name in obj ) {
	
			// if the public data object is empty, the private is still empty
			if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
				continue;
			}
			if ( name !== "toJSON" ) {
				return false;
			}
		}
	
		return true;
	}
	
	function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !acceptData( elem ) ) {
			return;
		}
	
		var ret, thisCache,
			internalKey = jQuery.expando,
	
			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,
	
			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,
	
			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
	
		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
			data === undefined && typeof name === "string" ) {
			return;
		}
	
		if ( !id ) {
	
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}
	
		if ( !cache[ id ] ) {
	
			// Avoid exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
		}
	
		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}
	
		thisCache = cache[ id ];
	
		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}
	
			thisCache = thisCache.data;
		}
	
		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}
	
		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( typeof name === "string" ) {
	
			// First Try to find as-is property data
			ret = thisCache[ name ];
	
			// Test for null|undefined property data
			if ( ret == null ) {
	
				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}
	
		return ret;
	}
	
	function internalRemoveData( elem, name, pvt ) {
		if ( !acceptData( elem ) ) {
			return;
		}
	
		var thisCache, i,
			isNode = elem.nodeType,
	
			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;
	
		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}
	
		if ( name ) {
	
			thisCache = pvt ? cache[ id ] : cache[ id ].data;
	
			if ( thisCache ) {
	
				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {
	
					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {
	
						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				} else {
	
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = name.concat( jQuery.map( name, jQuery.camelCase ) );
				}
	
				i = name.length;
				while ( i-- ) {
					delete thisCache[ name[ i ] ];
				}
	
				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
					return;
				}
			}
		}
	
		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;
	
			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}
	
		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );
	
		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		/* jshint eqeqeq: false */
		} else if ( support.deleteExpando || cache != cache.window ) {
			/* jshint eqeqeq: true */
			delete cache[ id ];
	
		// When all else fails, undefined
		} else {
			cache[ id ] = undefined;
		}
	}
	
	jQuery.extend( {
		cache: {},
	
		// The following elements (space-suffixed to avoid Object.prototype collisions)
		// throw uncatchable exceptions if you attempt to set expando properties
		noData: {
			"applet ": true,
			"embed ": true,
	
			// ...but Flash objects (which have this classid) *can* handle expandos
			"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
		},
	
		hasData: function( elem ) {
			elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
			return !!elem && !isEmptyDataObject( elem );
		},
	
		data: function( elem, name, data ) {
			return internalData( elem, name, data );
		},
	
		removeData: function( elem, name ) {
			return internalRemoveData( elem, name );
		},
	
		// For internal use only.
		_data: function( elem, name, data ) {
			return internalData( elem, name, data, true );
		},
	
		_removeData: function( elem, name ) {
			return internalRemoveData( elem, name, true );
		}
	} );
	
	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;
	
			// Special expections of .data basically thwart jQuery.access,
			// so implement the relevant behavior ourselves
	
			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = jQuery.data( elem );
	
					if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {
	
							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						jQuery._data( elem, "parsedAttrs", true );
					}
				}
	
				return data;
			}
	
			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					jQuery.data( this, key );
				} );
			}
	
			return arguments.length > 1 ?
	
				// Sets one value
				this.each( function() {
					jQuery.data( this, key, value );
				} ) :
	
				// Gets one value
				// Try to fetch any internally stored data first
				elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
		},
	
		removeData: function( key ) {
			return this.each( function() {
				jQuery.removeData( this, key );
			} );
		}
	} );
	
	
	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;
	
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = jQuery._data( elem, type );
	
				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},
	
		dequeue: function( elem, type ) {
			type = type || "fx";
	
			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};
	
			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}
	
			if ( fn ) {
	
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}
	
				// clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}
	
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},
	
		// not intended for public consumption - generates a queueHooks object,
		// or returns the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return jQuery._data( elem, key ) || jQuery._data( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					jQuery._removeData( elem, type + "queue" );
					jQuery._removeData( elem, key );
				} )
			} );
		}
	} );
	
	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;
	
			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}
	
			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}
	
			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );
	
					// ensure a hooks for this queue
					jQuery._queueHooks( this, type );
	
					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
	
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};
	
			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";
	
			while ( i-- ) {
				tmp = jQuery._data( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	
	
	( function() {
		var shrinkWrapBlocksVal;
	
		support.shrinkWrapBlocks = function() {
			if ( shrinkWrapBlocksVal != null ) {
				return shrinkWrapBlocksVal;
			}
	
			// Will be changed later if needed.
			shrinkWrapBlocksVal = false;
	
			// Minified: var b,c,d
			var div, body, container;
	
			body = document.getElementsByTagName( "body" )[ 0 ];
			if ( !body || !body.style ) {
	
				// Test fired too early or in an unsupported environment, exit.
				return;
			}
	
			// Setup
			div = document.createElement( "div" );
			container = document.createElement( "div" );
			container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
			body.appendChild( container ).appendChild( div );
	
			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			if ( typeof div.style.zoom !== "undefined" ) {
	
				// Reset CSS: box-sizing; display; margin; border
				div.style.cssText =
	
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;" +
					"padding:1px;width:1px;zoom:1";
				div.appendChild( document.createElement( "div" ) ).style.width = "5px";
				shrinkWrapBlocksVal = div.offsetWidth !== 3;
			}
	
			body.removeChild( container );
	
			return shrinkWrapBlocksVal;
		};
	
	} )();
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
	
	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
	
	
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	var isHidden = function( elem, el ) {
	
			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" ||
				!jQuery.contains( elem.ownerDocument, elem );
		};
	
	
	
	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() { return tween.cur(); } :
				function() { return jQuery.css( elem, prop, "" ); },
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );
	
		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
	
			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];
	
			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
	
			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;
	
			do {
	
				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";
	
				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );
	
			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}
	
		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;
	
			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	
	
	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;
	
		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}
	
		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
	
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
	
				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
	
			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn(
						elems[ i ],
						key,
						raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}
	
		return chainable ?
			elems :
	
			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var rcheckableType = ( /^(?:checkbox|radio)$/i );
	
	var rtagName = ( /<([\w:-]+)/ );
	
	var rscriptType = ( /^$|\/(?:java|ecma)script/i );
	
	var rleadingWhitespace = ( /^\s+/ );
	
	var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
			"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
			"mark|meter|nav|output|picture|progress|section|summary|template|time|video";
	
	
	
	function createSafeFragment( document ) {
		var list = nodeNames.split( "|" ),
			safeFrag = document.createDocumentFragment();
	
		if ( safeFrag.createElement ) {
			while ( list.length ) {
				safeFrag.createElement(
					list.pop()
				);
			}
		}
		return safeFrag;
	}
	
	
	( function() {
		var div = document.createElement( "div" ),
			fragment = document.createDocumentFragment(),
			input = document.createElement( "input" );
	
		// Setup
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	
		// IE strips leading whitespace when .innerHTML is used
		support.leadingWhitespace = div.firstChild.nodeType === 3;
	
		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		support.tbody = !div.getElementsByTagName( "tbody" ).length;
	
		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;
	
		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		support.html5Clone =
			document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";
	
		// Check if a disconnected checkbox will retain its checked
		// value of true after appended to the DOM (IE6/7)
		input.type = "checkbox";
		input.checked = true;
		fragment.appendChild( input );
		support.appendChecked = input.checked;
	
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		// Support: IE6-IE11+
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	
		// #11217 - WebKit loses check when the name is after the checked attribute
		fragment.appendChild( div );
	
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input = document.createElement( "input" );
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
	
		// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
		// old WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Support: IE<9
		// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
		support.noCloneEvent = !!div.addEventListener;
	
		// Support: IE<9
		// Since attributes and properties are the same in IE,
		// cleanData must set properties to undefined rather than use removeAttribute
		div[ jQuery.expando ] = 1;
		support.attributes = !div.getAttribute( jQuery.expando );
	} )();
	
	
	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
	
		// Support: IE8
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
	};
	
	// Support: IE8-IE9
	wrapMap.optgroup = wrapMap.option;
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	
	function getAll( context, tag ) {
		var elems, elem,
			i = 0,
			found = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( tag || "*" ) :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll( tag || "*" ) :
					undefined;
	
		if ( !found ) {
			for ( found = [], elems = context.childNodes || context;
				( elem = elems[ i ] ) != null;
				i++
			) {
				if ( !tag || jQuery.nodeName( elem, tag ) ) {
					found.push( elem );
				} else {
					jQuery.merge( found, getAll( elem, tag ) );
				}
			}
		}
	
		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], found ) :
			found;
	}
	
	
	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var elem,
			i = 0;
		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			jQuery._data(
				elem,
				"globalEval",
				!refElements || jQuery._data( refElements[ i ], "globalEval" )
			);
		}
	}
	
	
	var rhtml = /<|&#?\w+;/,
		rtbody = /<tbody/i;
	
	function fixDefaultChecked( elem ) {
		if ( rcheckableType.test( elem.type ) ) {
			elem.defaultChecked = elem.checked;
		}
	}
	
	function buildFragment( elems, context, scripts, selection, ignored ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,
	
			// Ensure a safe fragment
			safe = createSafeFragment( context ),
	
			nodes = [],
			i = 0;
	
		for ( ; i < l; i++ ) {
			elem = elems[ i ];
	
			if ( elem || elem === 0 ) {
	
				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
	
				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement( "div" ) );
	
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
	
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
	
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
	
					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
					}
	
					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {
	
						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :
	
							// String was a bare <thead> or <tfoot>
							wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;
	
						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
								!tbody.childNodes.length ) {
	
								elem.removeChild( tbody );
							}
						}
					}
	
					jQuery.merge( nodes, tmp.childNodes );
	
					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";
	
					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}
	
					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}
	
		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}
	
		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}
	
		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {
	
			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
	
				continue;
			}
	
			contains = jQuery.contains( elem.ownerDocument, elem );
	
			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );
	
			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}
	
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}
	
		tmp = null;
	
		return safe;
	}
	
	
	( function() {
		var i, eventName,
			div = document.createElement( "div" );
	
		// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
		for ( i in { submit: true, change: true, focusin: true } ) {
			eventName = "on" + i;
	
			if ( !( support[ i ] = eventName in window ) ) {
	
				// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
				div.setAttribute( eventName, "t" );
				support[ i ] = div.attributes[ eventName ].expando === false;
			}
		}
	
		// Null elements to avoid leaks in IE.
		div = null;
	} )();
	
	
	var rformElems = /^(?:input|select|textarea)$/i,
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
	
	function returnTrue() {
		return true;
	}
	
	function returnFalse() {
		return false;
	}
	
	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}
	
	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;
	
		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
	
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
	
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}
	
		if ( data == null && fn == null ) {
	
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
	
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
	
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}
	
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
	
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
	
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}
	
	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {
	
		global: {},
	
		add: function( elem, types, handler, data, selector ) {
			var tmp, events, t, handleObjIn,
				special, eventHandle, handleObj,
				handlers, type, namespaces, origType,
				elemData = jQuery._data( elem );
	
			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}
	
			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}
	
			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}
	
			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {
	
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" &&
						( !e || jQuery.event.triggered !== e.type ) ?
						jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
						undefined;
				};
	
				// Add elem as a property of the handle fn to prevent a memory leak
				// with IE non-native events
				eventHandle.elem = elem;
			}
	
			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}
	
				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};
	
				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;
	
				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};
	
				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );
	
				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;
	
					// Only use addEventListener/attachEvent if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	
						// Bind the global event handler to the element
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle, false );
	
						} else if ( elem.attachEvent ) {
							elem.attachEvent( "on" + type, eventHandle );
						}
					}
				}
	
				if ( special.add ) {
					special.add.call( elem, handleObj );
	
					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}
	
				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}
	
				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}
	
			// Nullify elem to prevent memory leaks in IE
			elem = null;
		},
	
		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
			var j, handleObj, tmp,
				origCount, t, events,
				special, handlers, type,
				namespaces, origType,
				elemData = jQuery.hasData( elem ) && jQuery._data( elem );
	
			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}
	
			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}
	
				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
	
				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];
	
					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );
	
						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}
	
				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
	
						jQuery.removeEvent( elem, type, elemData.handle );
					}
	
					delete events[ type ];
				}
			}
	
			// Remove the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				delete elemData.handle;
	
				// removeData also checks for emptiness and clears the expando if empty
				// so use it instead of delete
				jQuery._removeData( elem, "events" );
			}
		},
	
		trigger: function( event, data, elem, onlyHandlers ) {
			var handle, ontype, cur,
				bubbleType, special, tmp, i,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];
	
			cur = tmp = elem = elem || document;
	
			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}
	
			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}
	
			if ( type.indexOf( "." ) > -1 ) {
	
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;
	
			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );
	
			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;
	
			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}
	
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );
	
			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}
	
			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
	
				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}
	
				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}
	
			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
	
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;
	
				// jQuery handler
				handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
					jQuery._data( cur, "handle" );
	
				if ( handle ) {
					handle.apply( cur, data );
				}
	
				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;
	
			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
				if (
					( !special._default ||
					 special._default.apply( eventPath.pop(), data ) === false
					) && acceptData( elem )
				) {
	
					// Call a native DOM method on the target with the same name name as the event.
					// Can't use an .isFunction() check here because IE6/7 fails that test.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {
	
						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];
	
						if ( tmp ) {
							elem[ ontype ] = null;
						}
	
						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						try {
							elem[ type ]();
						} catch ( e ) {
	
							// IE<9 dies on focus/blur to hidden element (#1486,#12518)
							// only reproducible on winXP IE8 native, not IE9 in IE8 mode
						}
						jQuery.event.triggered = undefined;
	
						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}
	
			return event.result;
		},
	
		dispatch: function( event ) {
	
			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );
	
			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};
	
			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
			event.delegateTarget = this;
	
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}
	
			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;
	
				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {
	
					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {
	
						event.handleObj = handleObj;
						event.data = handleObj.data;
	
						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );
	
						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}
	
			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}
	
			return event.result;
		},
	
		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
	
			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if ( delegateCount && cur.nodeType &&
				( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {
	
				/* jshint eqeqeq: false */
				for ( ; cur != this; cur = cur.parentNode || this ) {
					/* jshint eqeqeq: true */
	
					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
	
							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";
	
							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push( { elem: cur, handlers: matches } );
						}
					}
				}
			}
	
			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
			}
	
			return handlerQueue;
		},
	
		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}
	
			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];
	
			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
	
			event = new jQuery.Event( originalEvent );
	
			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}
	
			// Support: IE<9
			// Fix target property (#1925)
			if ( !event.target ) {
				event.target = originalEvent.srcElement || document;
			}
	
			// Support: Safari 6-8+
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}
	
			// Support: IE<9
			// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
			event.metaKey = !!event.metaKey;
	
			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},
	
		// Includes some event props shared by KeyEvent and MouseEvent
		props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),
	
		fixHooks: {},
	
		keyHooks: {
			props: "char charCode key keyCode".split( " " ),
			filter: function( event, original ) {
	
				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}
	
				return event;
			}
		},
	
		mouseHooks: {
			props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
				"pageX pageY screenX screenY toElement" ).split( " " ),
			filter: function( event, original ) {
				var body, eventDoc, doc,
					button = original.button,
					fromElement = original.fromElement;
	
				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;
	
					event.pageX = original.clientX +
						( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
						( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY +
						( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
						( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}
	
				// Add relatedTarget, if necessary
				if ( !event.relatedTarget && fromElement ) {
					event.relatedTarget = fromElement === event.target ?
						original.toElement :
						fromElement;
				}
	
				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}
	
				return event;
			}
		},
	
		special: {
			load: {
	
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
	
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						try {
							this.focus();
							return false;
						} catch ( e ) {
	
							// Support: IE<9
							// If we error on focus to hidden element (#1486, #12518),
							// let .trigger() run the handlers
						}
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
	
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
						this.click();
						return false;
					}
				},
	
				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},
	
			beforeunload: {
				postDispatch: function( event ) {
	
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},
	
		// Piggyback on a donor event to simulate a different one
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
	
					// Previously, `originalEvent: {}` was set here, so stopPropagation call
					// would not be triggered on donor event, since in our own
					// jQuery.event.stopPropagation function we had a check for existence of
					// originalEvent.stopPropagation method, so, consequently it would be a noop.
					//
					// Guard for simulated events was moved to jQuery.event.stopPropagation function
					// since `originalEvent` should point to the original event for the
					// constancy with other events and for more focused logic
				}
			);
	
			jQuery.event.trigger( e, null, elem );
	
			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}
	};
	
	jQuery.removeEvent = document.removeEventListener ?
		function( elem, type, handle ) {
	
			// This "if" is needed for plain objects
			if ( elem.removeEventListener ) {
				elem.removeEventListener( type, handle );
			}
		} :
		function( elem, type, handle ) {
			var name = "on" + type;
	
			if ( elem.detachEvent ) {
	
				// #8545, #7054, preventing memory leaks for custom events in IE6-8
				// detachEvent needed property on element, by name of that event,
				// to properly expose it to GC
				if ( typeof elem[ name ] === "undefined" ) {
					elem[ name ] = null;
				}
	
				elem.detachEvent( name, handle );
			}
		};
	
	jQuery.Event = function( src, props ) {
	
		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}
	
		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
	
					// Support: IE < 9, Android < 4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}
	
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();
	
		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
	
		preventDefault: function() {
			var e = this.originalEvent;
	
			this.isDefaultPrevented = returnTrue;
			if ( !e ) {
				return;
			}
	
			// If preventDefault exists, run it on the original event
			if ( e.preventDefault ) {
				e.preventDefault();
	
			// Support: IE
			// Otherwise set the returnValue property of the original event to false
			} else {
				e.returnValue = false;
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;
	
			this.isPropagationStopped = returnTrue;
	
			if ( !e || this.isSimulated ) {
				return;
			}
	
			// If stopPropagation exists, run it on the original event
			if ( e.stopPropagation ) {
				e.stopPropagation();
			}
	
			// Support: IE
			// Set the cancelBubble property of the original event to true
			e.cancelBubble = true;
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
	
			this.isImmediatePropagationStopped = returnTrue;
	
			if ( e && e.stopImmediatePropagation ) {
				e.stopImmediatePropagation();
			}
	
			this.stopPropagation();
		}
	};
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,
	
			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
	
				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );
	
	// IE submit delegation
	if ( !support.submit ) {
	
		jQuery.event.special.submit = {
			setup: function() {
	
				// Only need this for delegated form submit events
				if ( jQuery.nodeName( this, "form" ) ) {
					return false;
				}
	
				// Lazy-add a submit handler when a descendant form may potentially be submitted
				jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
	
					// Node name check avoids a VML-related crash in IE (#9807)
					var elem = e.target,
						form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?
	
							// Support: IE <=8
							// We use jQuery.prop instead of elem.form
							// to allow fixing the IE8 delegated submit issue (gh-2332)
							// by 3rd party polyfills/workarounds.
							jQuery.prop( elem, "form" ) :
							undefined;
	
					if ( form && !jQuery._data( form, "submit" ) ) {
						jQuery.event.add( form, "submit._submit", function( event ) {
							event._submitBubble = true;
						} );
						jQuery._data( form, "submit", true );
					}
				} );
	
				// return undefined since we don't need an event listener
			},
	
			postDispatch: function( event ) {
	
				// If form was submitted by the user, bubble the event up the tree
				if ( event._submitBubble ) {
					delete event._submitBubble;
					if ( this.parentNode && !event.isTrigger ) {
						jQuery.event.simulate( "submit", this.parentNode, event );
					}
				}
			},
	
			teardown: function() {
	
				// Only need this for delegated form submit events
				if ( jQuery.nodeName( this, "form" ) ) {
					return false;
				}
	
				// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
				jQuery.event.remove( this, "._submit" );
			}
		};
	}
	
	// IE change delegation and checkbox/radio fix
	if ( !support.change ) {
	
		jQuery.event.special.change = {
	
			setup: function() {
	
				if ( rformElems.test( this.nodeName ) ) {
	
					// IE doesn't fire change on a check/radio until blur; trigger it on click
					// after a propertychange. Eat the blur-change in special.change.handle.
					// This still fires onchange a second time for check/radio after blur.
					if ( this.type === "checkbox" || this.type === "radio" ) {
						jQuery.event.add( this, "propertychange._change", function( event ) {
							if ( event.originalEvent.propertyName === "checked" ) {
								this._justChanged = true;
							}
						} );
						jQuery.event.add( this, "click._change", function( event ) {
							if ( this._justChanged && !event.isTrigger ) {
								this._justChanged = false;
							}
	
							// Allow triggered, simulated change events (#11500)
							jQuery.event.simulate( "change", this, event );
						} );
					}
					return false;
				}
	
				// Delegated event; lazy-add a change handler on descendant inputs
				jQuery.event.add( this, "beforeactivate._change", function( e ) {
					var elem = e.target;
	
					if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
						jQuery.event.add( elem, "change._change", function( event ) {
							if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
								jQuery.event.simulate( "change", this.parentNode, event );
							}
						} );
						jQuery._data( elem, "change", true );
					}
				} );
			},
	
			handle: function( event ) {
				var elem = event.target;
	
				// Swallow native change events from checkbox/radio, we already triggered them above
				if ( this !== elem || event.isSimulated || event.isTrigger ||
					( elem.type !== "radio" && elem.type !== "checkbox" ) ) {
	
					return event.handleObj.handler.apply( this, arguments );
				}
			},
	
			teardown: function() {
				jQuery.event.remove( this, "._change" );
	
				return !rformElems.test( this.nodeName );
			}
		};
	}
	
	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};
	
			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = jQuery._data( doc, fix );
	
					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = jQuery._data( doc, fix ) - 1;
	
					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						jQuery._removeData( doc, fix );
					} else {
						jQuery._data( doc, fix, attaches );
					}
				}
			};
		} );
	}
	
	jQuery.fn.extend( {
	
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
	
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
	
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
	
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		},
	
		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );
	
	
	var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
		rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
	
		// Support: IE 10-11, Edge 10240+
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,
	
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
		safeFragment = createSafeFragment( document ),
		fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );
	
	// Support: IE<8
	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?
	
			elem.getElementsByTagName( "tbody" )[ 0 ] ||
				elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
			elem;
	}
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );
		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}
		return elem;
	}
	
	function cloneCopyEvent( src, dest ) {
		if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
			return;
		}
	
		var type, i, l,
			oldData = jQuery._data( src ),
			curData = jQuery._data( dest, oldData ),
			events = oldData.events;
	
		if ( events ) {
			delete curData.handle;
			curData.events = {};
	
			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	
		// make the cloned public data object a copy from the original
		if ( curData.data ) {
			curData.data = jQuery.extend( {}, curData.data );
		}
	}
	
	function fixCloneNodeIssues( src, dest ) {
		var nodeName, e, data;
	
		// We do not need to do anything for non-Elements
		if ( dest.nodeType !== 1 ) {
			return;
		}
	
		nodeName = dest.nodeName.toLowerCase();
	
		// IE6-8 copies events bound via attachEvent when using cloneNode.
		if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
			data = jQuery._data( dest );
	
			for ( e in data.events ) {
				jQuery.removeEvent( dest, e, data.handle );
			}
	
			// Event data gets referenced instead of copied if the expando gets copied too
			dest.removeAttribute( jQuery.expando );
		}
	
		// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
		if ( nodeName === "script" && dest.text !== src.text ) {
			disableScript( dest ).text = src.text;
			restoreScript( dest );
	
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		} else if ( nodeName === "object" ) {
			if ( dest.parentNode ) {
				dest.outerHTML = src.outerHTML;
			}
	
			// This path appears unavoidable for IE9. When cloning an object
			// element in IE9, the outerHTML strategy above is not sufficient.
			// If the src has innerHTML and the destination does not,
			// copy the src.innerHTML into the dest.innerHTML. #10324
			if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
				dest.innerHTML = src.innerHTML;
			}
	
		} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
	
			// IE6-8 fails to persist the checked state of a cloned checkbox
			// or radio button. Worse, IE6-7 fail to give the cloned element
			// a checked appearance if the defaultChecked value isn't also set
	
			dest.defaultChecked = dest.checked = src.checked;
	
			// IE6-7 get confused and end up setting the value of a cloned
			// checkbox/radio button to an empty string instead of "on"
			if ( dest.value !== src.value ) {
				dest.value = src.value;
			}
	
		// IE6-8 fails to return the selected option to the default selected
		// state when cloning options
		} else if ( nodeName === "option" ) {
			dest.defaultSelected = dest.selected = src.defaultSelected;
	
		// IE6-8 fails to set the defaultValue to the correct value when
		// cloning other types of input fields
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}
	
	function domManip( collection, args, callback, ignored ) {
	
		// Flatten any nested arrays
		args = concat.apply( [], args );
	
		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );
	
		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}
	
		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;
	
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}
	
			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;
	
				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
	
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );
	
						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
	
							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
	
					callback.call( collection[ i ], node, i );
				}
	
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;
	
					// Reenable scripts
					jQuery.map( scripts, restoreScript );
	
					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {
	
							if ( node.src ) {
	
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval(
									( node.text || node.textContent || node.innerHTML || "" )
										.replace( rcleanScript, "" )
								);
							}
						}
					}
				}
	
				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}
	
		return collection;
	}
	
	function remove( elem, selector, keepData ) {
		var node,
			elems = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;
	
		for ( ; ( node = elems[ i ] ) != null; i++ ) {
	
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}
	
			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}
	
		return elem;
	}
	
	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},
	
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var destElements, node, clone, i, srcElements,
				inPage = jQuery.contains( elem.ownerDocument, elem );
	
			if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
				!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
	
				clone = elem.cloneNode( true );
	
			// IE<=8 does not properly clone detached, unknown element nodes
			} else {
				fragmentDiv.innerHTML = elem.outerHTML;
				fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
			}
	
			if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
					( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {
	
				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );
	
				// Fix all IE cloning issues
				for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {
	
					// Ensure that the destination node is not null; Fixes #9587
					if ( destElements[ i ] ) {
						fixCloneNodeIssues( node, destElements[ i ] );
					}
				}
			}
	
			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );
	
					for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
						cloneCopyEvent( node, destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}
	
			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}
	
			destElements = srcElements = node = null;
	
			// Return the cloned set
			return clone;
		},
	
		cleanData: function( elems, /* internal */ forceAcceptData ) {
			var elem, type, id, data,
				i = 0,
				internalKey = jQuery.expando,
				cache = jQuery.cache,
				attributes = support.attributes,
				special = jQuery.event.special;
	
			for ( ; ( elem = elems[ i ] ) != null; i++ ) {
				if ( forceAcceptData || acceptData( elem ) ) {
	
					id = elem[ internalKey ];
					data = id && cache[ id ];
	
					if ( data ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );
	
								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
	
						// Remove cache only if it was not already removed by jQuery.event.remove
						if ( cache[ id ] ) {
	
							delete cache[ id ];
	
							// Support: IE<9
							// IE does not allow us to delete expando properties from nodes
							// IE creates expando attributes along with the property
							// IE does not have a removeAttribute function on Document nodes
							if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
								elem.removeAttribute( internalKey );
	
							// Webkit & Blink performance suffers when deleting properties
							// from DOM nodes, so set to undefined instead
							// https://code.google.com/p/chromium/issues/detail?id=378607
							} else {
								elem[ internalKey ] = undefined;
							}
	
							deletedIds.push( id );
						}
					}
				}
			}
		}
	} );
	
	jQuery.fn.extend( {
	
		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,
	
		detach: function( selector ) {
			return remove( this, selector, true );
		},
	
		remove: function( selector ) {
			return remove( this, selector );
		},
	
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().append(
						( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
					);
			}, null, value, arguments.length );
		},
	
		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},
	
		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},
	
		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},
	
		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},
	
		empty: function() {
			var elem,
				i = 0;
	
			for ( ; ( elem = this[ i ] ) != null; i++ ) {
	
				// Remove element nodes and prevent memory leaks
				if ( elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem, false ) );
				}
	
				// Remove any remaining nodes
				while ( elem.firstChild ) {
					elem.removeChild( elem.firstChild );
				}
	
				// If this is a select, ensure that it displays empty (#12336)
				// Support: IE<9
				if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
					elem.options.length = 0;
				}
			}
	
			return this;
		},
	
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},
	
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;
	
				if ( value === undefined ) {
					return elem.nodeType === 1 ?
						elem.innerHTML.replace( rinlinejQuery, "" ) :
						undefined;
				}
	
				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
					( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
	
					value = jQuery.htmlPrefilter( value );
	
					try {
						for ( ; i < l; i++ ) {
	
							// Remove element nodes and prevent memory leaks
							elem = this[ i ] || {};
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}
	
						elem = 0;
	
					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}
	
				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},
	
		replaceWith: function() {
			var ignored = [];
	
			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;
	
				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}
	
			// Force callback invocation
			}, ignored );
		}
	} );
	
	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				i = 0,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1;
	
			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );
	
				// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
				push.apply( ret, elems.get() );
			}
	
			return this.pushStack( ret );
		};
	} );
	
	
	var iframe,
		elemdisplay = {
	
			// Support: Firefox
			// We have to pre-define these values for FF (#10227)
			HTML: "block",
			BODY: "block"
		};
	
	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */
	
	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
	
			display = jQuery.css( elem[ 0 ], "display" );
	
		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();
	
		return display;
	}
	
	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];
	
		if ( !display ) {
			display = actualDisplay( nodeName, doc );
	
			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {
	
				// Use the already-created iframe if possible
				iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
					.appendTo( doc.documentElement );
	
				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;
	
				// Support: IE
				doc.write();
				doc.close();
	
				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}
	
			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}
	
		return display;
	}
	var rmargin = ( /^margin/ );
	
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
	
	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};
	
		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
	
		ret = callback.apply( elem, args || [] );
	
		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	
		return ret;
	};
	
	
	var documentElement = document.documentElement;
	
	
	
	( function() {
		var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
			reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );
	
		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}
	
		div.style.cssText = "float:left;opacity:.5";
	
		// Support: IE<9
		// Make sure that element opacity exists (as opposed to filter)
		support.opacity = div.style.opacity === "0.5";
	
		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		support.cssFloat = !!div.style.cssFloat;
	
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
		container = document.createElement( "div" );
		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		div.innerHTML = "";
		container.appendChild( div );
	
		// Support: Firefox<29, Android 2.3
		// Vendor-prefix box-sizing
		support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
			div.style.WebkitBoxSizing === "";
	
		jQuery.extend( support, {
			reliableHiddenOffsets: function() {
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableHiddenOffsetsVal;
			},
	
			boxSizingReliable: function() {
	
				// We're checking for pixelPositionVal here instead of boxSizingReliableVal
				// since that compresses better and they're computed together anyway.
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return boxSizingReliableVal;
			},
	
			pixelMarginRight: function() {
	
				// Support: Android 4.0-4.3
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},
	
			pixelPosition: function() {
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return pixelPositionVal;
			},
	
			reliableMarginRight: function() {
	
				// Support: Android 2.3
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableMarginRightVal;
			},
	
			reliableMarginLeft: function() {
	
				// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			}
		} );
	
		function computeStyleTests() {
			var contents, divStyle,
				documentElement = document.documentElement;
	
			// Setup
			documentElement.appendChild( container );
	
			div.style.cssText =
	
				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
	
			// Support: IE<9
			// Assume reasonable values in the absence of getComputedStyle
			pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
			pixelMarginRightVal = reliableMarginRightVal = true;
	
			// Check for getComputedStyle so that this code is not run in IE<9.
			if ( window.getComputedStyle ) {
				divStyle = window.getComputedStyle( div );
				pixelPositionVal = ( divStyle || {} ).top !== "1%";
				reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
				boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";
	
				// Support: Android 4.0 - 4.3 only
				// Some styles come back with percentage values, even though they shouldn't
				div.style.marginRight = "50%";
				pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";
	
				// Support: Android 2.3 only
				// Div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				contents = div.appendChild( document.createElement( "div" ) );
	
				// Reset CSS: box-sizing; display; margin; border; padding
				contents.style.cssText = div.style.cssText =
	
					// Support: Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				contents.style.marginRight = contents.style.width = "0";
				div.style.width = "1px";
	
				reliableMarginRightVal =
					!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );
	
				div.removeChild( contents );
			}
	
			// Support: IE6-8
			// First check that getClientRects works as expected
			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			div.style.display = "none";
			reliableHiddenOffsetsVal = div.getClientRects().length === 0;
			if ( reliableHiddenOffsetsVal ) {
				div.style.display = "";
				div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
				div.childNodes[ 0 ].style.borderCollapse = "separate";
				contents = div.getElementsByTagName( "td" );
				contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
				if ( reliableHiddenOffsetsVal ) {
					contents[ 0 ].style.display = "";
					contents[ 1 ].style.display = "none";
					reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
				}
			}
	
			// Teardown
			documentElement.removeChild( container );
		}
	
	} )();
	
	
	var getStyles, curCSS,
		rposition = /^(top|right|bottom|left)$/;
	
	if ( window.getComputedStyle ) {
		getStyles = function( elem ) {
	
			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;
	
			if ( !view || !view.opener ) {
				view = window;
			}
	
			return view.getComputedStyle( elem );
		};
	
		curCSS = function( elem, name, computed ) {
			var width, minWidth, maxWidth, ret,
				style = elem.style;
	
			computed = computed || getStyles( elem );
	
			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;
	
			// Support: Opera 12.1x only
			// Fall back to style even without computed
			// computed is undefined for elems on document fragments
			if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}
	
			if ( computed ) {
	
				// A tribute to the "awesome hack by Dean Edwards"
				// Chrome < 17 and Safari 5.0 uses "computed value"
				// instead of "used value" for margin-right
				// Safari 5.1.7 (at least) returns percentage for a larger set of values,
				// but width seems to be reliably pixels
				// this is against the CSSOM draft spec:
				// http://dev.w3.org/csswg/cssom/#resolved-values
				if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {
	
					// Remember the original values
					width = style.width;
					minWidth = style.minWidth;
					maxWidth = style.maxWidth;
	
					// Put in the new values to get a computed value out
					style.minWidth = style.maxWidth = style.width = ret;
					ret = computed.width;
	
					// Revert the changed values
					style.width = width;
					style.minWidth = minWidth;
					style.maxWidth = maxWidth;
				}
			}
	
			// Support: IE
			// IE returns zIndex value as an integer.
			return ret === undefined ?
				ret :
				ret + "";
		};
	} else if ( documentElement.currentStyle ) {
		getStyles = function( elem ) {
			return elem.currentStyle;
		};
	
		curCSS = function( elem, name, computed ) {
			var left, rs, rsLeft, ret,
				style = elem.style;
	
			computed = computed || getStyles( elem );
			ret = computed ? computed[ name ] : undefined;
	
			// Avoid setting ret to empty string here
			// so we don't default to auto
			if ( ret == null && style && style[ name ] ) {
				ret = style[ name ];
			}
	
			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
	
			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			// but not position css attributes, as those are
			// proportional to the parent element instead
			// and we can't measure the parent instead because it
			// might trigger a "stacking dolls" problem
			if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {
	
				// Remember the original values
				left = style.left;
				rs = elem.runtimeStyle;
				rsLeft = rs && rs.left;
	
				// Put in the new values to get a computed value out
				if ( rsLeft ) {
					rs.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : ret;
				ret = style.pixelLeft + "px";
	
				// Revert the changed values
				style.left = left;
				if ( rsLeft ) {
					rs.left = rsLeft;
				}
			}
	
			// Support: IE
			// IE returns zIndex value as an integer.
			return ret === undefined ?
				ret :
				ret + "" || "auto";
		};
	}
	
	
	
	
	function addGetHookIf( conditionFn, hookFn ) {
	
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
	
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}
	
				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}
	
	
	var
	
			ralpha = /alpha\([^)]*\)/i,
		ropacity = /opacity\s*=\s*([^)]*)/i,
	
		// swappable if display is none or starts with table except
		// "table", "table-cell", or "table-caption"
		// see here for display values:
		// https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
	
		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;
	
	
	// return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {
	
		// shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}
	
		// check for vendor prefixed names
		var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;
	
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}
	
	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;
	
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
	
			values[ index ] = jQuery._data( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {
	
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}
	
				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] =
						jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
				}
			} else {
				hidden = isHidden( elem );
	
				if ( display && display !== "none" || !hidden ) {
					jQuery._data(
						elem,
						"olddisplay",
						hidden ? display : jQuery.css( elem, "display" )
					);
				}
			}
		}
	
		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}
	
		return elements;
	}
	
	function setPositiveNumber( elem, value, subtract ) {
		var matches = rnumsplit.exec( value );
		return matches ?
	
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
	}
	
	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?
	
			// If we already have the right measurement, avoid augmentation
			4 :
	
			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,
	
			val = 0;
	
		for ( ; i < 4; i += 2 ) {
	
			// both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}
	
			if ( isBorderBox ) {
	
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}
	
				// at this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
	
				// at this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
				// at this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}
	
		return val;
	}
	
	function getWidthOrHeight( elem, name, extra ) {
	
		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = support.boxSizing &&
				jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
		// some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
	
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}
	
			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}
	
			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );
	
			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}
	
		// use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}
	
	jQuery.extend( {
	
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
	
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
	
		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
	
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
	
			// normalize float css property
			"float": support.cssFloat ? "cssFloat" : "styleFloat"
		},
	
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
	
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;
	
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );
	
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that null and NaN values aren't set. See: #7116
				if ( value == null || value !== value ) {
					return;
				}
	
				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}
	
				// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
				// but it would mean to define eight
				// (for every problematic property) identical functions
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {
	
					// Support: IE
					// Swallow errors from 'invalid' CSS values (#5509)
					try {
						style[ name ] = value;
					} catch ( e ) {}
				}
	
			} else {
	
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
	
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra, styles ) {
			var num, val, hooks,
				origName = jQuery.camelCase( name );
	
			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}
	
			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}
	
			//convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}
	
			// Return, converting to number if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );
	
	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
	
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
						elem.offsetWidth === 0 ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},
	
			set: function( elem, value, extra ) {
				var styles = extra && getStyles( elem );
				return setPositiveNumber( elem, value, extra ?
					augmentWidthOrHeight(
						elem,
						name,
						extra,
						support.boxSizing &&
							jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					) : 0
				);
			}
		};
	} );
	
	if ( !support.opacity ) {
		jQuery.cssHooks.opacity = {
			get: function( elem, computed ) {
	
				// IE uses filters for opacity
				return ropacity.test( ( computed && elem.currentStyle ?
					elem.currentStyle.filter :
					elem.style.filter ) || "" ) ?
						( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
						computed ? "1" : "";
			},
	
			set: function( elem, value ) {
				var style = elem.style,
					currentStyle = elem.currentStyle,
					opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
					filter = currentStyle && currentStyle.filter || style.filter || "";
	
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;
	
				// if setting opacity to 1, and no other filters exist -
				// attempt to remove filter attribute #6652
				// if value === "", then remove inline opacity #12685
				if ( ( value >= 1 || value === "" ) &&
						jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
						style.removeAttribute ) {
	
					// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
					// if "filter:" is present at all, clearType is disabled, we want to avoid this
					// style.removeAttribute is IE Only, but so apparently is this code path...
					style.removeAttribute( "filter" );
	
					// if there is no filter style applied in a css rule
					// or unset inline opacity, we are done
					if ( value === "" || currentStyle && !currentStyle.filter ) {
						return;
					}
				}
	
				// otherwise, set new filter values
				style.filter = ralpha.test( filter ) ?
					filter.replace( ralpha, opacity ) :
					filter + " " + opacity;
			}
		};
	}
	
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);
	
	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return (
					parseFloat( curCSS( elem, "marginLeft" ) ) ||
	
					// Support: IE<=11+
					// Running getBoundingClientRect on a disconnected node in IE throws an error
					// Support: IE8 only
					// getClientRects() errors on disconnected elems
					( jQuery.contains( elem.ownerDocument, elem ) ?
						elem.getBoundingClientRect().left -
							swap( elem, { marginLeft: 0 }, function() {
								return elem.getBoundingClientRect().left;
							} ) :
						0
					)
				) + "px";
			}
		}
	);
	
	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},
	
					// assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];
	
				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}
	
				return expanded;
			}
		};
	
		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );
	
	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;
	
				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;
	
					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}
	
					return map;
				}
	
				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}
	
			return this.each( function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	
	
	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;
	
	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];
	
			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];
	
			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;
	
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}
	
			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};
	
	Tween.prototype.init.prototype = Tween.prototype;
	
	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;
	
				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}
	
				// passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails
				// so, simple values such as "10px" are parsed to Float.
				// complex values such as "rotate(1rad)" are returned as is.
				result = jQuery.css( tween.elem, tween.prop, "" );
	
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
	
				// use step hook for back compat - use cssHook if its there - use .style if its
				// available and use plain properties where available
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};
	
	// Support: IE <=9
	// Panic based approach to setting things on disconnected nodes
	
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};
	
	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};
	
	jQuery.fx = Tween.prototype.init;
	
	// Back Compat <1.8 extension point
	jQuery.fx.step = {};
	
	
	
	
	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;
	
	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}
	
	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			attrs = { height: type },
			i = 0;
	
		// if we include width, step value is 1 to do all cssExpand values,
		// if we don't include width, step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}
	
		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}
	
		return attrs;
	}
	
	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
	
				// we're done with this property
				return tween;
			}
		}
	}
	
	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = jQuery._data( elem, "fxshow" );
	
		// handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;
	
			anim.always( function() {
	
				// doing this makes sure that the complete handler will be called
				// before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}
	
		// height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
	
			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE does not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );
	
			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;
	
			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
	
				// inline-level elements accept inline-block;
				// block-level elements need to be inline with layout
				if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
					style.display = "inline-block";
				} else {
					style.zoom = 1;
				}
			}
		}
	
		if ( opts.overflow ) {
			style.overflow = "hidden";
			if ( !support.shrinkWrapBlocks() ) {
				anim.always( function() {
					style.overflow = opts.overflow[ 0 ];
					style.overflowX = opts.overflow[ 1 ];
					style.overflowY = opts.overflow[ 2 ];
				} );
			}
		}
	
		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {
	
					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
	
			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}
	
		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = jQuery._data( elem, "fxshow", {} );
			}
	
			// store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done( function() {
					jQuery( elem ).hide();
				} );
			}
			anim.done( function() {
				var prop;
				jQuery._removeData( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
	
				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}
	
		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
			style.display = display;
		}
	}
	
	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;
	
		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}
	
			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}
	
			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];
	
				// not quite $.extend, this wont overwrite keys already present.
				// also - reusing 'index' from above because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}
	
	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {
	
				// don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
	
					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;
	
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}
	
				deferred.notifyWith( elem, [ animation, percent, remaining ] );
	
				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
	
						// if we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
	
					// resolve when we played the last frame
					// otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;
	
		propFilter( props, animation.opts.specialEasing );
	
		for ( ; index < length ; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}
	
		jQuery.map( props, createTween, animation );
	
		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}
	
		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);
	
		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}
	
	jQuery.Animation = jQuery.extend( Animation, {
	
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},
	
		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnotwhite );
			}
	
			var prop,
				index = 0,
				length = props.length;
	
			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},
	
		prefilters: [ defaultPrefilter ],
	
		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );
	
	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};
	
		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ?
				jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
	
		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}
	
		// Queueing
		opt.old = opt.complete;
	
		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
	
			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};
	
		return opt;
	};
	
	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {
	
			// show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()
	
				// animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
	
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
					// Empty animations, or finishing resolves immediately
					if ( empty || jQuery._data( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;
	
			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};
	
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}
	
			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = jQuery._data( this );
	
				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}
	
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {
	
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}
	
				// start the next in the queue if the last step wasn't forced
				// timers currently will call their complete callbacks, which will dequeue
				// but only if they were gotoEnd
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = jQuery._data( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
	
				// enable finishing flag on private data
				data.finish = true;
	
				// empty the queue first
				jQuery.queue( this, type, [] );
	
				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}
	
				// look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}
	
				// look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}
	
				// turn off finishing flag
				delete data.finish;
			} );
		}
	} );
	
	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );
	
	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );
	
	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			timers = jQuery.timers,
			i = 0;
	
		fxNow = jQuery.now();
	
		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
	
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}
	
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};
	
	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};
	
	jQuery.fx.interval = 13;
	
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};
	
	jQuery.fx.stop = function() {
		window.clearInterval( timerId );
		timerId = null;
	};
	
	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
	
		// Default speed
		_default: 400
	};
	
	
	// Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";
	
		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};
	
	
	( function() {
		var a,
			input = document.createElement( "input" ),
			div = document.createElement( "div" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );
	
		// Setup
		div = document.createElement( "div" );
		div.setAttribute( "className", "t" );
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
		a = div.getElementsByTagName( "a" )[ 0 ];
	
		// Support: Windows Web Apps (WWA)
		// `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "checkbox" );
		div.appendChild( input );
	
		a = div.getElementsByTagName( "a" )[ 0 ];
	
		// First batch of tests.
		a.style.cssText = "top:1px";
	
		// Test setAttribute on camelCase class.
		// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		support.getSetAttribute = div.className !== "t";
	
		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		support.style = /top/.test( a.getAttribute( "style" ) );
	
		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		support.hrefNormalized = a.getAttribute( "href" ) === "/a";
	
		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		support.checkOn = !!input.value;
	
		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		support.optSelected = opt.selected;
	
		// Tests for enctype support on a form (#6743)
		support.enctype = !!document.createElement( "form" ).enctype;
	
		// Make sure that the options inside disabled selects aren't marked as disabled
		// (WebKit marks them as disabled)
		select.disabled = true;
		support.optDisabled = !opt.disabled;
	
		// Support: IE8 only
		// Check if we can trust getAttribute("value")
		input = document.createElement( "input" );
		input.setAttribute( "value", "" );
		support.input = input.getAttribute( "value" ) === "";
	
		// Check if an input maintains its value after becoming a radio
		input.value = "t";
		input.setAttribute( "type", "radio" );
		support.radioValue = input.value === "t";
	} )();
	
	
	var rreturn = /\r/g,
		rspaces = /[\x20\t\r\n\f]+/g;
	
	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];
	
			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
					if (
						hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}
	
					ret = elem.value;
	
					return typeof ret === "string" ?
	
						// handle most common string cases
						ret.replace( rreturn, "" ) :
	
						// handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}
	
				return;
			}
	
			isFunction = jQuery.isFunction( value );
	
			return this.each( function( i ) {
				var val;
	
				if ( this.nodeType !== 1 ) {
					return;
				}
	
				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}
	
				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
				} else if ( typeof val === "number" ) {
					val += "";
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}
	
				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );
	
	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
	
						// Support: IE10-11+
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;
	
					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];
	
						// oldIE doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
	
								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ?
									!option.disabled :
									option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
	
							// Get the specific value for the option
							value = jQuery( option ).val();
	
							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
	
							// Multi-Selects return an array
							values.push( value );
						}
					}
	
					return values;
				},
	
				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;
	
					while ( i-- ) {
						option = options[ i ];
	
						if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {
	
							// Support: IE6
							// When new option element is added to select box we need to
							// force reflow of newly added node in order to workaround delay
							// of initialization properties
							try {
								option.selected = optionSet = true;
	
							} catch ( _ ) {
	
								// Will be executed only in IE6
								option.scrollHeight;
							}
	
						} else {
							option.selected = false;
						}
					}
	
					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
	
					return options;
				}
			}
		}
	} );
	
	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );
	
	
	
	
	var nodeHook, boolHook,
		attrHandle = jQuery.expr.attrHandle,
		ruseDefault = /^(?:checked|selected)$/i,
		getSetAttribute = support.getSetAttribute,
		getSetInput = support.input;
	
	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},
	
		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );
	
	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}
	
			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
			}
	
			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}
	
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				elem.setAttribute( name, value + "" );
				return value;
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			ret = jQuery.find.attr( elem, name );
	
			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},
	
		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
	
						// Setting the type on a radio button after the value resets the value in IE8-9
						// Reset value to default in case type is set after value during creation
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},
	
		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );
	
			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					propName = jQuery.propFix[ name ] || name;
	
					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {
	
						// Set corresponding property to false
						if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
							elem[ propName ] = false;
	
						// Support: IE<9
						// Also clear defaultChecked/defaultSelected (if appropriate)
						} else {
							elem[ jQuery.camelCase( "default-" + name ) ] =
								elem[ propName ] = false;
						}
	
					// See #9699 for explanation of this approach (setting first, then removal)
					} else {
						jQuery.attr( elem, name, "" );
					}
	
					elem.removeAttribute( getSetAttribute ? name : propName );
				}
			}
		}
	} );
	
	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
	
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
	
				// IE<8 needs the *property* name
				elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );
	
			} else {
	
				// Support: IE<9
				// Use defaultChecked and defaultSelected for oldIE
				elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
			}
			return name;
		}
	};
	
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;
	
		if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			attrHandle[ name ] = function( elem, name, isXML ) {
				var ret, handle;
				if ( !isXML ) {
	
					// Avoid an infinite loop by temporarily removing this function from the getter
					handle = attrHandle[ name ];
					attrHandle[ name ] = ret;
					ret = getter( elem, name, isXML ) != null ?
						name.toLowerCase() :
						null;
					attrHandle[ name ] = handle;
				}
				return ret;
			};
		} else {
			attrHandle[ name ] = function( elem, name, isXML ) {
				if ( !isXML ) {
					return elem[ jQuery.camelCase( "default-" + name ) ] ?
						name.toLowerCase() :
						null;
				}
			};
		}
	} );
	
	// fix oldIE attroperties
	if ( !getSetInput || !getSetAttribute ) {
		jQuery.attrHooks.value = {
			set: function( elem, value, name ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
	
					// Does not return so that setAttribute is also used
					elem.defaultValue = value;
				} else {
	
					// Use nodeHook if defined (#1954); otherwise setAttribute is fine
					return nodeHook && nodeHook.set( elem, value, name );
				}
			}
		};
	}
	
	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	if ( !getSetAttribute ) {
	
		// Use this for any attribute in IE6/7
		// This fixes almost every IE6/7 issue
		nodeHook = {
			set: function( elem, value, name ) {
	
				// Set the existing or create a new attribute node
				var ret = elem.getAttributeNode( name );
				if ( !ret ) {
					elem.setAttributeNode(
						( ret = elem.ownerDocument.createAttribute( name ) )
					);
				}
	
				ret.value = value += "";
	
				// Break association with cloned elements by also using setAttribute (#9646)
				if ( name === "value" || value === elem.getAttribute( name ) ) {
					return value;
				}
			}
		};
	
		// Some attributes are constructed with empty-string values when not defined
		attrHandle.id = attrHandle.name = attrHandle.coords =
			function( elem, name, isXML ) {
				var ret;
				if ( !isXML ) {
					return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
						ret.value :
						null;
				}
			};
	
		// Fixing value retrieval on a button requires this module
		jQuery.valHooks.button = {
			get: function( elem, name ) {
				var ret = elem.getAttributeNode( name );
				if ( ret && ret.specified ) {
					return ret.value;
				}
			},
			set: nodeHook.set
		};
	
		// Set contenteditable to false on removals(#10429)
		// Setting to empty string throws an error as an invalid value
		jQuery.attrHooks.contenteditable = {
			set: function( elem, value, name ) {
				nodeHook.set( elem, value === "" ? false : value, name );
			}
		};
	
		// Set width and height to auto instead of 0 on empty string( Bug #8150 )
		// This is for removals
		jQuery.each( [ "width", "height" ], function( i, name ) {
			jQuery.attrHooks[ name ] = {
				set: function( elem, value ) {
					if ( value === "" ) {
						elem.setAttribute( name, "auto" );
						return value;
					}
				}
			};
		} );
	}
	
	if ( !support.style ) {
		jQuery.attrHooks.style = {
			get: function( elem ) {
	
				// Return undefined in the case of empty string
				// Note: IE uppercases css property names, but if we were to .toLowerCase()
				// .cssText, that would destroy case sensitivity in URL's, like in "background"
				return elem.style.cssText || undefined;
			},
			set: function( elem, value ) {
				return ( elem.style.cssText = value + "" );
			}
		};
	}
	
	
	
	
	var rfocusable = /^(?:input|select|textarea|button|object)$/i,
		rclickable = /^(?:a|area)$/i;
	
	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},
	
		removeProp: function( name ) {
			name = jQuery.propFix[ name ] || name;
			return this.each( function() {
	
				// try/catch handles cases where IE balks (such as removing a property on window)
				try {
					this[ name ] = undefined;
					delete this[ name ];
				} catch ( e ) {}
			} );
		}
	} );
	
	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
	
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}
	
			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				return ( elem[ name ] = value );
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			return elem[ name ];
		},
	
		propHooks: {
			tabIndex: {
				get: function( elem ) {
	
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );
	
					return tabindex ?
						parseInt( tabindex, 10 ) :
						rfocusable.test( elem.nodeName ) ||
							rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								-1;
				}
			}
		},
	
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );
	
	// Some attributes require a special call on IE
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !support.hrefNormalized ) {
	
		// href/src property should get the full normalized URL (#10299/#12915)
		jQuery.each( [ "href", "src" ], function( i, name ) {
			jQuery.propHooks[ name ] = {
				get: function( elem ) {
					return elem.getAttribute( name, 4 );
				}
			};
		} );
	}
	
	// Support: Safari, IE9+
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
	
				if ( parent ) {
					parent.selectedIndex;
	
					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
				return null;
			},
			set: function( elem ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}
	
	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );
	
	// IE6/7 call enctype encoding
	if ( !support.enctype ) {
		jQuery.propFix.enctype = "encoding";
	}
	
	
	
	
	var rclass = /[\t\r\n\f]/g;
	
	function getClass( elem ) {
		return jQuery.attr( elem, "class" ) || "";
	}
	
	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}
	
						// only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							jQuery.attr( elem, "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
	
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
	
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							jQuery.attr( elem, "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		toggleClass: function( value, stateVal ) {
			var type = typeof value;
	
			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}
	
			return this.each( function() {
				var className, i, self, classNames;
	
				if ( type === "string" ) {
	
					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnotwhite ) || [];
	
					while ( ( className = classNames[ i++ ] ) ) {
	
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}
	
				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {
	
						// store className if set
						jQuery._data( this, "__className__", className );
					}
	
					// If the element has a class name or if we're passed "false",
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					jQuery.attr( this, "class",
						className || value === false ?
						"" :
						jQuery._data( this, "__className__" ) || ""
					);
				}
			} );
		},
	
		hasClass: function( selector ) {
			var className, elem,
				i = 0;
	
			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + getClass( elem ) + " " ).replace( rclass, " " )
						.indexOf( className ) > -1
				) {
					return true;
				}
			}
	
			return false;
		}
	} );
	
	
	
	
	// Return jQuery for attributes-only inclusion
	
	
	jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
		function( i, name ) {
	
		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );
	
	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );
	
	
	var location = window.location;
	
	var nonce = jQuery.now();
	
	var rquery = ( /\?/ );
	
	
	
	var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
	
	jQuery.parseJSON = function( data ) {
	
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
	
			// Support: Android 2.3
			// Workaround failure to string-cast null input
			return window.JSON.parse( data + "" );
		}
	
		var requireNonComma,
			depth = null,
			str = jQuery.trim( data + "" );
	
		// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
		// after removing valid tokens
		return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {
	
			// Force termination if we see a misplaced comma
			if ( requireNonComma && comma ) {
				depth = 0;
			}
	
			// Perform no more replacements after returning to outermost depth
			if ( depth === 0 ) {
				return token;
			}
	
			// Commas must not follow "[", "{", or ","
			requireNonComma = open || comma;
	
			// Determine new depth
			// array/object open ("[" or "{"): depth += true - false (increment)
			// array/object close ("]" or "}"): depth += false - true (decrement)
			// other cases ("," or primitive): depth += true - true (numeric cast)
			depth += !close - !open;
	
			// Remove this token
			return "";
		} ) ) ?
			( Function( "return " + str ) )() :
			jQuery.error( "Invalid JSON: " + data );
	};
	
	
	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new window.DOMParser();
				xml = tmp.parseFromString( data, "text/xml" );
			} else { // IE
				xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch ( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};
	
	
	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
	
		// IE leaves an \r character at EOL
		rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
	
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
	
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},
	
		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},
	
		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),
	
		// Document location
		ajaxLocation = location.href,
	
		// Segment location into parts
		ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {
	
		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {
	
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}
	
			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];
	
			if ( jQuery.isFunction( func ) ) {
	
				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {
	
					// Prepend if requested
					if ( dataType.charAt( 0 ) === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );
	
					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}
	
	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
		var inspected = {},
			seekingTransport = ( structure === transports );
	
		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {
	
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}
	
		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var deep, key,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	
		return target;
	}
	
	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
		var firstDataType, ct, finalDataType, type,
			contents = s.contents,
			dataTypes = s.dataTypes;
	
		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}
	
		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}
	
		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
	
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
	
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}
	
		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}
	
	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
	
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();
	
		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}
	
		current = dataTypes.shift();
	
		// Convert to each sequential dataType
		while ( current ) {
	
			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}
	
			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}
	
			prev = current;
			current = dataTypes.shift();
	
			if ( current ) {
	
				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {
	
					current = prev;
	
				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {
	
					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {
	
							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {
	
								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
	
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];
	
									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}
	
					// Apply converter (if not an equivalence)
					if ( conv !== true ) {
	
						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}
	
		return { state: "success", data: response };
	}
	
	jQuery.extend( {
	
		// Counter for holding the number of active queries
		active: 0,
	
		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},
	
		ajaxSettings: {
			url: ajaxLocation,
			type: "GET",
			isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/
	
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
	
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
	
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
	
			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {
	
				// Convert anything to text
				"* text": String,
	
				// Text to html (true = no transformation)
				"text html": true,
	
				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,
	
				// Parse text as xml
				"text xml": jQuery.parseXML
			},
	
			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},
	
		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?
	
				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},
	
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
	
		// Main method
		ajax: function( url, options ) {
	
			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}
	
			// Force options to be an object
			options = options || {};
	
			var
	
				// Cross-domain detection vars
				parts,
	
				// Loop variable
				i,
	
				// URL without anti-cache param
				cacheURL,
	
				// Response headers as string
				responseHeadersString,
	
				// timeout handle
				timeoutTimer,
	
				// To know if global events are to be dispatched
				fireGlobals,
	
				transport,
	
				// Response headers
				responseHeaders,
	
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
	
				// Callbacks context
				callbackContext = s.context || s,
	
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,
	
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),
	
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
	
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
	
				// The jqXHR state
				state = 0,
	
				// Default abort message
				strAbort = "canceled",
	
				// Fake xhr
				jqXHR = {
					readyState: 0,
	
					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},
	
					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},
	
					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
	
					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},
	
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {
	
									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {
	
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},
	
					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};
	
			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
	
			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || ajaxLocation ) + "" )
				.replace( rhash, "" )
				.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
	
			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;
	
			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];
	
			// A cross-domain request is in order when we have a protocol:host:port mismatch
			if ( s.crossDomain == null ) {
				parts = rurl.exec( s.url.toLowerCase() );
				s.crossDomain = !!( parts &&
					( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
						( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
							( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
				);
			}
	
			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}
	
			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}
	
			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;
	
			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}
	
			// Uppercase the type
			s.type = s.type.toUpperCase();
	
			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );
	
			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;
	
			// More options handling for requests with no content
			if ( !s.hasContent ) {
	
				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
	
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}
	
				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?
	
						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :
	
						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}
	
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}
	
			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}
	
			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);
	
			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}
	
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
	
				// Abort if not done already and return
				return jqXHR.abort();
			}
	
			// aborting is no longer a cancellation
			strAbort = "abort";
	
			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}
	
			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
	
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
	
				// If request was aborted inside ajaxSend, stop there
				if ( state === 2 ) {
					return jqXHR;
				}
	
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}
	
				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {
	
					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );
	
					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}
	
			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;
	
				// Called once
				if ( state === 2 ) {
					return;
				}
	
				// State is "done" now
				state = 2;
	
				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}
	
				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;
	
				// Cache response headers
				responseHeadersString = headers || "";
	
				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;
	
				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;
	
				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}
	
				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );
	
				// If successful, handle type chaining
				if ( isSuccess ) {
	
					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}
	
					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";
	
					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";
	
					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
	
					// We extract error from statusText
					// then normalize statusText and status for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}
	
				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}
	
				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;
	
				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}
	
				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
	
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}
	
			return jqXHR;
		},
	
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},
	
		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );
	
	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
	
			// shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
	
			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );
	
	
	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,
	
			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		} );
	};
	
	
	jQuery.fn.extend( {
		wrapAll: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapAll( html.call( this, i ) );
				} );
			}
	
			if ( this[ 0 ] ) {
	
				// The elements to wrap the target around
				var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
	
				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}
	
				wrap.map( function() {
					var elem = this;
	
					while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
						elem = elem.firstChild;
					}
	
					return elem;
				} ).append( this );
			}
	
			return this;
		},
	
		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}
	
			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();
	
				if ( contents.length ) {
					contents.wrapAll( html );
	
				} else {
					self.append( html );
				}
			} );
		},
	
		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );
	
			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},
	
		unwrap: function() {
			return this.parent().each( function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			} ).end();
		}
	} );
	
	
	function getDisplay( elem ) {
		return elem.style && elem.style.display || jQuery.css( elem, "display" );
	}
	
	function filterHidden( elem ) {
	
		// Disconnected elements are considered hidden
		if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
			return true;
		}
		while ( elem && elem.nodeType === 1 ) {
			if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
				return true;
			}
			elem = elem.parentNode;
		}
		return false;
	}
	
	jQuery.expr.filters.hidden = function( elem ) {
	
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return support.reliableHiddenOffsets() ?
			( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
				!elem.getClientRects().length ) :
				filterHidden( elem );
	};
	
	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
	
	
	
	
	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	function buildParams( prefix, obj, traditional, add ) {
		var name;
	
		if ( jQuery.isArray( obj ) ) {
	
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
	
					// Treat each array item as a scalar.
					add( prefix, v );
	
				} else {
	
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );
	
		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
	
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
	
		} else {
	
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {
	
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};
	
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
	
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );
	
		} else {
	
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};
	
	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {
	
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;
	
				// Use .is(":disabled") so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();
	
				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						} ) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );
	
	
	// Create the request object
	// (This is still attached to ajaxSettings for backward compatibility)
	jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
	
		// Support: IE6-IE8
		function() {
	
			// XHR cannot access local files, always use ActiveX for that case
			if ( this.isLocal ) {
				return createActiveXHR();
			}
	
			// Support: IE 9-11
			// IE seems to error on cross-domain PATCH requests when ActiveX XHR
			// is used. In IE 9+ always use the native XHR.
			// Note: this condition won't catch Edge as it doesn't define
			// document.documentMode but it also doesn't support ActiveX so it won't
			// reach this code.
			if ( document.documentMode > 8 ) {
				return createStandardXHR();
			}
	
			// Support: IE<9
			// oldIE XHR does not support non-RFC2616 methods (#13240)
			// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
			// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
			// Although this check for six methods instead of eight
			// since IE also does not support "trace" and "connect"
			return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
				createStandardXHR() || createActiveXHR();
		} :
	
		// For all other browsers, use the standard XMLHttpRequest object
		createStandardXHR;
	
	var xhrId = 0,
		xhrCallbacks = {},
		xhrSupported = jQuery.ajaxSettings.xhr();
	
	// Support: IE<10
	// Open requests must be manually aborted on unload (#5280)
	// See https://support.microsoft.com/kb/2856746 for more info
	if ( window.attachEvent ) {
		window.attachEvent( "onunload", function() {
			for ( var key in xhrCallbacks ) {
				xhrCallbacks[ key ]( undefined, true );
			}
		} );
	}
	
	// Determine support properties
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	xhrSupported = support.ajax = !!xhrSupported;
	
	// Create transport if the browser can provide an xhr
	if ( xhrSupported ) {
	
		jQuery.ajaxTransport( function( options ) {
	
			// Cross domain only allowed if supported through XMLHttpRequest
			if ( !options.crossDomain || support.cors ) {
	
				var callback;
	
				return {
					send: function( headers, complete ) {
						var i,
							xhr = options.xhr(),
							id = ++xhrId;
	
						// Open the socket
						xhr.open(
							options.type,
							options.url,
							options.async,
							options.username,
							options.password
						);
	
						// Apply custom fields if provided
						if ( options.xhrFields ) {
							for ( i in options.xhrFields ) {
								xhr[ i ] = options.xhrFields[ i ];
							}
						}
	
						// Override mime type if needed
						if ( options.mimeType && xhr.overrideMimeType ) {
							xhr.overrideMimeType( options.mimeType );
						}
	
						// X-Requested-With header
						// For cross-domain requests, seeing as conditions for a preflight are
						// akin to a jigsaw puzzle, we simply never set it to be sure.
						// (it can always be set on a per-request basis or even using ajaxSetup)
						// For same-domain requests, won't change header if already provided.
						if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
							headers[ "X-Requested-With" ] = "XMLHttpRequest";
						}
	
						// Set headers
						for ( i in headers ) {
	
							// Support: IE<9
							// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
							// request header to a null-value.
							//
							// To keep consistent with other XHR implementations, cast the value
							// to string and ignore `undefined`.
							if ( headers[ i ] !== undefined ) {
								xhr.setRequestHeader( i, headers[ i ] + "" );
							}
						}
	
						// Do send the request
						// This may raise an exception which is actually
						// handled in jQuery.ajax (so no try/catch here)
						xhr.send( ( options.hasContent && options.data ) || null );
	
						// Listener
						callback = function( _, isAbort ) {
							var status, statusText, responses;
	
							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
	
								// Clean up
								delete xhrCallbacks[ id ];
								callback = undefined;
								xhr.onreadystatechange = jQuery.noop;
	
								// Abort manually if needed
								if ( isAbort ) {
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
	
									// Support: IE<10
									// Accessing binary-data responseText throws an exception
									// (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}
	
									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch ( e ) {
	
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}
	
									// Filter status for non standard behaviors
	
									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && options.isLocal && !options.crossDomain ) {
										status = responses.text ? 200 : 404;
	
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
	
							// Call complete if needed
							if ( responses ) {
								complete( status, statusText, responses, xhr.getAllResponseHeaders() );
							}
						};
	
						// Do send the request
						// `xhr.send` may raise an exception, but it will be
						// handled in jQuery.ajax (so no try/catch here)
						if ( !options.async ) {
	
							// If we're in sync mode we fire the callback
							callback();
						} else if ( xhr.readyState === 4 ) {
	
							// (IE6 & IE7) if it's in cache and has been
							// retrieved directly we need to fire the callback
							window.setTimeout( callback );
						} else {
	
							// Register the callback, but delay it in case `xhr.send` throws
							// Add to the list of active xhr callbacks
							xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
						}
					},
	
					abort: function() {
						if ( callback ) {
							callback( undefined, true );
						}
					}
				};
			}
		} );
	}
	
	// Functions to create xhrs
	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	}
	
	function createActiveXHR() {
		try {
			return new window.ActiveXObject( "Microsoft.XMLHTTP" );
		} catch ( e ) {}
	}
	
	
	
	
	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );
	
	// Handle cache's special case and global
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
			s.global = false;
		}
	} );
	
	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
	
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
	
			var script,
				head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;
	
			return {
	
				send: function( _, callback ) {
	
					script = document.createElement( "script" );
	
					script.async = true;
	
					if ( s.scriptCharset ) {
						script.charset = s.scriptCharset;
					}
	
					script.src = s.url;
	
					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function( _, isAbort ) {
	
						if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {
	
							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;
	
							// Remove the script
							if ( script.parentNode ) {
								script.parentNode.removeChild( script );
							}
	
							// Dereference the script
							script = null;
	
							// Callback if not abort
							if ( !isAbort ) {
								callback( 200, "success" );
							}
						}
					};
	
					// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
					// Use native DOM manipulation to avoid our domManip AJAX trickery
					head.insertBefore( script, head.firstChild );
				},
	
				abort: function() {
					if ( script ) {
						script.onload( undefined, true );
					}
				}
			};
		}
	} );
	
	
	
	
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );
	
	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);
	
		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;
	
			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}
	
			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};
	
			// force json dataType
			s.dataTypes[ 0 ] = "json";
	
			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};
	
			// Clean-up function (fires after converters)
			jqXHR.always( function() {
	
				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );
	
				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}
	
				// Save back as free
				if ( s[ callbackName ] ) {
	
					// make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;
	
					// save the callback name for future use
					oldCallbacks.push( callbackName );
				}
	
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}
	
				responseContainer = overwritten = undefined;
			} );
	
			// Delegate to script
			return "script";
		}
	} );
	
	
	
	
	// data: string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;
	
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}
	
		parsed = buildFragment( [ data ], context, scripts );
	
		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}
	
		return jQuery.merge( [], parsed.childNodes );
	};
	
	
	// Keep a copy of the old load method
	var _load = jQuery.fn.load;
	
	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}
	
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );
	
		if ( off > -1 ) {
			selector = jQuery.trim( url.slice( off, url.length ) );
			url = url.slice( 0, off );
		}
	
		// If it's a function
		if ( jQuery.isFunction( params ) ) {
	
			// We assume that it's the callback
			callback = params;
			params = undefined;
	
		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}
	
		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,
	
				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {
	
				// Save response for use in complete callback
				response = arguments;
	
				self.html( selector ?
	
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
					// Otherwise use the full result
					responseText );
	
			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}
	
		return this;
	};
	
	
	
	
	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );
	
	
	
	
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};
	
	
	
	
	
	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ?
			elem :
			elem.nodeType === 9 ?
				elem.defaultView || elem.parentWindow :
				false;
	}
	
	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};
	
			// set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}
	
			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;
	
			// need to be able to calculate position if either top or left
			// is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}
	
			if ( jQuery.isFunction( options ) ) {
	
				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}
	
			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}
	
			if ( "using" in options ) {
				options.using.call( elem, props );
			} else {
				curElem.css( props );
			}
		}
	};
	
	jQuery.fn.extend( {
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}
	
			var docElem, win,
				box = { top: 0, left: 0 },
				elem = this[ 0 ],
				doc = elem && elem.ownerDocument;
	
			if ( !doc ) {
				return;
			}
	
			docElem = doc.documentElement;
	
			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}
	
			// If we don't have gBCR, just use 0,0 rather than error
			// BlackBerry 5, iOS 3 (original iPhone)
			if ( typeof elem.getBoundingClientRect !== "undefined" ) {
				box = elem.getBoundingClientRect();
			}
			win = getWindow( doc );
			return {
				top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
				left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
			};
		},
	
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}
	
			var offsetParent, offset,
				parentOffset = { top: 0, left: 0 },
				elem = this[ 0 ];
	
			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
	
				// we assume that getBoundingClientRect is available when computed position is fixed
				offset = elem.getBoundingClientRect();
			} else {
	
				// Get *real* offsetParent
				offsetParent = this.offsetParent();
	
				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}
	
				// Add offsetParent borders
				parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}
	
			// Subtract parent offsets and element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft
			// are the same in Safari causing offset.left to incorrectly be 0
			return {
				top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},
	
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;
	
				while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
					jQuery.css( offsetParent, "position" ) === "static" ) ) {
					offsetParent = offsetParent.offsetParent;
				}
				return offsetParent || documentElement;
			} );
		}
	} );
	
	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = /Y/.test( prop );
	
		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );
	
				if ( val === undefined ) {
					return win ? ( prop in win ) ? win[ prop ] :
						win.document.documentElement[ method ] :
						elem[ method ];
				}
	
				if ( win ) {
					win.scrollTo(
						!top ? val : jQuery( win ).scrollLeft(),
						top ? val : jQuery( win ).scrollTop()
					);
	
				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length, null );
		};
	} );
	
	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
	
					// if curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );
	
	
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {
	
			// margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
				return access( this, function( elem, type, value ) {
					var doc;
	
					if ( jQuery.isWindow( elem ) ) {
	
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}
	
					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;
	
						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						// unfortunately, this causes bug #3838 in IE6/8 only,
						// but there is currently no good, small way to fix it.
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}
	
					return value === undefined ?
	
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :
	
						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		} );
	} );
	
	
	jQuery.fn.extend( {
	
		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},
	
		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
	
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		}
	} );
	
	// The number of elements contained in the matched element set
	jQuery.fn.size = function() {
		return this.length;
	};
	
	jQuery.fn.andSelf = jQuery.fn.addBack;
	
	
	
	
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	
	
	var
	
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
	
		// Map over the $ in case of overwrite
		_$ = window.$;
	
	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
	
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}
	
		return jQuery;
	};
	
	// Expose jQuery and $ identifiers, even in
	// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}
	
	return jQuery;
	}));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {/*
	    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
	    Version 0.8.0
	*/
	
	(function (factory) {
	  // Making your jQuery plugin work better with npm tools
	  // http://blog.npmjs.org/post/112712169830/making-your-jquery-plugin-work-better-with-npm
	  if(typeof module === "object" && typeof module.exports === "object") {
	    factory(__webpack_require__(3), window, document);
	  }
	  else {
	    factory(jQuery, window, document);
	  }
	}(function($, window, document, undefined) {
	
	  var modals = [],
	      getCurrent = function() {
	        return modals.length ? modals[modals.length - 1] : null;
	      },
	      selectCurrent = function() {
	        var i,
	            selected = false;
	        for (i=modals.length-1; i>=0; i--) {
	          if (modals[i].$blocker) {
	            modals[i].$blocker.toggleClass('current',!selected).toggleClass('behind',selected);
	            selected = true;
	          }
	        }
	      };
	
	  $.modal = function(el, options) {
	    var remove, target;
	    this.$body = $('body');
	    this.options = $.extend({}, $.modal.defaults, options);
	    this.options.doFade = !isNaN(parseInt(this.options.fadeDuration, 10));
	    this.$blocker = null;
	    if (this.options.closeExisting)
	      while ($.modal.isActive())
	        $.modal.close(); // Close any open modals.
	    modals.push(this);
	    if (el.is('a')) {
	      target = el.attr('href');
	      //Select element by id from href
	      if (/^#/.test(target)) {
	        this.$elm = $(target);
	        if (this.$elm.length !== 1) return null;
	        this.$body.append(this.$elm);
	        this.open();
	      //AJAX
	      } else {
	        this.$elm = $('<div>');
	        this.$body.append(this.$elm);
	        remove = function(event, modal) { modal.elm.remove(); };
	        this.showSpinner();
	        el.trigger($.modal.AJAX_SEND);
	        $.get(target).done(function(html) {
	          if (!$.modal.isActive()) return;
	          el.trigger($.modal.AJAX_SUCCESS);
	          var current = getCurrent();
	          current.$elm.empty().append(html).on($.modal.CLOSE, remove);
	          current.hideSpinner();
	          current.open();
	          el.trigger($.modal.AJAX_COMPLETE);
	        }).fail(function() {
	          el.trigger($.modal.AJAX_FAIL);
	          var current = getCurrent();
	          current.hideSpinner();
	          modals.pop(); // remove expected modal from the list
	          el.trigger($.modal.AJAX_COMPLETE);
	        });
	      }
	    } else {
	      this.$elm = el;
	      this.$body.append(this.$elm);
	      this.open();
	    }
	  };
	
	  $.modal.prototype = {
	    constructor: $.modal,
	
	    open: function() {
	      var m = this;
	      this.block();
	      if(this.options.doFade) {
	        setTimeout(function() {
	          m.show();
	        }, this.options.fadeDuration * this.options.fadeDelay);
	      } else {
	        this.show();
	      }
	      $(document).off('keydown.modal').on('keydown.modal', function(event) {
	        var current = getCurrent();
	        if (event.which == 27 && current.options.escapeClose) current.close();
	      });
	      if (this.options.clickClose)
	        this.$blocker.click(function(e) {
	          if (e.target==this)
	            $.modal.close();
	        });
	    },
	
	    close: function() {
	      modals.pop();
	      this.unblock();
	      this.hide();
	      if (!$.modal.isActive())
	        $(document).off('keydown.modal');
	    },
	
	    block: function() {
	      this.$elm.trigger($.modal.BEFORE_BLOCK, [this._ctx()]);
	      this.$body.css('overflow','hidden');
	      this.$blocker = $('<div class="jquery-modal blocker current"></div>').appendTo(this.$body);
	      selectCurrent();
	      if(this.options.doFade) {
	        this.$blocker.css('opacity',0).animate({opacity: 1}, this.options.fadeDuration);
	      }
	      this.$elm.trigger($.modal.BLOCK, [this._ctx()]);
	    },
	
	    unblock: function(now) {
	      if (!now && this.options.doFade)
	        this.$blocker.fadeOut(this.options.fadeDuration, this.unblock.bind(this,true));
	      else {
	        this.$blocker.children().appendTo(this.$body);
	        this.$blocker.remove();
	        this.$blocker = null;
	        selectCurrent();
	        if (!$.modal.isActive())
	          this.$body.css('overflow','');
	      }
	    },
	
	    show: function() {
	      this.$elm.trigger($.modal.BEFORE_OPEN, [this._ctx()]);
	      if (this.options.showClose) {
	        this.closeButton = $('<a href="#close-modal" rel="modal:close" class="close-modal ' + this.options.closeClass + '">' + this.options.closeText + '</a>');
	        this.$elm.append(this.closeButton);
	      }
	      this.$elm.addClass(this.options.modalClass).appendTo(this.$blocker);
	      if(this.options.doFade) {
	        this.$elm.css('opacity',0).show().animate({opacity: 1}, this.options.fadeDuration);
	      } else {
	        this.$elm.show();
	      }
	      this.$elm.trigger($.modal.OPEN, [this._ctx()]);
	    },
	
	    hide: function() {
	      this.$elm.trigger($.modal.BEFORE_CLOSE, [this._ctx()]);
	      if (this.closeButton) this.closeButton.remove();
	      var _this = this;
	      if(this.options.doFade) {
	        this.$elm.fadeOut(this.options.fadeDuration, function () {
	          _this.$elm.trigger($.modal.AFTER_CLOSE, [_this._ctx()]);
	        });
	      } else {
	        this.$elm.hide(0, function () {
	          _this.$elm.trigger($.modal.AFTER_CLOSE, [_this._ctx()]);
	        });
	      }
	      this.$elm.trigger($.modal.CLOSE, [this._ctx()]);
	    },
	
	    showSpinner: function() {
	      if (!this.options.showSpinner) return;
	      this.spinner = this.spinner || $('<div class="' + this.options.modalClass + '-spinner"></div>')
	        .append(this.options.spinnerHtml);
	      this.$body.append(this.spinner);
	      this.spinner.show();
	    },
	
	    hideSpinner: function() {
	      if (this.spinner) this.spinner.remove();
	    },
	
	    //Return context for custom events
	    _ctx: function() {
	      return { elm: this.$elm, $blocker: this.$blocker, options: this.options };
	    }
	  };
	
	  $.modal.close = function(event) {
	    if (!$.modal.isActive()) return;
	    if (event) event.preventDefault();
	    var current = getCurrent();
	    current.close();
	    return current.$elm;
	  };
	
	  // Returns if there currently is an active modal
	  $.modal.isActive = function () {
	    return modals.length > 0;
	  }
	
	  $.modal.getCurrent = getCurrent;
	
	  $.modal.defaults = {
	    closeExisting: true,
	    escapeClose: true,
	    clickClose: true,
	    closeText: 'Close',
	    closeClass: '',
	    modalClass: "modal",
	    spinnerHtml: null,
	    showSpinner: true,
	    showClose: true,
	    fadeDuration: null,   // Number of milliseconds the fade animation takes.
	    fadeDelay: 1.0        // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
	  };
	
	  // Event constants
	  $.modal.BEFORE_BLOCK = 'modal:before-block';
	  $.modal.BLOCK = 'modal:block';
	  $.modal.BEFORE_OPEN = 'modal:before-open';
	  $.modal.OPEN = 'modal:open';
	  $.modal.BEFORE_CLOSE = 'modal:before-close';
	  $.modal.CLOSE = 'modal:close';
	  $.modal.AFTER_CLOSE = 'modal:after-close';
	  $.modal.AJAX_SEND = 'modal:ajax:send';
	  $.modal.AJAX_SUCCESS = 'modal:ajax:success';
	  $.modal.AJAX_FAIL = 'modal:ajax:fail';
	  $.modal.AJAX_COMPLETE = 'modal:ajax:complete';
	
	  $.fn.modal = function(options){
	    if (this.length === 1) {
	      new $.modal(this, options);
	    }
	    return this;
	  };
	
	  // Automatically bind links with rel="modal:close" to, well, close the modal.
	  $(document).on('click.modal', 'a[rel="modal:close"]', $.modal.close);
	  $(document).on('click.modal', 'a[rel="modal:open"]', function(event) {
	    event.preventDefault();
	    $(this).modal();
	  });
	}));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {(function($, undefined) {
	
	  $.fn.monthpicker = function(options) {
	
	    var months = options.months || ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
	
	      Monthpicker = function(el) {
	        this._el = $(el);
	        this._init();
	        this._render();
	        this._renderYears();
	        this._renderMonths();
	        this._bind();
	      };
	
	    Monthpicker.prototype = {
	      destroy: function() {
	        this._el.off('click');
	        this._yearsSelect.off('click');
	        this._container.off('click');
	        $(document).off('click', $.proxy(this._hide, this));
	        this._container.remove();
	      },
	
	      _init: function() {
	        var dateObj = new Date();
	        var year = dateObj.getFullYear();
	        var month = dateObj.getMonth()+1;
	        this._el.html(year + '-' + month);
	        this._el.data('monthpicker', this);
	      },
	
	      _bind: function() {
	        this._el.on('click', $.proxy(this._show, this));
	        $(document).on('click', $.proxy(this._hide, this));
	        this._yearsSelect.on('click', function(e) { e.stopPropagation(); });
	        this._container.on('click', 'button', $.proxy(this._selectMonth, this));
	      },
	
	      _show: function(e) {
	        e.preventDefault();
	        e.stopPropagation();
	        this._container.css('display', 'inline-block');
	      },
	
	      _hide: function() {
	        this._container.css('display', 'none');
	      },
	
	      _selectMonth: function(e) {
	        var monthIndex = $(e.target).data('value'),
	          month = months[monthIndex],
	          year = this._yearsSelect.val();
	        this._el.html(year + '-' + month);
	        if (options.onMonthSelect) {
	          options.onMonthSelect(monthIndex, year);
	        }
	      },
	
	      _render: function() {
	        var linkPosition = this._el.position(),
	          cssOptions = {
	            display:  'none',
	            position: 'absolute',
	            top:      linkPosition.top + this._el.height() + (options.topOffset || 0),
	            left:     linkPosition.left
	          };
	        this._id = (new Date).valueOf();
	        this._container = $('<div class="monthpicker" id="monthpicker-' + this._id +'">')
	          .css(cssOptions)
	          .appendTo($('body'));
	      },
	
	      _renderYears: function() {
	        var markup = $.map(options.years, function(year) {
	          return '<option>' + year + '</option>';
	        });
	        var yearsWrap     = $('<div class="years">').appendTo(this._container);
	        this._yearsSelect = $('<select>').html(markup.join('')).appendTo(yearsWrap);
	      },
	
	      _renderMonths: function() {
	        var markup = ['<table>', '<tr>'];
	        $.each(months, function(i, month) {
	          if (i > 0 && i % 4 === 0) {
	            markup.push('</tr>');
	            markup.push('<tr>');
	          }
	          markup.push('<td><button data-value="' + i + '">' + month +'</button></td>');
	        });
	        markup.push('</tr>');
	        markup.push('</table>');
	        this._container.append(markup.join(''));
	      }
	    };
	
	    var methods = {
	      destroy: function() {
	        var monthpicker = this.data('monthpicker');
	        if (monthpicker) monthpicker.destroy();
	        return this;
	      }
	    }
	
	    if ( methods[options] ) {
	        return methods[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof options === 'object' || ! options ) {
	      return this.each(function() {
	        return new Monthpicker(this);
	      });
	    } else {
	      $.error( 'Method ' +  options + ' does not exist on monthpicker' );
	    }
	
	  };
	
	}(jQuery));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(8);
	
	__webpack_require__(9);
	
	var leftMenuVm = avalon.define({
	    $id: 'left-menu-controller',
	    menuList: [
	    	{
	    		label: "中国人民银行",
				href: "#!/",
	    		active: true
	    	},
	    	{
	    		label: "备付金存管银行",
				href: "#!/depository-bank",
	    		active: false
	    	},
	    	{
	    		label: "备付金合作银行",
				href: "#!/cooperative-bank",
	    		active: false
	    	}
	    ],
	    init: function(){
	        for (var i = leftMenuVm.menuList.length - 1; i >= 0; i--) {
	            if (leftMenuVm.menuList[i].href == window.location.hash) {
	                leftMenuVm.menuList[i].active=true;
	            } else {
	                leftMenuVm.menuList[i].active=false;
	            }
	        }
	    },
	    active: function(index){
	    	for (var i = leftMenuVm.menuList.length - 1; i >= 0; i--) {
	    		if (i!=index) {
	    			leftMenuVm.menuList[i].active = false;
	    		} else {
	    			leftMenuVm.menuList[i].active = true;
	    		}
	    	}
	    }
	});
	
	leftMenuVm.init();
	
	avalon.history.start({
	    root: "/mmRouter"
	});
	
	var hash = location.hash.replace(/#!?/, '');
	avalon.router.navigate(hash || '/', 2);
	
	avalon.scan(document.body);

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var pbcRouter = __webpack_require__(10);
	var depositoryBankRouter = __webpack_require__(21);
	var cooperativeBankRouter = __webpack_require__(24);
	
	pbcRouter.init();
	depositoryBankRouter.init();
	cooperativeBankRouter.init();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var pbcModule = __webpack_require__(11);
	var commonModule = __webpack_require__(12);
	
	module.exports = {
		init: function(){
			avalon.router.add("/", function () {
				if(avalon.vmodels['main']!=undefined){
					delete avalon.vmodels['main'];
				}
	
				var mainVm = avalon.define({
					$id: 'main',
					template: __webpack_require__(18),
					data: {
						bankList: pbcModule.getBankList(null, null),
						selectedBankIndex: 0,
						selectedAccountIndex: 0,
						reportTypeList: [
							{
								label: "汇总报表"
							},
							{
								label: "账户报表"
							}
						],
						selectedReportTypeIndex: 0,
						reportList: [],
						totalCount: 11,
						fileCount: 0,
						checkedReportIndexList: []
					},
					selectBank: function () {
						mainVm.data.selectedBankIndex = document.getElementsByName("bank")[0].value;
	
	                    document.getElementsByName("account")[mainVm.data.selectedBankIndex].value = 0;
	                    mainVm.data.selectedAccountIndex = 0;
	
	                    var reportListObj = pbcModule.getReportList(
	                        mainVm.data.selectedReportTypeIndex,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                    );
	
	                    mainVm.data.reportList = reportListObj.reportList;
	                    mainVm.data.fileCount = reportListObj.fileCount;
					},
					selectAccount: function () {
						mainVm.data.selectedAccountIndex = document.getElementsByName("account")[mainVm.data.selectedBankIndex].value;
	
	                    var reportListObj = pbcModule.getReportList(
	                        mainVm.data.selectedReportTypeIndex,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                    );
	
	                    mainVm.data.reportList = reportListObj.reportList;
	                    mainVm.data.fileCount = reportListObj.fileCount;
					},
					selectReportType: function(){
						mainVm.data.selectedReportTypeIndex = document.getElementsByName("report-type")[0].value;
	
	                    mainVm.data.selectedBankIndex = 0;
	                    document.getElementsByName("bank")[0].value = 0;
	
	                    mainVm.data.selectedAccountIndex = 0;
	                    document.getElementsByName("account")[0].value = 0;
	
	                    var reportListObj = pbcModule.getReportList(
	                        mainVm.data.selectedReportTypeIndex,
							mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
						);
	
	                    mainVm.data.reportList = reportListObj.reportList;
	                    mainVm.data.fileCount = reportListObj.fileCount;
					},
					checkAll: function () {
						mainVm.data.checkedReportIndexList=[];
	
						if(document.getElementsByName("check-all")[0].checked){
							for(var i=0; i<mainVm.data.reportList.length; i++){
								mainVm.data.checkedReportIndexList.push(i);
							}
	
							for(var i=0; i<document.getElementsByName("check-one").length; i++){
								document.getElementsByName("check-one")[i].checked = true;
							}
						} else {
							for(var i=0; i<document.getElementsByName("check-one").length; i++){
								document.getElementsByName("check-one")[i].checked = false;
							}
						}
					},
					checkOne: function () {
						mainVm.data.checkedReportIndexList=[];
	
						for(var i=0; i<document.getElementsByName("check-one").length; i++){
							if (document.getElementsByName("check-one")[i].checked) {
								mainVm.data.checkedReportIndexList.push(i);
							}
						}
	
						console.log(mainVm.data.checkedReportIndexList);
					},
	                generate: function (index) {
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
	                    var reportList={
	                        start_day: commonModule.getStartDay(year, month),
	                        end_day: commonModule.getEndDay(year, month),
	                        report_type: mainVm.data.selectedReportTypeIndex,
	                        report_list: []
	                    };
	
	                    if (mainVm.data.selectedReportTypeIndex==0){
							reportList.report_list.push({
								report_name: mainVm.data.reportList[index].report_name
							});
	                    } else {
	                        reportList.report_list.push({
	                            bank_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                            account_id: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
	                            account_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_name,
	                            account_no: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_no,
	                            report_name: mainVm.data.reportList[index].report_name
	                        });
						}
	
	                    var result = pbcModule.generateReport(reportList);
	
	                    if (result) {
	                        var reportListObj =pbcModule.getReportList(
	                            mainVm.data.selectedReportTypeIndex,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                        );
	
	                        mainVm.data.reportList = reportListObj.reportList;
	                        mainVm.data.fileCount = reportListObj.fileCount;
						}
	                },
					batchGenerate: function () {
						if (mainVm.data.checkedReportIndexList.length==0){
	                        commonModule.errorModal("请选择您要生成的报表!");
	
	                        return;
						}
	
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
						var reportList={
	                        start_day: commonModule.getStartDay(year, month),
	                        end_day: commonModule.getEndDay(year, month),
	                        report_type: mainVm.data.selectedReportTypeIndex,
	                        report_list: []
						};
	
	                    if (mainVm.data.selectedReportTypeIndex==0) {
	                        for (var i = 0; i < mainVm.data.checkedReportIndexList.length; i++) {
	                            reportList.report_list.push({
	                                report_name: mainVm.data.reportList[mainVm.data.checkedReportIndexList[i]].report_name
	                            });
	                        }
	                    } else {
	                        for (var i = 0; i < mainVm.data.checkedReportIndexList.length; i++) {
	                            reportList.report_list.push({
	                                bank_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                                account_id: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
	                                account_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_name,
	                                account_no: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_no,
	                                report_name: mainVm.data.reportList[mainVm.data.checkedReportIndexList[i]].report_name
	                            });
	                        }
						}
	
	                    var result = pbcModule.generateReport(reportList);
	
	                    if (result) {
	                        var reportListObj = pbcModule.getReportList(
	                            mainVm.data.selectedReportTypeIndex,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                        );
	
	                        mainVm.data.reportList = reportListObj.reportList;
	                        mainVm.data.fileCount = reportListObj.fileCount;
	                    }
					},
					submit: function () {
						if($('#monthpicker').html()==''){
	                        commonModule.errorModal("请选择月份!");
	
							return;
						}
	
						if(avalon.vmodels['submit-controller']!=undefined){
							delete avalon.vmodels['submit-controller'];
						}
	
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
						var submitVm = avalon.define({
							$id: 'submit-controller',
	                        checkReportFlag: 0,
							submit: function () {
	                            pbcModule.submitReport(
	                            	commonModule.getStartDay(year, month),
									commonModule.getEndDay(year, month)
								);
							},
	                        checkReport: function () {
	                            if (document.getElementsByName("check-report")[0].checked) {
	                                submitVm.checkReportFlag=1;
	                            } else {
	                                submitVm.checkReportFlag=0;
	                            }
	                        }
						});
	
						var submitTemplate = __webpack_require__(20);
	
						$('#modal').html(submitTemplate).modal({fadeDuration: 100});
						avalon.scan(document.getElementById("modal").firstChild);
					},
	                download: function (reportName) {
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
						pbcModule.download(
							mainVm.data.selectedReportTypeIndex,
							mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
							mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
	                        commonModule.getStartDay(year, month),
	                        commonModule.getEndDay(year, month),
							reportName
						);
	                },
					downloadAll: function () {
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
	                    pbcModule.downloadAll(
	                        commonModule.getStartDay(year, month),
	                        commonModule.getEndDay(year, month)
	                    );
					},
					filter: function () {
						//此处需要调用接口重新获取列表
	
						if($('#filter').val()!=''){
							for(var i=0; i<mainVm.data.reportList.length; i++){
								if (mainVm.data.reportList[i].report_name.indexOf($('#filter').val())<0){
									mainVm.data.reportList.splice(i, 1);
									i=i-1;
								}
							}
						}
					}
				});
	
				var reportListObj = pbcModule.getReportList(0);
	            mainVm.data.reportList = reportListObj.reportList;
	            mainVm.data.fileCount = reportListObj.fileCount;
	
				for (var i=0; i<mainVm.data.bankList.length; i++){
	                mainVm.data.totalCount += mainVm.data.bankList[i].account_list.length*7;
				}
	
				mainVm.$watch('onReady', function(){
					$("#filter").keydown(function(event){
						if(event.which == "13"){
							mainVm.filter();
						}
					});
	
	                var dateObj = new Date();
	                var currentYear = dateObj.getFullYear();
	
					var years = []
					for (var i=0; i<=currentYear-2008; i++){
						years.push(currentYear-i);
					}
	
	                $('#monthpicker').monthpicker({
	                    years: years,
	                    topOffset: 6,
	                    onMonthSelect: function(month, year) {
	                        var reportListObj = pbcModule.getReportList(
	                            mainVm.data.selectedReportTypeIndex,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                        );
	
	                        mainVm.data.reportList = reportListObj.reportList;
	                        mainVm.data.fileCount = reportListObj.fileCount;
	                    }
	                });
				});
	
				avalon.scan(document.body);
			});
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var commonModule = __webpack_require__(12);
	var pbcService = __webpack_require__(17);
	
	module.exports = {
		getBankList: function () {
	        var year;
	        var month;
	
		    if ($('#monthpicker').html()!=undefined && $('#monthpicker').html()!=''){
	            year = $('#monthpicker').html().split("-")[0];
	            month = $('#monthpicker').html().split("-")[1];
	        } else {
	            var dateObj = new Date();
	            year = dateObj.getFullYear();
	            month = dateObj.getMonth()+1;
	        }
	
	        return pbcService.getBankList(
	            commonModule.getStartDay(year, month),
	            commonModule.getEndDay(year, month)
	        );
	    },
	    getReportList: function (reportType, bankName, accountId) {
	        var year;
	        var month;
	
	        if ($('#monthpicker').html()!=undefined && $('#monthpicker').html()!=''){
	            year = $('#monthpicker').html().split("-")[0];
	            month = $('#monthpicker').html().split("-")[1];
	        } else {
	            var dateObj = new Date();
	            year = dateObj.getFullYear();
	            month = dateObj.getMonth()+1;
	        }
	
	        var startDay = commonModule.getStartDay(year, month);
	        var endDay = commonModule.getEndDay(year, month);
	
		    if (reportType==0){
	            return pbcService.getReportList(reportType, startDay, endDay);
	        } else {
		        if (bankName==undefined || accountId==undefined){
	                return {
	                    reportList: [],
	                    fileCount: 0
	                };
	            }
	
	            return pbcService.getReportList(reportType, startDay, endDay, bankName, accountId);
	        }
	    },
	    generateReport: function(reportList){
	        return pbcService.generateReport(reportList);
	    },
	    submitReport: function(startDay, endDay){
	        pbcService.submitReport(startDay, endDay);
	    },
	    download: function (reportType, bankName, accountId, startDay, endDay, reportName) {
	        if (pbcService.downloadable(reportType, bankName, accountId, startDay, endDay, reportName)){
	            if (reportType==0) {
	                window.open(
	                    "/report/pbc/download?report_type=" + reportType
	                    + "&start_day=" + startDay
	                    + "&end_day=" + endDay
	                    + "&report_name=" + reportName
	                );
	            } else {
	                window.open(
	                    "/report/pbc/download?report_type=" + reportType
	                    +"&bank_name=" + bankName
	                    + "&account_id=" + accountId
	                    + "&start_day=" + startDay
	                    + "&end_day=" + endDay
	                    + "&report_name=" + reportName
	                );
	            }
	        }
	    },
	    downloadAll: function (startDay, endDay) {
	        if (pbcService.downloadableAll(startDay, endDay)){
	            window.open(
	                "/report/pbc/download-all?"
	                +"&start_day="+startDay
	                +"&end_day="+endDay
	            );
	        }
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {module.exports = {
		errorModal: function(errorMessage) {
			if(avalon.vmodels['error-controller']!=undefined){
	    		delete avalon.vmodels['error-controller'];
	    	}
	
	    	var errorVm = avalon.define({
			    $id: 'error-controller',
			    message: ''
			});
	
	    	errorVm.message = errorMessage;
	    	var errorTemplate = __webpack_require__(13);
	    	
	    	$('#modal').html(errorTemplate).modal({fadeDuration: 100});
	    	avalon.scan(document.getElementById("modal").firstChild);
		},
	    infoModal: function(infoMessage) {
	        if(avalon.vmodels['info-controller']!=undefined){
	            delete avalon.vmodels['info-controller'];
	        }
	
	        var infoVm = avalon.define({
	            $id: 'info-controller',
	            message: ''
	        });
	
	        infoVm.message = infoMessage;
	        var infoTemplate = __webpack_require__(15);
	
	        $('#modal').html(infoTemplate).modal({fadeDuration: 100});
	        avalon.scan(document.getElementById("modal").firstChild);
	    },
		getBankAbbreviation: function (bankName) {
			var bankList = [
	            {name: "中国建设银行", abbreviation: "ccb"},
	            {name: "平安银行", abbreviation: "pab"},
	            {name: "江苏银行", abbreviation: "bojs"},
	            {name: "上海浦东发展银行", abbreviation: "spdb"},
	            {name: "中信银行", abbreviation: "citic"}
			];
	
			for (var i=0; i<bankList.length; i++){
				if (bankList[i].name==bankName){
					return bankList[i].abbreviation;
				}
			}
	
			return null;
	    },
	    getStartDay: function(year, month){
			if(parseInt(month)<10){
				month = '0'+month;
			}
	        return year+"-"+month+"-01";
	    },
		getEndDay: function(year, month){
			var total = new Date(year, month, 0).getDate();
	
	        if(parseInt(month)<10){
	            month = '0'+month;
	        }
	
			return year+"-"+month+"-"+total;
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div ms-controller=\"error-controller\">\r\n\t<div class=\"modal-content\">\r\n\t\t<div class=\"modal-message error-message\">\r\n\t\t\t<div class=\"modal-message-left\"><img class=\"icon\" src=\"" + __webpack_require__(14) + "\">{{@message}}</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACTElEQVRYR82XwVLbQAyGfzn1wgWaY2fapuTCxLfwBE2eoOFN2icgPEH7JqRPgHkCuCXTC65pZ3pM4VLWddTZtZNxHAfvrpmCL5kkK+mTVpIlwhM/9MT2YQUwfYUDEv4HMEYanNDXn4yr/PuEZfI1+IXI1DEjgOmbFwMiOgHRwEgxc8jMp8GPv2Hd+QcBrtto3+/5Z8aGy9aYw5275Lg7x3wbyFaAb6/9/qJFZwAO6ryo+T/yUj4+/Jlk11R6KgEy4zgHqN3QeC7Ocy/FsApiA0CHfV9cPoLnZfZo51Yela9jA2D61g+J6H2d5wx8h5RZUgoREvCuTgbMYe8mGRbPrQHobPe881pFuvJwGsRyrM5OO2JMwImR3GIxLFbHOoCh97mhiKXU3pAQCtosWUtRWAFkTUZcm3jR9AxL2V02qxXArON/BOhzU+Vm8vypFydfdPSWAqbJVzTgpXykvi9apKrG+GHmi+Am0QncCKAXSy0/6wg2tq4SuApg1vHnAL20UeQKACDqxbK7FoH/CaB6SBBLXTXP5wpcktD1CrblgHUZugIAVWXo0IhcASobke7pdq0YLgDF8K8loQaweBmp804AD72MbKNg2wnL3m9EQP2gBpI/++LK6P1u0bVU7e/eyn7tQKJ05iNZaNsZt/Pwby/FwGgkWypREGmLJk0joTxvpTyyGkqXEPo69vyJyYhW5b268927ZOQ0lhcVquoA0dgURBkG87jxYlL2Kl/NRrxazSgbw5j1KkYEtZpNHn01s0h266NGu6G1VguBfz8tKDBD89nnAAAAAElFTkSuQmCC"

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div ms-controller=\"info-controller\">\n    <div class=\"modal-content\">\n        <div class=\"modal-message info-message\">\n            <div class=\"modal-message-left\"><img class=\"icon\" src=\"" + __webpack_require__(16) + "\">{{@message}}</div>\n        </div>\n    </div>\n</div>";

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACUUlEQVRYR8WXTW7TUBDH/xPHbrsiG6SWDekCKezCCUhOQHoEbgAnoD1BuUnMCQgnILtaYoFZuRIbs3JkJxk0/kj8FfvZTpS3iWL7vfnN55shnHnRmeWjEcA1j4YU8AeAZgJOoLH8MngZKcIm6/TtmSxbVTElgOtgNCHGFwJNVA5m8IIJD8+6taj7vhJgwMPBVXA5VxWcFyYgnr66c8l2D4EcBHjpvxn3WZsT0bBOi6r3zGyvaXP31/gVuyn7dSmACNfR/w5g0EV4aq8bYD0tgygAhGb3L3921bzgDmbbM1bv8u4oANz4owWB3h9J88wxEhOOYU3TDzMAEu09JjH9ydaWeJrOjgzAKbVPNMpbYQcgRaYX0O+TqZ46eKvzbVKsdgA3/ttPBDx2B+B/ATYTjbTBIXcy8Nkxnr5G1TRexzF/JFzSrSqeGPzDMaywqh4RYC+8ro6UArzyRy5AL9q5QF14eGUx286FdZuxQBXAFvxxg81Sh7YoQjYTHgHgj3PxFJZ4JRckuRuZNg3RXHgI0CIGdrV8DwEkAVfn85JbsiwIa9MwAyGHSrQ3FR5ZoCQNFQtR5lZrI1wASguRvFCsBSGEpmtuL6A5gLAtU11p/2eCUP6c/TJqYAVVhTPf5bUvWEAeRA3J1ZIIr1tJObBJct8zvHFtQyL7i/neFWVfL/In1TSlfbOrJUTzNa1njZrShDJuy822LZr43NNXs1ZtedpU8WByrwoigplw33kwyfsrGs1kLONwNAPHMwNxPIqRyTqbRx/NuoZg1X6l2fCUAP8Bh55gMLtj2AwAAAAASUVORK5CYII="

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var commonModule = __webpack_require__(12);
	
	module.exports = {
	    getBankList: function (startDay, endDay) {
	        var data = [];
	        $.ajax({
	            url: "/report/bank-account?start_day="+startDay+"&end_day="+endDay,
	            type: 'GET',
	            async: false,
	            dataType: 'json',
	            success: function (response) {
	                if (response.code == 200) {
	                    data = response.data;
	                }
	            },
	            error: function () {
	                commonModule.errorModal("接口错误！");
	            }
	        });
	
	        return data;
	    },
	    getReportList: function (reportType, startDay, endDay, bankName, accountId) {
	        var parameterList;
	        if (reportType==0){
	            parameterList = "start_day="+startDay+"&end_day="+endDay+"&report_type="+reportType;
	        } else {
	            parameterList = "bank_name="+bankName+"&account_id="+accountId+"&start_day="+startDay+"&end_day="+endDay+"&report_type="+reportType;
	        }
	
	        var data = {
	            reportList: [],
	            fileCount: 0
	        };
	        $.ajax({
	            url: "/report/pbc/list?"+parameterList,
	            type: 'GET',
	            async: false,
	            dataType: 'json',
	            success: function (response) {
	                if (response.code == 200) {
	                    data.reportList = response.data;
	                    data.fileCount = response.file_count;
	                }
	            },
	            error: function () {
	                commonModule.errorModal("接口错误！");
	            }
	        });
	
	        return data;
	    },
	    generateReport: function (reportList) {
	        var result = false;
	
	        $.ajax({
	            url: "/report/pbc/create",
	            type: "POST",
	            async: false,
	            dataType: 'json',
	            contentType: "application/json;charset=utf-8",
	            data: JSON.stringify(reportList),
	            success: function (data) {
	                if (data.code == 200) {
	                    commonModule.infoModal(data.message);
	                    result = true;
	                } else if (data.code == 400) {
	                    commonModule.errorModal(data.message);
	                }
	            },
	            error: function () {
	                commonModule.errorModal("接口错误！");
	            }
	        });
	
	        return result;
	    },
	    submitReport: function(startDay, endDay) {
	        $.ajax({
	            url: "/report/pbc/submit?start_day="+startDay+"&end_day="+endDay,
	            type: "POST",
	            dataType: 'json',
	            contentType: "application/json;charset=utf-8",
	            success: function (data) {
	                if (data.code == 200) {
	                    commonModule.infoModal(data.message);
	                } else if (data.code == 400) {
	                    commonModule.errorModal(data.message);
	                }
	            },
	            error: function () {
	                commonModule.errorModal("接口错误！");
	            }
	        });
	    },
	    downloadable: function(reportType, bankName, accountId, startDay, endDay, reportName){
	        var result = true;
	
	        var url = null;
	        if (reportType==0){
	            url = "/report/pbc/download?"
	                +"&report_type="+reportType
	                +"&start_day="+startDay
	                +"&end_day="+endDay
	                +"&report_name="+reportName;
	        } else {
	            url = "/report/pbc/download?report_type="+reportType
	                +"&bank_name="+bankName
	                +"&account_id="+accountId
	                +"&start_day="+startDay
	                +"&end_day="+endDay
	                +"&report_name="+reportName;
	        }
	
	        $.ajax({
	            url: url,
	            type: 'GET',
	            dataType: 'json',
	            async: false,
	            timeout : 5000,
	            success: function (response) {
	                if (response.code == 400) {
	                    commonModule.errorModal(response.message);
	
	                    result=false;
	                }
	            }
	        });
	
	        return result;
	    },
	    downloadableAll: function(startDay, endDay){
	        var result = true;
	
	        $.ajax({
	            url: "/report/pbc/download-all?"
	            +"&start_day="+startDay
	            +"&end_day="+endDay,
	            type: 'GET',
	            dataType: 'json',
	            async: false,
	            timeout : 5000,
	            success: function (response) {
	                if (response.code == 400) {
	                    commonModule.errorModal(response.message);
	
	                    result=false;
	                }
	            }
	        });
	
	        return result;
	    }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div>\r\n\t<div class=\"main-content-head\"><h4>中国人民银行(报表总数: {{@data.totalCount}}，已生成: {{@data.fileCount}})</h4></div>\r\n\r\n\t<div class=\"main-content-body\">\r\n\t\t<div class=\"report-head\">\r\n\t\t\t<div class=\"report-head-item\">\r\n\t\t\t\t<label>选择月份</label>\r\n\t\t\t\t<a href=\"#monthpicker\" id=\"monthpicker\" class=\"monthpicker\"></a>\r\n\t\t\t\t<button ms-click=\"@submit()\">报送</button>\r\n\t\t\t\t<button ms-click=\"@downloadAll()\">下载全部</button>\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class=\"report-head-item\">\r\n\t\t\t\t<label>报表类型</label>\r\n\t\t\t\t<select name=\"report-type\" ms-on-change=\"@selectReportType()\">\r\n\t\t\t\t\t<option ms-for=\"(index, reportType) in @data.reportTypeList\"\r\n\t\t\t\t\t\t\tms-attr=\"{'value': index}\">\r\n\t\t\t\t\t\t{{reportType.label}}\r\n\t\t\t\t\t</option>\r\n\t\t\t\t</select>\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class=\"report-head-item\" ms-visible=\"@data.selectedReportTypeIndex==1\">\r\n\t\t\t\t<label>选择银行</label>\r\n\t\t\t\t<select name=\"bank\" ms-on-change=\"@selectBank()\">\r\n\t\t\t\t\t<option ms-for=\"(index, bank) in @data.bankList\"\r\n\t\t\t\t\t\t\tms-attr=\"{'value': index}\">\r\n\t\t\t\t\t\t{{bank.bank_name}}\r\n\t\t\t\t\t</option>\r\n\t\t\t\t</select>\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class=\"report-head-item\"\r\n\t\t\t\t ms-for=\"(bankIndex, bank) in @data.bankList\"\r\n\t\t\t\t ms-visible=\"@data.selectedReportTypeIndex==1 && bankIndex==@data.selectedBankIndex\">\r\n\t\t\t\t<label>选择账户</label>\r\n\t\t\t\t<select name=\"account\"\r\n\t\t\t\t\t\tms-on-change=\"@selectAccount()\">\r\n\t\t\t\t\t<option ms-for=\"(index, account) in @data.bankList[bankIndex].account_list\"\r\n\t\t\t\t\t\t\tms-attr=\"{'value': index}\">\r\n\t\t\t\t\t\t{{account.account_no}}\r\n\t\t\t\t\t</option>\r\n\t\t\t\t</select>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"report-body\">\r\n\t\t\t<div class=\"operation\">\r\n\t\t\t\t<div><button ms-click=\"@batchGenerate()\">批量生成</button></div>\r\n\t\t\t\t<div class=\"right\">\r\n\t\t\t\t\t<input type=\"text\" placeholder=\"可按报表类型检索\" id=\"filter\">\r\n\t\t\t\t\t<button class=\"search-button\" ms-click=\"@filter()\"></button>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<table>\r\n\t\t\t\t<thead>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<th>\r\n\t\t\t\t\t\t<input name=\"check-all\" type=\"checkbox\" ms-click=\"@checkAll()\"/>&nbsp;&nbsp;全选\r\n\t\t\t\t\t</th>\r\n\t\t\t\t\t<th>银行</th>\r\n\t\t\t\t\t<th>账户</th>\r\n\t\t\t\t\t<th>报表</th>\r\n\t\t\t\t\t<th>状态</th>\r\n\t\t\t\t\t<th>操作</th>\r\n\t\t\t\t</tr>\r\n\t\t\t\t</thead>\r\n\t\t\t\t<tbody>\r\n\t\t\t\t<tr ms-for=\"(index, report) in @data.reportList\">\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<input type=\"checkbox\"\r\n\t\t\t\t\t\t\t   name=\"check-one\"\r\n\t\t\t\t\t\t\t   ms-click=\"@checkOne()\"/>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td>{{report.bank_name}}</td>\r\n\t\t\t\t\t<td>{{report.account_no ? report.account_no : '--'}}</td>\r\n\t\t\t\t\t<td>{{report.report_name}}</td>\r\n\t\t\t\t\t<td ms-if=\"report.report_status==1\">\r\n\t\t\t\t\t\t<img class=\"icon\" src=\"" + __webpack_require__(16) + "\">已生成\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td ms-if=\"report.report_status==0\">\r\n\t\t\t\t\t\t<img class=\"icon\" src=\"" + __webpack_require__(19) + "\">未生成\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<button ms-click=\"@generate(index)\">生成</button>\r\n\t\t\t\t\t\t<button ms-if=\"report.report_status==0\" disabled>下载</button>\r\n\t\t\t\t\t\t<button ms-if=\"report.report_status==1\" ms-click=\"@download(report.report_name)\">下载</button>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t</tbody>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACfUlEQVRYR82XTXLTMBTH/8/G2ZIlMzShbCBZkZyA5ASUG7QnAE5AuUFvUG5AOUHNCZquAqxCAjMs062F/BjZ8VcsWYpTJnhpS+//e3pfMuHADx1YHzsBfH8cjNinV8w8AaEL0Ch1gGdgrIkoJMmfn/0SM1fHnADmveCUiN4DOHY0vCCW756v5JVtfSPA/BGOKQguQTSxGdJ+Zw5ZiLPhbyxM+40A6rhjH9cAdVuJ55t47UlMTWHRAqTidLOfcHW3J3msg6gBJMfeCW7293wbn9ccifF2OOoAvSAkopf36X0RDQ4HKzEt264AbLL98p+Ib4wSy9fl6qgC9DsLAp7oADiOpz7TOvYRAvRQD8l3nsREEnfJ864NjiwGy+hp9i0HsCWeAhj+/BNuqkMDkYqrRJsfPZg0AKCckDnAvN85J0A1G8NTlFMdohB3KV8GPgyX0bkSKgCckk8HAWSeu4gnjZv5y3AlkuaWA3ztBTMQvbAnYBVCrVfH7iqezY7BUoyrAP0O28WzFdXutpt4amOwjBLnixPYDSBPOGXEnJhml+oA7iHIxZXwVggaSrQEw3w7WIlk765JWBFPh1WShMmwcT0JfRIeBRfw6E1DGWrEs0nZVKJ1i9oytDWirHmYE66AaNWIFOfc0oqTmHn0yTwpU4imVszAj+Eyym9W/9cwSk7BqSO6d4zyynLy1YZR9mJzIZmZJ147cYDvOBIj64WkaCwHupJl/rnWtP08ikmpW2u9liMIPra9oqmYQ4jTVtfyMu23nn8Sk39hui1te6ZKzWP5du8fk23DKizSpxMwTwjo5uOb+ZaBNYhCX/LVvf+a2ePcfoXTv2F78/adfwEPZoswq99u9AAAAABJRU5ErkJggg=="

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div ms-controller=\"submit-controller\">\r\n    <div class=\"modal-content\">\r\n        <div class=\"modal-message error-message\">\r\n            <div>报送之前请先下载所有报表，并仔细检查数据是否正确</div>\r\n        </div>\r\n        <div class=\"modal-message error-message\">\r\n            <div>\r\n                <input name=\"check-report\" type=\"checkbox\" ms-click=\"@checkReport()\"/>&nbsp;&nbsp;检查无误，确认报送\r\n            </div>\r\n        </div>\r\n        <div class=\"modal-button\">\r\n            <a href=\"#close-modal\" rel=\"modal:close\">\r\n                <button ms-if=\"@checkReportFlag==0\" disabled>确定</button>\r\n                <button ms-if=\"@checkReportFlag==1\" ms-click=\"@submit()\">确定</button>\r\n            </a>\r\n            <a href=\"#close-modal\" rel=\"modal:close\"><button href=\"#close-modal\" rel=\"modal:close\">取消</button></a>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var depositoryBankModule = __webpack_require__(22);
	
	module.exports = {
	    init: function(){
	        avalon.router.add("/depository-bank", function (index, subIndex) {
	            if(avalon.vmodels['main']!=undefined){
	                delete avalon.vmodels['main'];
	            }
	
	            var mainVm = avalon.define({
	                $id: 'main',
	                template: __webpack_require__(23),
	                data: ""
	            });
	
	            mainVm.$watch('onReady', function(){
	            });
	            avalon.scan(document.body);
	        });
	    }
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {
	
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<div class=\"main-content-head\"><h4>备付金存管银行</h4></div>\r\n\r\n\t<div class=\"main-content-body\">\r\n\t\t<div style=\"margin-top: 100px;font-size: 20px;text-align: center;\">即将上线，敬请期待！</div>\r\n\t</div>\r\n</div>";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var pbcModule = __webpack_require__(11);
	var cooperativeBankModule = __webpack_require__(25);
	var commonModule = __webpack_require__(12);
	
	module.exports = {
	    init: function(){
	        avalon.router.add("/cooperative-bank", function () {
	            if(avalon.vmodels['main']!=undefined){
	                delete avalon.vmodels['main'];
	            }
	
	            var mainVm = avalon.define({
	                $id: 'main',
	                template: __webpack_require__(27),
	                data: {
	                    bankList: [],
	                    selectedBankIndex: 0,
	                    selectedAccountIndex: 0,
	                    reportTypeList: [
	                        {
	                            label: "汇总报表"
	                        },
	                        {
	                            label: "账户报表"
	                        }
	                    ],
	                    selectedReportTypeIndex: 0,
	                    reportList: [],
	                    checkedReportIndexList: []
	                },
	                selectBank: function () {
	                    mainVm.data.selectedBankIndex = document.getElementsByName("bank")[0].value;
	                    mainVm.data.reportList = cooperativeBankModule.getReportList(
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        mainVm.data.selectedReportTypeIndex,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                    );
	                },
	                selectAccount: function () {
	                    mainVm.data.selectedAccountIndex = document.getElementsByName("account")[0].value;
	
	                    mainVm.data.reportList = cooperativeBankModule.getReportList(
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        mainVm.data.selectedReportTypeIndex,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                    );
	                },
	                selectReportType: function(){
	                    mainVm.data.selectedReportTypeIndex = document.getElementsByName("report-type")[0].value;
	
	                    if (mainVm.data.selectedReportTypeIndex==1) {
	                        mainVm.data.selectedAccountIndex = 0;
	                        document.getElementsByName("account")[0].value = 0;
	                    }
	
	                    mainVm.data.reportList = cooperativeBankModule.getReportList(
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        mainVm.data.selectedReportTypeIndex,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                    );
	                },
	                checkAll: function () {
	                    mainVm.data.checkedReportIndexList=[];
	
	                    if(document.getElementsByName("check-all")[0].checked){
	                        for(var i=0; i<mainVm.data.reportList.length; i++){
	                            mainVm.data.checkedReportIndexList.push(i);
	                        }
	
	                        for(var i=0; i<document.getElementsByName("check-one").length; i++){
	                            document.getElementsByName("check-one")[i].checked = true;
	                        }
	                    } else {
	                        for(var i=0; i<document.getElementsByName("check-one").length; i++){
	                            document.getElementsByName("check-one")[i].checked = false;
	                        }
	                    }
	                },
	                checkOne: function () {
	                    mainVm.data.checkedReportIndexList=[];
	
	                    for(var i=0; i<document.getElementsByName("check-one").length; i++){
	                        if (document.getElementsByName("check-one")[i].checked) {
	                            mainVm.data.checkedReportIndexList.push(i);
	                        }
	                    }
	                },
	                generate: function (index) {
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
	                    var reportList={
	                        start_day: commonModule.getStartDay(year, month),
	                        end_day: commonModule.getEndDay(year, month),
	                        report_list: []
	                    };
	
	                    if (mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name=="中国建设银行" ||
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name=="中信银行"){
	                        reportList.report_type = mainVm.data.selectedReportTypeIndex;
	                    }
	
	                    if (mainVm.data.selectedReportTypeIndex==1) {
	                        reportList.report_list.push({
	                            account_id: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
	                            account_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_name,
	                            account_no: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_no,
	                            report_name: mainVm.data.reportList[index].report_name
	                        });
	                    } else {
	                        reportList.report_list.push({
	                            report_name: mainVm.data.reportList[index].report_name
	                        });
	                    }
	
	                    var result = cooperativeBankModule.generateReport(
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        reportList
	                    );
	
	                    if (result) {
	                        mainVm.data.reportList = cooperativeBankModule.getReportList(
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                            mainVm.data.selectedReportTypeIndex,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                        );
	                    }
	                },
	                batchGenerate: function () {
	                    if (mainVm.data.checkedReportIndexList.length==0){
	                        commonModule.errorModal("请选择您要生成的报表!");
	
	                        return ;
	                    }
	
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
	                    var reportList={
	                        start_day: commonModule.getStartDay(year, month),
	                        end_day: commonModule.getEndDay(year, month),
	                        report_list: []
	                    };
	
	                    if (mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name=="中国建设银行" ||
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name=="中信银行"){
	                        reportList.report_type = mainVm.data.selectedReportTypeIndex;
	                    }
	
	                    if (mainVm.data.selectedReportTypeIndex==1) {
	                        for (var i = 0; i < mainVm.data.checkedReportIndexList.length; i++) {
	                            reportList.report_list.push({
	                                account_id: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
	                                account_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_name,
	                                account_no: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_no,
	                                report_name: mainVm.data.reportList[mainVm.data.checkedReportIndexList[i]].report_name
	                            });
	                        }
	                    } else {
	                        for (var i = 0; i < mainVm.data.checkedReportIndexList.length; i++) {
	                            reportList.report_list.push({
	                                report_name: mainVm.data.reportList[mainVm.data.checkedReportIndexList[i]].report_name
	                            });
	                        }
	                    }
	
	                    var result = cooperativeBankModule.generateReport(
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        reportList
	                    );
	
	                    if (result) {
	                        mainVm.data.reportList = cooperativeBankModule.getReportList(
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                            mainVm.data.selectedReportTypeIndex,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                        );
	                    }
	                },
	                submit: function () {
	                    if($('#monthpicker').html()==''){
	                        commonModule.errorModal("请选择月份!");
	
	                        return;
	                    }
	
	                    if(avalon.vmodels['submit-controller']!=undefined){
	                        delete avalon.vmodels['submit-controller'];
	                    }
	
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
	                    var submitVm = avalon.define({
	                        $id: 'submit-controller',
	                        checkReportFlag: 0,
	                        submit: function () {
	                            cooperativeBankModule.submitReport(
	                                mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                                commonModule.getStartDay(year, month),
	                                commonModule.getEndDay(year, month)
	                            );
	                        },
	                        checkReport: function () {
	                            if (document.getElementsByName("check-report")[0].checked) {
	                                submitVm.checkReportFlag=1;
	                            } else {
	                                submitVm.checkReportFlag=0;
	                            }
	                        }
	                    });
	
	                    var submitTemplate = __webpack_require__(20);
	
	                    $('#modal').html(submitTemplate).modal({fadeDuration: 100});
	                    avalon.scan(document.getElementById("modal").firstChild);
	                },
	                download: function (reportName) {
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
	                    cooperativeBankModule.download(
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        mainVm.data.selectedReportTypeIndex,
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
	                        commonModule.getStartDay(year, month),
	                        commonModule.getEndDay(year, month),
	                        reportName
	                    );
	                },
	                downloadAll: function () {
	                    var year = $('#monthpicker').html().split("-")[0];
	                    var month = $('#monthpicker').html().split("-")[1];
	
	                    cooperativeBankModule.downloadAll(
	                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                        commonModule.getStartDay(year, month),
	                        commonModule.getEndDay(year, month)
	                    );
	                },
	                filter: function () {
	                    //此处需要调用接口重新获取列表
	
	                    if($('#filter').val()!=''){
	                        for(var i=0; i<mainVm.data.reportList.length; i++){
	                            if (mainVm.data.reportList[i].name.indexOf($('#filter').val())<0){
	                                mainVm.data.reportList.splice(i, 1);
	                                i=i-1;
	                            }
	                        }
	                    }
	                },
	                getOKBankList: function () {
	                    var okBankNameList = ["中国建设银行", "平安银行", "江苏银行", "上海浦东发展银行", "中信银行"];
	                    var okBankList = [];
	
	                    var allBankList = pbcModule.getBankList();
	
	                    for (var i=0; i<allBankList.length; i++){
	                        if (okBankNameList.indexOf(allBankList[i].bank_name)>=0){
	                            okBankList.push(allBankList[i]);
	                        }
	                    }
	
	                    return okBankList;
	                }
	            });
	
	            mainVm.data.bankList = mainVm.getOKBankList();
	            mainVm.data.reportList = cooperativeBankModule.getReportList(
	                mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                mainVm.data.selectedReportTypeIndex,
	                mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	            );
	
	            mainVm.$watch('onReady', function(){
	                $("#filter").keydown(function(event){
	                    if(event.which == "13"){
	                        mainVm.filter();
	                    }
	                });
	
	                var dateObj = new Date();
	                var currentYear = dateObj.getFullYear();
	
	                var years = []
	                for (var i=0; i<=currentYear-2008; i++){
	                    years.push(currentYear-i);
	                }
	
	                $('#monthpicker').monthpicker({
	                    years: years,
	                    topOffset: 6,
	                    onMonthSelect: function(month, year) {
	                        mainVm.data.reportList = cooperativeBankModule.getReportList(
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
	                            mainVm.data.selectedReportTypeIndex,
	                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
	                        );
	                    }
	                });
	            });
	            avalon.scan(document.body);
	        });
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var cooperativeBankService = __webpack_require__(26);
	var commonModule = __webpack_require__(12);
	
	module.exports = {
	    getReportList: function (bankName, reportType, accountId) {
	        if ($('#monthpicker').html()!=undefined && $('#monthpicker').html()!=''){
	            var year = $('#monthpicker').html().split("-")[0];
	            var month = $('#monthpicker').html().split("-")[1];
	
	            startDay = commonModule.getStartDay(year, month);
	            endDay = commonModule.getEndDay(year, month);
	        } else {
	            var dateObj = new Date();
	            var year = dateObj.getFullYear();
	            var month = dateObj.getMonth()+1;
	
	            startDay = commonModule.getStartDay(year, month);
	            endDay = commonModule.getEndDay(year, month);
	        }
	
	        return cooperativeBankService.getReportList(bankName, reportType, accountId, startDay, endDay);
	    },
	    generateReport: function(bankName, reportList){
	        return cooperativeBankService.generateReport(bankName, reportList);
	    },
	    submitReport: function(bankName, startDay, endDay){
	        cooperativeBankService.submitReport(bankName, startDay, endDay);
	    },
	    download: function (bankName, reportType, accountId, startDay, endDay, reportName) {
	        if (cooperativeBankService.downloadable(bankName, reportType, accountId, startDay, endDay, reportName)){
	            var url =null;
	            if (bankName=="中国建设银行" || bankName=="中信银行"){
	                if(reportType==0){
	                    url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                        +"/download?report_type="+reportType
	                        +"&start_day="+startDay
	                        +"&end_day="+endDay
	                        +"&report_name="+reportName;
	                }else {
	                    url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                        +"/download?report_type="+reportType
	                        +"&account_id="+accountId
	                        +"&start_day="+startDay
	                        +"&end_day="+endDay
	                        +"&report_name="+reportName;
	                }
	            }else {
	                url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                    +"/download?start_day="+startDay
	                    +"&end_day="+endDay
	                    +"&report_name="+reportName;
	            }
	
	            window.open(url);
	        }
	    },
	    downloadAll: function (bankName, startDay, endDay) {
	        if (cooperativeBankService.downloadableAll(bankName, startDay, endDay)){
	            window.open(
	                "/report/"+commonModule.getBankAbbreviation(bankName)
	                +"/download-all?start_day="+startDay
	                +"&end_day="+endDay
	            );
	        }
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var commonModule = __webpack_require__(12);
	
	module.exports = {
	    getReportList: function (bankName, reportType, accountId, startDay, endDay) {
	        var data = [];
	
	        var url =null;
	        if (bankName=="中国建设银行" || bankName=="中信银行"){
	            if(reportType==0){
	                url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                        +"/list?report_type="+reportType
	                        +"&start_day="+startDay
	                        +"&end_day="+endDay;
	            }else {
	                url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                    +"/list?report_type="+reportType
	                    +"&account_id="+accountId
	                    +"&start_day="+startDay
	                    +"&end_day="+endDay;
	            }
	        }else {
	            url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                    +"/list?start_day="+startDay
	                    +"&end_day="+endDay;
	        }
	
	        $.ajax({
	            url: url,
	            type: 'GET',
	            async: false,
	            dataType: 'json',
	            success: function (response) {
	                if (response.code == 200) {
	                    data = response.data;
	                }
	            },
	            error: function () {
	                commonModule.errorModal("接口错误！");
	            }
	        });
	
	        return data;
	    },
	    generateReport: function (bankName, reportList) {
	        var result = false;
	
	        $.ajax({
	            url: "/report/"+commonModule.getBankAbbreviation(bankName)+"/create",
	            type: "POST",
	            async: false,
	            dataType: 'json',
	            contentType: "application/json;charset=utf-8",
	            data: JSON.stringify(reportList),
	            success: function (data) {
	                if (data.code == 200) {
	                    commonModule.infoModal(data.message);
	                    result = true;
	                } else if (data.code == 400) {
	                    commonModule.errorModal(data.message);
	                }
	            },
	            error: function () {
	                commonModule.errorModal("接口错误！");
	            }
	        });
	
	        return result;
	    },
	    submitReport: function(bankName, startDay, endDay) {
	        $.ajax({
	            url: "/report/"+commonModule.getBankAbbreviation(bankName)+"/submit?start_day="+startDay+"&end_day="+endDay,
	            type: "POST",
	            dataType: 'json',
	            contentType: "application/json;charset=utf-8",
	            success: function (data) {
	                if (data.code == 200) {
	                    commonModule.infoModal(data.message);
	                } else if (data.code == 400) {
	                    commonModule.errorModal(data.message);
	                }
	            },
	            error: function () {
	                commonModule.errorModal("接口错误！");
	            }
	        });
	    },
	    downloadable: function(bankName, reportType, accountId, startDay, endDay, reportName){
	        var result = true;
	
	        var url =null;
	        if (bankName=="中国建设银行" || bankName=="中信银行"){
	            if(reportType==0){
	                url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                    +"/download?report_type="+reportType
	                    +"&start_day="+startDay
	                    +"&end_day="+endDay
	                    +"&report_name="+reportName;
	            }else {
	                url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                    +"/download?report_type="+reportType
	                    +"&account_id="+accountId
	                    +"&start_day="+startDay
	                    +"&end_day="+endDay
	                    +"&report_name="+reportName;
	            }
	        }else {
	            url = "/report/"+commonModule.getBankAbbreviation(bankName)
	                    +"/download?start_day="+startDay
	                    +"&end_day="+endDay
	                    +"&report_name="+reportName;
	        }
	
	        $.ajax({
	            url: url,
	            type: 'GET',
	            dataType: 'json',
	            async: false,
	            timeout : 5000,
	            success: function (response) {
	                if (response.code == 400) {
	                    commonModule.errorModal(response.message);
	
	                    result=false;
	                }
	            }
	        });
	
	        return result;
	    },
	    downloadableAll: function(bankName, startDay, endDay){
	        var result = true;
	
	        $.ajax({
	            url: "/report/"+commonModule.getBankAbbreviation(bankName)
	                    +"/download-all?start_day="+startDay
	                    +"&end_day="+endDay,
	            type: 'GET',
	            dataType: 'json',
	            async: false,
	            timeout : 5000,
	            success: function (response) {
	                if (response.code == 400) {
	                    commonModule.errorModal(response.message);
	
	                    result=false;
	                }
	            }
	        });
	
	        return result;
	    }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div>\r\n    <div class=\"main-content-head\"><h4>备付金合作银行</h4></div>\r\n\r\n    <div class=\"main-content-body\">\r\n        <div class=\"report-head\">\r\n            <div class=\"report-head-item\">\r\n                <label>选择银行</label>\r\n                <select name=\"bank\" ms-on-change=\"@selectBank()\">\r\n                    <option ms-for=\"(index, bank) in @data.bankList\"\r\n                            ms-attr=\"{'value': index}\">\r\n                        {{bank.bank_name}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n\r\n            <div class=\"report-head-item\">\r\n                <label>选择月份</label>\r\n                <a href=\"#monthpicker\" id=\"monthpicker\"></a>\r\n                <button ms-click=\"@submit()\"\r\n                        ms-if=\"@data.bankList[@data.selectedBankIndex].bank_name!='中国建设银行'\r\n                            || @data.bankList[@data.selectedBankIndex].bank_name!='中信银行'\">\r\n                    报送\r\n                </button>\r\n                <button ms-click=\"@downloadAll()\">下载全部</button>\r\n            </div>\r\n\r\n            <div class=\"report-head-item\"\r\n                 ms-visible=\"@data.bankList[@data.selectedBankIndex].bank_name=='中国建设银行'\r\n                            || @data.bankList[@data.selectedBankIndex].bank_name=='中信银行'\">\r\n                <label>报表类型</label>\r\n                <select name=\"report-type\" ms-on-change=\"@selectReportType()\">\r\n                    <option ms-for=\"(index, reportType) in @data.reportTypeList\"\r\n                            ms-attr=\"{'value': index}\">\r\n                        {{reportType.label}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n\r\n            <div class=\"report-head-item\"\r\n                 ms-visible=\"(@data.bankList[@data.selectedBankIndex].bank_name=='中国建设银行'\r\n                                || @data.bankList[@data.selectedBankIndex].bank_name=='中信银行')\r\n                            && @data.selectedReportTypeIndex==1\">\r\n                <label>选择账户</label>\r\n                <select name=\"account\" ms-on-change=\"@selectAccount()\">\r\n                    <option ms-for=\"(index, account) in @data.bankList[@data.selectedBankIndex].account_list\"\r\n                            ms-attr=\"{'value': index}\">\r\n                        {{account.account_no}}\r\n                    </option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"report-body\">\r\n            <div class=\"operation\">\r\n                <div><button ms-click=\"@batchGenerate()\">批量生成</button></div>\r\n                <div class=\"right\">\r\n                    <input type=\"text\" placeholder=\"可按报表类型检索\" id=\"filter\">\r\n                    <button class=\"search-button\" ms-click=\"@filter()\"></button>\r\n                </div>\r\n            </div>\r\n            <table>\r\n                <thead>\r\n                <tr>\r\n                    <th>\r\n                        <input name=\"check-all\" type=\"checkbox\" ms-click=\"@checkAll()\"/>&nbsp;&nbsp;全选\r\n                    </th>\r\n                    <th>报表</th>\r\n                    <th>状态</th>\r\n                    <th>操作</th>\r\n                </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr ms-for=\"(index, report) in @data.reportList\">\r\n                        <td>\r\n                            <input type=\"checkbox\"\r\n                                   name=\"check-one\"\r\n                                   ms-click=\"@checkOne()\"/>\r\n                        </td>\r\n                        <td>{{report.report_name}}</td>\r\n                        <td ms-if=\"report.report_status==1\">\r\n                            <img class=\"icon\" src=\"" + __webpack_require__(16) + "\">已生成\r\n                        </td>\r\n                        <td ms-if=\"report.report_status==0\">\r\n                            <img class=\"icon\" src=\"" + __webpack_require__(19) + "\">未生成\r\n                        </td>\r\n                        <td>\r\n                            <button ms-click=\"@generate(index)\">生成</button>\r\n                            <button ms-if=\"report.report_status==0\" disabled>下载</button>\r\n                            <button ms-if=\"report.report_status==1\" ms-click=\"@download(report.report_name)\">下载</button>\r\n                        </td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }
/******/ ]);
//# sourceMappingURL=app.1.0.0.js.map