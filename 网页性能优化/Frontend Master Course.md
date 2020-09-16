# Golden rules

1. Doing less stuff takes less times.
1. Doing something later is better than doing it now.
1. Until the user actually gets the page, there isn't much to optimize.

# facts

1. js is a complied language. complied to binary code just in time before being excuted in user's browser.
2. Parsing is slow. **the lesser code, the lesser time to parse**
3. Chrome will parse must needed code to AST, but let like functions or others go because it's not needed when app initially run.
   eager parse: parse code when app start running.
   lazy parse: parse code when code was called.

```js
const a = 1;
const b = 2;
// Parse it now.
// without parenthesses, V8 will not parse this function until meet the code where call it.
// but abuse using will break the V8 optimization algotherm
// use this rull only when really needed.
(function add(a, b) {
  return a + b;
});
add(a, b);
```

# [user timing api](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)

could add marks into performance panel.

- node --trace-opt xxx.js 
  get some information on how v8 optimize this file.
