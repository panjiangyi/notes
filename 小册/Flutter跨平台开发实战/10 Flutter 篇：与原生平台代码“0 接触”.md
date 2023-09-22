自从 Flutter 正式推出后，其生态一直都在快速迭代中。我记得 2019 年时，想要集成地图导航，都没有现成的库可以用。只能手动编写原生代码，然后使用“平台通道”打通原生与 Flutter，使用“混合开发”技术实现。

如今，Flutter 生态系统逐渐完善，一些知名的服务提供商已经推出了 Flutter 版本的 SDK。开发者只需要按照文档一步步操作即可完成功能集成了，可以说是非常方便了。

但是，某些特定的功能仍需要原生代码的支持，比如 Android 平台的设备信息获取、某些第三方即时消息服务等等。在这种情况下，和原生代码打交道就是无法避免的工作了。

## 核心思想

在 Flutter 中，与原生平台交互的方式被称为“平台通道”。平台通道支持 iOS/iPadOS、Android、Windows、macOS 以及 Linux 客户端产品，且非常灵活。具体支持如下编程语言：

-   iOS/iPadOS：Objective-C、Swift；
-   Android：Java、Kotlin；
-   Windows：C++；
-   macOS：Objective-C；
-   Linux：C。

无论开发者使用哪种编程语言，Flutter 都能“适应”。那么，Flutter 与原生代码是如何交互的呢？它们的关系又是怎样的呢？

形象地说，**Flutter** **层与平台原生层没有严格的** **“** **主 - 辅** **”** **关系**。根据实际项目的需求，我们可以以 Flutter 为主，通过主动调用平台原生层的方法实现混合开发。当需要交互时，Flutter 层会通过“平台通道”“告知”平台原生层。平台原生层收到“告知”后，自行处理，使用自身的 API 完成“工作”，并将执行的结果回传给 Flutter 层，完成整个交互过程。

**在整个交互过程中，消息的传递是异步进行的**。即使平台原生层需要一些时间才能执行结束，Flutter 层的用户交互也不会受影响，确保用户拥有流畅的使用体验。需要特别注意的是，**Flutter 层调用平台原生层，必须从主线程发起**。

另一方面，我们也可以以平台原生层为主。这有点类似于现在比较流行的程序中的小程序，比如微信小程序。平台原生层相当于微信 App，Flutter 层相当于微信中的小程序。此外，当我们考虑将一个现有产品迁移到 Flutter 技术实现时，这种方法非常管用。

此外，如果我们要打造一款跨平台的 Flutter App，并且需要与平台原生代码打交道，Flutter 还提供了判断当前平台的 API。如此便可方便我们对不同平台执行各自不同的代码逻辑了，从而更便于实现多平台适配。

本讲我以 Android 平台为例，为大家详细介绍如何让 Flutter 的 Dart 代码与 Android 平台的 Java 代码交互，实现“0”距离接触。

## Flutter × Android

假如我们使用 Java 编程语言开发 Android 原生平台代码，当数据在 Flutter 层和平台原生层来回传递时，便面临一项挑战：数据类型如何兼容。

### 消除编程语言的隔阂

实际上，除 Java 外，Kotlin、Objective-C 等都与 Dart 的数据类型存在不同之处，这该如何应对呢？

平台通道内置了数据“编解码器”，通过对数据的序列化和反序列化实现了数据类型的兼容。以 Dart 与 Java 为例，它们之间的关系如下：

| **Dart 数据类型** | **Java 数据类型** |
| ----------------- | ----------------- |
| int               | Integer/Long      |
| double            | Double            |
| bool              | Boolean           |
| String            | String            |
| Uint8List         | byte[]            |
| Int32List         | int[]             |
| Int64List         | long[]            |
| Float32List       | float[]           |
| Float64List       | double[]          |
| List              | ArrayList         |
| Map               | HashMap           |
| null              | null              |

在传递数据时，我们只需要按照上表的规律传递和接收数据即可。

好了，理论部分到此该告一段落了，下面进入实战环节。通过前面的学习，我们知道 Flutter 混合开发既可以以 Flutter 为主，也可以以平台原生为主。本讲我将给大家分别演示这两种思路的实现过程，起到抛砖引玉的作用。大家可以根据实际情况进行选择，以最恰当的方式完成工作。

