---
title: js的dom操作
author: lazySir
tags: [js]
description:  DOM定义了表示和修改文档所需的方法。DOM对象即为宿主对象，由浏览器厂商定义，用来操作html和xml功能的一类对象的集合。也有人称DOM是对HTML以及XML的标准编程接口
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js.png
date: 2022-11-16
---

# 一、什么是DOM
1. DOM -> Document Object Model
2. DOM定义了表示和修改文档所需的方法。DOM对象即为宿主对象，由浏览器厂商定义，用来操作html和xml功能的一类对象的集合。也有人称DOM是对HTML以及XML的标准编程接口
# 二、DOM的基本操作
## 1、查
### 1. 查看元素节点

1. document代表整个文档(类似于最外层的标签)
2. getElementById()//元素id在ie8以下的浏览器，不区分id大小写，而且也返回匹配name属性的元素 
3. getElementsByTagName（） //通过标签名获取元素 例如div 、span等但获取的是这个元素的数组集合
4. getElementsByName（） //通过name属性获取，注意：在之前的浏览器只有部分标签name可以生效（表单form，表单元素，img，iframe）
5. getElementsByClassName（）//通过class类名获取，ie8和ie8以下的ie版本中没有这个方法，可以多个class一起
6. querySelector() //css选择器  选择单一的 （）里面可以按css一样获取元素  在ie7和ie7以下的版本没有 
7. querySelectorAll（）//css选择器 就算选择的是单一的 也会变成类数组 在ie7和ie7以下的版本没有

>1.一切的dom生成的组的东西都是类数组（类数组：可以当数组用也可以当对象用）
>
>2.除了getElementById以外选的全是一组
>
>3.querySelector和querySelectorAll选择的是静态的不是动态的
>4.get查找的元素节点是实时的动态的

### 2.遍历节点树
 - parentNode -》父节点（最顶端的parentNode为#document）
 - childNodes -》子节点们 （直系子节点孙子不算）
 - firstChild -》第一个子节点
 - lastChild-》最后一个子节点
 - nextSibling-》后一个兄弟节点
 - previousSibling-》前一个兄弟节点
>包含所有节点  
>元素节点  
>属性节点
> 文本节点
>  注释节点
>  document 
>    DocumentFragment
 
### 3.基于元素节点树的遍历
 - parentElement ->返回当前元素的父元素节点（IE不兼容）
 - children->只返回当前元素的元素子节点
 - childElementCount ===children.length当前元素节点的子元素个数（IE不兼容）
 - firstElementChild->返回的是第一个元素节点（IE不兼容）
 - lastElementChild->返回的是最后一个元素节点（IE不兼容）
 - nextElementSibling/previousSibling->返回前一个兄弟元素节点/后一个兄弟元素节点（IE不兼容）
 >IE不兼容意思是IE9及9以下不兼容，当时IE市场占有率大，不根据W3C规范。
### 4.节点的类型
 - 元素节点 ---1
 - 属性节点 ---2
 - 文本节点----3
 - 注释节点----8
 - document---9
 - DocumentFragment----11
>后面的数字是nodeType返回的数字
### 5.节点的一个方法
Node.hasChildNodes()  //是否有子节点 返回true/false
>当且仅当标签中间无任何符号包括回车空格的时候返回false

### 6.节点的四个属性
#### 1.获取节点名称
nodeName
  - 元素的标签名，以大写形式表示，只读
#### 2.获取节点值
 nodeValue
   - 只有Text节点或Comment节点拥有，显示的是文本内容，可读写
 - nodeType
   - 该节点的类型，只读
 - attributes
   - Element节点的属性集合
## 2.增
### 1.创建元素节点
  document.createElement();
```js
    var strong =  document.createElement('strong');//生成一个strong元素
    strong.innerHTML = 'hello world';//给strong元素添加内容 变成<strong>hello world</strong>
```
### 2.创建文本节点
  document.createTextNode();
```js
    var text = document.createTextNode('hello world!!');//生成一个文本节点
    var div = document.getElementsByTagName('div')[0];
    div.appendChild(text);//把文本节点添加到div里面
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作1.png)
###  3.创建注释节点
 document.createComment();
```js
  var comment = document.createComment('this is a comment')//创建一个注释节点
  var div = document.getElementsByTagName('div')[0];
  div.appendChild(comment);//把注释节点添加到div里面
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作2.png)

