# 混合开发sdk的设计方案

# 混合开发H5和native交互及可扩展sdk的设计


# 混合开发是什么

混合开发是指开发Hybrid App，Hybrid App是一种将Native App和WebApp组合在一起的应用。

# 为什么要用混合开发

## 优点

- Hybrid开发效率高、跨平台
- 学习成本低
- Hybrid从业务开发上讲，没有版本问题，有BUG能及时修复

## 缺点

- 体验没有native好。

## 为什么不干脆用WebApp呢？

- WebApp开发和发布成本最低。
- 但是在移动端，运行在移动端浏览器里的WebApp体验并不好。
- 而且几乎每次打开WebApp都需要下载所有代码，好费流量。
- 无法调用手机原生的能力

# 开发前需要考虑的问题

> 开发前需要后台、IOS、安卓、前端要一起商量规划好的细节问题


## js怎么调用Native里的方法，Native怎么调用js里的方法

有两种方法：

- webview里通过Url Schema通知Native调用方法
   - Native监听Url Schema的变化，兼容性好，不存在等待webview加载的问题
- webview里直接调用Native注入的方法
   - 因为是注入的方法，有一个生命周期，可能会出现js代码已经都实例化完毕，而方法还没被注入的问题。

> Url Schema方法指在WebView里发起请求，这些请求都可以被Native拦截到，查看Url，并根据事先约定执行逻辑。


## 跳转

- Native跳H5
- H5跳Native
- H5跳H5（这里还要分内嵌的场景）
- H5新开Webview打开H5

## 跳转时的动画设计

## 要仔细管理history，以免出现死循环

## Header组件的设计

> header组件需用Native组件，因为：
> - 其它主流容器都是这么做的，比如微信、手机百度、携程
> - 没有header一旦网络出错出现白屏，APP将陷入假死状态，这是不可接受的，而一般的解决方案都太业务了


## 防止假死

- 使用Native的Header组件，就是为了防止假死
- 通过检测网络情况，webview里js代码执行情况，给Header的后退按钮注册不同的方法，来避免假死。

## webview里如何发请求

- webview打开在线站点时，用ajax发请求
- webview打开本地网站时
   - 调用native注入的方法发请求
   - 使用url schema，native监测到url schema，然后发请求，并执行js的回调

## 账号系统的设计

## webview和native如何同步登陆状态。

- 为简化逻辑，请求需要都通过native发出
- 登陆和登出，也需要通过调用统一的组件。

## 账号信息获取

## 增量机制：即在线更新混H5写的模块

1. 给每个模块一个版本号
1. app每次启动时军询问后台是否有更新
1. 有更新则下载新的资源完成更新

## NativeUI

- 可以封装一些非常通用的NativeUI以供调用

## 静态资源管理

> 因为开发时宿主环境是浏览器，上线后是webview，静态资源的位置可能会变化


- 静态资源都读取线上资源，Native可拦截webview请求，实现一些缓存的逻辑。

# SDK设计

## 需求

1. H5调用Native
1. Native通知H5执行回调
1. 能够注入方法
1. 封装后的api支持promise式调用

## 构思

1. H5调用Native时，用Url Schema还是直接调用Native注入的方法？

> 我们公司之前选择了注入，原因我也不知道。


2. Native暴露一个方法共H5调用，H5暴露一个方法共Native调用
2. 互相调用显然是异步的，于是需要**有一个机制来管理回调函数**

## 开始写

### 管理回调函数的机制

- 创建一个类，取名News Center.
- 在add方法中，可以看到回调函数有resolve, reject两个属性，而通常做法里回调函数仅仅是一个函数。这么做是为了支持promise

```javascript
class NewsCenter {
        constructor() {
            /* 存放callback */
            this.callBacks = {};
        }
        add(id, cb) {
            const { resolve, reject } = cb;
            const CALLBACKS = this.callBacks;
            CALLBACKS[id] = {
                resolve: (...params) => {
                    resolve(...params);
                    this._remove(id);
                },
                reject: (...params) => {
                    reject(...params);
                    this._remove(id);
                },
            };
        }
        get(id) {
            return this.callBacks[id];
        }
        _remove(id) {
            delete this.callBacks[id];
        }
    }
```

### hybrid类

1. IOS和安卓分别注入了函数**webkit.messageHandlers.jstouseoc.postMessage**和**android.sendCommond**
1. 将该函数封装一下，作为类的一个方法_sendCommand
1. 还要一个H5调用Native的方法取名为invokeNative
1. 还要一个Native调用H5的方法取名为informH5
1. 还要一个wrapAPI方法，参数是一个命名空间字符串和一个函数。

> 期待hybrid的使用方式：

