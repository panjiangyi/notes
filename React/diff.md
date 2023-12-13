React的diff算法分为

- 单节点Diff:  新节点为单节点
- 多节点Diff： 新节点为多节点

## 单节点Diff

这种情况比较简单。

遍历旧的FiberNodes，找到key和Type相同的，复用旧fiberNode创建新的fiberNode，对key或者Type不同的旧fiberNode标记删除

## 多节点Diff

> 有一个前提，大部分情况下节点的位置不会改变。
>
> 所以会首先处理位置没有改变的情况。
>
> 

会遍历两遍。

第一遍找到位置没变的所有节点

第二遍处理其他位置改变了的节点。

### 第一遍：

同时遍历旧的FiberNodes和新的jsx

从头开始遍历，检查新旧相同位置的节点是否改变了。

每次循环会更新lastPlacedIndex变量。

1. 如果没有改变，则直接复用。 同时lastPlacedIndex++。
2. 如果key不同，会直接结束第一遍循环
3. 如果key相同但是type不同，会标记旧fiberNode为DELETION，然后继续循环。

### 第二遍：

四种情况

1. 旧fiberNodes和新jsx 都遍历完了。 diff结束。
2. 旧fiberNodes有剩余，新jsx tree遍历完了。标记删除所有剩下的旧fiberNodes
3. 旧fiberNodes遍历完了，新Jsx tree还有剩余。新增所有jsx
4. 都没有遍历完。这时要处理节点移动。

### 情况四

最复杂的是情况四

首先用一个Map把所有旧fiberNodes按key保存起来

然后，遍历新jsx。找到每个jsx是否有对应的旧fiberNode。

如果没有：则新增这个jsx

如果有：

找到这个fiberNode.index的值。

如果大于或等于lastPlaceIndex，则不需要移动。同时更新lastPlaceIndex为Max(fiberNode.index, lastPlaceIndex)的值

如果小于lastPlaceIndex， 标记Placement

> 具体如何移动的，看commitPlacement方法









 