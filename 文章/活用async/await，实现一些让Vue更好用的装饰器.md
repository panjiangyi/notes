Async/await加上装饰器，会产生神奇的效果。

以下所列几个装饰器，都要求被装饰的方法写成async/await，

这样就可以利用async/await本身的特性，从方法外部得知**异步**方法是否运行完成。

于是便实现了将繁杂和麻烦的逻辑隐藏在装饰器内部，使业务代码更加干净。

以下装饰器除了最后一个都是用在Typescript环境下的class写法的vue里的。

最后一个其实并不是装饰器，而是一个高阶函数，但是众所周知，装饰器本质上就是个高阶函数。

所以所有装饰器都可以很容易的改成高阶函数，然后用在js环境的vue里。

# 给vue添加一个指示初始化完成的变量。

1. 使用场景举例：

   搜索页面：搜索中显示loading，结果为空时显示暂无数据。

   第一次打开页面时，在created或者mounted中发出请求，进行初始化的搜索，此时搜索还没完成，显示暂无数据并不合适。
   这个时候就需要一个变量来判断页面是不是第一次打开。

2. 代码解释：

   通过装饰器添加这个属性（pageIsReady）到组件的类上，

   并包装vue的created, mounted和beforeDestroy方法，监控组件的生命周期。
   当created或者mounted里发出的请求完成后，就把pageIsReady设为true。
   然后在beforeDestroy中重置状态，因为装饰器用了闭包，只会实例化一次。

```ts
import { Constructor } from "vue/types/options";
export type WrapReadyProperty<T> = T & {
    pageIsReady?: boolean;
    createdDone?: boolean;
    mountedDone?: boolean
}
/**  
 * 在@compontent 之后使用这个装饰器，
 * 组件就会被注入属性 pageIsReady，
 * 当created和mounted都执行完成时 pageIsReady 变成true，
 * 要求mounted或created是async/await。(取决于在哪个方法中发请求初始化组件)
 * 然后可以在template中直接使用。
 * 在script中使用调用isPageReady.call(this)方法；
    */
export default function PageReadyStatus() {
    return function pageReadyEnhancement<T extends WrapReadyProperty<Constructor>>(target: T) {
        const oldMounted = target.prototype.mounted || function() { }
        const oldCreated = target.prototype.created || function() { }
        const oldBeforeDestroy = target.prototype.beforeDestroy || function() { }
        target.prototype.pageIsReady = false;
        function isCreatedMountedAllDone(this: T) {
            return !!this.createdDone && !!this.mountedDone;
        }
        target.prototype.created = async function(...params: any[]) {
            await oldCreated.apply(this, params);
            this.createdDone = true;
            this.pageIsReady = isCreatedMountedAllDone.call(this)
        }
        target.prototype.mounted = async function(...params: any[]) {
            await oldMounted.apply(this, params);
            this.mountedDone = true
            this.pageIsReady = isCreatedMountedAllDone.call(this)
        }
        target.prototype.beforeDestroy = async function(...params: any[]) {
            await oldBeforeDestroy.apply(this, params);
            this.createdDone = false;
            this.mountedDone = true
            this.pageIsReady = false;
        }
        return target
    };
}

export function isPageReady(this: WrapReadyProperty<Vue>) {
    return this.pageIsReady
}

```
# 给事件回调函数和按钮Dom添加防抖与loading样式

1. 使用场景举例：

   点击一个按钮，触发一个函数，并发出一个请求。此时需要给这个函数防抖，并给按钮增加一个loading的样式

2. 代码解释

   利用async/await把异步变成同步的特性，在装饰器中发现方法还没执行完成时直接返回。

   并从时间对象中拿到按钮的dom节点，改变按钮的样式。我这里是用了一个cursor:wait;

```ts
/*
 * 请保证被包装的方法的参数列表最后一个是点击事件的参数
 */
export default function buttonThrottle() {
    let pending = false;
    return function(target: any, name: string): any {
        const btnClickFunc = target[name];
        const newFunc = async function(this: Vue, ...params: any[]) {
            if (pending) {
                return;
            }
            const event:Event = params[params.length - 1];
            let btn = event.target as HTMLElement
            pending = true;
            const recoverCursor = changeCursor(btn);
            try {
                await btnClickFunc.apply(this, params);
            } catch (error) {
                console.error(error);
            }
            recoverCursor();
            pending = false;
        };
        target[name] = newFunc;
        return target;
    };
}
function changeCursor(btn?: HTMLElement) {
    if (btn == null) {
        return () => {};
    }
    const oldCursor = btn.style.cursor;
    btn.style.cursor = "wait";
    return () => {
        btn.style.cursor = oldCursor;
    };
}

```
3. 用法:
   在点击事件函数上使用这个装饰器.

```ts
    import { Component, Vue } from "vue-property-decorator";
    import buttonThrottle from "@/ui/view/utils/buttonThrottle";


    type Member = { account_no: string; name: string; warn?: string };
    @Component({ components: {} })
    export default class AddMemberInput extends Vue {
    @buttonThrottle()
    private async confirmAdd() {
        await this.addMembers(this.getVaildMembers());
        }    
    }
```
# 注入loading变量

1. 场景

   发请求时在页面上加一个loading的状态，比如element-ui里就有一个v-loading的指令。

   这个指令需要一个是否在loading中的变量

2. 代码解释

   往组件上增加一个变量，变量名由参数variableName指定

   该变量会在被包装的方法执行期间为true

   这样就不用自己写this.loading=true this.loading=false了

```ts
 export default function FunctionLoadingVariable(variableName: string) {
       return function(target: any, name: string): any {
           target[variableName] = false;
           const btnClickFunc = target[name];
           const newFunc = async function(this: Vue & {
               [key: string]: boolean
           }, ...params: any[]) {
               try {
                   this[variableName] = true
                   await btnClickFunc.apply(this, params);
               } catch (error) {
                   console.error(error);
               }
               this[variableName] = false
           };
           target[name] = newFunc;
           return target;
       };
   }
  
```

   

# mounted之前显示白屏

1. 场景

   页面加载的过程很丑，所以可以在mouted之前显示白屏，或者弄一个骨架屏。

   特别是在微信小程序中，因为加载完成之前特别丑，所以几乎所有小程序都会在mounted之前白屏。

2. 通过async/await获得mounted或者created是否执行完成
   再通过指向vue实力的this拿到组件根节点，然后按需修改它
   以下代码只是将组件隐藏了，实际上可以写更复杂的逻辑，在加载过程中显示其他内容，毕竟拿到了Dom，想干嘛就干嘛。

```js
  function firstPaintControl(vueObj) {
    let oldMounted = vueObj.mounted || function() {};
    vueObj.mounted = async function(...params) {
      this.$el.style.visibility = 'hidden';
      await oldMounted.apply(this, params);
      this.$el.style.visibility = 'visible';
    };
    return vueObj;
  }
```