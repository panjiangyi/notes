开发前端或客户端应用程序，**异步可以使程序在后台完成耗时的工作**，前台保持与用户的互动，从而保证程序的可用性。

举例来说，下载文件通常是一个需要持续几秒甚至几小时的任务。如果程序是单线程的，就意味着同时只能执行一个操作。这将导致用户不得不等待下载任务结束，再进行互动。想想都是一个灾难，所以基本上没有程序是这样的。

使用异步的另一个场景就是执行并行任务。现在的 CPU/SoC 基本都是多核心的，**并行可以把不同任务分配给不同的核心，从而提高程序的整体运行效率**。

还是用下载文件来举例，在没有使用并发前，如果使用一个线程来处理一个下载任务，其他的下载任务只能等待其完成再开始。如果单个文件下载速度不足以跑满带宽，就白白浪费了资源，花费了多余的时间。如果使用了并发，多个文件同时下载，则可以更充分地使用带宽资源，尽可能地缩短下载时间。

综上，使用异步（并发）可以获得两方面收益：

1.  **保持 UI 随时可用；**
1.  **提高程序性能。**

在 Dart 中，有两种开启异步的方式，本讲会对它们进行详细介绍，我们先从较为简单的一种说起。

## async + await 与 Future/Stream 组合

这种方法的实现较为简单，却可以说是实际开发中最常用的一种开启异步的方式。

先来看这样一段代码：

```dart
void main() {
  print("程序运行开始");
  methodOne();
  print("main运行结束");
}

methodOne() {
  print("methodOneStart");
  methodTwo();
  print("等待3秒开始");
  sleep(Duration(seconds: 3));
  print("等待3秒结束");
  print("methodOneEnd");
}

methodTwo() {
  print("methodTwoStart");
  print("methodTwoEnd");
}
```

这段代码简单得很，main() 作为入口函数首先得到执行，然后调用了 methodOne() 函数，在该函数中，又调用了 methodTwo() 函数。代码是逐行运行的，因此最终程序将在控制台输出如下内容：

> 程序运行开始
>
> methodOneStart
>
> methodTwoStart
>
> methodTwoEnd
>
> 等待3秒开始
>
> 等待3秒结束
>
> methodOneEnd
>
> main运行结束

`💡 提示：此处涉及“函数”的知识，看不懂的同学请自行学习 Dart 基础语法中相关的内容。`

显然，methodOne() 函数在执行耗时较长的工作，为了确保 main() 函数不受其影响，使用 async + await 组合来修改 methodOne()，具体如下：

```dart
void main() {
  print("程序运行开始");
  methodOne();
  print("main运行结束");
}

Future<void> methodOne() async{
  print("methodOneStart");
  await methodTwo();
  print("等待3秒开始");
  sleep(Duration(seconds: 3));
  print("等待3秒结束");
  print("methodOneEnd");
}

methodTwo() {
  print("methodTwoStart");
  print("methodTwoEnd");
}
```

再次运行之后，控制台的输出结果将变为：

> 程序运行开始
>
> methodOneStart
>
> methodTwoStart
>
> methodTwoEnd
>
> main运行结束
>
> 等待3秒开始
>
> 等待3秒结束
>
> methodOneEnd

可以看到，3 秒等待并没有干扰 main() 函数的执行，它们看上去各自独立，目的达成了。这到底是怎么一回事呢？这就需要详细的执行过程分析了。

首先，methodOne() **函数名用 async 作为后缀， 它的返回值将是 Future 类型**。示例中无需具体的返回值，因此该函数的返回值类型为 Future<void> 或省略不写。当然，如果最终返回 String，则变为 Future<String>，以此类推。

Future 和 Stream 是两类返回类型，前者通常返回一个值，后者则是一系列值，即流。在调用异步方法处可从中取出返回的值，这里就不再展开详述了。

接着，在调用 methodTwo() 时，**使用了 await 关键字。这表示其后续的代码将暂停执行**，直到 methodTwo() 完全执行结束。**await 和 async 必须成对使用才能实现异步**，只有 await ，将出现编译时错误；只有 async， 则仍会顺序执行所有代码。

最后，main() 函数一看，发现异步开始了，无需等待 methodOne() 运行结束，就索性继续执行剩下的语句，所以我们会先看到“main运行结束”的字样。此时，methodOne() 函数还没结束，于是它将继续运行，直到完全结束后，程序彻底退出。

在 Flutter App 中，main() 就对应 UI 互动线程，methodOne() 则对应耗时较长的任务。如果不使用异步，UI 线程就会被卡住，造成程序“假死”。这种“假死”会一直持续，直到 methodOne() 执行完成。

这类耗时的场景通常对应的任务包括：网络请求、数据上传/下载、本地数据库的 CRUD、本地文件的读写、GPS 位置的获取、蓝牙设备的搜索与连接等等。总之，可能发生阻塞的操作，理论上都需要开启异步来完成，用处非常广泛。

异步操作还通常和表示“正在加载”的 UI 组件联合使用，告知用户该步骤需要一点时间来完成。并在必要的时候遮挡其它 UI 组件，使其无法互动。比如在支付期间，用户必须等待交易完成或失败的结果。否则将会有重复提交造成重复支付的风险。

这种简单的异步处理其实已经能满足大部分的需求场景了，但总有一些情况是这种简便方法无法应付的。那就是**数据“竞争**”状况。Dart 语言为了规避该问题引入了 isolate 机制，这种机制能彻底根治数据“竞争”问题。那么，数据“竞争”问题是如何发生的，isolate 又是怎样规避该问题的呢？

## isolate 原理概述

