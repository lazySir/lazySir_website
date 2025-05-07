---
title: html5笔记总结
author: lazySir
tags: [html5,html]
description: HTML5是新一代的HTML标准，引入了新的语义化标签如<header>、<article>，增强了JavaScript交互接口，提供了多媒体标签如<video>和<audio>，并改进了表单控件。同时，文章讨论了HTML5在不同浏览器的兼容性，包括对旧版IE的支持策略。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/html/cover.png
date: 2023-06-12
---

# 一、HTML5简介

## 1. 什么是HTML5
HTML5 是新一代的 HTML 标准，于2014年10月由万维网联盟（W3C）完成标准制定。

官网地址：
- W3C 提供：[https://www.w3.org/TR/html/index.html](https://www.w3.org/TR/html/index.html)
- WHATWG 提供：[https://whatwg-cn.github.io/html/multipage](https://whatwg-cn.github.io/html/multipage)

HTML5 在狭义上是指新一代的 HTML 标准，在广义上是指整个前端。

## 2. HTML5 优势
- 针对 JavaScript，新增了很多可操作的接口。
- 新增了一些语义化标签、全局属性。
- 新增了多媒体标签，可以很好地替代 Flash。
- 更加侧重语义化，对于 SEO 更友好。
- 可移植性好，可以大量应用在移动设备上。

## 3. HTML5兼容性
支持的主流浏览器包括 Chrome、Safari、Opera、Firefox等。
>IE浏览器必须是9及以上版本才支持HTML5，且IE9仅支持部分HTML5新特性。

# 二、新增语义化标签

## 1. 新增布局标签
| 标签名  | 语义              | 单/双标签 |
| ------- | ----------------- | --------- |
| header  | 整个页面，或部分区域的头部 | 双        |
| footer  | 整个页面，或部分区域的底部 | 双        |
| nav     | 导航              | 双        |
| article | 文章、帖子、杂志、新闻、博客、评论等 | 双        |
| section | 页面中的某段文字，或文章中的某段文字（里面文字通常里面会包含标题） | 双        |
| aside   | 侧边栏            | 双        |
| main    | 文档的主要内容 (WHATWG没有语义，IE不支持)，几乎不用 | 双        |
| hgroup  | 包裹连续的标题，如文章主标题、副标题的组合（W3C将其删除） | 双        |

>关于`article`和`section`：
>1. `article`里面可以有多个`section`。
>2. `section`强调的是分段或分块，如果你想将一块内容分成几段的时候，可使用`section`元素。
>3. `article`比`section`更强调独立性，一块内容如果比较独立、比较完整，应该使用`article`元素。

## 2. 新增状态标签
### 2.1 meter 标签
语义：定义已知范围内的标量测量。也被称为` gauge`（尺度），双标签，例如：电量、磁盘用量等。

常用属性如下：

属性 | 值 | 描述
--- | --- | ---
high | 数值 | 规定高值
low | 数值 | 规定低值
max | 数值 | 规定最大值
min | 数值 | 规定最小值
optimum | 数值 | 规定最优值
value | 数值 | 规定当前值

### 2.2 progress 标签
语义：显示某个任务完成的进度的指示器，一般用于表示进度条，双标签，例如：工作完成进度等。

属性 | 值 | 描述
--- | --- | ---
max | 数值 | 规定目标值。
value | 数值 | 规定当前值。

## 3. 新增列表标签


| 标签名   | 语义                               | 单/双标签 |
| -------- | ---------------------------------- | --------- |
| datalist | 用于搜索框的关键字提示               | 双        |
| details  | 用于展示问题和答案，或对专有名词进行解释 | 双        |
| summary  | 写在details的里面，用于指定问题或专有名词 | 双        |

```html
<input type="text" list="mydata">
<datalist id="mydata">
<option value="周冬雨">周冬雨</option>
<option value="周杰伦">周杰伦</option>
<option value="温兆伦">温兆伦</option>
<option value="马冬梅">马冬梅</option>
</datalist>
```
```html
<details>
<summary>如何走上人生巅峰？</summary>
<p>一步一步走呗</p>
</details>
```
## 4.新增文本标签
### 4.1 文本注音

| 标签名 | 语义                 | 单/双标签 |
| ------ | -------------------- | --------- |
| ruby   | 包裹需要注音的文字   | 双        |
| rt     | 写注音，rt标签写在ruby的里面 | 双        |

```html
<ruby>
<span>魑魅魍魉</span>
<rt>chī mèi wǎng liǎng </rt>
</ruby>
```
### 4.2 文本标记
| 标签名 | 语义 | 单/双标签 |
| ------ | ---- | --------- |
| mark   | 标记 | 双        |

> 注意： W3C 建议 mark 用于标记搜索结果中的关键字。

# 三、新增表单功能
## 1. 表单控件新增属性



| 属性名        | 功能                                              |
| ------------- | ------------------------------------------------- |
| placeholder   | 提示文字（注意：不是默认值，value是默认值），适用于文字输入类的表单控件。 |
| required      | 表示该输入项必填，适用于除按钮外其他表单控件。                |
| autofocus     | 自动获取焦点，适用于所有表单控件。                        |
| autocomplete  | 自动完成，可以设置为on或off，适用于文字输入类的表单控件。     |
| pattern       | 填写正则表达式，适用于文本输入类表单控件。                   |

>注意：密码输入框、多行输入框不可用。空的输入框不会验证，往往与required属性配合使用。
## 2. input 新增属性值
| 属性名          | 功能                                                   |
| --------------- | ------------------------------------------------------ |
| email           | 邮箱类型的输入框，表单提交时会验证格式，输入为空则不验证格式。     |
| url             | URL类型的输入框，表单提交时会验证格式，输入为空则不验证格式。       |
| number          | 数字类型的输入框，表单提交时会验证格式，输入为空则不验证格式。     |
| search          | 搜索类型的输入框，表单提交时不会验证格式。                     |
| tel             | 电话类型的输入框，表单提交时不会验证格式，在移动端使用时会唤起数字键盘。 |
| range           | 范围选择框，默认值为50，表单提交时不会验证格式。                 |
| color           | 颜色选择框，默认值为黑色，表单提交时不会验证格式。                |
| date            | 日期选择框，默认值为空，表单提交时不会验证格式。                  |
| month           | 月份选择框，默认值为空，表单提交时不会验证格式。                  |
| week            | 周选择框，默认值为空，表单提交时不会验证格式。                   |
| time            | 时间选择框，默认值为空，表单提交时不会验证格式。                  |
| datetime-local  | 日期+时间选择框，默认值为空，表单提交时不会验证格式。              |
## 3. form 标签新增属性

| 属性名     | 功能                                           |
| ---------- | ---------------------------------------------- |
| novalidate | 如果给`form`标签设置了该属性，表单提交时不再进行验证。 |
# 四、新增多媒体标签
## 1. 视频标签
`<video> `标签用来定义视频，它是双标签。

属性      | 值    | 描述
----------|-------|---------------------------
src       | URL地址 | 视频地址
width     | 像素值 | 设置视频播放器的宽度
height    | 像素值 | 设置视频播放器的高度
controls  | -     | 向用户显示视频控件（比如播放/暂停按钮）
muted     | -     | 视频静音
autoplay  | -     | 视频自动播放
loop      | -     | 循环播放
poster    | URL地址 | 视频封面
preload   | auto / metadata / none | 视频预加载，如果使用autoplay，则忽略该属性。

>要想开启自动播放，必须开启视频静音， 但是有的时候开了自动播放，也开了视频静音，但是还是有声音，这是因为媒体参与度的问题即浏览器会自动记录你打开这个网友的操作习惯如果你经常打开这个网页播放视频 那么会让你自动播放视频且不静音

>chorme媒体参与度查询地址：chrome://media-engagement/

```html
<video>
  <source src="URL地址" type="video/mp4">
  <source src="URL地址" type="video/webm">
  该浏览器不支持HTML5视频标签。
</video>
```




## 2. 音频标签
`<audio>` 标签用来定义音频，它是双标签。
属性      | 值    | 描述
----------|-------|---------------------------
src       | URL地址 | 音频地址
controls  | -     | 向用户显示音频控件（比如播放/暂停按钮）
autoplay  | -     | 音频自动播放
muted     | -     | 音频静音
loop      | -     | 循环播放
preload   | auto / metadata / none | 音频预加载，如果使用autoplay，则忽略该属性。


```html
<audio>
  <source src="URL地址" type="audio/mp3">
  <source src="URL地址" type="audio/wav">
  该浏览器不支持HTML5音频标签。
</audio>
```


# 五、新增全局属性（了解）

| 属性名           | 功能                                                         |
| ---------------- | ------------------------------------------------------------ |
| contenteditable  | 表示元素是否可被用户编辑，可选值如下：<br>- true：可编辑<br>- false：不可编辑 |
| draggable        | 表示元素可以被拖动，可选值如下：<br>- true：可拖动<br>- false：不可拖动 |
| hidden           | 隐藏元素                                                     |
| spellcheck       | 规定是否对元素进行拼写和语法检查，可选值如下：<br>- true：检查<br>- false：不检查 |
| contextmenu      | 规定元素的上下文菜单，在用户鼠标右键点击元素时显示               |
| data-*           | 用于存储页面的私有定制数据                                     |

# 六、HTML5兼容性处理

- 添加元信息，让浏览器处于最优渲染模式。
```html
<!--设置IE总是使用最新的文档模式进行渲染-->
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<!--优先使用 webkit ( Chromium ) 内核进行渲染, 针对360等壳浏览器-->
<meta name="renderer" content="webkit">
```

- 使用`html5shiv`让低版本浏览器认识H5的语义化标签。

```html
<!--[if lt ie 9]>
<script src="../sources/js/html5shiv.js"></script>
<![endif]-->
```

-	扩展
	- lt 小于
	- lte 小于等于
	- gt 大于
	- gte 大于等于
	- ! 逻辑非

示例：
```html
<!--[if IE 8]>仅IE8可见<![endif]-->
<!--[if gt IE 8]>仅IE8以上可见<![endif]-->
<!--[if lt IE 8]>仅IE8以下可见<![endif]-->
<!--[if gte IE 8]>IE8及以上可见<![endif]-->
<!--[if lte IE 8]>IE8及以下可见<![endif]-->
<!--[if !IE 8]>非IE8的IE可见<![endif]-->
```