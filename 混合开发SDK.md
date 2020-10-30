# 混合开发SDK

```javascript
/*
 * 1. 注入方法
 * 2. H5调用native:
 * 3. native通知H5: 
 */
/* 
 * Usage
 * 注册一个native的功能:Hybrid.wrapAPI('ns.someApi',someFunction);
 * 使用一个native的功能：Hybrid.ns.someApi(someParams);
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        Object.assign(root, factory())
    }
}(typeof self !== 'undefined' ? self : this, function () {
    function eacapeJsonStr(str) {
        return str.replace(/\\/gm, "\\\\")
            .replace(/[\b]/gm, "\\b")
            .replace(/\f/gm, "\\f")
            .replace(/\n/gm, "\\n")
            .replace(/\r/gm, "\\r")
            .replace(/\t/gm, "\\t")
            .replace(/"/gm, "\\\"");
    }
    function deviceBrand() {
        if (typeof navigator === 'undefined') {
            return OTHER_BRAND;
        }
        let deviceInfo = navigator.userAgent.toLowerCase();
        if (deviceInfo.indexOf(IPHONE) !== -1) {
            return IPHONE;
        } else if (deviceInfo.indexOf(ANDROID) !== -1) {
            return ANDROID;
        } else {
            return OTHER_BRAND;
        }
    }
    function idGenerater() {
        return CALL_BACK_ID_PREFIX + Date.now()
    }
    const IPHONE = 'iphone';
    const ANDROID = 'android';
    const OTHER_BRAND = 'unkonwn';
    const CALL_BACK_ID_PREFIX = '__T_'
    const brand = deviceBrand();
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
    /* 暴露hybrid实例和informH5方法到全局 */
    const $ = Hybrid = new Hybrid();
    const inform = $.informH5.bind($);
    return {
        Hybrid,
        inform
    };
}));
// const $ = this.Hybrid;
// $.wrapAPI('music.play', param => {
//     return $.invokeNative('paly', param)
// });
// $.music.play('some Param')
//     .then(r => console.log('success', r))
//     .catch(j => console.log('fail', j))
```
