var e = $0.innerHTML;
var e = `"1\d3"d\dd"
44"`
function Eacape(str) {
    var r = str
    .replace(/\\/gm, "\\\\")
    .replace(/[\b]/gm, "\\b").replace(/\f/gm, "\\f").replace(/\n/gm, "\\n").replace(/\r/gm, "\\r").replace(/\t/gm, "\\t").replace(/"/gm, "\\\"");
    return r
}
e = Eacape(e)
var str = `{
    "test":"${e}"
}`;
var r = JSON.parse(str);
r
