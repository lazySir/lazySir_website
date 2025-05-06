---
title: git笔记总结
author: lazySir
tags: [git,前端]
description: git的一些命令和使用方法
cover: 
date: 2022-10-07
---

# 下载

官网：https://git-scm.com/

npm高速下载：https://registry.npmmirror.com/binary.html?path=git-for-windows/

<br/>

安装步骤：一直next

# Git工作机制

![git笔记总结1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/前端/git笔记总结1.png)


# Git和代码托管中心

代码托管中心就是基于网络服务器的远程代码仓库，简称为远程库

## 局域网

GitLab

## 互联网

GitHub（外网）

Gitee码云（国内网站）

# Git常用命令

|命令名称|作用|
|--|--|
|git config --global user.name 用户名|设置用户签名|
|git config --global user.email 邮箱|设置用户签名|
|git config --global -l|查看设置的用户签名|
|git init|初始化本地库|
|git status|查看本地库状态|
|git add 文件名|添加到暂存区|
|git rm --cached 文件名|删除暂存区文件|
|git commit -m "日志版本信息" 文件名|提交到本地库|
|git reflog|查看版本信息|
|git log|查看详细版本信息（和git reflog相比多了可以看谁提交的）|
|git reset --hard 版本号（版本号通过git reflog查看--> 输出的前七位）|版本穿梭|

>注意
>- Git 首次安装必须设置一下用户签名，否则无法提交代码。
>- 文件名（要加上文件后缀）




# vim界面

复制 ： yy   指令界面复制：双击

粘贴：p   指令界面粘贴：鼠标中间

编辑状态：i

退出编辑状态：esc

保存：非编辑状态 ：wq

进入文件：vim 文件名

查看文件内容：cat 文件名

清屏：ctrl+l

强制退出不保存：q！

# 分支的操作

|git branch 分支名|创建分支|
|--|--|
|git branch -v|查看分支|
|git checkout 分支名|切换分支|
|git merge 分支名|把指定的分支合并到当前分支上|

## 合并分支（冲突）

### 冲突产生的原因：

合并分支时，两个分支在同一个文件的同一个位置有两套完全不同的修改。Git 无法替
我们决定使用哪一个。必须人为决定新代码内容。

### 解决冲突

1）编辑有冲突的文件，删除特殊符号，决定要使用的内容

特殊符号：

- <<<<<<< HEAD 当前分支的代码
- ======= 分隔符
- 合并过来的代码 >>>>>>> hot-fix

2）添加到暂存区

3）执行提交（注意：==此时使用 git commit 命令时不能带文件名==）

# Git团队协作机制

## 团队内协作

![git笔记总结1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/前端/git笔记总结2.png)


## 跨团队协作

![git笔记总结1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/前端/git笔记总结3.png)


# GitHub操作

|命令名称|作用|
|--|--|
|git remote -v|查看当前所有远程地址别名|
|git remote add 别名 远程地址|起别名|
|git push 别名（远程地址别名） 分支名（要推送过去的东西的名字）|推送本地分支上的内容到远程仓库|
|git clone 远程地址|将远程仓库的内容克隆到本地|
|git pull 远程库地址别名 远程分支名|将远程仓库对于分支最新内容拉下来后与当前本地分支直接合并|
