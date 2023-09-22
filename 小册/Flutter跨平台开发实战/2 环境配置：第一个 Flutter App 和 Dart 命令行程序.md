从本小节开始，我们就要正式开始实践了。学完本讲内容后，你将掌握配置开发环境的技能，初尝编译对应平台、移动端以及 Web 版本的应用程序的过程。

具体来说，如果您打算在 Windows 中进行实操，则最终产品形态是 PC 软件、Android App 及 Web 页应用；如果您打算在 macOS 中进行实操，则最终产品形态是 macOS 软件、iOS/iPadOS/Android App 及 Web 页应用；如果您打算在 Linux 的某个发行版中进行实操，则最终产品形态是 Linux 软件、Android App 及 Web 页应用。

鉴于目前使用 Windows 的用户更多，本小册会**以 Windows 10 为例**进行讲解。使用 macOS 和 Linux 的朋友可参考，并做相应的步骤即可。

## 配置环境

Flutter 的学习之路分为两大部分进行：

-   第一部分是 核心原理篇，主要介绍 Dart 编程语言和 Flutter 基础知识；
-   第二部分是 三个实战项目，依次由简到繁，在项目中介绍实际开发的必备技能。先理解，再实操；

为了确保上述两个部分能顺利进行，需要安装 SDK 、配置系统、安装集成开发环境。

### 检查系统必备

在进行配置前，请先确认下面的事项：

1.  操作系统为 64 位的 Windows 10 或以上版本；

2.  总共大约 29 GB 的磁盘空间，其中：

    1.  Dart + Flutter SDK：3 GB；
    2.  完整的 Android SDK：15 GB；
    3.  Visual Studio：6 GB；
    4.  Google Chrome：1 GB；
    5.  IntelliJ IDEA：3 GB；
    6.  Git 和 Java SE：共计1 GB。

3.  Git 2.x 工具。

如果您具有 Android App 开发经验，可以继续使用 Android Studio。但对于 Dart 编程语言基础部分的学习，仍推荐使用 IntelliJ IDEA。

`💡 提示：Android Studio 是基于 IntelliJ IDEA 社区版高度定制化的开发工具，二者在使用上具有很多相同或相似之处，都非常高效，前者广泛用于 Android App 开发。在安装了 Flutter 和 Dart 插件后，它们都具备跨端编译开发的能力。`

### 配置 Flutter（含 Dart）SDK

这一步包含**下载**和**配置环境变量**两个步骤。

Flutter SDK 能自动获取 Dart SDK，因此我们只需要**下载 Flutter SDK的zip压缩包**即可。下载地址：[Flutter SDK 下载页面](https://docs.flutter.dev/get-started/install/windows)，如果网络环境欠佳，请使用 [备用页面](https://flutter.cn/docs/get-started/install/windows)。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0f3b03bbf5d4684ab81651cecd325cf~tplv-k3u1fbpfcp-zoom-1.image)

接着，解压缩下载后的 zip 文件，并选择合适的位置存放。这个位置用来保存 Flutter 和 Dart SDK，**日后不可随意移动**。我将它解压到了用户主目录的 Develop 文件夹下，结构如下图所示。大家可根据自己电脑的情况自行配置，可以存放在非系统分区中。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acb4d6abcaa242a6be9ebdf0472160b8~tplv-k3u1fbpfcp-zoom-1.image)

接下来是配置环境变量。复制上图红框内的路径，然后依次打开 设置 -> 系统 -> 关于 -> 高级系统设置。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cebec11256240a8b6a26f9990112e7a~tplv-k3u1fbpfcp-zoom-1.image)

在弹出的“系统属性”对话框中选择“高级”选项卡，单击“环境变量”按钮。在弹出的窗口中选择变量名为“Path”的一项，单击“编辑”按钮。最后在弹出的窗口中单击“新建”，粘贴刚才复制的路径，末尾追加“\bin”。整个过程如下图所示：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00dd060fda5a4b69a618f6d0b8bf9ecc~tplv-k3u1fbpfcp-zoom-1.image)

`❗️ 注意：请注意按需替换“C:\Users\wh199\Develop\flutter\”为读者电脑中 Flutter SDK 的存放目录。`

