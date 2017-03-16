# [b7e83e61] 1.0.10

## index.js

> 添加 Vue.options 默认属性，如果使用了 vue 开发者工具，则激活。

## instance

### vue.js

> 在 Vue 上挂载属性和 API 并且Vue.init
>
> this._init(options)

### internal/init.js

#### 1. Vue.prototype._init(options)

> 主要生成队列

```js
Vue:
prop:
$el
$parent <=> options.parent
$root: options.parent ? options.parent.$root : this
$children: []
$refs:{}  // child vm references
$els: {} // element references
_watchers: [] // 所有的数据订阅者
_directives: [] // 所有的指令

_uid: uid

isVue: true // 一个避免本身被 observed 的标志 //Q

_events: {} // 注册的回调
_eventsCount: {} // for $broadcast 优化 //Q

_isFragment = false
_fragment = _fragmentStart = _fragmentEnd = null

// 生命周期状态
this._isCompiled =
this._isDestroyed =
this._isReady =
this._isAttached =
this._isBeingDestroyed = false
this._unlinkFn = null

_context: options._context || this.$parent // 上下文

_scope: options._scope 作用域

_frag: options._frag
// 如果这个实例被编译在一个 Fragment 内部，它需要将自己注册为该 fragment 的一个子对象，以便 attach / detach 能正常工作。

if (this._frag) {
  this._frag.children.push(this)
}

// push self into parent / transclusion host
if (this.$parent) {
  this.$parent.$children.push(this)
}

$options: mergeOptions() // merge options. 混合选项

_updateRef() // set ref //Q // Update v-ref for component.

_data = {}

_callHook('init') // call init hook

_initState() // 初始化数据观察和作用域继承

_initEvents() // 初始化事件

_callHook('created') // call created hook

// 如果有 options.el 则开始 $mount
if (options.el) {
  this.$mount(options.el)
}
```

### state.js

> Accessor for `$data` property, since setting $data requires observing the new object and updating proxied properties.

```js
defined Vue $data => if newData => _setData(newData)

/**
 * Setup the scope of an instance, which contains:
 * - observed data
 * - computed properties
 * - user methods
 * - meta properties
 */
set Vue.prototype._initState => {
  this._initProps()
  this._initMeta()
  this._initMethods()
  this._initData()
  this._initComputed()
}

_initProps => {
  if options.props
    compileAndLinkProps(this, el, props, this._scope)
    compileAndLinkProps // 在 compiler/compile.js 中
}

_initMeta // Initialize meta information like $index, $key & $value.

_initMethods // setup instance methods 绑定方法示例，并且把 this 指向 Vue

_initData => { // Initialize the data.
  // 先检测 data 有没有被定义为 prop
  if (this._props[prop].raw !== null ||!hasOwn(optionsData, prop
  	set // Set a property on an object. Adds the new property and triggers change notification if the property doesn't already exist.
                                               
  this._proxy(data.allkey) //proxy data on instance
  observe(data, this) // observe data
}

_initComputed => { // Setup computed properties.
  if computed(key) 为 funciton
  	makeComputedGetter
  else
    分别处理 get set
  
  Object.defineProperty(this, key, def)
}

Vue.prototype._setData => { // Swap the instance's $data. Called in $data's setter.
  if key not in new data => this._unproxy(key)
  
  if key not in old data but in new data => this._proxy(key)
  oldData.__ob__.removeVm(this)
  observe(newData, this)
  this._digest() // Force update on every watcher in scope.
}

Vue.prototype._proxy => {
  if !isReserved(key)
    Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter () {
          return self._data[key]
        },
        set: function proxySetter (val) {
          self._data[key] = val
        }
      })
}
```



