React 的 diff 算法分为

- 单节点 Diff: 新节点为单节点
- 多节点 Diff： 新节点为多节点

## 单节点 Diff

这种情况比较简单。

遍历旧的 FiberNodes，找到 key 和 Type 相同的，复用旧 fiberNode 创建新的 fiberNode，对 key 或者 Type 不同的旧 fiberNode 标记删除

## 多节点 Diff

> 有一个前提，大部分情况下节点的位置不会改变。
>
> 所以会首先处理位置没有改变的情况。

会遍历两遍。

第一遍找到位置没变的所有节点

第二遍处理其他位置改变了的节点。

> 标记 Deletion：会把待删除的 fiberNode 添加到父节点的 deletions 数组中，在 commit 阶段的 commitMutationEffects 中正式删除
> 标记 placement: 按新 finberNode 中的顺讯插入或移动 dom 即可

### 第一遍：

同时遍历旧的 FiberNodes 和新的 jsx

从头开始遍历，检查新旧相同位置的节点是否改变了。

每次循环会更新 lastPlacedIndex 变量。

1. 如果没有改变，则直接复用。 同时 lastPlacedIndex++。
2. 如果 key 不同，会直接结束第一遍循环
3. 如果 key 相同但是 type 不同，会标记旧 fiberNode 为 DELETION，然后继续循环。

### 第二遍：

四种情况

1. 旧 fiberNodes 和新 jsx 都遍历完了。 diff 结束。
2. 旧 fiberNodes 有剩余，新 jsx tree 遍历完了。标记删除所有剩下的旧 fiberNodes
3. 旧 fiberNodes 遍历完了，新 Jsx tree 还有剩余。新增所有 jsx
4. 都没有遍历完。这时要处理节点移动。

### 情况四

最复杂的是情况四

首先用一个 Map 把所有旧 fiberNodes 按 key 保存起来

然后，遍历新 jsx。找到每个 jsx 是否有对应的旧 fiberNode。

如果没有：则新增这个 jsx

如果有：

找到这个 fiberNode.index 的值。

如果大于或等于 lastPlaceIndex，则不需要移动。同时更新 lastPlaceIndex 为 Max(fiberNode.index, lastPlaceIndex)的值

如果小于 lastPlaceIndex， 标记 Placement

> 具体如何移动的，看 commitPlacement 方法