### 4.创建碎片节点
 document.createDocumentFragment() 
## 3.插
### 1.插入到（类似push）
- PARENTNODE.appendChild()；插入元素到parentNode（什么东西调用这个方法就是插入到什么东西里面） 类似于push方法
>1.只要是元素就有appendChild方法
```js
    var div =  document.createElement('div');//生成一个div元素
    div.innerHTML = 'hello world';//给div元素添加内容
    document.body.appendChild(div);//将div插入到body中

  var div = document.getElementsByTagName('div')[0];
  var text = document.createTextNode('insert!!');
  div.appendChild(text)
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作3.png)

### 2.插入到什么之前
PARENTNODE.insertBefore(a,b) //a是要插入的内容  b是在插入位置（会插入到b的前面） insert A before B
```js
<body>
  <div>
    <span></span>
  </div>
</body>

<script>
  var strong = document.createElement("strong");//创建strong元素
  var div = document.getElementsByTagName('div')[0]//获取div
  var span = document.getElementsByTagName('span')[0]//获取span
  div.insertBefore(strong, span)//将strong元素插入到span元素之前
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作4.png)

## 4.删
### 1.父节点删除子节点
parent.removeChild(); 
```js
<body>
  <div>
    <span></span>
    <strong></strong>
  </div>
</body>

<script>
  var div = document.querySelector('div'); //获取div
  var span = document.querySelector('span');//获取span
  div.removeChild(span)//div中删除span
</script>
```
### 2.自己删掉自己
child.remove() 
```js
<body>
  <div>
    <span></span>
    <strong></strong>
  </div>
</body>
<script>
  var div = document.querySelector('div'); //获取div
  var span = document.querySelector('span');//获取span
  span.remove()//span自尽
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作5.png)

## 5.替换
- parent.replaceChild(new,origin) //拿新的元素替换老的元素
```js
<body>
  <div>
    <span></span>
    <strong></strong>
  </div>
</body>
<script>
  var div = document.querySelector('div'); //获取div
  var span = document.querySelector('span');//获取span
  var p = document.createElement('p'); //创建p
  div.replaceChild(p,span) //将p替换span
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作6.png)



# 三、DOM结构树

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作7.png)
## 1.document和Document
1. Document是构造函数 只不过有点特殊 不能new 只能系统new 
2. document相当于实例化对象
3. 在Document上的prototype上加东西 document能访问到
4. 继承关系document---->HTMLDocument.prototype---->Document.prototype
## 2.继承关系
```java
  //document原型
  console.log(document.__proto__)//HTMLDocument
  //HTMLDocument原型
  console.log(document.__proto__.__proto__)//Document
  //Document原型
  console.log(document.__proto__.__proto__.__proto__)//Node
  //Node原型
  console.log(document.__proto__.__proto__.__proto__.__proto__)//EventTarget
  //EventTarget原型
  console.log(document.__proto__.__proto__.__proto__.__proto__.__proto__)//Object
  //Object原型
  console.log(document.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__)//null
```
# 四、dom一些方法定义所在地
1. getElementById方法定义在Document.prototype上，即Element节点上不能使用。
2. getElementsByName方法定义在这HTMLDocument.prototype上即非html中的document不能使用（xml docuument，Element）
3. getElementByTagName定义在Document.prototyepe和Element.prototype上
4. HTMLDocument.prototype定义了一些常用的属性，body，head，分别指代HTML文档中的body和head标签即document.body--->《body》
5. Document.prototype上定义了documentElement属性，指代文档的根元素，在HTML文档中指代html元素即document.documentElement---->《html》
6. getElementsByClassName、querySelectorAll、querySelector在Document.prototytpe,Element.prototype类中均有定义

# 五、Element节点的方法和属性
## 1.Element节点的一些属性
### 1.改变内容
- innerHTML //能改变元素里面的内容
>会覆盖之前的内容
```js
<body>
  <div>
    <span>123</span>
    <strong>234</strong>
  </div>
</body>

<script>
  var span  =document.getElementsByTagName('span')[0];
  var strong = document.getElementsByTagName('strong')[0];
  var div = document.getElementsByTagName('div')[0]
  div.innerHTML="123" //div中插入123 会覆盖之前的内容
  div.innerHTML +=456 //不会覆盖
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作8.png)
也可以插入一些标签以及css样式
```js
<body>
  <div>
    <span>123</span>
    <strong>234</strong>
  </div>
