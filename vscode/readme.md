- 支持两种协议，**protocol** 配置项用于选择协议
  - auto:自动选择
  - inspector: 
    1. 新协议，调试非常大的JS对象时更稳定
    2. 对sourcemap支持得更好
  - legacy:老协议，传输非常大的JS对象时非常慢