---
title: css3 过渡
author: lazySir
tags: [css,css3]
description: 过渡可以在不使用 Flash 动画，不使用 JavaScript 的情况下，让元素从一种样式，平滑过渡为另一
种样式。
cover: 
date: 2023-04-06
---

# 一、设置过渡元素
transition-property
作用：定义哪个属性需要过渡，只有在该属性中定义的属性（比如宽、高、颜色等）才会以有过渡效果。

# 二、设置过渡时间
transition-duration
- 作用：设置过渡的持续时间，即：一个状态过渡到另外一个状态耗时多久。
- 常用值：
	1. 0 ：没有任何过渡时间 —— 默认值。
	2. s 或 ms ：秒或毫秒。
	3. 列表 ：
		- 如果想让所有属性都持续一个时间，那就写一个值。
		- 如果想让每个属性持续不同的时间那就写一个时间的列表。
# 三、设置延迟时间
 transition-delay
 作用：指定开始过渡的延迟时间，单位： s 或 ms
# 四、设置过渡类型
transition-timing-function

- 作用：设置过渡的类型
- 常用值：
	1. ease ： 平滑过渡 —— 默认值
	2. linear ： 线性过渡
	3. ease-in ： 慢 → 快
	4. ease-out ： 快 → 慢
	5. ease-in-out ： 慢 → 快 → 慢
	6. step-start ： 等同于 steps(1, start)
	7. step-end ： 等同于 steps(1, end)
	8. steps( integer,?) ： 接受两个参数的步进函数。第一个参数必须为正整数，指定函数的
步数。第二个参数取值可以是 start 或 end ，指定每一步的值发生变化的时间点。第二个
参数默认值为 end 。
	9. cubic-bezie ( number, number, number, number)： 特定的贝塞尔曲线类型。

#  五、复合属性
transition: property duration timing-function delay;
- 如果设置了一个时间，表示 duration ；如果设置了两个时间，第一是 duration ，第二个是delay ；其他值没有顺序要求。

# 六、案例
1. 按钮效果

按钮是网页中常见的元素，我们可以通过 CSS3 过渡来为按钮添加一些动态效果，比如鼠标悬浮时的颜色变化、点击时的缩放等等。具体的实现方式如下：

```css
.button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #3e8e41;
}
```

在上述代码中，我们为按钮添加了一个背景颜色的过渡效果。当鼠标悬浮在按钮上时，按钮的背景颜色会从原来的绿色过渡到深绿色，产生一个流畅的动态效果。

2. 图片效果

CSS3 过渡还可以用来为图片添加一些动态效果。比如，当鼠标悬浮在图片上时，图片的大小可以发生变化。具体的实现方式如下：

```css
.img-container {
  width: 300px;
  height: 200px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.img-container img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s ease;
}
.img-container:hover img {
  transform: scale(1.1);
}
```

在上述代码中，我们为包含图片的容器添加了一个 overflow: hidden 属性，用于隐藏图片溢出容器的部分。然后，我们为图片添加了一个 transform: scale(1.1) 的样式，表示将图片放大 1.1 倍。当鼠标悬浮在容器上时，图片的大小会从原来的尺寸过渡到 1.1 倍大小，产生一个动态的效果。

1. 菜单效果

CSS3 过渡还可以用来为菜单添加一些动态效果。比如，当鼠标悬浮在菜单上时，菜单的字体颜色可以发生变化。具体的实现方式如下：

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f2f2;
  padding: 10px;
}

.nav li {
  list-style: none;
  margin-right: 20px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav li:hover {
  color: #4CAF50;
}
```

在上述代码中，我们为菜单项添加了一个 color 属性的过渡效果。当鼠标悬浮在菜单项上时，菜单项的字体颜色会从原来的灰色过渡到绿色，产生一个流畅的动态效果。