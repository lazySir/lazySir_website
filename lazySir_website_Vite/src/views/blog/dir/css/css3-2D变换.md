---
title: css3 2D变换
author: lazySir
tags: [css,css3]
description: 2D 位移可以改变元素的位置
cover:  https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/css/css图片.png
date: 2023-04-06
---


# 一、2D位移
2D 位移可以改变元素的位置，具体使用方式如下：
1. 先给元素添加 转换属性 transform
2. 编写 transform 的具体值，相关可选值如下：
 	- `translateX`：设置水平方向位移，需指定长度值；若指定的是百分比，是参考自身宽度的百分比。
 	- `translateY`：设置垂直方向位移，需指定长度值；若指定的是百分比，是参考自身高度的百分比。
 	- `translate` ：一个值代表水平方向，两个值代表：水平和垂直方向。
>注意点：
>1. 位移与相对定位很相似，都不脱离文档流，不会影响到其它元素。
>2. 与相对定位的区别：相对定位的百分比值，参考的是其父元素；定位的百分比值，参考的是其自身。
>3. 浏览器针对位移有优化，与定位相比，浏览器处理位移的效率更高。
>4. transform 可以链式编写，例如：
>transform: translateX(30px) translateY(40px);
>5. 位移对行内元素无效。
>6. 位移配合定位，可实现元素水平垂直居中
>.box {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
}


# 二、2D缩放
2D 缩放是指：让元素放大或缩小，具体使用方式如下：
1. 先给元素添加 转换属性 transform
2. 编写 transform 的具体值，相关可选值如下：
	- `scaleX`：设置水平方向的缩放比例，值为一个数字， 1 表示不缩放，大于 1 放大，小于 1 缩小。
	- `scaleY`：设置垂直方向的缩放比例，值为一个数字， 1 表示不缩放，大于 1 放大，小于 1 缩小。
	- `scale`：同时设置水平方向、垂直方向的缩放比例，一个值代表同时设置水平和垂直缩放；两个值分别代表：水平缩放、垂直缩放。

> 注意点：
> 1. scale 的值，是支持写负数的，但几乎不用，因为容易让人产生误解。
> 2. 借助缩放，可实现小于 12px 的文字。

# 三、2D旋转
2D 旋转是指：让元素在二维平面内，顺时针旋转或逆时针旋转，具体使用方式如下：
1. 先给元素添加 转换属性 transform
2. 编写 transform 的具体值，相关可选值如下：
	- `rotate` ： 设置旋转角度，需指定一个角度值( deg )，正值顺时针，负值逆时针。
>注意： rotateZ(20deg) 相当于 rotate(20deg) ，当然到了 3D 变换的时候，还能写：rotate(x,x,x)