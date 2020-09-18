# First of all: Just use typescript, a type system will help v8 optimize our code.

# Golden rules

1. Doing less stuff takes less times.
1. Doing something later is better than doing it now.
1. Until the user actually gets the page, there isn't much to optimize.
   s

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

# hidden class

v8 has a type system for js for speeding up js running.

## Reduce the amount of unused css. it's a waste of time of parsing and checking

## Reduce the numbers of styles that effect a given element.

### Change opacity and transform won't trigger repaint

# create layer

>  IMPORTANT: will-change is literally used for element will change, not always changing element.
>
> layer reduce repaint, but increase memory.

- will-change suggest browser to create a new layer, but browser may or may not follow our suggestion.

- transform:  translateZ(0). this rule force browser to create a layer instead of suggestion like will-change.

  not that good, because this way intervene the browser's way 

- will-change better be added to element just before it changing.  element will change when be clicked, then add will-change when be hovered.

  eg: 

  ```css
  
  .xxx:hover {
      will-change: transform;
  }
  ```

- remove will-change when element do not change any more. eg:

  ```js
  ele.addEventListener('animationEnd',()=>{
      ele.style.willChange = "unset";
  })
  ```

  

# latency and Bandwidth.

- file size under **14kb**, need just one tcp connection.

  > first painted HTML file size should under 14 kb to show page in one connection.