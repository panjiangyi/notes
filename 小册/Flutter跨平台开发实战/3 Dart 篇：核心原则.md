要开发 Flutter App，Dart 编程语言是个无法绕开的话题。本讲向大家介绍开发 Flutter App 的基础：Dart 编程语言。重点在于说明 Dart 的**基本原则**和**高效方法**，这两点是快速上手的“秘诀”。如果暂时看不懂也没关系，先有个“印象”，遇到相关内容的时候自然会豁然开朗了。

Dart 基础语法相关内容在官网上已经有很全面的讲解了，我就不多做展开讲了，在本讲的最后会放上 Dart 基础语法的学习链接；另一方面，本讲所述的“原则”，即是 Dart 的核心精髓。所以请大家务必先看完本讲，了解这些原则，再学基础语法就简单多了。

另外，对于异步（并发）和空安全，则是非常重要且不太易于理解的，需要额外注意。我会在接下来的两讲中做专题介绍。大家在学习本讲后，只要做到熟练掌握基础语法就行了。

以下几条原则在学习和使用 Dart 时要牢记在心，可以把它们看作是“道”而非“术”，正所谓“有道无术，术可求，有术无道，止于术。”（出自 老子《道德经》）

## 警告和错误

IntelliJ IDEA 是 Dart 语言的集成开发环境（IDE）。在使用时，通常会以**警告**和**错误**来提示代码中的问题。

-   警告意味着代码看上去有问题，但语法上又没什么破绽，**代码是可以运行起来的**；
-   错误就相对复杂一些，分为**编译时错误**和**运行时错误**。编译时错误很可能在语法层面就有问题，**代码无法运行**。运行时错误就是指那些**程序在运行时出现的各种异常**。

比如这段代码：

```dart
List testList = ["Alice", "Bob", "Cindy"];
print(testList[10]);
```

testList 中有三个元素，然后要取下标为 10 的元素（合法的下标值应该是 0 或 1 或 2）。这样的代码语法上没问题，也可以被编译。因此不会有任何警告和编译时错误，但显然**逻辑是错误的**。一旦运行，程序便会发生异常，出现运行时错误：

> Unhandled exception:
>
> RangeError (index): Invalid value: Not in inclusive range 0..2: 10
>
> #0 List.[] (dart:core-patch/growable_array.dart:264:36)
>
> #1 main (file:///C:/Users/wh199/Projects/juejin_dart/learn.dart:3:17)
>
> #2 delayEntrypointInvocation.<anonymous closure (dart:isolate-patch/isolate_patch.dart:297:19)\*
>
> #3 _RawReceivePortImpl.handleMessage (dart:isolate-patch/isolate_patch.dart:192:12)

如果把代码稍微改动一点，将 testList 中元素的类型限定为整数。由于后面的赋值都是字符串类型，所以类型不匹配。这种**明显的语法错误会在编译时被 IDE 检测出来**，默认会以波浪线的形式提示开发者，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd4dcd4c06ae4ceba6173b12cb051812~tplv-k3u1fbpfcp-zoom-1.image)

红框中的英文翻译过来意思就是：元素的类型是字符串，无法分配给整数类型的数组。

## 表达式 VS 语句

在某些编程语言中，模糊了表达式和语句的概念。但在 Dart 中，它们是不同的。**表达式会有明确的结果值，语句则没有**。听上去比较抽象，我们还是用例子来说明：

```dart
int timeInHour = 17;
print(timeInHour >= 12 ? "现在是下午" : "现在是上午");
```

大家注意看 print() 函数的内容，它的意思是先判断 timeInHour 是否大于 12，如果是的话就输出“现在是下午”，反之则输出“现在是上午”。这种有明确结果的就是表达式了。

但如果是这种：

```dart
if (timeInHour > 12) {}
```

if 分支语句之所以不算表达式，是因为它没有值，只是单纯地根据表达式（`timeInHour > 12`是表达式）的结果影响执行逻辑。

进而得出表达式与语句的关系：**一个语句可以包含一个或多个表达式，但一个表达式不能只包含一个语句**。

## 访问修饰符

访问修饰符又被称为访问限定符，如果你用过 Java 或 C++ 一定不会感到陌生。Dart 中也有访问修饰符，相对来说算是“简化版”。**使用下划线（“_”）开头修饰的类、成员、函数/方法等仅对本库中的其它代码可见；反之则不可见。**

这也就意味着，**为变量、类和函数/方法命名时，除了可以使用字母外，还可使用下划线（“_”）开头**。

限定可访问范围的一大原因是为了数据的安全性，它**确保了重要数据不被外部代码修改**。Dart 在传统的访问修饰符基础上做了简化，具体请看下图示意：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ce92ee0ce524b00a61c3fe7bd0a2492~tplv-k3u1fbpfcp-zoom-1.image)

左侧是程序入口，访问右侧 test.dart 源码中的变量、函数和类。显然，test.dart 中所有以下划线开头都无法在 main() 函数中访问。

因此，如果在 Dart 中进行访问限定，使用下划线来控制就行了，非常容易。

## 一切皆对象

在 Dart 中，**一切数据类型均继承自 Object（类）** ，即使是一个数字、函数/方法还是 null。**所有变量引用的都是对象，每个对象都是一个类的实例**。

## 自由的强类型

“自由”和“强”类型，这二者看上去是一对矛盾体，我们如何理解它们呢？