</body>
<script>
  var span  =document.getElementsByTagName('span')[0];
  var strong = document.getElementsByTagName('strong')[0];
  var div = document.getElementsByTagName('div')[0]
  div.innerHTML ="<span style = 'background-color:red;color:#fff;font-size:20px'>123</span>"
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作9.png)

### 2.改变文本

- innerText(老版本火狐不兼容)/textContent(老版本IE不好使)

直接取
```js
<body>
  <div>
    <span>123</span>
    <strong>234</strong>
  </div>
</body>
<script>
  var span  =document.getElementsByTagName('span')[0];
  var strong = document.getElementsByTagName('strong')[0];
  var div = document.getElementsByTagName('div')[0]
  console.log(div.innerText)//如果直接写会打印里面的内容 不会管什么标签
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作10.png)
赋值
```js
<body>
  <div>
    <span>123</span>
    <strong>234</strong>
  </div>
</body>
<script>
  var span  =document.getElementsByTagName('span')[0];
  var strong = document.getElementsByTagName('strong')[0];
  var div = document.getElementsByTagName('div')[0]
  div.innerText="123" //赋值  会将所有内容覆盖掉 div里的所有元素会消失
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作11.png)


## 2.Element节点的一些方法
### 1.设置元素属性和属性值
ele.setAttribute（"name","value"）
```html
<body>
  <div></div>
</body>
<script>
  var div = document.getElementsByTagName('div')[0]
  div.setAttribute("id", "only")//给div设置id属性和id值
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作12.png)

### 2.获取元素属性和属性值
ele.getAttribute("name")
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作13.png)







# 六、获取窗口属性，获取dom尺寸
## 1.查看滚动条的滚动距离
即获取滚动条的x，y轴
1. window.pageXOffset /pageYOffset
 - IE8以及IE8以下不兼容
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作14.png)
2. document.body/documentElement.scrollLeft/scrollTop
 - 兼容性比较混乱，用时取两个值相加，因为不可能存在两个同时有值
>IE8和IE8以下的浏览器 可以使用document.body.scrollLeft/scrollTop  ie8 ie5 ie4
>document.documentElement.scrollLeft/Top ie7 ie6
>上面两个方法一定相互冲突 一方有一方就为0
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作15.png)
所以一般在IE8以下是 使用两个相加的值document.documentElement.scrollLeft+document.body.scrollLeft

## 2.查看视口的尺寸
即获取浏览器可视区的宽高大小
1. window.innerWidth/innerHeight  
 - IE8及IE8以下不兼容
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作16.png)

2. document.documentElement.clientWidth/clientHeight
- 标准模式下，任意浏览器都兼容
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作17.png)

3. document.body.clientWidth/clientHeight
- 适用于怪异模式下的浏览器
>怪异模式：是否在html上面添加<!DOCTYPE html> 如果添加则是标准模式 不添加则是怪异模式 怪异模式的唯一用途就是为了兼容之前的语法规则比如ie5写的代码 那ie6看可能会不兼容 

## 3.查看元素的几何尺寸(不常用)
1. 任何dom对象.getBoundingClientRect();
2. 兼容性很好
3. 该方法返回一个对象，对象里面有left top right bottom 等属性。left和top代表该元素左上角的x和y的坐标，right和bottom代表元素右下角的x和y的坐标
4. height和width属性老版本IE并未实现(如果要实现可以right-left，bottom-top)
5. 返回的结果不是“实时的”
```html
<body>
<div style="height:100px;width: 100px;position: absolute;left: 100px;top:100px;background-color:red ;"></div>
</body>
<script>
  //1.先将元素选出
  var div=document.getElementsByTagName('div')[0];
  console.log(div.getBoundingClientRect())

</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作18.png)
>这个方法基本不用 了解即可
## 4.查看元素的尺寸
宽：任何dom对象.offsetWidth
高：任何dom对象.offsetHeight

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作19.png)
>求的是视觉上的尺寸 不是元素本身的px
## 5.查看元素的位置
### 1.方法一
该元素左上角的
x：任何dom对象.offsetLeft
y：任何dom对象.offsetTop
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作21.png)
>对于无定位父级的元素，返回相对文档的坐标。对于有定位父级返回相对于最近的有定位的父级的坐标。

