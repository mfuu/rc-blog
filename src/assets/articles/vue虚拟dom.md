Vue版本: 2.3.2

`virtual-dom`(后文简称`vdom`)的概念大规模的推广还是得益于`react`出现，`virtual-dom`也是`react`这个框架的非常重要的特性之一。相比于频繁的手动去操作`dom`而带来性能问题，`vdom`很好的将`dom`做了一层映射关系，进而将在我们本需要直接进行`dom`的一系列操作，映射到了操作`vdom`，而`vdom`上定义了关于真实`dom`的一些关键的信息，`vdom`完全是用`js`去实现，和宿主浏览器没有任何联系，此外得益于`js`的执行速度，将原本需要在真实`dom`进行的`创建节点`,`删除节点`,`添加节点`等一系列复杂的`dom`操作全部放到`vdom`中进行，这样就通过操作`vdom`来提高直接操作的`dom`的效率和性能。

`Vue`在`2.0`版本也引入了`vdom`。其`vdom`算法是基于[snabbdom算法](https://github.com/snabbdom/snabbdom)所做的修改。

在`Vue`的整个应用生命周期当中，每次需要更新视图的时候便会使用`vdom`。那么在`Vue`当中，`vdom`是如何和`Vue`这个框架融合在一起工作的呢？以及大家常常提到的`vdom`的`diff`算法又是怎样的呢？接下来就通过这篇文章简单的向大家介绍下`Vue`当中的`vdom`是如何去工作的。

首先，我们还是来看下`Vue`生命周期当中初始化的最后阶段：将`vm`实例挂载到`dom`上，源码在[src/core/instance/init.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/init.js#L67-L70)

```js
    Vue.prototype._init = function () {
        ...
        vm.$mount(vm.$options.el)  
        ...
    }   
```

实际上是调用了[src/core/instance/lifecycle.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L139-L202)中的`mountComponent`方法，  
`mountComponent`函数的定义是：

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // vm.$el为真实的node
  vm.$el = el
  // 如果vm上没有挂载render函数
  if (!vm.$options.render) {
    // 空节点
    vm.$options.render = createEmptyVNode
  }
  // 钩子函数
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    ...
  } else {
    // updateComponent为监听函数, new Watcher(vm, updateComponent, noop)
    updateComponent = () => {
      // Vue.prototype._render 渲染函数
      // vm._render() 返回一个VNode
      // 更新dom
      // vm._render()调用render函数，会返回一个VNode，在生成VNode的过程中，会动态计算getter,同时推入到dep里面
      vm._update(vm._render(), hydrating)
    }
  }

  // 新建一个_watcher对象
  // vm实例上挂载的_watcher主要是为了更新DOM
  // vm/expression/cb
  vm._watcher = new Watcher(vm, updateComponent, noop)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

注意上面的代码中定义了一个`updateComponent`函数，这个函数执行的时候内部会调用`vm._update(vm._render(), hyddrating)`方法，其中`vm._render`方法会返回一个新的`vnode`，(关于`vm_render`是如何生成`vnode`的建议大家看看`vue`的关于`compile`阶段的代码)，然后传入`vm._update`方法后，就用这个新的`vnode`和老的`vnode`进行`diff`，最后完成`dom`的更新工作。那么`updateComponent`都是在什么时候去进行调用呢？

```js
vm._watcher = new Watcher(vm, updateComponent, noop)
```

实例化一个`watcher`，在求值的过程中`this.value = this.lazy ? undefined : this.get()`，会调用`this.get()`方法，因此在实例化的过程当中`Dep.target`会被设为这个`watcher`，通过调用`vm._render()`方法生成新的`Vnode`并进行`diff`的过程中完成了模板当中变量依赖收集工作。即这个`watcher`被添加到了在模板当中所绑定变量的依赖当中。一旦`model`中的响应式的数据发生了变化，这些响应式的数据所维护的`dep`数组便会调用`dep.notify()`方法完成所有依赖遍历执行的工作，这里面就包括了视图的更新即`updateComponent`方法，它是在`mountComponent`中的定义的。

`updateComponent`方法的定义是：

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

完成视图的更新工作事实上就是调用了`vm._update`方法，这个方法接收的第一个参数是刚生成的`Vnode`，调用的`vm._update`方法([src/core/instance/lifecycle.js](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L50-L90))的定义是

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const prevActiveInstance = activeInstance
    activeInstance = vm
    // 新的vnode
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    // 如果需要diff的prevVnode不存在，那么就用新的vnode创建一个真实dom节点
    if (!prevVnode) {
      // initial render
      // 第一个参数为真实的node节点
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      )
    } else {
      // updates
      // 如果需要diff的prevVnode存在，那么首先对prevVnode和vnode进行diff,并将需要的更新的dom操作已patch的形式打到prevVnode上，并完成真实dom的更新工作
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
}
```

在这个方法当中最为关键的就是`vm.__patch__`方法，这也是整个`virtaul-dom`当中最为核心的方法，主要完成了`prevVnode`和`vnode`的`diff`过程并根据需要操作的`vdom`节点打`patch`，最后生成新的真实`dom`节点并完成视图的更新工作。

接下来就让我们看下`vm.__patch__`里面到底发生了什么：

```js
function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    // 当oldVnode不存在时
    if (isUndef(oldVnode)) {
        // 创建新的节点
        createElm(vnode, insertedVnodeQueue, parentElm, refElm)
    } else {
        const isRealElement = isDef(oldVnode.nodeType)
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        // 对oldVnode和vnode进行diff，并对oldVnode打patch
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
  } 
    }
}
```

在对`oldVnode`和`vnode`类型判断中有个`sameVnode`方法，这个方法决定了是否需要对`oldVnode`和`vnode`进行`diff`及`patch`的过程。

```js
function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}
```

**`sameVnode`会对传入的2个`vnode`进行基本属性的比较，只有当基本属性相同的情况下才认为这个2个`vnode`只是局部发生了更新，然后才会对这2个`vnode`进行`diff`，如果2个`vnode`的基本属性存在不一致的情况，那么就会直接跳过`diff`的过程，进而依据`vnode`新建一个真实的dom，同时删除老的`dom`节点。**

`vnode`基本属性的定义可以参见源码:[src/vdom/vnode.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js#L4-L65)里面对于`vnode`的定义。

```js
constructor (
    tag?: string,
    data?: VNodeData,         // 关于这个节点的data值，包括attrs,style,hook等
    children?: ?Array<VNode>, // 子vdom节点
    text?: string,        // 文本内容
    elm?: Node,           // 真实的dom节点
    context?: Component,  // 创建这个vdom的上下文
    componentOptions?: VNodeComponentOptions
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.functionalContext = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

每一个`vnode`都映射到一个真实的`dom`节点上。其中几个比较重要的属性:

*   `tag` 属性即这个`vnode`的标签属性
*   `data` 属性包含了最后渲染成真实`dom`节点后，节点上的`class`,`attribute`,`style`以及绑定的事件
*   `children` 属性是`vnode`的子节点
*   `text` 属性是文本属性
*   `elm` 属性为这个`vnode`对应的真实`dom`节点
*   `key` 属性是`vnode`的标记，在`diff`过程中可以提高`diff`的效率，后文有讲解

比如，我定义了一个`vnode`，它的数据结构是:

```js
{
    tag: 'div'
    data: {
        id: 'app',
        class: 'page-box'
    },
    children: [
        {
            tag: 'p',
            text: 'this is demo'
        }
    ]
}
```

最后渲染出的实际的`dom`结构就是:

```js
<div id="app" class="page-box">
    <p>this is demo</p>
</div>
```

让我们再回到`patch`函数当中，**在当`oldVnode`不存在的时候**，这个时候是`root节点`初始化的过程，因此调用了`createElm(vnode, insertedVnodeQueue, parentElm, refElm)`方法去创建一个新的节点。**而当`oldVnode`是`vnode`且`sameVnode(oldVnode, vnode)`2个节点的基本属性相同**，那么就进入了2个节点的`diff`过程。

`diff`的过程主要是通过调用`patchVnode`([src/core/vdom/patch.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js#L441))方法进行的:

```js
function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    ...
}
```

```js
if (isDef(data) && isPatchable(vnode)) {
      // cbs保存了hooks钩子函数: 'create', 'activate', 'update', 'remove', 'destroy'
      // 取出cbs保存的update钩子函数，依次调用，更新attrs/style/class/events/directives/refs等属性
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
```

更新真实`dom`节点的`data`属性，相当于对`dom`节点进行了预处理的操作

接下来:

```js
...
const elm = vnode.elm = oldVnode.elm
const oldCh = oldVnode.children
const ch = vnode.children
// 如果vnode没有文本节点
if (isUndef(vnode.text)) {
  // 如果oldVnode的children属性存在且vnode的属性也存在
  if (isDef(oldCh) && isDef(ch)) {
    // updateChildren，对子节点进行diff
    if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
  } else if (isDef(ch)) {
    // 如果oldVnode的text存在，那么首先清空text的内容
    if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
    // 然后将vnode的children添加进去
    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
  } else if (isDef(oldCh)) {
    // 删除elm下的oldchildren
    removeVnodes(elm, oldCh, 0, oldCh.length - 1)
  } else if (isDef(oldVnode.text)) {
    // oldVnode有子节点，而vnode没有，那么就清空这个节点
    nodeOps.setTextContent(elm, '')
  }
} else if (oldVnode.text !== vnode.text) {
  // 如果oldVnode和vnode文本属性不同，那么直接更新真是dom节点的文本元素
  nodeOps.setTextContent(elm, vnode.text)
}
```

这其中的`diff`过程中又分了好几种情况，`oldCh`为`oldVnode`的子节点，`ch`为`Vnode`的子节点：

1.  首先进行文本节点的判断，若`oldVnode.text !== vnode.text`，那么就会直接进行文本节点的替换；
2.  在`vnode`没有文本节点的情况下，进入子节点的`diff`；
3.  当`oldCh`和`ch`都存在且不相同的情况下，调用`updateChildren`对子节点进行`diff`；
4.  若`oldCh`不存在，`ch`存在，首先清空`oldVnode`的文本节点，同时调用`addVnodes`方法将`ch`添加到`elm`真实`dom`节点当中；
5.  若`oldCh`存在，`ch`不存在，则删除`elm`真实节点下的`oldCh`子节点；
6.  若`oldVnode`有文本节点，而`vnode`没有，那么就清空这个文本节点。

这里着重分析下`updateChildren`([src/core/vdom/patch.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js#L366-L366))方法，它也是整个`diff`过程中最重要的环节:

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    // 为oldCh和newCh分别建立索引，为之后遍历的依据
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, elmToMove, refElm
    
    // 直到oldCh或者newCh被遍历完后跳出循环
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        // 插入到老的开始节点的前面
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 如果以上条件都不满足，那么这个时候开始比较key值，首先建立key和index索引的对应关系
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
        // 如果idxInOld不存在
        // 1. newStartVnode上存在这个key,但是oldKeyToIdx中不存在
        // 2. newStartVnode上并没有设置key属性
        if (isUndef(idxInOld)) { // New element
          // 创建新的dom节点
          // 插入到oldStartVnode.elm前面
          // 参见createElm方法
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        } else {
          elmToMove = oldCh[idxInOld]
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            )
          
          // 将找到的key一致的oldVnode再和newStartVnode进行diff
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined
            // 移动node节点
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          } else {
            // same key but different element. treat as new element
            // 创建新的dom节点
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          }
        }
      }
    }
    // 如果最后遍历的oldStartIdx大于oldEndIdx的话
    if (oldStartIdx > oldEndIdx) {        // 如果是老的vdom先被遍历完
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      // 添加newVnode中剩余的节点到parentElm中
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) { // 如果是新的vdom先被遍历完，则删除oldVnode里面所有的节点
      // 删除剩余的节点
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}
```

在开始遍历`diff`前，首先给`oldCh`和`newCh`分别分配一个`startIndex`和`endIndex`来作为遍历的索引，当`oldCh`或者`newCh`遍历完后(遍历完的条件就是`oldCh`或者`newCh`的`startIndex >= endIndex`)，就停止`oldCh`和`newCh`的`diff`过程。接下来通过实例来看下整个`diff`的过程(节点属性中不带`key`的情况):

1.  首先从第一个节点开始比较，不管是`oldCh`还是`newCh`的起始或者终止节点都不存在`sameVnode`，同时节点属性中是不带`key`标记的，因此第一轮的`diff`完后，`newCh`的`startVnode`被添加到`oldStartVnode`的前面，同时`newStartIndex`前移一位；  
    [![](https://user-images.githubusercontent.com/9695264/27948439-63c3fb00-632c-11e7-95ae-425fac8ffc81.jpeg)
    ](https://user-images.githubusercontent.com/9695264/27948439-63c3fb00-632c-11e7-95ae-425fac8ffc81.jpeg)
    
2.  第二轮的`diff`中，满足`sameVnode(oldStartVnode, newStartVnode)`，因此对这2个`vnode`进行`diff`，最后将`patch`打到`oldStartVnode`上，同时`oldStartVnode`和`newStartIndex`都向前移动一位  
    [![](https://user-images.githubusercontent.com/9695264/27948452-6c0acbf4-632c-11e7-85a9-d5cc9585d051.jpeg)
    ](https://user-images.githubusercontent.com/9695264/27948452-6c0acbf4-632c-11e7-85a9-d5cc9585d051.jpeg)
    
3.  第三轮的`diff`中，满足`sameVnode(oldEndVnode, newStartVnode)`，那么首先对`oldEndVnode`和`newStartVnode`进行`diff`，并对`oldEndVnode`进行`patch`，并完成`oldEndVnode`移位的操作，最后`newStartIndex`前移一位，`oldStartVnode`后移一位；  
    [![](https://user-images.githubusercontent.com/9695264/27948460-73c6d6da-632c-11e7-88f4-2887c72e740f.jpeg)
    ](https://user-images.githubusercontent.com/9695264/27948460-73c6d6da-632c-11e7-88f4-2887c72e740f.jpeg)
    
4.  第四轮的`diff`中，过程同步骤3；  
    [![](https://user-images.githubusercontent.com/9695264/27948473-7d83ab1c-632c-11e7-8eb7-c0d79e606355.jpeg)
    ](https://user-images.githubusercontent.com/9695264/27948473-7d83ab1c-632c-11e7-8eb7-c0d79e606355.jpeg)
    
5.  第五轮的`diff`中，同过程1；  
    [![](https://user-images.githubusercontent.com/9695264/27948477-84de867a-632c-11e7-9856-93202e96525f.jpeg)
    ](https://user-images.githubusercontent.com/9695264/27948477-84de867a-632c-11e7-9856-93202e96525f.jpeg)
    
6.  遍历的过程结束后，`newStartIdx > newEndIdx`，说明此时`oldCh`存在多余的节点，那么最后就需要将这些多余的节点删除。  
    [![](https://user-images.githubusercontent.com/9695264/27948481-89cf9b10-632c-11e7-8044-6fe70870fd43.jpg)
    ](https://user-images.githubusercontent.com/9695264/27948481-89cf9b10-632c-11e7-8044-6fe70870fd43.jpg)
    

在`vnode`不带`key`的情况下，每一轮的`diff`过程当中都是`起始`和`结束`节点进行比较，直到`oldCh`或者`newCh`被遍历完。而当为`vnode`引入`key`属性后，在每一轮的`diff`过程中，当`起始`和`结束`节点都没有找到`sameVnode`时，首先对`oldCh`中进行`key`值与索引的映射:

```js
if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
```

`createKeyToOldIdx`([src/core/vdom/patch.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js#L61-L69))方法，用以将`oldCh`中的`key`属性作为`键`，而对应的节点的索引作为`值`。然后再判断在`newStartVnode`的属性中是否有`key`，且是否在`oldKeyToIndx`中找到对应的节点。

1.  如果不存在这个`key`，那么就将这个`newStartVnode`作为新的节点创建且插入到原有的`root`的子节点中:

```js
if (isUndef(idxInOld)) { // New element
  // 创建新的dom节点
  // 插入到oldStartVnode.elm前面
  // 参见createElm方法
  createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
  newStartVnode = newCh[++newStartIdx]
} 
```

2.  如果存在这个`key`，那么就取出`oldCh`中的存在这个`key`的`vnode`，然后再进行`diff`的过程:

```js
elmToMove = oldCh[idxInOld]
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'production' && !elmToMove) {

// 将找到的key一致的oldVnode再和newStartVnode进行diff
if (sameVnode(elmToMove, newStartVnode)) {
  patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
  // 清空这个节点
  oldCh[idxInOld] = undefined
  // 移动node节点
  canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
  newStartVnode = newCh[++newStartIdx]
} else {
  // same key but different element. treat as new element
  // 创建新的dom节点
  createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
  newStartVnode = newCh[++newStartIdx]
}
```

通过以上分析，给`vdom`上添加`key`属性后，遍历`diff`的过程中，当`起始点`, `结束点`的`搜寻`及`diff`出现还是无法匹配的情况下时，就会用`key`来作为唯一标识，来进行`diff`，这样就可以提高`diff`效率。

带有`Key`属性的`vnode`的`diff`过程可见下图：

注意在第一轮的`diff`过后`oldCh`上的`B节点`被删除了，但是`newCh`上的`B节点`上`elm`属性保持对`oldCh`上`B节点`的`elm`引用。  