“isolate”直译是“隔离”，开发过大型软件系统的同学对“锁”的概念不会陌生。简单地说，如果多个异步任务同时操作同一个对象，则**有可能发生数据“竞争”** ，导致一些奇怪的问题发生。

比如，一个银行账户，总共 5000 元。一个人在柜台取 3000，另一个人也取 3000。如果恰好它们的操作是在同一时刻进行，基数都会是 5000，他们都能顺利地把钱取走。等操作都完成后，储户的余额就会变为 -1000，银行就该哭了。

所以，一种比较好的处理方式就是给数据加“锁”，在同一时刻仅允许一个人取钱，更新完余额之后，另一个人才允许继续取钱，这就规避了数据“竞争”的问题。

看上去很好理解，但要实现“锁”可不是件容易的事。**既然不容易，那索性也就不要想它了，因为 Dart 有 isolate。**

Dart 中的 isolate，相当于“线程”，但它们之间是“**隔离**”的，拥有各自的堆内存，这样做的好处就是**数据互不影响（但仍可相互通信）** ，可以说是将数据“竞争”问题直接扼杀在摇篮中。

另一方面，async + await 就能实现异步了，但在数据层面仍然是共享的，无法规避“竞争”问题，这也是 isolate 诞生和使用的重要原因。

每个 isolate 内部都有一个“事件循环（Event Loop）”，调度执行“事件队列（Event Queue）”中的每个任务，直到完成全部任务，isolate 就退出了。期间，开发者可以动态编辑“事件队列”中的任务，进行灵活调度 **。一个 Dart 程序启动后，就开启了一个“主” isolate。开发者可以创建自定义的 isolate，实现任务并行。**

## 实战 isolate

我们还是直接上代码，从代码中分析程序的执行过程：

```dart
void main() {
  print("程序运行开始");
  doSomethingInBackground();
  print("main运行结束");
}

doSomethingInBackground() async {
  String result = await doSomething();
  print(result);
}

Future<String> doSomething() async {
  final port = ReceivePort();
  await Isolate.spawn(longTimeJob, port.sendPort);
  return await port.first;
}

void longTimeJob(SendPort port) {
  sleep(Duration(seconds: 3));
  Isolate.exit(port, "3 seconds passed");
}
```

main() 函数中调用了 doSomethingInBackground() 函数，该函数是异步执行的，其中调用了 doSomething() 函数。

在 doSomething() 函数中，有个名为 ReceivePort() 的函数。该函数将返回 ReceivePort 实例，赋值给 port 变量。它将作为主 isolate 与自定义 isolate 之间**传递数据的“管道”** 。

紧接着，`isolate.spawn()` 真正创建了自定义 isolate。并向其中传入了两个参数：第一个参数是**函数引用**，即这个 isolate 要执行的具体任务；第二个是**传送数据的“管道”** ，此处使用 `port.sendPort`，便于主 isolate 接收结果。

最后，通过 `port.first` 的值来**接收**从自定义 isolate 中传出的数据。

再来看 longTimeJob() 函数，该函数需要 SendPort 类型值作为参数，在延迟 3 秒后，调用 `isolate.exit()`，指定使用的数据“管道”，并将结果（字符串）传递出去，然后终止 isolate。

看到这，相信大家已经能猜到运行结果了吧？

> 程序运行开始
>
> main运行结束
>
> 3 seconds passed

大家注意看 `Isolate.spawn()` 中的参数和 longTimeJob() 函数声明，发现什么规律吗？

对了！**前者的两个参数正好对应后者的函数名和参数值**。我们便可利用此规律向自定义 isolate 中传入参数，具体代码修改如下：

```dart
void main() {
  print("程序运行开始");
  doSomethingInBackground(3);
  doSomethingInBackground(5);
  print("main运行结束");
}

doSomethingInBackground(int seconds) async {
  String result = await doSomething(seconds);
  print(result);
}

Future<String> doSomething(int seconds) async {
  final port = ReceivePort();
  await Isolate.spawn(longTimeJob, [port.sendPort, seconds]);
  return await port.first;
}

void longTimeJob(List data) {
  sleep(Duration(seconds: data[1]));
  Isolate.exit(data[0], "${data[1]} seconds passed");
}
```

再次运行，控制台将输出：

> 程序运行开始
>
> main运行结束
>
> 3 seconds passed
>
> 5 seconds passed

请大家体会程序在输出结果时的表现，两个自定义 isolate 同时运行，一个先结束（3 秒），另一个稍后结束（5 秒）。
    
## 小结

🎉 恭喜，您完成了本次课程的学习！

📌 以下是本次课程的重点内容总结：

本讲为大家介绍了两种在 Dart 中开启异步的方法。

一个 Dart 程序启动后，便有了一个主 isolate，即主线程。对于大部分需要异步的任务，使用 async + await 这套组合拳都能应付。它虽然运行在单线程，但借助协程，实现了多线程的效果。易于编码，运行效率也比较高。

而对于容易发生数据“竞争”的场景，Dart 提供了自定义 isolate 的 API。isolate 的直译是“隔离”，与 async + await 相比，isolate 最大的区别就是拥有各自的堆内存，数据之间互相隔离，互不打扰。但这种方式将带来更多的内存消耗（每次创建要消耗大约 2MB 的空间），大量的 isolate 将可能导致内存溢出。此外，在不同 isolate 之间传递数据会发生深拷贝，也是相对更加耗时的操作，可能会造成 UI 卡顿。

**因此，在实际开发中，优先考虑使用 async + await。如确实有必要，再使用 isolate。**

➡️ 在下次课程中，我们会深入介绍 Dart 编程语言中空安全的知识。