### 实战平台通道（Flutter 为主）

先上一个效果图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee75463dc4534704babd5d6bf88df078~tplv-k3u1fbpfcp-zoom-1.image)

我们要实现的是：当用户点击上图左侧的 1 号位置的按钮后，通过调用原生 Android 代码，获取 Build Model 信息，最终展示到界面上，即上图右侧 2 号位置的文本。

要把大象装冰箱，需要三步。实现上述效果，也需要三步：**Flutter 层实现**、**Android 层实现**、**测试运行**。

首先来看 Flutter 层，创建一个 Flutter 工程，然后将默认的界面改为 Text 和 TextButton 组成的 Column 组件，并居中显示。具体代码如下：

```dart
class _MyHomePageState extends State<MyHomePage> {
  String androidBuildModel = "";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(androidBuildModel),
            TextButton(
              onPressed: getAndroidBuildModelInfo,
              child: const Text("获取 Build Model 信息"),
            )
          ],
        ),
      ),
    );
  }
}
```

这段代码理解起来非常容易，我就不再过多解释了。大家注意 TextButton 的 onPressed 值，它是一个方法名。作用就是用户点击整个按钮后的具体动作。

于是乎，接下来的重点就是 `getAndroidBuildModelInfo()` 方法的实现了。我们还是结合实际的代码来讲解：

```dart
static const platform = MethodChannel('samples.juejin.cn/androidBuildModel');
getAndroidBuildModelInfo() async {
  try {
    final String result = await platform.invokeMethod('getBuildModel');
    androidBuildModel = result;
  } on PlatformException catch (e) {
    androidBuildModel = "无法获取 Build Model";
  }
  setState(() {});
}
```

这里的 platform 是 MethodChannel 类型，`samples.juejin.cn/androidBuildModel` 是完整的平台通道名。`samples.juejin.cn` 是前缀，一般可以是应用程序包名。`androidBuildModel` 在此处起到区分模块功能的作用。

接下来，通过 platform 调用了 `invokeMethod()` 方法，并传入 `getBuildModel` 参数。在这里，**`getBuildModel`** **相当于某个模块功能中的最细化的功能**。

总结一下，**`samples.juejin.cn`** **是平台通道的前缀**；**`androidBuildModel`** **区分了较大维度的模块功能**；**`getBuildModel`** **是最细化的功能**。

为了更好理解，我再举一个例子。

如果在该程序中添加一个即时消息能力，完整的平台通道名可以是 `samples.juejin.cn/chat`，最细化的模块功能名称可以是 `sendMessage`（发送消息）、`setMessageReceiveListener`（设置消息接收监听器）……

到此，Flutter 层面的实现已经完全完成了。**Flutter 层面我们实现的是“发起调用请求”** ，**Android 层面是“响应请求，必要时返回结果”** 。所以，下面就该来到 Android 层面了。

在 Flutter 视图中，由于缺少 Android 模块的专有支持（比如 Android API 的代码提示、项目结构视图等等），需要在新窗口中以 Android 视图打开 Android 模块。方法如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ee7b68b2ca74144ac36430a64d55d26~tplv-k3u1fbpfcp-zoom-1.image)

在上图 1 号位置点右键，在出现的菜单中选择 Flutter -> Open Android module in Android Studio（在 Android Studio 中打开 Android 模块）。紧接着，Android Studio 就会启动，并以 Android 视图展示项目结构。

接下来，打开 MainActivity，覆写 `configureFlutterEngine()` 方法，将“接收”平台通道的消息并返回结果的逻辑添加进去。具体代码如下：

```dart
@Override
public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
    super.configureFlutterEngine(flutterEngine);
    MethodChannel getAndroidBuildModelMethodChannel = new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), "samples.juejin.cn/androidBuildModel");
    getAndroidBuildModelMethodChannel.setMethodCallHandler((call, result) -> {
        if (call.method.equals("getBuildModel")) {
            String buildModel = getBuildModel();
            if (buildModel != null && !buildModel.equals("")) {
                result.success(buildModel);
            } else {
                result.error("err", "无法获取 Build Model 信息", "Build.MODEL 值为 null 或空字符串");
            }
        } else {
            result.notImplemented();
        }
    });
}
private String getBuildModel() {
    return Build.MODEL;
}
```

