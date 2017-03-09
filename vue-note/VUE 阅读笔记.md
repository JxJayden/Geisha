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


