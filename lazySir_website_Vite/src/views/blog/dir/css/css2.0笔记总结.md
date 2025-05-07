---
title: css2.0笔记总结
author: lazySir
tags: [css]
description: css2.0是CSS的第二个版本，它引入了一些新的特性和功能，使得网页设计更加灵活和美观。本文将总结css2.0的一些重要概念和用法。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/css/css图片.png
date: 2022-10-23
---

# 一、CSS权重值
| 标签名 | 权重值 |
|--|--|
|！important  | infinity正无穷 |
|行间样式|1000|
id选择器|100|
|class选择器、属性选择器、伪类选择器|10|
|标签选择器、伪元素选择器|1|
|通配符选择器|0|

1. 在计算机中，正无穷+1>正无穷
2. 如果权重值一样（优先级一样），会显示后面的
就是先来后到，谁在后面，谁（后面的）覆盖前面的——后面的会覆盖前面的
3. 在权重中，是 256 进制，是从 0 到 255 后变成 1
所以这里的 1000 不是一千，100 不是一百

# 二、复杂选择器
## 1.父子选择器
语法格式：
最外面的结构 外面的结构 里面的结构{} 就是一个父子结

例只选出 div 里面的 span
```html
<div>
	<sapn></span>
</div>
```
div span{
background-color:red;
}

>父子选择器中，每一个层级，都不一样,要是标签选择器，写 class 选择器也行，重要的是表达出来父子关系。而且这种父子关系有可能是间接地，也有可能是直接的

## 2.直接子元素选择
如果写成 div > em{} 意思就是 div 下面直接一级的 em
```html
<div>
	<em></em>
</div>
```

## 3.并列选择器
格式 div.demo 在.之前不用写空格，这就是并列选择器

例在下面这种情况下，让 2 变红，如何写 css？
```html
<div>1</div>
<div class="demo">2</div>
<p class="demo">3</p>
```
```css
div.demo{
background-color:red
}

```
## 4.分组选择器
可以简化代码（常用功能）

例想把 1，2，3 都变红
```html
<em>1</em>
<strong>2</strong>
<del>3</del>
```
```css
em,
strong,
del{
background-color:red
}
```
>可以写成一行，但是开发中一般都竖着写，方便看
## 5.伪类选择器
格式 任意选择器:怎么动 后面有很多种写法 
任意选择器:hover 是一种比较常见的写法

# 三、设置字体
|属性名| 属性值（举例） |效果/功能|
|--|--| --|
|  font-size| 12px |设置字体大小，默认是 16px，但是互联网字体一般用12px或者14px，这个设置的是字体的大小|
|font-weight|lighter（细体），normal正常（默认值），bold（加粗和strong标签一样），bolder（更粗），100-900|字体的粗细是跟字体包有关|
|font-style|italic|斜体，em这个标签本身就带有italic的样式|
|font-family|arial|设置字体包的样式，这个是乔布斯发明的字体|
|color|三种写法间下面|注意字体颜色直接写color，不写font-color|
|border|1px solid black|这是一个复合属性。可以给容器加外边框。第一位是border-width：代表粗细，第二位是border-style 设置实心solid 虚线dashed，第三位是border-color 设置颜色|
|text-align| left 左对齐，right 右对齐，center 一行居中|对齐方式|
|line-height|16px，单行文本所占的高度当line-height=height时，当行文本水平垂直居中，1.2em，单行文本所在的高度。意思是文字的行高是1.2倍行高|行高|
|text-indent|2em|意思是首行缩进2em（2个文本单位）|
|text-decoration|line-through中划线，none 没有线，underline 下划线，overline 上划线|线|
cursor|pointer|光标定位置（cursor：pointer）鼠标变成一个小手|


## 1.字体颜色的 color 三种写法：
1. 纯英文单词：red，green 等（一般不用）
2. 颜色代码，如#ff4400; 其中每两位都是从 00 到 ff，分别对应红 r（从 00 到 ff），绿 g（从 00 到 ff），蓝 b（从 00 到 ff），这是一个十六进制的数，代表的是饱和度，如果没两位都可以重复，那么简写成#f40 淘宝红，#ffffff 白色，#000000 黑色。
3. 颜色函数，如 color:rgb(255,255,255); //这是白色
rgb（0-255，0-255，0-255）里面的 0-255 是十进制数
transparent 是透明色