Dart 从 2.0 版本开始，就是一门**强类型**语言了，但**仍具有类型推断能力**。

举例来说，下面是显式变量声明的代码片段：

```dart
String testValue = "Hello";
```

它也可以写成：

```dart
var testValue = "Hello";
```

这两种写法中，testValue 都是 String 类型。这样的语法提供了编码上的灵活性，但是，也隐含着危险。大家来看下面这段代码：

```dart
var testArr = [];
testArr.add("Hello");
testArr.add(123);
testArr.add(false);
for (int i = 0; i < testArr.length; i++) {
  print(testArr[i] + 300);
}                                 
```

由于 testArr 在声明时并没有严格要求其类型，所以可以向其中添加任何类型的元素。而在稍后的 for 循环中，直接将元素当作数值类型做算术运算将导致程序崩溃。

实际上，**Dart 本身是一门类型安全的编程语言。它使用静态类型检查和运行时检查的组合来保证类型是匹配的**，只是由于类型推断特性的存在，才导致上述问题的发生。

静态类型检查在编译期间就会发现问题了，比如下面这段代码：

```dart
var testStr = "Hello";
print(testStr + 300);
```

这段代码根本无法运行，因为编译器会将 testStr 视为 String类型，String 类型无法做算术运算，因此编译不通过。

为什么编译器能正确推断 testStr 的类型，却不能正确推断 testArr 中元素的类型呢？实际上，testArr 将被推断为 List<dynamic> 类型。**dynamic 就是 Dart 中的“动态数据类型”，是在运行时才会“知道”确切类型的一种特殊类型，所以在编译期间的类型检查对 dynamic 是失效的。**

若要规避类型不匹配而引起的崩溃，我有两种解决办法：一是在使用前做类型判断，不同类型进行各自相应的计算逻辑；二是在声明时就明确给定类型，不同的类型放在不同的 List 中。

综上，**一个良好的编程习惯仍然是明确地指明变量类型**。这样不仅能增强代码的可读性，使程序更加“健壮”，而且能更方便地让代码审查工具分析代码。

## 前端 VS 后端

虽然开发 Flutter App 的基础是 Dart，但若抛开 Flutter 框架，**Dart 还可用来开发服务器软件**，这一切得益于灵活的编译器技术。

-   Dart Native：针对目标设备平台进行的开发，比如移动设备、PC、服务器等等。**Dart Native 包括 JIT（Just In Time） 和 AOT（Ahead Of Time） 编译方式**。前者是热修复的实现基础，多用于开发阶段；后者为程序的全速运行提供保障，多用于产品发布；
-   Dart Web：针对 Web 页的应用开发，**包括 dartevc 编译器和 dart2js 编译器**。前者被称为开发时编译器，后者被称为生产时编译器。

## 空安全

Dart 编程语言从 2.12 版本开始，引入了“空安全”的概念。**只要某个变量未声明为可空时，默认都不能为空（null）** 。这一模式极大规避了运行时的空指针异常。有关空安全的用法，我们将在之后的空安全专题中详细介绍。

## 命名规则

在 Dart 中，建议大家使用以下三种命名方式应对各种场景：

-   **大驼峰式命名法**：每个单词的首字母都大写。如：MainPage、PrefsUtil；
-   **小驼峰式命名法**：第一个字母小写，后面每个单词的首字母大写。如：serialNumber、age；
-   **小写+下划线式命名法**：每个单词都是小写字母，单词之间使用下划线（“_”）连接。如：database_util、shared_pref_util。

那么，什么时候用何种类型呢？

-   定义**类名**、**枚举类型**、**类型定义**、**类型参数**、**扩展**时使用**大驼峰式命名法**；
-   定义**类内成员**、**顶级定义**、**变量**、**参数/命名参数**、**常量**都是用**小驼峰式命名法**；
-   定义**库名**、**包名**、**目录名**、**代码源文件名**时使用**小写+下划线式命名法**。

另外，**对于超过两个字母的缩略词（如：HTTP、FTP）当作一般单词来对待（即：Http或http、Ftp或ftp）** 。

在使用导入（import）和导出（export）语句时，建议的顺序如下：

```dart
import 'dart:xxx';
import 'package:xxx';
import 'xxx';
    
export 'xxx'
```

在导入时，首先导入的是以“dart:”开头的，然后才是以“package:”开头的，最后才是项目相关的。

导入和导出的整体编码顺序是**所有导入在前，导出随其后，每个部分按字母顺序排序**。

## 小结

🎉 恭喜，您完成了本次课程的学习！

📌 以下是本次课程的重点内容总结：

本讲主要介绍了使用 Dart 编程语言的**基本概念和原则**，这些内容都是基于 Dart 语言本身的特性和最佳实践总结而来的，在日常开发中都要遵循。在学习时需要搭配官网提供的 [Dart 编程语言概览](https://dart.cn/samples) 一起使用。在学完本讲后再阅读官网的文档，会比一上来就硬啃语法要轻松得多。

完成所有学习后，请**尝试使用 Dart 语言完成一些编程练习**。比如：冒泡排序、九九乘法表，以及使用面向对象的思想实现人员信息管理等等。

Dart 之于 Flutter，犹如地基之于高楼。Dart 基础掌握好，才能更高效地使用 Flutter 框架构建优秀的产品。

➡️ 在下次课程中，我们会深入介绍 Dart 编程语言中异步的知识。