1. 安装transmission: [教程](https://help.ubuntu.com/community/TransmissionHowTo)
2. 会碰到跑transmission程序的用户没有权限的情况: **permission denied**
3. 用这个命令可以以debian-transmission身份登录系统
```bash
sudo su --shell /bin/bash --login debian-transmission
```
4. df -h 可以看当前用户能读写那些目录
4. 以下命令给用户name读写foldername的权限 
```bash
chown name foldername
```

