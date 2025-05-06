---
title: css3 媒体查询--响应式布局
author: lazySir
tags: [css,css3]
description: CSS的 :nth-child 选择器是一个强大的工具，允许我们根据它们在父元素中的位置选择元素。这为我们提供了更大的灵活性来控制页面上的元素。
cover: 
date: 2023-04-07
---

<hr>

### 媒体查询

#### 1.1 媒体类型


| 值         | 含义                                                  |
| ---------- | ----------------------------------------------------- |
| all        | 检测所有设备。                                        |
| screen     | 检测电子屏幕，包括：电脑屏幕、平板屏幕、手机屏幕等。  |
| print      | 检测打印机。                                          |
| speech     | 应用于语音和声音合成器，已废弃。                      |
| braille    | 应用于盲文触摸式反馈设备，已废弃。                    |
| embossed   | 应用于打印的盲人印刷设备，已废弃。                    |
| handheld   | 应用于掌上设备或更小的装置，如PDA和小型电话，已废弃。 |
| projection | 应用于投影设备，已废弃。                              |
| tv         | 应用于电视和网络电视，已废弃。                        |


完整列表请参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media)。



#### 1.2 媒体特性
| 值               | 含义                           |
| ---------------- | ------------------------------ |
| width            | 检测视口宽度                   |
| max-width        | 检测视口最大宽度               |
| min-width        | 检测视口最小宽度               |
| height           | 检测视口高度                   |
| max-height       | 检测视口最大高度               |
| min-height       | 检测视口最小高度               |
| device-width     | 检测设备屏幕的宽度             |
| max-device-width | 检测设备屏幕的最大宽度         |
| min-device-width | 检测设备屏幕的最小宽度         |
| orientation      | 检测视口的旋转方向（是否横屏） |

`orientation` 属性的值：

1. `portrait`：视口处于纵向，即高度大于等于宽度。
2. `landscape`：视口处于横向，即宽度大于高度。


#### 1.3 运算符
- `and`：并且
- `,` 或 `or`：或
- `not`：否定
- `only`：肯定
#### 1.4 常用阈值

在实际开发中，会将屏幕划分成几个区间，例如：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/86bd9792c2571001416ec9b875cb667a.png)


- 超小屏幕（小于 576px）：移动设备的竖屏状态。
- 小屏幕（576px 及以上）：不超过 576px 的视口宽度。
- 中等屏幕（768px 及以上）：大于等于 576px 且小于 992px 的视口宽度。
- 大屏幕（992px 及以上）：大于等于 992px 且小于 1200px 的视口宽度。
- 超大屏幕（1200px 及以上）：大于等于 1200px 的视口宽度。

#### 1.5结合外部样式的用法
用法一：
```js
<link rel="stylesheet" media="具体的媒体查询" href="mystylesheet.css">
```
用法二：
```css
@media screen and (max-width:768px) {
/*CSS-Code;*/
}
@media screen and (min-width:768px) and (max-width:1200px) {
/*CSS-Code;*/
}
```