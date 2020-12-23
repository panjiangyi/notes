重点写在前面：

> 我们并不知道我们写下的函数和方法是否被框架赋值过或显示绑定过而改变了this指向。以至this指向更加扑朔迷离。
# this 到底指向哪里
> 以下如果没提及，则为严格模式。

js中作用域有两种:
1. 词法作用域
2. 动态作用域
## 词法作用域
词法作用域指在书写代码时就被确定的作用域。
看如下代码
```js
    var value = 1;

    function foo() {
        console.log(value);
    }

    function bar() {
        var value = 2;
        foo();
    }

    bar();// 结果是1
```
## 动态作用域
动态作用域指在代码运行时才被确定的作用域。
js中**只有this的作用域是动态作用域**
# this的五种绑定
初学js时，会想当然认为this遵循某一条规律，就像物理学那样，然而并不是。
this的绑定分为五种情况，这五种情况之间毫无规律可言。不过好在都很简单。
## 一. 默认绑定
当以如下形式执行一个函数时，this为默认绑定；
```js
    func()
```
- 严格模式下，this为undefined
- 非严格模式下，this是全局对象。

与函数调用嵌套多少层如何嵌套无关
```js
/* 全是undefined */
function printThis(){
    return this
}
var obj = {
    say(){
        console.log('obj.say',printThis())
    }
}
function funcB(){
    console.log('funcB',printThis());
    obj.say();
}
console.log('funcA',printThis())
obj.say()
funcB()
```
## 二. 隐式绑定
当以如下行驶执行一个函数时，this为隐式绑定；
```js
a.b.func()
```
此时this指向**点**前面一个对象
### 赋值会改变隐式绑定this的指向
- 方法赋值给变量
```js
class T {
    dotInvoke() {
        console.log('dotInvoke', this.sayThis())
    }
    sayThis() {
        return this
    }
    assignInvoke() {
        var sayThis = this.sayThis;
        console.log('assignInvoke', sayThis())
    }
}
var tt = new T();
tt.dotInvoke()// 指向T
tt.assignInvoke()// undefined
```
- 函数被赋值成方法
```js
function printThis(){
    return this
}
var obj = {};
obj.say = printThis;
obj.say()/* 指向obj */
```
- 赋值给参数
极为常见的是回调函数的this是undefined，因为回调函数被复制给参数，参数再调用时变成了默认绑定
```js
function asyncFun(cb){
    cb()
}
var obj = {
    callback(){
        console.log(this)
    }
}
obj.callback()/*隐式绑定 obj */
asyncFun(obj.callback);/*默认绑定 undefined */
```
## 三. 箭头函数
箭头函数会让this指向最近的函数或全局作用域
- 与最近的函数的this指向相同
```js 
    function foo() {
        // 返回一个箭头函数
        return (a)=>{
            //this 继承自 foo()
            return this.a
        }
        ;
    }
    var obj1 = {
        a: 'obj1'
    };
    var obj2 = {
        a: 'obj2'
    }
    var arrow1 = foo.call(obj1);
    var arrow2 = foo.call(obj2);
    var arrow3 = foo();
    console.log('arrow1',arrow1())/* obj1 */
    console.log('arrow2',arrow2())/* obj2 */
    console.log('arrow3',arrow3())/* undefined,严格模式下报错 */
```
- 指向全局
```js
var printThis = ()=>this;
console.log('printThis',printThis());/* global */
```
- 指向实例
```js
class Test {
    printThis = ()=>{
        return this
    }
}
//会被babel翻译成
var test = function test() {
  var _this = this;

  this.printThis = function () {
    return _this;
  };
};
```
## 四. 显示绑定
call, apply, bind指定this指向
## 五. new绑定
> 构造函数，ES6中的class
new构造函数，new class时，this指向实例

# 总结
1. 五种绑定，后面两种情况单一，前面两种会因为方法，函数被赋值而互相转化。
2. 因为this处于动态作用域，而目前开发时又大量使用框架。我们写下的代码，并不总是由我们自己调用，而是被打包工具打包后，由框架调用。**导致我们并不知道我们写下的函数和方法是否被框架赋值过或显示绑定过而改变了this指向**。以至this指向更加扑朔迷离。
3. 写完本文顿时觉得，python里指向明确的self完爆js的this。