### 2.方法二
任何dom对象.offsetParent
返回最近的有定位的父级，如无，返回body,body.offsetParent返回null

## 6.让滚动条滚动
### 1.window上的三个方法
三个方法功能类似，用法都是将xy坐标传入。即实现让滚动论滚动到x，y轴的位置。
1. scroll（x,y）
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作22.png)

2. scrollTo （x,y）
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作23.png)
>window.scroll 和window.scrollTo 方法一样  兼容性也一样 记一个就可以了
3. scrollBy（x,y）
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作24.png)

>这个是累加滚动，会在原先的基础上继续添加 也就是x轴+多少 y轴+多少

# 七、脚本化CSS
## 1.读写元素CSS属性
1. dom.style.prop
    -  可读写行间样式，没有兼容性问题，碰到float这样的保留字属性，前面应该加CSS
    - eg：float---->cssFloat
    - 复合属性必须拆解，组合单词变成小驼峰式写法
    - 写入的值必须是字符串格式 
>除了.style之外其他的所有间接方法都是不可以写入值的，都说是读取值

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作25.png)
>div.style会返回样式表，里面的属性是可读可写的

### 1.代码
```js
<body>
  <div style="height: 100px;width: 100px;background-color: red;"></div>
</body>

<script>
  var div = document.getElementsByTagName('div')[0];
  
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作26.png)
### 2.小驼峰式案例
错误写法：
因为没有-这种形式的  所以需要改写成小驼峰式
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作27.png)

正确写法：
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作28.png)
### 3.只有写在行间样式里的东西才能被读取
将1.的案例中的width属性写在style标签里
```html
  <style>
    div{
      width: 200px;
    }
  </style>

<body>
  <div style="height: 100px;background-color: red;"></div>
</body>

<script>
  var div = document.getElementsByTagName('div')[0];
</script>
```
此时获取height有值而width无值
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作29.png)
>即间接操作CSS写入的css属性都会写在行间样式上面

### 4.保留字案例
什么叫保留字？
int float double 这种以后可能会用到的

在1上面添加float：left属性

```js
<body>
  <div style="width: 100px;float:left; height: 100px;background-color: red;"></div>
</body>

<script>
  var div = document.getElementsByTagName('div')[0];
</script>
```
其实直接写div.style.float 也能获取到值 但是根据W3C规则 最好写成cssFloat
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作30.png)
### 5.复合属性建议拆解
在以前的版本中必须拆解写 但是现在不需要了
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作31.png)


## 2.查询计算样式
1. window.getComputedStyle(ele,null)
    -  计算样式只读
    - 返回的计算样式的值都是绝对值，没有相对单位
    - IE8及IE8以下不兼容
    - null是存放伪元素的 用它可以获取伪元素的样式表
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作32.png)

  
 >和div.style返回的类数组的差别就是div.style返回的东西是有空的即你没写的东西属性值为空，而getComputedStyle返回的是一切这个元素显示的值包括默认值

### 1.与div.style对比案例：

```js
  <style>
    div{
      width: 200px;
    }
  </style>
</head>

<body>
  <div style="float:left; height: 100px;background-color: red;"></div>
</body>

<script>
  var div = document.getElementsByTagName('div')[0];
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作33.png)
>getComputedStyle()获取的数据更准确

### 2. 只读案例
通过这个方法获取的属性不可更改
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作34.png)
### 3.返回的都是绝对值案例
这个方法返回的数据是经过计算的 不会返回原本的数据
```js
 <style>
    div{
      width: 10em;
    }
  </style>

<body>
  <div style="float:left; height: 100px;background-color: red;"></div>
</body>

<script>
  var div = document.getElementsByTagName('div')[0];
</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作35.png)
em相对于px肯定是相对的 原本的长度为16px  10em就是扩大十倍 即返回160px 不会返回10em  还有backgrounColor 不会直接返回red 而是返回rgb

### 4.获取伪元素样式表案例
代码
```html
  <style>
    div::after{
      content:"";
      width: 50px;
      height:10px;
      background-color: green;
      display: inline-block;
    }
  </style>

