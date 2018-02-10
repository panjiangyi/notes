- **DefinePlugin**加**UglifyJsPlugin** 可以去掉React, Vue中输出警告信息的代码。DefinePlugin把process.env.NODE_ENV替换成'production'，UglifyJsPlugin删除恒为false的if代码块。 
``` javascript
if (typeof val === 'string') {
  name = camelize(val);
  res[name] = { type: null };
} else if (process.env.NODE_ENV !== 'production') {
  warn('props must be strings when using array syntax.');
}
```

- 使用ES6模块语法，webpack会自动启用tree-shaking去掉没有被import过的export代码。
> 1. 注：tree-shaking只会去掉exports语句，需要配合代码压缩插件去掉冗余代码。 2. babel会把es模块语法翻译成CommonJs语法，这也会导致tree-shaking失效。{module:false}来禁用翻译。

- scope hoisting.webpack将每个模块放在一个自执行函数中，使用**ModuleConcatenationPlugin**后，可以将模块和依赖的模块放在一起，减少代码体积。
> 需使用es module语法

- 加载非模块化代码
1. 全局变量模块化
``` javascript
module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
};
```
会被编译成
``` js
// bundle.js (part of)
(function(module, exports) {
  // A module that exports `window.React`. Without `externals`,
  // this module would include the whole React bundle
  module.exports = React;
}),
(function(module, exports) {
  // A module that exports `window.ReactDOM`. Without `externals`,
  // this module would include the whole ReactDOM bundle
  module.exports = ReactDOM;
})
```
2. AMD ESModule化
```js
// webpack.config.js
module.exports = {
  output: { libraryTarget: 'amd' },

  externals: {
    'react': { amd: '/libraries/react.min.js' },
    'react-dom': { amd: '/libraries/react-dom.min.js' },
  },
};
```
会被编译成
``` js
// bundle.js (beginning)
define(["/libraries/react.min.js", "/libraries/react-dom.min.js"], function () { … });
```
>注：使用externals之后，必须import externals的键，否则webpack不认识，会按正常流程打包该模块。
- 常用工具库简化配置https://github.com/GoogleChromeLabs/webpack-libs-optimizations
-  webpack runtime代码很少，可以内联到html中减少http请求。
> 1. 如果用**HtmlWebpackPlugin**生成HTML，可使用  **InlineChunkWebpackPlugin**插件。2. 如果由服务端生成HTML，**CommonsChunkPlugin**生成的runtime文件，自行添加到HTML中。

  