```javascript
$.wrapAPI('music.play', param => {
        return $.invokeNative('paly', param)
   });
   $.music.play('some Param')
   .then(r => console.log('success', r))
   .catch(j => console.log('fail', j))
```

#### 看代码

- 在constructor中实例化NewsCenter，以供使用
- 在invokeNative方法中，返回了一个promise，并把resolve和reject添加到了newsCenter中。没有执行resolve或reject，promise将一直处于pending状态
- 又在informH5方法中取出保存在newsCenter里的resolve和reject，执行resolve或reject,使invokeNative方法中的promise被resolved或被rejected。这样就支持了promise风格的api

```javascript
function idGenerater() {
     return CALL_BACK_ID_PREFIX + Date.now()
}
 class Hybrid {
        constructor() {
            this.newsCenter = new NewsCenter();
            this.isInApp = brand !== OTHER_BRAND;
        }
        /* 向native发送命令 */
        _sendCommand(cmd, id, params) {
            if (brand === IPHONE) {
                window.webkit.messageHandlers.jstouseoc.postMessage({ cmd, id, params });
            } else if (brand === ANDROID) {
                android.sendCommond(cmd, id, params);
            } else if (brand === OTHER_BRAND) {
                /* 以下为测试代码 */
                console.log(`cmd:${cmd} \n id:${id} \n params:${params}`)
                setTimeout(() => {
                    this.informH5(id, JSON.stringify({
                        callbackType: 'fail',
                        data: 'okok123',
                        params
                    }))
                }, 2000)
            } else {
                throw 'Unkonwn platform isn\'t supported';
            }
        }
        /* h5调用native */
        invokeNative(method, params) {
            return new Promise((resolve, reject) => {
                const id = idGenerater();
                this._sendCommand(method, id, params)
                this.newsCenter.add(id, { resolve, reject });
            })
        }
        /* native通知h5执行回调 */
        informH5(id, content) {
            let rtn;
            try {
                rtn = JSON.parse(content);
            } catch (err) {
                console.warn(err)
            }
            const cb = this.newsCenter.get(id);
            if (cb == null) return;
            const { callbackType } = rtn;
            const { resolve, reject } = cb;
            if (callbackType === 'success') {
                resolve(rtn)
            } else {
                reject(rtn)
            }
        }
        /* 创建一个api */
        wrapAPI(nameSpace, wrapAPI) {
            const names = nameSpace.split('.');
            const fnName = names.pop();
            let result = this;
            while (1) {
                if (names.length === 0) break;
                let name = names.shift();
                if (result[name] == null) {
                    result[name] = {}
                }
                result = result[name]
            }
            if (result[fnName] != null) {
                throw `${nameSpace} has already been defined!`
            }
            result[fnName] = wrapAPI;
        }
    }
```

### UMD-通用模块规范

前端社区有好几种模块化方案，采用UMD的写法让代码能在各种环境中都能运行。
更多知识可以看[这里](https://github.com/umdjs/umd)

#### 原理

通过检测是否有特定的全局变量，来判断当前处于什么环境

```javascript
(function (root, factory) {
    /* AMD */
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    /* CMD */
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    /* 没有采用模块化，script标签引入 */
    } else {
        Object.assign(root, factory())
    }
}(typeof self !== 'undefined' ? self : this, function () {
    class NewsCenter {
        /* 省略 */
    }
    class Hybrid {
        /* 省略 */
    }
    /* 暴露hybrid实例和informH5方法到全局 */
    const $ = Hybrid = new Hybrid();
    const inform = $.informH5.bind($);
    /* 上面factory()返回的就是这个对象 */
    return {
        Hybrid,
        inform
    };
}));
```

### 总结

#### news center类

相比在hybrid类中用一个对象保存id和回调函数，为news center的逻辑创建一个类有很多好处

1. 高内聚低耦合
1. 代码更易读
1. 需求更改时需要被修改的代码更少
1. 例子中news center类在constructor中被实例化。稍加修改，在外部实例化，以参数形势传入constructor方法，便可实现依赖注入

#### 如何设置私有方法

js里无法直接设置私有方法，导致我们创建的hybrid类导出后每个方法都能被调用到。
如果不用ES6的类，可以这样做

```javascript
var hybrid = global.hybrid = {};
     var privateFunc = ()=>{};
     var publicFunc = ()=>{
          privateFunc()
     };
     hybrid.privateFunc = privateFunc;
```

使用ES6的类，方便许多。且私有方法和公用方法，视觉上就泾渭分明。

```javascript
var privateFunc = ()=>{};
class hybrid {
     publicFunc(){
          privateFunc();
     };
}
```