<body>
  <div style="float:left; width:100px;height: 100px;background-color: red;"></div>
</body>

<script>
  var div = document.getElementsByTagName('div')[0];
</script>
```
前面一个是写谁的伪元素就填谁，第二个填伪元素名称
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作36.png)
>但是 这个只能获取 不能写入
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作37.png)

那么怎么改变伪元素？
现有一个要求 点击div切换绿色和橘色 （通过伪元素改变）
实现：通过设定class间接改变

```html
  <style>
    .green::after {
      content: "";
      width: 50px;
      height: 10px;
      background-color: green;
      display: inline-block;
    }

    .orange::after {
      content: "";
      width: 50px;
      height: 10px;
      background-color: orange;
      display: inline-block;
    }
  </style>
</head>

<body>
  <div class="green" style="float:left; width:100px;height: 100px;background-color: red;"></div>
</body>

<script>
  var div = document.getElementsByTagName('div')[0];
  var i = 0;
  div.onclick = function () {
    if (i % 2 == 0) { 
      div.setAttribute("class", "orange") 
      i++
    } else {
      div.setAttribute("class", "green")
      i++
    }

  }
</script>
```
>通过修改class会提高效率，每次操作dom会浪费效率，这样子减少了dom操作。且好维护


## 3.查询样式（IE）
为什么会有这个 因为当时IE市场占有率太高，不遵循W3C规则，自己写了查询样式方法

1. 元素节点.currentStyle
   - 计算样式只读
   - 返回的计算样式的值不是经过转换的绝对值
   - IE独有的属性
   
# 案例
## 1.修改class与添加class小案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .active {
      background-color: yellow;
    }

    .content {
      display: none;
      width: 200px;
      height: 200px;
      border: 2px solid red
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <button class="active">111</button>
    <button>222</button>
    <button>333</button>
    <div class="content" style="display:block">显示1的内容</div>
    <div class="content">显示2的内容</div>
    <div class="content">显示3的内容</div>
  </div>
</body>

<script type="text/javascript">
  var btns = document.getElementsByTagName('button')
  var divs = document.getElementsByClassName('content')
  //法一：var定义的变量
//   for (var i = 0; i < btns.length; i++) {
//     // 利用闭包做
//     (function (n) {
//       btns[i].onclick = function () {
//         //1.首先清除所有样式
//         for (var j = 0; j < btns.length; j++) {
//           btns[j].className = ""
//           divs[j].style.display = "none"
//         }
//         //2.给当前点击的btn添加acive属性
//         this.className = 'active'
//         //3.给对应的div添加block属性
//         divs[n].style.display = "block"

//       }
//     }(i))
// }
  //法二：let定义的变量
  for (let i  = 0 ; i<btns.length;i++){
        //法二：利用this做
        btns[i].onclick = function () {
      //1.首先清除所有样式
      for (var j = 0; j < btns.length; j++) {
        btns[j].className = ""
        divs[j].style.display = "none"
      }
      //2.给当前点击的btn添加acive属性
        this.className='active'
      //3.给对应的div添加block属性
        divs[i].style.display = "block"
    }
  }


</script>

</html>
```
## 2.移动小方块案例

```java
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

</head>

<body>

</body>

<script type="text/javascript">
  //创建元素
  var div = document.createElement('div')
  //将元素添加进body
  document.body.appendChild(div)
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.backgroundColor = "red"
  div.style.position = "absolute"
  div.style.left = "0"
  div.style.top = '0'
  //能够检测到按下的键的code
  document.onkeydown = (e) => {
    // console.log(e)  //上38 下40 左37 右39
    switch (e.which) {
      case 38:
        div.style.top = parseInt(div.style.top) - 5 + 'px' //电脑的yy是反的
        break;
      case 39:
        div.style.left = parseInt(div.style.left) + 5 + "px"
        break;
      case 40:
        div.style.top = parseInt(div.style.top) + 5 + "px"
        break;
      case 37:
        div.style.left = parseInt(div.style.left) - 5 + "px"
        break;
    }
  }
  //每隔100毫秒会执行一次函数
  // setInterval(function () {
  //   div.style.left = parseInt(div.style.left) + 1 + 'px'
  //   div.style.top = parseInt(div.style.top) + 1 + 'px'
  // }, 100)

</script>

</html>
```

