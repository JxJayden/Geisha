# VUE 阅读笔记
## [5200951]

#### Seed(el, options)
- 拷贝 options 到 this
- new Scope
- 如果有 data 则拷贝到 scope
- invoke ctrl
- call _compileNode
- extract dependencies for computed properties

#### _compileNode
- 文本节点：_compileTextNode
- 其他节点：

 > if sd-each
 > parse as dir
 > seed bind dir
 >
 > if ctrl but not root
 >  new chid Seed
 >
 > else
 > each attr
 >     each exp
 >         parse as dir
 >         seed bind dir
 > 递归 compile child nodes

#### _compileTextNode

#### _bind
- traceOwnerSeed
- call seed._createBinding
- binding <-> dir
- directive.bind // 指令执行前需要预处理，如：初始化变量
- directive.update
- directive.refresh

#### Scope
- property
- $seed
- $el
- $index
- $parent
- $watchers
- method
- $watch
- $unwatch
- $dump
- $destroy
- $serialize

#### Directive (directive-parser)
- new Directive(dirname, expression, oneway)
- set this._update
- call this.parseKey
- call parseFilter
- property
- oneway
- directiveName
- expression
- rawKey
- filters
- arg
- inverse
- nesting
- root
- key
- method
- update
- refresh
- apply
- applyFilters
- parseKey
- parseFilter
- deps-parser
- observer
- parse

#### Binding
```javascript
	this.inspect(utils.getNestedValue(seed.scope, path))
	this.def(seed.scope, path) // Define getter/setter for this binding on scope
```

- property
- seed
- key
- instances
- subs
- deps
- isComputed
- value
- inspect (value)

> Pre-process a passed in value based on its type
> 如果是 {get:, set:} 则标记 computed
> 如果是 Array, 则 拦截数组原生方法

- def : 定义 getter/setter
- update
- pub: `each subs : dir.refresh()`

## [498778e]
> 0.3.2 - make it actually work for Browserify

```
vm
- $el
- $parent
- $compiler <<=>>
	- el
	- vm <<=>>
	- directives [dir,...]
					- rawKey // 除去过滤器
					- expression // 完整
					- directiveName
					- _update
					- filters [{name:x,apply:x,args}...]
					- isExp
					- nesting ^ 往上多少级父亲
					- arg // arg: key
					- key
					- root (Bool)
					- compiler: $compiler
					- vm: <<=>> $compiler.vm

	- expressions [binding] // 表达式
	- observables [binding] // 非 {get: xx} 的对象 和 数组
	- computed [binding] //  表达式 or {get: xx} 成员
	- contextBindings[binding] // {get: fun} fun中有依赖的
	- parentCompiler
	- bindings [binding]
					- value
					- isComputed
					- rawGet
					- contextDeps

	- rootCompiler
	- observer(Emitter)
		- proxies {}

-------------------------------------------------------------------------------

compiler.bindings = {
	value
	isExp (Bool)
	root
	compiler <<=>> $compiler
	key: {}
	instances: []
	subs: []
	deps: []
}

-------------------------------------------------------------------------------

依赖关系是用 binding 的引用

binding.update()
    each dir in instances : dir.update()
    call pub()
        ==>
        each binding in subs : dir.refresh()
                                    ==>
                                    each dir in instances : dir.refresh()

外部引起的值改变先是 update 再触发依赖自己的 computed 成员去 refresh
```
---

#### ViewModel
- ViewModel(options) => new Compiler(ViewModel, options)
- $set 对 vm 设值，key 可以为 a.b.c 这样的
- $get
- $watch
- $unwatch
- $destroy

#### Compiler
- Compiler
1. extend(options)
2. extend(options.data)
3. determine el
4. prototypal inheritance of bindings
5. setup observer
6. call options.init
7. for key in vm : createBinding(key)
8. compileNode
9. for bindIns in observables : Observer.observe(bindIns.value, bindIns.key, this.observer)
10. DepsParser.parse(computed)
11. bindContexts(ctxBindings)

- setupObserver
```
observer
	.on('get', callback)
	.on('set', callback)
	.on('mutate', callback)
```

- compileNode
```
if textNode
	compileTextNode
else if 标签元素
	if sd-each
		parse then bindDirective
else if sd-vm 且 非根
	new ChildVM
else // normal node
	遍历属性，跳过有 vm 声明的
	遍历表达式
	parse then bindDirective
	递归 compile 子元素
```

- createBinding(key, isExp)

```
new Binding
表达式
	ExpParser.parseGetter
	binding.value = { get: getter }
	this.markComputed(binding)
	this.expressions.push(binding)
非表达式
	compiler.bindings[key] = new Binding
	ensurePath(key)
	对如 `a.b.c` 这类，会保证
    binding = {
        'a': 
        'a.b':
        'a.b.c': 
    }
    每层 path 都有一个 bindingIns # question
    只对第一层 path 调用 this.define(a, aKeyBinding)
```
- bindDirective 


```
find target compiler: traceOwnerCompiler
var binding
设置 subs
执行开发者的 bind hook
if computed
	call refresh
else
	call update
```

- markComputed
- define: Defines the getter/setter for a root-level binding on the VM

```
针对根成员，定义 getter/setter，另外 observables 也是在这里收集的

难点：
getter 会触发 'get' 事件，目前是为了依赖侦测，为了获得最『纯净』的底层依赖，
对以下类型不触发，因为以下类型的值肯定依赖更深的属性：isComputed value.__observer__ array 

setter
对于 computed 的，有 set 方法就直接用，没有就不管。
非 computed, 先移除旧的 observe，然后再设置新的的 observe
```

- bindContexts
- destroy

#### Directive