显然，这里**平台通道的完整名字、具体细化的方法名都要与 Flutter 层面定义过的一一对应**。在 `setMethodCallHandler()` 中，**通过 `call.method` 字符串的值区分具体细化的方法名，并做相应的处理**。在返回结果时，**`result.success()` 表示执行成功，并根据需要返回结果**（本例是 buildModel 的值）。

**`result.error()` 表示执行出错，三个参数都是 String 类型，分别表示 errorCode、errorMessage 和 detailMessage**。

大家可以根据实际项目需要，传入合适的值作为返回。如果 `call.method` 没有匹配，导致原生层无法正确响应 Flutter 层的请求怎么办呢？直接**执行 `result.notImplemented()` 即可，它表示没有实现传过来的方法名对应的具体实现**。

最后，让我们重新运行程序，测试一下吧！如无意外，大家都能看到效果图中的样子了。

`❗️ 注意：还记得吗？在前一讲中，有一种情况是热修复不适用的：平台原生代码发生修改。因此，大家需要重新运行程序（而非保存代码，执行热修复），才能使最新修改原生代码奏效。`

### 实战平台通道（平台原生为主）

Flutter 与 Android 的混合开发还有一种情况，就是以原生代码为主，Flutter 部分仅为部分功能服务。这种情况在部分重构/迁移原生到 Flutter 时特别有效，且非常容易实现。

如果我们以 Android 视图打开 Flutter 工程中的 Android 模块，会发现它其实和一个正常的 Android 项目在结构上没什么不同。作为启动页的 Activity（一般是 MainActivity），只是继承了 FlutterActivity 而已，再没有其它的处理逻辑了。

再到 AndroidManifest.xml 中瞧瞧，更是简单至极。如此少量的原生代码修改意味着什么呢？没错，它为开发者提供了非常大的自由度，越少的修改也就意味着留给开发者的修改空间越多。

顺着原生 Android 的开发方式，既然一个继承自 FlutterActivity 的 Activity 是 Flutter App 的“容器”，我们可否再添加一些 Activity，把旧的原生代码集成进来，只将部分功能“外包”给 Flutter 层面实现呢？答案是肯定的！

为了探索可能性，我在 Android 模块中添加了一个 LauncherActivity，并将它作为整个 Android 程序的启动页 Activity（当然，我同时禁止 MainActivity 作为启动页 Activity）。如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84bdb367634d453db010ffd47e47c1a5~tplv-k3u1fbpfcp-zoom-1.image)

这个 LauncherActivity 就相当于实际项目中任何一个旧的 Activity。

在这个 Activity 中，只有一个按钮，用于启动 MainActivity。完整的 UI 和代码如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae2c6899d45d4083b220211d739d92d7~tplv-k3u1fbpfcp-zoom-1.image)

重新运行程序，这个界面会首先出现在屏幕上。当我们点击中间的按钮后，由 Flutter 实现的部分就运行起来了！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79a1f8ed427e454185dfdf3fdd9a95b3~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

🎉恭喜，您完成了本次课程的学习！

📌 以下是本次课程的重点内容总结：

本讲以 Android 平台为例，为大家介绍了 Flutter 与平台原生代码的“沟通方式”。

诚然，即使目前 Flutter 的生态日益完善，某些特定的功能仍需要原生代码的支持。此时，平台通道就派上用场了。

对于以 Flutter 代码为主的项目，从 Flutter 层面发起“执行请求”。原生平台通过平台通道名和方法名，精准“理解” Flutter 层面发出的“意图”，执行相应的代码逻辑。并根据需要，回传执行结果。

这里要注意的是数据类型的匹配，错误的类型接收将导致无法正常获取另一平台的参数传递。

另一方面，对于以 Android 原生代码为主的项目，可以将 Flutter 部分“嵌入”到项目中，实现类似微信小程序的执行方式。该方式对于那些逐步迁移至 Flutter 实现的大型项目非常有帮助。

➡️ 在下次课程中，我们就要进入实战项目环节了。第一个项目，将从功能最简单的《一言》App 开始，带大家一起完成项目从 0 到 1 的过程，体会整个项目从无到有的流程。这听上去就很让人期待，让我们一起开始下一讲的实战吧！