对于大陆用户，还需添加下面两个环境变量，以便日后顺利升级 Flutter SDK 版本：

> PUB_HOSTED_URL=https://pub.flutter-io.cn FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn

上述网址是 Flutter 社区主镜像地址，目前由七牛云提供服务。除此外，还有很多社区提供镜像服务，具体可访问 [在中国网络环境下使用 Flutter](https://flutter.cn/community/china) 页面查看。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e540135060b43818460850b935f0e8c~tplv-k3u1fbpfcp-zoom-1.image)

`💡 提示：细心的朋友会发现，环境变量有两种类型，一是用户变量，二是系统变量。前者仅针对当前用户有效，后者针对系统中所有用户都有效。如果您的电脑只有一个用户账户，那么用户变量相当于系统变量。`

配置好后，依次点击“确认”按钮关闭若干对话框。

最后，启动命令提示符窗口，执行：

```
flutter doctor
```

验证环境配置。

`❗️ 注意：必须启动新的命令提示符窗口，才能应用新的环境变量修改。`

执行后，若出现下图输出，则说明配置无误。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcaec5f507454e2bab89bd92fb99dcb0~tplv-k3u1fbpfcp-zoom-1.image)

### 安装和配置Java SDK 和 IntelliJ IDEA

从上图中可以看到三个非常醒目的红十叉，它们分别用于**开发 Android App、Web 前端和 Windows 程序**。通过安装和配置 IntelliJ IDEA（以下简称 IDEA），便可解决第一个红十叉。

首先是 JAVA SDK，推荐大家访问 Oracle官网的[下载页面](https://www.oracle.com/java/technologies/downloads/#java11-windows)，下载并安装 Java SE 11。具体安装过程和安装常用软件类似，这里就不再赘述了。值得一提的是，**使用 exe 安装程序可帮我们省去配置 Java 环境变量的步骤**。

然后是 IntelliJ IDEA，还是访问官方[下载页面](https://www.jetbrains.com/idea/download/)，下载并安装个人免费的 Community（社区版）就够用了。

安装完毕后，启动 IDEA，选择“New Project”（新建项目）。接着依次选择 Android -> Install SDK。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2796eecc35849eab5429bec8cc1e548~tplv-k3u1fbpfcp-zoom-1.image)

接着会弹出“SDK Setup”安装向导，一路下一步，等待完成即可。

众所周知，市场上的 Android 设备版本不一，碎片化明显。为了构建适合旧版本的 Android App，我推荐大家**通过 Android SDK Manager 安装完整的 SDK**。具体的操作步骤请参考下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b7c3ce293ad475a9f2c354422dcf2ff~tplv-k3u1fbpfcp-zoom-1.image)

如果您希望减少空间占用，SDK Platform中的 Preview 版本和 “System Image” 字样的内容可以不选，它们是预览版和用于模拟器的系统镜像。特别注意：**SDK Tools 中的“Android SDK Command-line Tools”是必须安装的**。

完成上述全部步骤后，启动命令提示符，执行：

```
flutter doctor --android-licenses
```

反复输入“y”，接受若干必要的许可协议。

再次执行：

```
flutter doctor
```

输出如下图所示，可见 Android toolchain 已经准备就绪了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/047d7523248b498a9e379856a937e79c~tplv-k3u1fbpfcp-zoom-1.image)

为了方便控制 Android 设备、调试 Android App，通常会将 Android SDK 中的关键目录添加到“path”环境变量中。这些目录包括：

-   C:\Users\wh199\AppData\Local\Android\Sdk\platform-tools
-   C:\Users\wh199\AppData\Local\Android\Sdk\tools

`❗️ 注意：请注意按需替换“C:\Users\wh199\AppData\Local\Android\Sdk\”为实际 Android SDK 的存放目录。`

最后，安装 IDEA 的 **Dart 和 Flutter 插件**。具体过程如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1267afaa8e6f4afeb0c66a3eb04877be~tplv-k3u1fbpfcp-zoom-1.image)

在安装 Flutter 插件时，会提示安装 Dart 插件，一并安装即可。

### 安装 Chrome

