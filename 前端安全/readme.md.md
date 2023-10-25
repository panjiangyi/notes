[阅读原文](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet)


0. Never Insert Untrusted Data Except in Allowed Locations
1. HTML Escape Before Inserting Untrusted Data into HTML Element Content
2. Attribute Escape Before Inserting Untrusted Data into HTML Common Attributes
    - HTML属性必须要有引号。没有引号很多字符都可以搞事
3. JavaScript Escape Before Inserting Untrusted Data into JavaScript Data Values    
    - 转码动态生成的代码，包括script和事件监听属性里的。 
    - HTML parser runs before the JavaScript parser. 
    - Content-Type要准: 比如JSON被当成HTML解析
4. CSS Escape And Strictly Validate Before Inserting Untrusted Data into HTML Style Property Values    
    - css中用到URL的地方，可以执行js代码，或恶意请求
5. Bonus Rule #1: Use **HTTPOnly** cookie flag
6. Bonus Rule #2: Implement **Content Security Policy**
7. Bonus Rule #3: Use an Auto-Escaping Template System
8. Bonus Rule #4: Use the **X-XSS-Protection** Response Header