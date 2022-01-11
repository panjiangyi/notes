试验过很多在线 WiFi 二维码的生成软件，很多生成的二维码有问题，支持的手机不过多。有的时候很奇怪。为啥有的手机能连接这个 WiFi，iOS 11 的手机就不支持呢。

qrcode-wifi

我试过不同的平台生成二维码，仔细对比，发现每个平台生成的二维码不一样。最后找到了一个适用于 Android 和 iOS 的 WiFi 二维码的序列号。如下：

```
WIFI:T:WPA;S:wifiname;P:wifipasswd;;
```

说明一下：

WIFI 表示这个是一个连接 WiFi 的协议

S 表示后面是 WiFi 的 SSID，wifiname 也就是 WiFi 的名称

P 表示后面是 WiFi 的密码，wifipasswd 是 WiFi 的密码

T 表示后面是密码的加密方式，WPA/WPA2 大部分都是这个加密方式，也使用 WPA。如果写 WPA/WPA2 我的小米手机无法识别。

H 表示这个 WiFi 是否是隐藏的，直接打开 WiFi 扫不到这个信号。苹果还不支持隐藏模式

二维码通过 https://cli.im/text 这个平台生成，文本信息内容如上，可适用于 Android、苹果等系统。

扫一扫结果展示