## 3.遍历元素节点数（在原型链上编程）
## 4.封装函数，返回元素e的第n层祖先元素节点
```js
<script type="text/javascript">
  var span = document.getElementsByTagName('span')[0]
  function retParent(elem,n){
    //判断elem是否为null 因为一直返回父节点到最后是null
    while(elem && n){
      //返回当前元素节点的父节点
      elem = elem.parentElement;
      //将n--
      n--;
    }
    return elem;
  }
</script>
```
## 5.封装函数，返回元素e的第n个兄弟元素节点，n为正，返回后面的兄弟元素节点，n为负，返回前面的，n为0，返回自己
```js
<script type="text/javascript">
  var span = document.getElementsByTagName('span')[0]
  function retSibling(e, n) {
    //当前元素是否由意义 即是否为null
    while (e && n) {
      if (n > 0) {
        //n为正数返回后面的兄弟元素节点
        //如果是ie9及以上版本
        if (e.nextElementSibling) { e = e.nextElementSibling; }
        //是ie9以下版本
        else {
          //执行 判断条件（为什么要加个e是因为如果是最后的文本节点的下一个为null 它的nodeType也是不等于1，会再次执行语句，null.nextSibling就报错了） 为真时执行的代码  
          for (e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling) { }
        }

        n--;
      } else {
        //n为负数要返回前面的兄弟元素节点
        if (e.previousElementSibling) { e = e.previousElementSibling; }
        else {
          for (e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling) {}
        }
        n++;
      }
    }
    return e;
  }
</script>
```
## 6.编辑函数，封装myChildren功能，解决以前部分浏览器的兼容问题
```js
<script type="text/javascript">
  var span = document.getElementsByTagName('span')[0]
  Element.prototype.myChildren = function () {
    var child = this.childNodes//返回所有子节点
    var len = child.length;
    var arr = []
    for (var i = 0; i < len; i++) {
      if (child[i].nodeType == 1) {
        arr.push(child[i])
      }
    }
    return arr
  }
</script>
```
## 7.自己封装hasChildren（）方法，不可用children属性
```js
<script type="text/javascript">
  var span = document.getElementsByTagName('span')[0]
  Element.prototype.myHasChildren = function () {
    var child = this.childNodes//返回所有子节点
    var len = child.length;
    for (var i = 0; i < len; i++) {
      if (child[i].nodeType == 1) {
        return true
      }
    }
    return false
  }
</script>
```
## 8.parentNode 案例
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

</head>

<body>
  <div>
    <span>
      <strong></strong>
    </span>
  </div>

</body>

<script type="text/javascript">
  var strong = document.getElementsByTagName('strong')[0]
  //strong的父节点是span
  console.log(strong.parentNode)
  //连续调用parentNode
  console.log(strong.parentNode.parentNode)//span的父节点是div
  //再次调用
  console.log(strong.parentNode.parentNode.parentNode)//body
  //再次调用
  console.log(strong.parentNode.parentNode.parentNode.parentNode)//html
  //再次调用
  console.log(strong.parentNode.parentNode.parentNode.parentNode.parentNode)//document 最顶层了 如果再次调用是null
</script>
</html>
```

## 9.childNodes案例
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

</head>

<body>
  <div>
    <span>
      <strong></strong>
    </span>
    <p></p>
  </div>

</body>

<script type="text/javascript">
  var div = document.getElementsByTagName('div')[0]
  //strong的父节点是span
  console.log(div.childNodes)
  //打印的是 NodeList(5) [text, span, text, p, text]
</script>

</html>
```
## 10.nextSibling案例
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

</head>

<body>
  <div>
    <span>
      <strong></strong>
    </span>
    <p></p>
  </div>

</body>

<script type="text/javascript">
  var span = document.getElementsByTagName('span')[0]
  //span的下一个兄弟节点是text
  console.log(span.nextSibling)//#text
  //在下一个节点
  console.log(span.nextSibling.nextSibling)//p
  //在下一个节点
  console.log(span.nextSibling.nextSibling.nextSibling)//#text
  //在下一个节点 
  console.log(span.nextSibling.nextSibling.nextSibling.nextSibling)//null
</script>

</html>
```
## 11.生成Dom结构操作
请编写一段JavaScript脚本生成下面这段DOM结构，要求：使用标准的DOM方法或属性
```
<div class='example'>
  <p class='slogan'>我很帅</p>