## 2.单位
单位的衡量标准：绝对单位（m，cm 等），相对单位（px，em 等）
px 是像素的意思，一个像素只能显示一个颜色；
屏幕的分辨率，就是说的像素，国际标准是每英寸所能容纳的垂直像素点数。
em 是文本单位，1em = 1* font-size 该文本的字体大小

# 四、标签的分类（归类）
我们可以通过 display 更改元素属性，如果写成 display:none;元素就没有了
## 1.行级元素
**属性值：**
display：inline


**特点：**
1. 内容决定元素所占位置
2. 不可以通过css改变宽高


**例如：**
 span，strong，em，a，del

行级元素自带 CSS 属性，可更改自带属性
span 自带隐藏属性 display:inline; 可以通过改成 block 变成块级元素

## 2.块级元素
**属性值**
display：block

**特点：**
1. 独占一行
2. 可以通过css改变宽高

**例如：**

div，p，ul，li，ol，form，address

## 3.行级块元素
**属性值：**
display：inline-block

**特点：**
1. 内容决定大小
2. 可以改变宽高



# 五、编程思路
1. 小白式一：先写 html，再写 css
2. 小白式二：一边写 html，一边写 css
3. 最好的编程思想：先写 css 定义颜色尺寸等，再写 html也就是先定义功能，后选配功能（方便团队合作）

# 六、初始化元素
改变 html 自带的系统属性，变成自定义标签

|天生自带| 去掉自己带的 |
|--|--|
| em标签带斜体 | em{font-style：normal} |
|无序标签|ul{list-style：none 去掉远点；padding：0，margin：0}|
|a标签|a{text-decoration：none；color：#424242 互联网标准黑}|
|*通配符选择器初始化所有的标签|*{padding：0；margin：0；text-decoration：none；list-style：none}

# 七、盒子模型
1. 盒子的组成三大部分：
     - 盒子璧border
     - 盒子内边距padding
     - 盒子内容content=width+height
2. 盒子模型（四部分组成）
     - 盒子璧border
     - 盒子内边距padding
     - 盒子内容content=width+height
     - 盒子外边距margin
![css图片](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/css/css2.0.png)
1. padding:上 右 下 左；（顺时针） padding:上下 左右；（两个值）
2. padding:上 左右 下；（三个值，中间代表左右），一个值的时候设置四个方向padding-left:10px; 代表单独设置左侧，也可写成 padding:0 0 0 10px;
3. margin 和 border-width 的设置方法和 padding 是一样的
如 border-width:100px 10px 30px 50px; //这样盒子壁四边都不一样了

# 八、定位
## 1.position:absolute
绝对定位定位：脱离原来位置定位

定位元素需要配合 right，left，top，bottom 使用（浏览器 y 轴是向下的），但是一般是不设置 bottom 的，因为浏览器一般没有底部


>body 自带的属性，是 margin:8px;

## 2.position:relative
relative 是保留原来位置进行定位

## 3.比较
1. absolute 定位：脱离原来位置定位。是相对于最近的有定位的父级进行定位；如果没
有有定位的父级元素，就相对于文档进行定位
2. relative 定位：保留原来的位置进行定位，相对于自己原来（出生的）的位置进行定
位

## 4.经验
什么时候用 relative，什么时候用 absolute？

如果想定位，最好找参照物。

absolute 定位：脱离原来位置定位。是相对于最近的有定位的父级进行定位；如果没有有定位的父级元素，就相对于文档进行定位

relative 定位：保留原来的位置进行定位，相对于自己原来（出生的）的位置进行定位我们一般用 relative 作为参照物（不用 relative 进行定位），用 absolute 进行定位

给一个元素只设置一个 relative，不设置 left，right，top，bottom，看起来是对这个元素没什么影响的，但是它保留了原来的位置，就对后续元素没有什么影响absolute 可以任意的调整自己的参照物，更加灵活，所以用于定位想让谁成为基地，就给谁 relative 定位，并且不设置方向

## 5.position:fixed;
固定定位
可以用作小广告，不管滚动条怎么动，它都在一个固定的位置上面
需要搭配 right，left，top，bottom 使用

## 九、浮动元素
## 1.浮动元素产生了浮动流
（浮动流产生的效果）所有产生了浮动流的元素，块级元素看不到他们。
产生了 bfc 的元素和文本类属性（带有 inline 属性就是文本类属性）的元素以及文本都能看到浮动元素。

## 2.清除浮动流
```css
::after{
	display:block;
	clear:both;
	content:"";
}
```