# 简单diff算法

双循环遍历新旧虚拟dom。

外层循环是新虚拟dom: 记作 new，

内层循环是旧虚拟dom:记作 old

## 步骤

1. let lastIndex = 0;

2. 拿到new[i].key，在内层循环中找old中相同key的索引:index
   1. 如果index>= lastIndex. 代表new[i]不需要移动
   2. 如果index< lastIndex.  代表new[i]需要移动。
      1. 移动到new[i-1]后面。
   3. 如果index不存在的。代表new[i]是新增的节点.
      1. 挂载到new[i-1]后面
3. 此时双循环遍历完毕。
4. 遍历old，去new中找对应的key是否存在
   1. 如果不存在，代表old[i]需要被卸载。