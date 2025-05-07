---
title: html笔记总结
author: lazySir
tags: [html]
description: HTML标签的一些总结
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/html/cover.png
date: 2022-11-16
---

# 一、标签
# 1.最基础标签
## 1.页面标签
```
<html></html>根标签
<head></head>里面放的是思想，设置浏览器用的，是人看不到的
<body></body>是展示给用户看的
```
## 2.标题标签
```
成段展示，独占一行，加粗字体，更改字体大小（从 1 到 6 依次减小）
<h1></h1>
<h2></h2>
<h3></h3>
<h4></h4>
<h5></h5>
<h6></h6>
```
## 3.特殊字体
```
<strong>加粗</strong>
<em>斜体</em>
<del>中划线</del>
```
又加粗又斜体，写成嵌套功能
```
<strong>
<em>又加粗又斜体</em>
</strong>
```
## 4.地址标签
```
<address></address>这是一个地址标签。可以用斜体+成段展示模拟
```
## 5.容器标签
功能 1：分块明确，让整个页面更加结构化；
功能 2：捆绑操作的作用（搬书架）
```
<div></div>独占一行
<span></span>不独占一行
```
## 6.单标签
大部分标签的作用是把他包裹的文本作用城他设置的样子，所以成对出现，有的标签自己就代表功能，就是单标签
```
<br>换行符
<hr>水平线

```
>如果一个标签的作用单一不需要写内容 那么可以写成“< />”

## 7.有序列表
```
<ol>
<li></li>
</ol>
```
>1.如果在ol标签里加上 type = “1” 就以 ABC 排序， 改成 a，就以 abc 排序。
>此处的 type 值只有五个：数字，大写英文 A，小写英文 b，罗马数字大写 I，罗马数字小写 i
2.如果加上  reversed = “reversed” 就是倒序
3.如果想从第 2 个开始排序，就写 start = “2"
想从第几个开始拍，start 里面写数字几

## 8.无序列表 
```
ul，unorder list 只有 type = “”这一个属性可以改
<ul type = “disc”>
<li>草莓</li>
<li>苹果</li>
<li>橙子</li>
</ul>
如 type = “disc” 意思是 discircle，实心圆
如 type = “square” 意思是 square，实心方块
如 type = “circle” 意思是 circle，圈(空心圆)
```
>ul 和 li 是一个很好的天生父子结构(柜子与抽屉)，可以做导航栏

## 9.图片标签
```
<img src = “sss.jpg style = “width:100px;”>
src 是 source 的缩写，img 的地址分：
1）网上 url
2）本地的绝对路径
3）本地的相对路径
如 html 和图片在同一文件下，是一种相对关系，相对路径，写法<img src = “123.jpg”>
D:/a/b/lesson2.html
D:/a/b/123.jpg
如 html 和图片不在同一文件下，是绝对路径，写法<img src = “D:/a/b/c/123.jpg”>
D:/a/b/lesson2.html
D:/a/b/c/123.jpg
```
## 10.跳转标签
```
<a href = “https://www.baidu.com”>www.taobao.com</a>
这个地址展示给用户是淘宝，实际给浏览器看的地址是百度
href 是 hyperText reference 超文本引用
<a>标签可以包裹图片
<a>是 anchor --> 锚，定在某个点（置顶） 
<a>标签的功能
1）超链接
2）锚点 (别的标签加上id属性  a标签的href=“#id名称”)
3）打电话，发邮件
4）协议限定符
属性：
target = “_blank”意思是在新标
签中打开这个地址


```
## 11.表单标签
```
form method = “get/post”这是 form 发送数据的两种方式
action = “http://ssffg.php”这是发送给谁，就是 action 的位置
form 表单里面还需要配合 input 来写，input 里面需要 type
<input type = “text”> //这个是输入框的意思
<input type = “password”> //这个是密码框的意思，默认是暗文
<input type = “submit”> //这个是提交的组件，也就是登录
<input type = “submit” value = “login”> //这样就改变了提交框的值
<input type = “radio”> //是单选框
<input type = “checkbox”> //是复选框
要注意语义化，所以用 p 标签更好，p 标签天生的功能就是换行
```

# 2.html 编码格式
html 编码格式是&；常用就以下三个
```
1.  空格文本，写多少个就空几格&nbsp;
2. <左尖角号，小于的意思，less than，html 编码是&lt;
3. >右尖角号，大于的意思，great than，html 编码是&gt;
```
