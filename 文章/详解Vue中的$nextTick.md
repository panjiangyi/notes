当在代码中更新了数据，并希望等到对应的Dom更新之后，再执行一些逻辑。这时，我们就会用到$nextTick
```js
funcion callback(){
 //等待Dom更新，然后搞点事。
}
$nextTick(callback)；
```

官方文档对nextTick的解释是：
> 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
>

那么，Vue是如何做的这一点的，是不是在调用修改Dom的Api之后（appendChild, textContent = "xxxxx" 诸如此类），调用了我们的回调函数？
实际上发生了什么呢。

## 源码
nextTick的实现逻辑在这个文件里：
>vue/src/core/util/next-tick.js
>

我们调用的this.$nextTick实际上是这个方法:

```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

```
可以看到

1. 回调函数被存放到了一个数组里:callbacks。
2. 如果没有传递回调函数，这个方法会返回一个Promise，然后吧reslove当成回调函数放到flushCallbacks中。所以文档解释了把本该当成回调函数的callbacks放到then里的用法。
3. 然后，有一个变量叫pending，如果不在pending中，则执行函数timerFunc。而且pending默认等于false。
4. flushCallbacks这个函数会一口气执行所有回调函数。


### timerFunc

timerFunc定义在这里

可以看到timerFunc是在一个已resolve了的Promise的then 中执行了flushCallbacks.

**利用了js事件循环的微任务的机制**

所以，每当我们调用$nextTick，如果pending为false，就会调用timerFunc,然后timerFunc会把flushCallbacks给塞到事件循环的队尾，等待被调用。

```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
}
```


### flushCallbacks
然后在这个文件里还有一个函数叫：flushCallbacks
用来把保存的回调函数给全执行并清空。

```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

### pending

什么时候pending为true呢？

从timerFunc被调用到flushCallbacks被调用期间pending为true

即一个事件循环周期

在pending期间加入的回调函数，会被已经等待执行的flushCallbacks函数给执行。


### 核心机制

看完源码，发现除了利用了一个微任务的机制，和Dom更新一点关系都没有哇。

其实调用nextTick的不仅是开发者，Vue更新Dom时，也用到了nextTick。

开发者更新绑定的数据之后，Vue就会立刻调用nextTick，把更新Dom的回调函数作为微任务塞到事件循环里去。

于是，在微任务队列中，开发者调用的nextTick的回调函数，就一定在更行Dom的回调函数之后执行了。

但是问题又来了，根据浏览器的渲染机制，渲染线程是在微任务执行完成之后运行的。渲染线程没运行，怎么拿到Dom呢？

因为，渲染线程只是把Dom树渲染成UI而已，Vue更新Dom之后，在Dom树里，新的Dom节点已经存在了，js线程就已经可以拿到新的Dom了。除非开发者读取Dom的计算属性，触发了强制重流渲染线程才会打断js线程。

## 总结
1. 首先timerFunc函数负责把回调函数们都丢到事件循环的队尾
2. 然后，nextTick函数负责把回调函数们都保存起来。
3. 调用nextTick函数时会调用timerFunc函数
4. Vue更新Dom也会使用nextTick，而且在开发者调用nextTick之前。
5. 因为4中的先后关系和事件循环的队列性质，确保了开发者的nextTick的回调一定在Dom更新之后