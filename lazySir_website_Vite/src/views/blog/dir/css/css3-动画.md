---
title: css3 动画
author: lazySir
tags: [css,css3]
description: CSS3 动画（Animation）是一种让网页元素产生动态效果的特性。与 CSS3 过渡不同的是，CSS3 动画可以实现更加复杂的动态效果，比如旋转、缩放、透明度变化等等。在本篇博客中，我们将介绍 CSS3 动画的基本语法和一些实际应用场景。
cover: 
date: 2023-04-06
---



# 一、动画的基本使用
## 1.第一步：定义关键帧（定义动画）
1. 简单方式定义：
	```css
		/*写法一*/
		@keyframes 动画名 {
		from {
		/*property1:value1*/
		/*property2:value2*/
		}
		to {
		/*property1:value1*/
		}
		}
		
	```
		
2. 完整方式定义：
	```css
		@keyframes 动画名 {
		0% {
		/*property1:value1*/
		}
		20% {
		/*property1:value1*/
		}
		40% {
		/*property1:value1*/
		}
		60% {
		/*property1:value1*/
		}
		80% {
		/*property1:value1*/
		}
		100% {
		/*property1:value1*/
		}
		}
	```
## 2.第二步：给元素应用动画
用到的属性如下：
1. `animation-name `：给元素指定具体的动画（具体的关键帧）
2. `animation-duration` ：设置动画所需时间
3. `animation-delay` ：设置动画延迟
```css
.box {
/* 指定动画 */
animation-name: testKey;
/* 设置动画所需时间 */
animation-duration: 5s;
/* 设置动画延迟 */
animation-delay: 0.5s;
}
```
# 二、动画的其他属性
## 1.设置动画的类型
animation-timing-function ，常用值如下：
1. ease ： 平滑动画 —— 默认值
2. linear ： 线性过渡
3. ease-in ： 慢 → 快
4. ease-out ： 快 → 慢
5. ease-in-out ： 慢 → 快 → 慢
6. step-start ： 等同于 steps(1, start)
7. step-end ： 等同于 steps(1, end)
8. steps( integer,?) ： 接受两个参数的步进函数。第一个参数必须为正整数，指定
函数的步数。第二个参数取值可以是 start 或 end ，指定每一步的值发生变化的时间
点。第二个参数默认值为 end 。
9. cubic-bezie ( number, number, number, number)： 特定的贝塞尔曲线类型。
## 2.指定动画的播放次数 
animation-iteration-count ，常用值如下：
1. `number` ：动画循环次数
2. `infinite` ： 无限循环
## 3.指定动画方向
animation-direction ，常用值如下：
1. `normal` ： 正常方向 (默认)
2. `reverse` ： 反方向运行
3. `alternate` ： 动画先正常运行再反方向运行，并持续交替运行
4. `alternate-reverse` ： 动画先反运行再正方向运行，并持续交替运行

## 4. 设置动画之外的状态
animation-fill-mode
1. `forwards` ： 设置对象状态为动画结束时的状态
2. `backwards` ： 设置对象状态为动画开始时的状态

## 5.设置动画的播放状态
animation-play-state ，，常用值如下：
1. `number `：动画循环次数
2. ` infinite` ： 无限循环

# 三、动画复合属性
只设置一个时间表示 duration ，设置两个时间分别是： duration 和 delay ，其他属性没有数量和顺序要求。
```css
.inner {
animation: atguigu 3s 0.5s linear 2 alternate-reverse forwards;
}
```
>备注： animation-play-state 一般单独使用。