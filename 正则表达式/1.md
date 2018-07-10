# 正则表达式
- i g
- .

# 正则表达式解析jsx模板
```javascrpt
var str = `<Router>
 <div style={{width:'100%',height:'100%'}}>
        <Route exact path="/" component={Hello} />
        <Route exact />
        <Route path="/edit" component={{Edit}} />
        <Route component={Edit} />
        <Route component={{a:1}} />
    </div>
    <fuck success style={{whidth:100}} ok='haohaohao'/>
</Router>`;
// 1、html标签的正则。2、首字符大写的正则
const tag_reg = /<([a-zA-Z][a-zA-Z]*)\s+(([A-Za-z])+\s*(=(((['"]).+?\7)\s?|({|{{).+(}|}})\s?)){0,1})+\s*\/?>/gm;
const tag = /<[a-zA-Z][a-zA-Z]*.*\/?>/gm;
let tag_attr = {};
var result = true;
let i = 0;
while (result != null) {
    result = tag.exec(str);
    if (result != null) {
        // 取得名字
        let tagName = /<([a-zA-Z][a-zA-Z]*)\s*(?!=)/.exec(result[0]);
        let rightTag = RegExp.rightContext;
        i++;
        tag_attr[tagName[1] + i] = attrArr = [];
        while (rightTag) {
            let attrReg = /(\w+)=(['"])(.+)\2|(\w+)=[{](.+)[}]|\s?(\w+)\s/g;
            let attr = attrReg.exec(rightTag);
            rightTag = RegExp.rightContext;
            if (attr == null) break
            // console.log(attr)
            if (attr[0].indexOf('{') > -1) {
                attrArr.push({
                    key: attr[4],
                    value: attr[5]
                })
            } else if (attr[0].indexOf('=') > -1) {
                attrArr.push({
                    key: attr[1],
                    value: attr[3]
                })
            } else {
                attrArr.push({
                    key: attr[6],
                })
            }
        }
    }
}
```