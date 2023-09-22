本讲我们来学习 Dart 篇的第二个专题：空安全。

为什么单独把空安全拿出来讲呢？其中一方面原因是自 Dart 更新至 2.12 版本后，代码的类型默认都是非空的，除非特别声明。它将改变过去的编码方式，而这一点是在开发中无法避免的。另一方面，有了空安全，很多在运行时才暴露的问题则变为编译时错误。“帮助”我们避免了很多空判断的同时，极大地增强了程序的健壮性。

`💡 提示：Dart 2.12 发布于 2021 年初，目前的最新版本已具有空安全特性。`

总地来说，空安全的意义主要可归结为以下三点：

1.  **默认非空**：Dart 中的类型将分为两大类：非空和可空，**默认为非空**；
1.  **增强程序可靠性**：Dart 中的空安全机制值得开发者信赖，辅助开发者构建更加稳定的应用程序；
1.  **迁移灵活**：从旧版本迁移到支持空安全的新版本 Dart，可渐进迁移。即使项目中混有新、旧不同版本的代码也是允许的。

我们从第一点开始说起。

## 平行世界：非空类型 VS 可空类型

Dart 中的非空类型与可空类型好似成对生活在平行世界中一样，它们的关系如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4255a73f8cc8494580fc0ee722b30ca0~tplv-k3u1fbpfcp-zoom-1.image)

上图左侧都是若干非空类型，右侧则是若干可空类型，它们的唯一区别就是可空类型比非空类型的名字后面多了个问号（?）。

## 变量

相信很多人在实际开发中会下意识地使用左侧所列举的类型，比如下面这段代码：

```dart
void main() {
  String content = "Hello Dart!";
  print(content);
}
```

接下来，把 content 变量赋值为 null，试试会发生什么。

没错，出现了编译时错误，具体信息为：

> A value of type 'Null' can't be assigned to a variable of type 'String'.

也就是说：Null 类型的值无法赋值给 String。这一点对于掌握其它编程语言的同学来说太奇怪了，很多编程语言中明明是可以将某个变量赋值为 null 的。

这就是 Dart 在确保空安全上做出的“要求”：代码的类型默认都是**非空**的。如此，编译器可以在代码运行前检查出 null 风险，从而避免空指针异常。正如 Dart 官方文档中所述：“**除非你需要，否则你永远不会在运行时遇到空指针异常**”。要知道，未经妥善处理的空指针异常通常将导致程序崩溃，这对于和用户打交道的前端程序而言将会是灾难。

但有的时候，null 也并非一无是处，甚至可以为我们所用，处理一些特殊的场景。如果确实需要给某个变量赋值为 null，则在类型后面加上问号（?）就可以了。比如：

```dart
void main() {
  String? content = null;
  print(content);
}
```

由于可空的 content 变量在未赋值时，默认为 null，因此上面的代码还可进一步精简如下：

```dart
void main() {
  String? content;
  print(content);
}
```

接下来我们一起见证编译器的“聪明”时刻。

上面这段代码中，content 并未赋值，默认为 null。此时，如果尝试获取 content 的长度，会发生什么呢？

```dart
void main() {
  String? content;
  print(content.length);
}
```

如上代码所示，编译器会在`content.length` 处报错：

> The property 'length' can't be unconditionally accessed because the receiver can be 'null'.

我们都知道，null 是没有 length 属性的，既然 content 有可能是 null，那么直接获取 length 属性就是不允许的，所以代码编译不通过。如果是其它语言，恐怕只会在运行时发生崩溃了。

`💡 提示：对于 null，可用的操作只有 toString()、== 和 hashCode。`

接着，尝试为 content 赋值：

```dart
void main() {
  String? content = "Hello Dart!";
  print(content.length);
}
```

此时，代码可以运行吗？当然可以！输出结果是 11。

从本例中，我们可以得出一个结论：Dart 编译器可以在程序运行之前，根据代码逻辑判断某个变量**实际是否为 null**，甚至在多条件分支的情况下依然可以准确无误地判断。尽可能地规避空指针异常，可以说是非常“聪明”又“保险”了。

前面的示例让大家“浅尝”了空安全的编码方式和益处，对于变量，Dart 空安全特性有以下具体的要求：

**对于顶层变量和静态字段而言，非空类型要求必须完成初始化赋值**，比如：

```dart
String tag = "Test";
class TestClass {
  static int testLevel = 100;
}
```

代码中的 tag 和 testLevel 必须赋值，否则将出现编译时错误。

**类内的成员变量需要在构造函数执行前完成赋值**，比如：

```dart
class Demo {
  int code = 001;
  String userName;
  int demoId;

  Demo(this.userName, this.demoId);
}
```

显然，code 变量在声明时完成赋值，userName 和 demoId 则在构造函数中完成赋值。

**局部变量需要在使用前完成赋值**，比如：

```dart
void main() {
  bool en = false;
  String content;
  if (en) {
    content = "Hello Dart!";
  } else {
    content = "你好，Dart！";
  }
  print(content);
}
```

content 变量虽然没有在一开始赋值，但是随后通过分支结构赋值了，之后才使用。符合使用前完成赋值的要求，代码可以运行。

`❗️ 注意：务必确保 content 在使用前完成赋值。“聪明”的编译器会检查所有逻辑分支，只要有一条分支没有赋值，依然会报编译时错误。`

**可选参数必须指定默认值**，比如：

```dart
void makeTest(int testType, [String userName = "guest"]) {
  print("测试者：$userName");
}
```

