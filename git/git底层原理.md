- 内部各文件夹作用
  1. description 文件仅供 GitWeb 程序使用，我们无需关心。
  2. config 文件包含项目特有的配置选项。
  3. info 目录包含一个全局性排除（global exclude）文件，用以放置那些不希望被记录在 .gitignore 文件中的忽略模式（ignored patterns）。
  4. hooks 目录包含客户端或服务端的钩子脚本（hook scripts），在 Git 钩子 中这部分话题已被详细探讨过。
  5. HEAD 文件、（尚待创建的）index 文件，和 objects 目录、refs 目录。这些条目 是 Git 的核心组成部分。
  6. objects 目录存储所有数据内容；
  7. refs 目录存储指向数据（分支）的提交对象的指 针；
  8. HEAD 文件指示目前被检出的分支；
  9. index 文件保存暂存区信息。
- Git对象
> git用键值对来存储数据，键是一个校验和
  - git hash-object -w -stdin命令保存数据并返回一个校验和
   > -w让命令存储数据对象，而不是仅返回校验和
   > --stdin 让命令从标准输入读取内容。无此选项则指定一个文件路径
  - git cat-file 命令返回校验和对应的数据 
   1. -p 返回内容
   2. -s 返回大小
   3. -t 返回数据类型
- 树对象
  >文件被加入暂存区时，会被创建一个树对象
  1. git hash-object -w命令得到一个文件的校验和
  2. git update-index --add --cacheinfo 100644 上一部校验和 filename 为一个文件创建树对象，效果与git add相同 
  > 100644：普通文件，100755：可执行文件，120000：符号链接
  3. git write-tree 给当前暂存区创造一个树对象
  4. git read-tree --prefix=bak 树校验和 把一个树对象加到另一个树对象中
- 提交对象
  >提交对象保存快照的各项信息：校验和，提交者，时间等等
  1. echo 'first commit' | git commit-tree 树校验和。 保存一个树对象的信息到一个提交对象中;
  2. echo commit message | git commit-tree 树校验和 -p 提交对象, 保存树为提交对象，并连接至上一个提交对象
- 打包
  >文件新加入git库时，git会完整保存文件的各个版本。
  >当push或手动执行**git gc**时，git会压缩文件，只保存文件个版本间的差异。
  - git verify-pack 命令查看打包的内容
  > git verify-pack -v .git/object/pack/某个文件
- 协议
   - 克隆一个库
   1. 得到info/refs文件,得到HEAD
   2. 得到HEAD后遍历树对象，然后下载相应git对象
   3. 若下载不到git对象，说明已被打包
   4. 下载 objects/info/packs文件获取打包信息，并下载包文件
   5. 下载完成