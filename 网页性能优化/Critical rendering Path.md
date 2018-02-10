- “优化关键渲染路径”在很大程度上是指了解和优化 HTML、CSS 和 JavaScript 之间的依赖关系谱。
- 渲染过程：
> 1. 处理 HTML 标记并构建 DOM 树。
> 2. 处理 CSS 标记并构建 CSSOM 树。
> 3. 将 DOM 与 CSSOM 合并成一个渲染树。
> 4. 根据渲染树来布局，以计算每个节点的几何信息。
> 5. 将各个节点绘制到屏幕上。
## css
- CSS会阻塞渲染。浏览器不会渲染任何已处理的内容，直至 CSSOM 构建完毕。
- 尽早在文档中放置外链css的<link>标签，以浏览器尽早请求css文件。
- 避免在css文件中使用@import，因为只有包含import的文件被下载编译后，浏览器才会发现并下载import的css
- 不匹配当前媒体查询条件的CSS不会阻塞渲染，但会被下载。
- 可以考虑用内联css，减少请求次数，并不会阻塞首次渲染。
## html
- HTML也会阻塞渲染。同时具有 DOM 和 CSSOM 才能构建渲染树
## js
- JavaScript 执行将暂停，直至 CSSOM 就绪。
- JavaScript 也会阻止 DOM 构建和延缓网页渲染。除非将 JavaScript 显式声明为异步，否则它会阻止构建 DOM。
- Script标签上标记async，可使JS不阻塞渲染。
- 当浏览器遇到一个 script 标记时，DOM 构建将暂停，直至脚本完成执行。
## 其他
- Navigation Timing API 中提供了网页加载时各个事件发生的时间点，可用来分析网页加载性能。