userName 作为可选参数，类型为 String，是非空类型，必须给定默认值（此处为“guest”）。当然，出于产品需求考虑，若确实允许传入 null，则可如下实现：

```dart
void makeTest(int testType, [String? userName]) {
  if (userName != null) {
    print("测试者：$userName");
  } else {
    print("未指定测试者名称");
  }
}
```

除了 userName 的类型改为 String? 外，使用前别忘了判空。

讲完变量，再来介绍函数。

## 函数

说到函数，主要考虑的就是返回值。

Dart 是一门非常智能的编程语言，它智能到，即使本该有返回值的函数，忘记写 return 语句也没事的地步。在空安全诞生之前，下面的写法是没有任何问题的：

```dart
String getTestResult(int testId){

}
```

看上去很让人惊讶，因为 Dart 会**隐式返回 null**。

看到这，相信大家就察觉到问题了：引入空安全后，null 不能赋值给 String，因此这种写法就变的不可行了。

一种解决方法就是变 String 为 String?，null 可以赋值给可空类型。但仍会收到一个提示：提醒你忘记写 return 语句了；另一种解决方法就是老老实实地写 return 语句吧。我个人比较建议采用后者。

和变量赋值类似，如果函数中存在多分支，且返回值是非空类型，就一定要确保每条分支都能成功走到 return 语句，否则“聪明”的编译器就又会报错了。

## 避空运算符

我们都知道，在使用可空类型时，通常需要搭配非空判定。Dart 提供了避空运算符，简化了整个判空流程。我们首先来看传统的判空写法：

```dart
void main() {
  String? userName;
  if (userName == null) {
    print("null");
  } else {
    print(userName.length);
  }
}
```

传统判空需要6行代码完成。再来看看使用避空运算符（?.）后的代码：

```dart
void main() {
  String? userName;
  print(userName?.length);
}
```

显然，代码简化为 2 行，运行结果不变。是不是方便了很多？

Dart 语言有时很“懒”，但它的“懒”却方便了开发者。假如把上面的代码稍作修改如下：

```dart
void main() {
  String? userName;
  print(userName?.length.isOdd);
}
```

程序还能运行吗？

userName 是 null，使用避空运算符之后，`userName?.length` 的结果也是 null。null 没有 isOdd 属性，程序应该抛出异常了。

但实际运行后却发现并没有异常，控制台结果仍然输出 null。

这是因为：运行时`userName?.length` 已经是 null 了，后面就**直接跳过**了，所以不会发生异常。这就是 Dart“懒”的地方，而这种“懒”能为开发者省事儿，还能增强程序的可靠性。

## 类型匹配

本讲的最后，介绍 Dart 引入空安全后的另一个特性：类型匹配。

还是先来看一段简单的代码片段：

```dart
int getSize(Object object) {
  if (object is List) {
    return object.length;
  } else {
    return 0;
  }
}
```

这是一个名为 getSize() 的函数，当 object 的类型是 List 时，返回 length 属性；反之则返回 0。其目的就是当 object 是 List 时，返回长度。

接下来看实现上述目的的第二版本：

```dart
int getSize(Object object) {
  if (object is! List) return 0;
  return object.length;
}
```

仔细看第二个 return 语句，这里发生了匹配。开发者无需再判断 object 的类型，Dart 自动将 object 匹配为 List，简化了编码步骤。原先 6 行的代码瞬间变为 2 行。

值得注意的是判断条件表达式的写法，这里的逻辑是：当 object 不是 List 时，执行 `return 0`。object 是 List 时，则访问 length 属性。但如果稍作修改如下：

```dart
int getSize(Object object) {
  if (object is List) return 0;
  return object.length;
}
```

代码便会报错，无法运行。这里的逻辑是：当 object 是 List 时，执行 `return 0`。object 不是 List 时，访问 length 属性。天知道此时 object 还有没有 length 属性，不报错才怪呢。

## 小结

🎉 恭喜，您完成了本次课程的学习！

📌 以下是本次课程的重点内容总结：

本讲为大家介绍了两种在 Dart 中的空安全特性。

首先介绍了 Dart 中的两类类型：非空类型和可空类型。每种基本数据类型都能找到对应，它们就像是生活在平行时空中一般。为了使空安全特性发挥最大功效，我们最常使用的 int、String 等等都是非空类型。如果确实需要赋值或传递 null，再使用可空类型，并在使用前进行非空判定。

说到非空判定，不得不提及避空运算符。避空运算符简化了非空判定的编码，且用了一种“偷懒”的方式为连续的属性访问操作提供了空安全保障。

对于变量和函数，空安全特性给它们提出了几条严格的使用“规范”，大家一定要遵守。有些开发者，特别是从旧版本 Dart 迁移到新版本时，会有“懒汉”的心理，干脆都用可空类型算了。这其实是白白浪费了 Dart 提供的空安全特性，并使程序处于“不稳定”的状态。

和某些编程语言不同，Dart 默认采用非空的一系列类型，本质上并非提供在发生空指针异常时的“良药”，而是在运行前给程序一件“铁布衫”，力求彻底消灭空指针带来的异常。与其家中常备药，不如百毒不侵好身体。

➡️ 在下次课程中，我们就开始进入 Flutter 基础环节了。如果你对 Dart 部分还有疑惑，建议你赶快学习一下。后面就要开始 Flutter 框架的学习了，Dart 基础可一定要过关呀！