- Directive (directiveName, expression)

```
each definition
	this._update =
	this.xxx = xxx
parse key
parse filters
```

- update 值改变的时候会调用，只针对非 computed
- refresh 值改变的时候会调用，只针对 computed 成员，当所依赖发生改变时
- apply: Actually invoking the _update from the directive's definition

#### ExpParser from https://github.com/RubyLouvre/avalon 

## [f4861ca]

#### func (main.js)

- config(opts) 个人设置

- directive(id, fn) 注册指令

- filter(id, fn) 注册 filter 指令

- component(id, Ctor) 

  > 注册组件，用 util.toConstructor 转为 ViewModel(或子类)

- partial(id, partial)

  > 注册模板，用 utils.toFragment 转为 frag 节点

- transition(id, transition)

  > 注册动画 def

- extend(options)

  ```
   Expose the main ViewModel class and add extend method
   
  ```

- inheritOptions (child, parent, topLevel)

  > 对象则 拷贝 (一层)，方法则 mergeHook，忽略 el methods

- mergeHook (fn, parentFn)

- updatePrefix ()

- setPrefix()

#### Compiler

**props**

- init
- options
- data
- el
- vm
- dirs
- exps
- computed
- childCompilers
- emitter (Emitter)
- parentCompiler
- bindings {}
- rootCompiler
- childId
- observer
  - proxies
- [repeatIndex]
- $
- $el
- $compiler
- $root

**func**

- Compiler(vm, options) 

```
compiler.init = true // indicate intiating this instance

// process and extend options

// copy data, methods & compiler options

// initialize element

// set compiler properties

// inherit parent bindings

// set inenumerable VM properties

// set parent VM
// and register child id on parent

// setup observer

// beforeCompile hook

// the user might have set some props on the vm 
// so copy it back to the data...

// observe the data
Observer.observe(data, '', compiler.observer)

// for repeated items, create an index binding
// which should be inenumerable but configurable

// allow the $data object to be swapped

// now parse the DOM
	// create necessary bindings
	// bind the parsed directives
	
// extract dependencies for computed properties

// done! post compile / ready hook
```

- setupElement(options) 

  >  Initialize the VM/Compiler's element. Fill it in with the template if necessary.

- setupObserver

  > Setup observer.The observer listens for get/set/mutate events on all VM

- compile(node, root)

- compileNode(node)

- compileTextNode(node)

  ```
  // TextParser.parse as tokens
  // each tokens:
      //if a binding with key
          // if '>' as partialId, compileNode()
          // else parse as sd-text then bind dir

      //if a plain string then createTextNode(token)
  ```

- bindDirective(direcitve)

  ```
  // append to dirs

  // if a simple directive simply call its bind() or _update()

  // if exp
      // expression bindings, created on current compiler
  // if data or vm has baseKey
  	// Create the binding if it's not created already.
  // else
  	// 由于绑定的原型继承，如果绑定对象上不存在键，那么它不存在于整个原型链中。 
  	// 在这种情况下，我们在根级别创建新的绑定。
  // invoke bind hook if exists

  // set initial value
  	refresh for computed. update for other
  ```

- createBinding(key, isExp, isFn)

  ```
  // Create binding and attach getter/setter for a key to the viewmodel object

  // if isExp
  // a complex expression binding
  // parse exp to generate an anonymous computed property {$get:xx}
  // apply `value`
  // mark computed
  // push to exps

  // just key
  // if root
  	// define getter/setters for it.
  // else 
  	// ensure path in data so it can be observed
  	// this is a nested value binding, but the binding for its parent
  	// has not been created yet. We better create that one too.
  ```

- define(key, binding)

  ``` 
  Defines the getter/setter for a root-level binding on the VM and observe the initial value

  binding.value = data[key] // save the value before redefinening it
  // set 事件两次 ? question
  // if (data.__observer__) {
  //     Observer.convert(data, key)
  // }
  ```

- markComputed(binding) Process a computed property binding

- getOption(type, id)

- execHook

- destroy

- getRoot

#### ViewModel

**props**

- ${chidid:,...}
- $el
- $compiler
- $root
- $parent

**func**

- ViewModel(options) 直接 new Compiler
- $set(key, value) 找到 basekey 对应 vm 然后设置
- $watch(key, callback)
- $unwatch
- $destroy
- $broadcast() 递归向下发布事件
- $emit 自身 & 往上递归发事件
- $on ()
- $off ()
- $once ()
- $appendTo (target, cb)
- $remove (cb)
- $before (target, cb)
- $after (target, cb)
- getTargetVM (vm, path)

#### Directive

**props**

- compiler
- vm
- el
- isSimple
- expression
- bind 或 _update
- rawKey
- key
- isExp
- filters

**func**

- update
- refresh -- computed property only --
- apply
- applyFilters
- unbind
- split
- parse

#### Binding

> 每一个 vm 上的属性（路径）都有一个对应的 Binding 对象，这个对象有多个作用在 DOM 上的 指令 实例，以及多个依赖 binding 跟属性一一对应，所以 update 等方法的触发入口是属性被改变了

**props**

- value
- isExp
- isFn
- root
- compiler
- key
- subs = []
- deps = []
- isComputed // 表达式 / {$get:xx}
- instances [,...]

**func**

- update

- refresh

- pub 

  > Notify computed properties that depend on this binding to update themselves

- unbind

  >  Unbind the binding, remove itself from all of its dependencies

#### Observer

- watchObject
  - convert
- isWatchable (obj)
- emitSet
- copyPaths //保证旧对象的叶子路径都在新对象上
- ensurePath  // 保证 各层路径 accessed 和 enumerated
- observe (obj, rawPath, observer)
- unobserve



