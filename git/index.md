- git diff
    > 对比工作去和暂存区的区别
    1. --cached, --staged对比暂存区和已commit的区别
- git difftool
    > 功能与git diff相同，但使用编辑器来对比文件
    > 两步，把对比工具设置成vscode
    > git config --global diff.tool vscode
    > git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'
    1. --tool-help查看帮助
    2. --tools=&lt;tool&gt; 用指定编辑器查看
    3. --cached, --staged对比暂存区和已commit的区别
- git commit
    1. -a 跳过add进暂存区步骤，直接提交
    2. --amend 覆盖上一次提交操作
- git rm
    > 从磁盘和暂存区中删除文件
    1. -f, 如果修改过切已暂存，则必须用此强制删除命令
    2. --cached，从git仓库中删除并不再跟踪文件
- git mv
    >移动文件
    1. 重命名 git mv file_from file_to
- git log
  > 更多命令自己搜
    1. -p 显示每次提交的内容的差异
    2. -n 显示n条记录
    3. --stat 简洁信息
    4. --pretty=oneline;
    5. --pretty=short;
    6. --pretty=full;
    7. --pretty=fuller;
    8. --pretty=format:"模板";
        | 选项 | 说明                                      |
        | ---- | ----------------------------------------- |
        | %H   | commit的完整哈希字串                      |
        | %h   | commit的简短哈希字串                      |
        | %T   | 树对象的完整哈希字串                      |
        | %t   | 书对象的简短哈希字串                      |
        | %P   | 父对象的完整哈希字串                      |
        | %p   | 父对象的简短哈希字串                      |
        | %an  | 作者的名字                                |
        | %ae  | 作者的电子邮件地址                        |
        | %ad  | 作者修订日期（可以用--date=选项指定格式） |
        | %ar  | 作者修订日期，按多久以前的方式显示        |
        | %cn  | 提交者的名字                              |
        | %ce  | 提交者的电子邮件地址                      |
        | %cd  | 提交日期                                  |
        | %cr  | 提交日期，按多久以前的方式显示            |
        | %s   | 提交说明                                  |
        > 注：作者是写代码的人，提交者是把代码合并到项目的人
    9.  --graph， 图形化显示分支，合并历史
    10. --since --after --before --until 设定起止时间
    11. --author 指定作者
    12. --committer 指定提交者
    13. --grep 指定说明关键字
    14. -S 指定代码关键字
    15. --all-match 此命令使结果必须满足多个限制条件，否则满足一个即可
    16. --no-merges Do not print commits with more than one parent. This is exactly the same as --max-parents=1.
- git tag
    > 列出所有标签
    1. -l
    > git tag-l 'v1.8.5' 列出名字v1.8.5开头的标签
    >-a &lt;tag name&gt; &lt;commit hash&gt; 创建附注标签
    2. git push --tags 把标签也一并上传
    3. git checkout -b &lt;branchname&gt; &lt;tagname&gt;
- checkout
    >工作区和暂存区没提交干净时，不能切换分支。除非目标分支和当前分支处于同一节点

   
