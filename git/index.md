- git diff
    > 对比工作去和暂存区的区别
    1. --cached, --staged对比暂存区和已commit的区别
- git difftool
    > 功能与git diff相同，但使用编辑器来对比文件
    > 两步，把对比工具设置成vscode
    > git config --global diff.tool vscode
    > git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'
    1. --tool-help查看帮助
    2. --tools=<tool> 用指定编辑器查看
    3. --cached, --staged对比暂存区和已commit的区别