</div>
```
```html
<body>
</body>
<script>

//1.创建div标签和p标签
var div = document.createElement('div')
var p = document.createElement('p');
//2.给div和p标签添加class属性
div.setAttribute('class','example')
p.setAttribute('class','slogan')
//3.给标签添加内容
p.innerHTML = '我很帅' //或者可以innerText
//4.将p标签插入到div
div.appendChild(p)
//5.将div标签插入到body
document.body.appendChild(div)

</script>
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作38.png)
## 12.封装insertAfter()
功能类似于insertBefore()

我的思路
```js
  //如果插入的目标就是最后一个 那么将targetNode直接append即可
  //如果插入的目标是在中间 那么查找afterNode节点的下一个兄弟元素节点
  Element.prototype.insertAfter = function (insertNode, targetNode) {
    //寻找插入点的父节点
    var parent = targetNode.parentNode
    //如果插入点的父节点的最后一个元素是目标节点 那么直接append
    if (parent.lastNode == targetNode) {
      parent.appendChild(insertNode)
    } else {
      //插入点非父节点的最后一个节点  两种情况 一种是插入点无兄弟节点 一种是有兄弟节点
      //定义插入点的后一个兄弟节点
      var afterNode = targetNode.nextElementSibling
      //如果为null则说明无兄弟节点 那么只有一种情况就是父节点只有一个子元素节点 直接append
      //如果不为null则将其插入到兄弟节点之前即可
      if (afterNode) {
        afterNode.insertBefore(targetNode, a)
      } else {
        parent.appendChild(targetNode)
      }
    }
    //返回插入节点
    return insertNode
  }
```

老师的思路
```js
  Element.prototype.insertAfter = function (targetNode, afterNode) {
    //寻找插入位置的后一个兄弟元素节点
    var beforeNode = afterNode.nextElementSibling
    //如果下一个兄弟节点为空
    if (beforeNode == null) {
      this.appendChild(targetNode)
    } else {
      //this代表谁调用这个方法就是谁
      this.insertBefore(targetNode, beforeNode)
    }
    return targetNode
  }
```

总结：
我的思路重复了，不需要判断父节点的最后一个节点是否是插入点元素，如果targetNode.nextElementNode为空即代表为最后一个节点

## 10.将目标节点内部的节点顺序逆序
```
<div>
	<i></i>
	<b></b>
	<span></span>
</div>
要变成span--->b---->i
```
## 11.封装兼容性方法，求滚轮滚动离getScrollOffset()
```js
  function getScrollOffset() {
    //如果有新方法
    if (window.pageXOffset) {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    } else {
      //如果没有新方法  即ie8以下  使用两个相加
      return {
        x: document.body.scrollLeft + document.documentElement.scrollLeft,
        y: document.body.scrollTop + document.documentElement.scrollTop
      }
    }
  }
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作39.png)
## 12.封装兼容性方法，返回浏览器视口尺寸
```js
function getViewportOffset() {
	if (window.innerWidth) {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	} else {
		//如果没有写<!DOCTYPE html>则是怪异模式 compatMode就是返回怪异模式还是标准模式
		//是怪异模式：BackCompat   标准模式：CSS1Compat
		if (document.compatMode == 'BackCompat') {
			return {
				width: document.body.clientWidth,
				height: document.body.clientHeight
			}
		} else {
			//标准模式
			return {
				width:document.documentElement.clientWidth,
				height:document.documentElement.clientHeight
			}
		}
	}
}
```
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的dom操作40.png)
## 13.自动阅读
```js
<script>
  //1.先将元素选出
  var start = document.getElementsByTagName('div')[0]
  var pause = document.getElementsByTagName('div')[1]
  var timer = 0
  var key = true
  start.onclick = function () {
    if (key) {
      timer = setInterval(() => {
        window.scrollBy(0, 10)
      }, 100)
      key=false
    }

  }
  pause.onclick = function () {
    clearInterval(timer)
    key=true
  }
</script>
```
## 14.封装兼容性方法getStyle(elem,prop)
```js

  function getStyle(elem,prop){
    if(window.getComputedStyle){
      return window.getComputedStyle(elem,null)[prop];
    }else{
      return elem.currentStyle[prop];
    }
  }
```