Chrome 浏览器用于**预览和调试 Web App页面**，安装 Chrome 并不难，只需到[下载页面](https://www.google.cn/chrome/index.html)下载并安装就可以了。

安装好后执行：

```
flutter doctor
```

输出如下图所示，Chrome 也已经准备就绪了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bba9e9412a34f63907fa17f7e09c749~tplv-k3u1fbpfcp-zoom-1.image)

### 安装 Visual Studio

Visual Studio 用于开发运行在 Windows 中的软件（**Visual Studio 和 Visual Studio Code 是两个不同的软件**）。访问[官方下载页面](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=Community&channel=Release&version=VS2022&source=VSLandingPage&cid=2030&passive=false)，下载 Community（免费的个人社区） 版本。安装时，选择“使用 C++ 的桌面开发”工作负荷，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0973b38aa5054f76893dae7e05be3179~tplv-k3u1fbpfcp-zoom-1.image)

点击右下角的“安装”按钮，启动安装，这是一个耗时较长的过程。

完成后，再次执行：

```
flutter doctor
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34e84082305b4120909567976971e4ab~tplv-k3u1fbpfcp-zoom-1.image)

可以看到，Visual Studio 已经没有问题了。

## Hello, World

通常，第一个演示程序被称为“Hello, World”，本套教程也不例外。不同之处在于，我们会构建若干“Hello, World”程序，一类（Android App、Windows 应用程序和 Web App）是带有 UI 界面的 Flutter 程序，另一个是 Dart 命令行程序。

### 第一个 Flutter App

启动 IDEA，点击“New Project”，创建一个项目。在弹出的新建项目窗口左侧，选择“Flutter”，右侧定位到 Flutter SDK 所在目录，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca72f7f7446e456b9fe7fe70a486a2fd~tplv-k3u1fbpfcp-zoom-1.image)

单击“OK”确认后，再单击“Next”，来到项目信息配置界面，如下图所示。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c89e29d54cdb4cc0b3bceb10f35307f1~tplv-k3u1fbpfcp-zoom-1.image)

-   **Project name：** 项目名称；
-   **Project location：** 项目代码存放路径；
-   **Description：** 项目描述；
-   **Project type：** 可选项包括 Application（应用程序）、Plugin（插件）等；
-   **Organization：** 组织（公司）域名；
-   **Android language：** 使用何种语言开发 Android App；
-   **iOS language：** 使用何种语言开发iOS App；
-   **Platforms：** 该程序可在哪些平台上运行。

在这里，Organization 和 Project name 共同构成程序唯一 ID（本例为 com.juejin 和 hello_flutter）。

-   对于 Android App 而言，是 Package name（com.juejin.hello_flutter）；
-   对于 iOS App 和 macOS 程序而言，是 Bundle identifier（com.juejin.hello_flutter）；
-   对于 Linux 程序而言，是Application ID（com.juejin.hello_flutter）；
-   对于 Windows 程序而言，是 CompanyName（com.juejin） 和 ProductName（hello_flutter）。

填写好后，单击“Create”（创建）按钮，稍等片刻，进入下图所示的 IDEA 工作环境。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7764625ae1db4112a8c60914ffa5ac81~tplv-k3u1fbpfcp-zoom-1.image)
出于普适性的考虑，**本小册结合 Android 模拟器进行讲解**。点击上图中红框标记的按钮，创建模拟器。

在虚拟设备列表窗口中单击“Create Virtual Device...”（创建虚拟设备）按钮，弹出设备配置窗口。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b391df98fdbc4b97bd2c94c4de64f66a~tplv-k3u1fbpfcp-zoom-1.image)

可以看到，左侧列出了支持的设备类型，中间是机型和配置概要，右侧是参数图示。我们依次选择“Phone”（手机）和“Pixel 2”，然后点击“Next”（下一步）按钮。

之后便来到 Android 系统版本选择界面，截至我在写作这本小册时，Android 系统版本占有率如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2c8f6b7eed84977b4ebff7558d1c349~tplv-k3u1fbpfcp-zoom-1.image)

为了让更多人都能享用我们的应用程序，并能使用高版本特性的原生 API，我最终选择 Android 8.1 作为系统版本。

在列表中选择相应的版本，点击“Download”（下载），将启动下载，自动补全缺少的系统镜像。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fbfd4b736cb4ec5b392657003e75a65~tplv-k3u1fbpfcp-zoom-1.image)

下载完成后，原来无法点击的“Next”按钮就可以正常点击了。最后一页是验证配置，我们保持默认，然后单击“Finish”（完成）按钮，模拟器就创建成功了。

回到虚拟设备列表窗口，单击下图红框按钮，即可启动模拟器了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f78e0307c31745eca66c008abd6626cf~tplv-k3u1fbpfcp-zoom-1.image)

回到 IDEA 工作区，首先选择目标设备，然后再单击绿色的运行按钮，稍等片刻，一个 Flutter 应用程序就运行起来了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/812835757ab240829c942c04086afa4e~tplv-k3u1fbpfcp-zoom-1.image)

最后，我放上一些不同平台上运行的效果图（从左至右分别是：Android App、Web App、Windows 程序）。如果您能看到类似的界面，那么恭喜您，可以继续后面的学习了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb49acf33c0f49f7987795bec0b78781~tplv-k3u1fbpfcp-zoom-1.image)

### 第一个 Dart 命令行程序

学习 Dart 编程语言是上手 Flutter App 开发的第一步，本讲的最后一部分要带大家创建一个 Dart 项目，利用这个项目熟悉使用 Dart。

和创建 Flutter 项目类似，启动 IDEA 后，选择“New Project”，在弹出的窗口左侧选择“Dart”，右侧定位 Dart SDK 所在目录，默认位于 Flutter SDK 中，具体请大家参考下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc7ed725db4422c8839a39de5846887~tplv-k3u1fbpfcp-zoom-1.image)

如果配置无误的话，IDEA 会自动获取到 Dart SDK 版本。单击“Next”按钮，输入项目名称和路径，最后单击“Create”按钮，创建项目。

和 Flutter 项目不同，默认的 Dart 项目空白一片。我们在左侧的“Project”（项目）视图中，在项目根目录上单击右键，创建一个名为 hello.dart 的源码，过程如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0353f719448f437e827ba6c4ce3a261b~tplv-k3u1fbpfcp-zoom-1.image)

`💡 提示：“New Dart File”小窗口没有确认按钮，我们**只需要输入文件名，然后按回车键**即可。`

创建好后的 hello.dart 会自动打开，处于编辑模式，我们输入以下代码内容：

```dart
void main(){
  print("Hello, World");
}
```

然后单击 IDEA 工具栏中的“Add Configuration”（添加运行配置）按钮，按照下图所示配置项目信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e6812699ab648e49c92470c5cf1478e~tplv-k3u1fbpfcp-zoom-1.image)

在上图中，第 3 步可自定义内容。

最后，回到 IDEA 工作区，和运行 Flutter 程序一样，单击绿色的运行按钮。稍等片刻，便可在控制台视图中观测到运行结果，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dfb2d33a27a473b8df13f8db7a601ee~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

🎉 恭喜，您完成了本次课程的学习！

📌 以下是本次课程的重点内容总结：

1.  Flutter SDK 的下载和安装；
2.  Android SDK 的下载和安装；
3.  Java SE 和 Git 工具的下载和安装；
4.  在 Windows 中安装和配置 IntelliJ IDEA 和 Visual Studio；
5.  在 Windows 中使用 IntelliJ IDEA 编译和运行多平台程序；
6.  在 Windows 中使用 IntelliJ IDEA 编译和运行 Dart 命令行程序。

本讲的内容以 Windows 10 为例，讲述了如何搭建 Flutter 开发环境。配置开发环境并非日常频繁的事务，大家在通读本小节后**保留“印象”即可**。在日后用到的时候再将本节从大脑中“检索”出来，按步骤操作就行了。

**配置开发环境本身难度不高，但略显繁琐**。俗话说：“工欲善其事，必先利其器”。祝大家能够轻松、顺利地完成本环节，以便顺畅进行后面的学习。

本讲内容到此为止，希望能够对你有所帮助，我们下次再见。