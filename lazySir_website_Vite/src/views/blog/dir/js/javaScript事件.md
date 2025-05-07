---
title: js的事件
author: lazySir
tags: [js]
description:  事件就是在文档中或者在浏览器窗口中通过某些动作触发。比如，单击，鼠标经过，键盘按下等。事件通常和函数结合使用。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js.png
date: 2022-11-16
---

# 一、什么是事件？
事件就是在文档中或者在浏览器窗口中通过某些动作触发。比如，单击，鼠标经过，键盘按下等。事件通常和函数结合使用。

# 二、如何绑定事件处理函数
## 1.法一
1. ele.onXXX=function(event){}
    - 兼容性很好，但是一个元素的同一个事件上只能绑定一个处理程序
    - 基本等同于写在HTML行间上
### 1.onclick
```html
<body>
  <div style="height:100px;width:100px;background-color: red;"></div>
</body>
<script>
  var div= document.getElementsByTagName('div')[0]
  div.onclick=function(){
    console.log('click事件触发')
  }
</script>
```
这时候点击div标签后会触发click事件
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件1.png)

### 2.只能绑定一个处理事件
让div标签绑定两个事件
```html
<body>
  <div style="height:100px;width:100px;background-color: red;"></div>
</body>
<script>
  var div= document.getElementsByTagName('div')[0]
  div.onclick=function(){
    console.log('a')
  }
  div.onclick=function(){
    console.log('b')
  }
</script>
```
点击之后没有出现a b 只出现了b
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件2.png)
>后一个事件会覆盖前一个事件

### 基本等同于写在HTML行间上
div.onclick 等同于在div标签上写个onclick属性
```html
<body>
  <div style="height:100px;width:100px;background-color: red;" onclick="console.log('a')"></div>
</body>
```
点击div标签
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件3.png)
## 2.法二
2. obj.addEventListener(type事件类型，fn处理函数，false)
   -  IE9以下不兼容，可以为一个事件绑定多个处理程序
### 1.click
和法一相比不用写on了 直接写事件名称
```html
<body>
  <div style="height:100px;width:100px;background-color: red;" ></div>
</body>
<script>
  var div= document.getElementsByTagName('div')[0]
  div.addEventListener("click",function(){
    console.log("click事件")
  },false)

</script>
```
点击div标签之后
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件4.png)
### 2.可以绑定多个处理事件
```html
<body>
  <div style="height:100px;width:100px;background-color: red;" ></div>
</body>
<script>
  var div= document.getElementsByTagName('div')[0]
  div.addEventListener("click",function(){
    console.log("click事件1")
  },false)
  div.addEventListener("click",function(){
    console.log("click事件2")
  },false)

</script>
```
点击div标签
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件5.png)
>会按照绑定的顺序执行
>
但是 函数值的引用要不同才行
```js
  var div = document.getElementsByTagName('div')[0]
  div.addEventListener('click', test, false)
  div.addEventListener('click', test, false)
  function test() {
    console.log("触发click事件")
  }
```
这时候点击div只会打印一个
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件6.png)


3. obj.attachEvent('on+type',fn)
   -  IE9 独有，一个事件同样可以绑定多个处理程序
# 三、事件处理程序的运行环境
1. ele .onXXX = function(event){}
   - 程序this指向是dom元素本身
```js
<script>
  var div = document.getElementsByTagName('div')[0]
  div.onclick = function(){
    console.log(this)
  }

</script>
```
点击div标签
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件7.png)


2. obj.addEventListener(type,fn,false)]
   - 程序this指向是dom元素本身
```js
<script>
  var div = document.getElementsByTagName('div')[0]
  div.addEventListener('click', function () {
    console.log(this)
  },false)

</script>

```
点击div标签
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件8.png)

3. obj.attachEvent('on+type',fn)
    - 程序this指向windw

怎么让程序this指向本身？
```js
<script>
  var div = document.getElementsByTagName('div')[0]
  div.attachEvent('onclick',function(){
    handle.call(div)
  })
  function handle(){
    //事件处理程序
  }
</script>
```

# 四、解除事件处理程序
方法：
 - ele.onclick =false/''/null;
```html
```html
<script>
  var div = document.getElementsByTagName('div')[0]
  div.onclick = function () {
    console.log('div')
    this.onclick=null
  }
</script>
```
 - ele.removeEventListener(type,fn,false)
     - 解除的时候一定要高度一致，事件类型，处理函数，false

假如写成这种处理函数那么肯定是解除不了的 因为处理函数是匿名的
```html
<script>
  var div = document.getElementsByTagName('div')[0]
  div.addEventListener('click', function (e) {
    console.log('div')
  },false)
</script>
```
正确写法：
```html
<script>
  var div = document.getElementsByTagName('div')[0]

  div.addEventListener('click', handle, false);
  function handle() {
    console.log("A")
  }
  div.removeEventListener('click',handle,false)
</script>
```

>若绑定匿名函数，则无法解除

 - ele.detachEvent('on'+type,fn);

用途： 
- 只想让这个东西被点击一次 





# 五、事件分类
## 1、鼠标事件
### 1.事件名称
|事件名称 | 说明 |
|--|--|
|click  |  click=mousedown+mouseup  |
|mousedown| 鼠标点击触发（不用放开）|
|mouseup|鼠标点击放开之后触发|
|contextmenu| 右键出现菜单|
|mouseover|鼠标移入 等于mouseenter|
|mouseout|鼠标移出 等于mouseleave|
|mousemove|鼠标移动触发|
### 2.用button属性来区分鼠标左中右键


- 鼠标左键 event对象的button属性为0
- 鼠标中间 event对象的button属性为1
- 鼠标右键 event对象的button属性为2

>只有mousedown事件和mouseup事件可以区分出来，为什么？
>因为DOM3标准规定：click事件只能监听左键
```js
  var div = document.getElementsByTagName('div')[0]
  div.onmousedown = function (e) {
    console.log(e)
  }
```
当鼠标左键点击之后
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件9.png)
>事件e的button属性为0

当鼠标中间点击之后

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件10.png)
>事件e的button属性为1

当鼠标右键点击之后
>事件e的button属性为2

## 2、HTML事件
onload、onscoll、onsubmit、onchange、onfoucs(获取焦点)，onblur(失去焦点)

## 3、键盘事件
|事件名称| 说明  |
|--|--|
| keydown | 键盘按下时触发 |
| keyup| 键盘抬起时触发 |
| onkeypress | 用户摁下摁键，并且产生一个字符时发生|

触发顺序：keydown>keypress>keyup

### 1.keydown和keypress的区别
1. keydown可以响应任意键盘案件，keypress只可以响应字符类键盘按键（即ASCLL码有的keypress都可以触发）
2. keypress返回ASCLL码，可以转换成相应字符（event对象里有个charCode属性记录着ASCLL码）

## 4.文本操作事件
|事件名称  |说明  |
|--|--|
| input | 当input里的文本有变化会触发 |
|change|先聚焦input在失去焦点（如果input内容变化）会触发|
|blur| 失去焦点|
|focus|聚焦|

搜索栏默认内容案例
```html
<input type='text' value="请输入关键字" style='color:#999' onfocus="if(this.value=='请输入关键字'){this.value='';this.style.color='#424242'}" onblur="if(this.value=='') {this.value='请输入用户名' ;this.style.color='#999'}"> 
<input/>
```
## 5.窗体操作类（window上的事件）

|事件名称| 说明 |
|--|--|
| scroll  |当滚动条一滚动触发  |
|load|即当页面都渲染完之后才触发|
```js
window.onscroll=function(){
  console.log(window.pageXoffset + " " + window.pageYoffset); 
}
```
>window.onload方法了解,一般不去使用,效率太低了,是最慢执行.   


# 六、事件处理模型---事件冒泡、捕获
## 1.事件冒泡
结构上（非视觉上）嵌套关系的元素，会存在事件冒泡的功能，即同一事件，自子元素冒泡向父元素（自底向上）
```html
<style>
    .wrapper {
      width: 300px;
      height: 300px;
      background-color: red;
    }
    .content{
      width: 200px;
      height:200px;
      background-color:green;
    }
    .box{
      width:100px;
      height:100px;
      background-color:orange
    }
  </style>

</head>

<body>
  <div class="wrapper">
    <div class="content">
      <div class="box"></div>
    </div>
  </div>
</body>
<script>
  var wrapper = document.getElementsByClassName('wrapper')[0];
  var content = document.getElementsByClassName('content')[0];
  var box = document.getElementsByClassName('box')[0];

  wrapper.addEventListener('click',function(){
    console.log('wrapper')
  },false)
  content.addEventListener('click',function(){
    console.log('content')
  },false)
  box.addEventListener('click',function(){
    console.log('box')
  },false)
</script>
```
点击黄色
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件11.png)v
点击绿色
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件12.png)
点击红色
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件13.png)

>focus,blur,change,submit,reset,select等事件不冒泡
## 2.事件捕获
结构上（非视觉上）嵌套关系的元素，会存在事件捕获的功能，即同一事件，自父元素捕获至子元素（事件源元素）（自顶向下）
 >IE没有捕获事件

>小知识：
>除了addEventListener的第三个事件的true可以捕获事件外，
>另一种捕获是IE的一个方法setCapture() dom元素执行后可以捕获页面上的所有事件加在dom元素身上触发。有一个对应的函数叫releaseCapture（）；可以释放。

## 3.触发捕获
addEventListener(type,fn,true) 将第三个形参改为true
```html
  <style>
    .wrapper {
      width: 300px;
      height: 300px;
      background-color: red;
    }
    .content{
      width: 200px;
      height:200px;
      background-color:green;
    }
    .box{
      width:100px;
      height:100px;
      background-color:orange
    }
  </style>

</head>

<body>
  <div class="wrapper">
    <div class="content">
      <div class="box"></div>
    </div>
  </div>
</body>
<script>
  var wrapper = document.getElementsByClassName('wrapper')[0];
  var content = document.getElementsByClassName('content')[0];
  var box = document.getElementsByClassName('box')[0];

  wrapper.addEventListener('click',function(){
    console.log('wrapper')
  },true)
  content.addEventListener('click',function(){
    console.log('content')
  },true)
  box.addEventListener('click',function(){
    console.log('box')
  },true)
</script>
```
点击黄色
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件14.png)
点击绿色
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件15.png)
点击红色
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件16.png)
>和事件冒泡执行顺序相反
## 4.触发顺序
因为addEventListener可以绑定多个处理函数
故 当同时存在事件冒泡和事件捕获时 是先触发哪个？

```js
<script>
  var wrapper = document.getElementsByClassName('wrapper')[0];
  var content = document.getElementsByClassName('content')[0];
  var box = document.getElementsByClassName('box')[0];
  //捕获
  wrapper.addEventListener('click', function () {
    console.log('wrapper')
  }, true)
  content.addEventListener('click', function () {
    console.log('content')
  }, true)
  box.addEventListener('click', function () {
    console.log('box')
  }, true)

  //冒泡
  wrapper.addEventListener('click', function () {
    console.log('wrapper2')
  }, false)
  content.addEventListener('click', function () {
    console.log('content2')
  }, false)
  box.addEventListener('click', function () {
    console.log('box2')
  }, false)

</script>
```
点击黄色

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件17.png)


>先捕获，后冒泡

## 5.取消冒泡
1. W3C标准 event.stopPropagation();
```js
<script>
  var wrapper = document.getElementsByClassName('wrapper')[0];
  var content = document.getElementsByClassName('content')[0];
  var box = document.getElementsByClassName('box')[0];
  //冒泡
  wrapper.addEventListener('click', function () {
    console.log('wrapper')
  }, false)
  content.addEventListener('click', function () {
    console.log('content')
  }, false)
  box.addEventListener('click', function () {
    console.log('box')
  }, false)


  //取消冒泡事件
  box.onclick=function(event){
    event.stopPropagation()
  }
  content.onclick=function(event){
    event.stopPropagation()
  }

</script>
```
这时候点击黄色
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件18.png)
点击绿色
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件19.png)

>不支持ie9以下版本
2. IE独有event.cancelBubble =true;
3. 封装取消冒泡的函数stopBuBBle(event)
## 6.阻止默认事件
默认事件：
  - 表单提交
  - a标签跳转
  - 右键菜单等
### 1. return false
以对象属性的方式注册的事件才能生效
```js
  //阻止网页右键菜单
  document.oncontextmenu = function () {
    return false
  }
```
未取消前：
![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件20.png)
取消后 在按鼠标右键无反应
### 2. event.preventDefault();
```js
document.oncontextmenu = function(e){
e.preventDefault()
}
```
W3C标准，IE9以下不兼容
### 3. event.returnValue = false;
兼容IE
```js
document.oncontextmenu = function (e){
	e.returnValue = false
}
```
### 4. 封装组织默认事件的函数cancelHandler(event)
# 七、事件对象
## 1.event 非IE||window.event 用于IE
兼容性写法：
```js
div.onclick = function (e){
	var event = e||window.event
}
```
## 2.事件源对象
event.target 火狐只有这个
event.srcElement IE只有这个
这两chrome都有
兼容性写法
```js
div.onclick = function (e){
	  //取出事件
    var event = e || window.event
    //取出事件源
    var target = event.target ||event.srcElement
}
```
## 3.事件委托
- 利用事件冒泡，和事件源对象进行处理
- 优点：
    - 1.性能：不需要循环所有的元素一个个绑定事件
    - 2.灵活：当有新的子元素时不需要重新绑定事件

例如有十个li 要求点击一个li就输出这个li的innerText
方法一：虽然这么写也可以 但是如果有大数量的li则性能不好
```html
<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
    <li>8</li>
    <li>9</li>
    <li>10</li>
  </ul>
</body>
<script>
  var li =document.getElementsByTagName('li')
  var len = li.length;
  for(var i = 0;i<len;i++){
    li[i].onclick=function(){
      console.log(this.innerText) //或者innerText
    }
  }
</script>
```
方法二：
```js
  var ul =document.getElementsByTagName('ul')[0]
  ul.onclick = function(e){
    //取出事件
    var event = e || window.event
    //取出事件源
    var target = event.target ||event.srcElement
    //打印出事件源对象的内容  原理就是通过冒泡 点击li一定会冒泡到ul 
    //冒泡 自底向上冒泡
    console.log(target.innerHTML)
  }
```

# 案例
## 1.addEventListener
```html
<ul>
	<li>a</li>
	<li>a</li>
	<li>a</li>
	<li>a</li>
</ul>
```
使用原生js,addEventListener,给每隔li元素绑定一个click事件输出他们的顺序

法一：let 没有闭包问题
```html
<body>
  <ul>
    <li>a</li>
    <li>a</li>
    <li>a</li>
    <li>a</li>
  </ul>
</body>
<script>
var li =document.getElementsByTagName('li')

for(let i =0 ; i<li.length;i++){
  li[i].addEventListener('click',function(){
    console.log(i)
  })
}
</script>
```
法二：var 解决闭包
```html

<body>
  <ul>
    <li>a</li>
    <li>a</li>
    <li>a</li>
    <li>a</li>
  </ul>
</body>
<script>
  var liCol = document.getElementsByTagName('li'),
    len = liCol.length;
  for (var i = 0; i < len; i++) {
    (function (i) {
      liCol[i].addEventListener('click', function () {
        console.log(i);
      });
    }(i))
  }

</script>
```

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js事件21.png)
## 2.封装兼容性的addEvent(elem,type,handle)方法
```js
  function addEvenet(elem,type,handle){
    if(elem.addEvenetListener){
      elem.addEvenetListener(type,handle,false)
    }else if(elem.attachEvent){
      elem.attachEvent('on'+type,function(){
        handle.call(elem)
      })
    }else{
      elem['on'+type] = handle
    }
  }
```

## 3.封装取消冒泡的函数stopBubble()
```js
  function stopBubble(event){
    if(event.stopPropagation){
      event.stopPropagation()
    }else{
      event.cancelBubble=true
    }
  }
```

使用的时候直接传入e就可以了

## 4.封装阻止默认事件的函数
```js
function cancelHandler(e){
	if(e.preventDefault){
 	e.preventDefault();
 	}else{
	e.returnValue = false
	}
}
```

## 5.阻止a标签点击之后跳转到顶端
```js
var a = document.getElementsByTagName('a')[0]
 a.onclick = function() {
	return false
}
```

## 6.完成拖拽
点击方块可以拖着移动 ，放开点击会暂停
```js
  var div = document.getElementsByTagName('div')[0]
  var disX,
      disY;
  //当鼠标点击之后触发
  div.onmousedown = function (e) {
    disX=e.pageX-parseInt(div.style.left);
    disY=e.pageY-parseInt(div.style.top);
    //当鼠标移动之后触发
    document.onmousemove=function(e){
      var event = e || window.event;
    //记录当前鼠标点的位置
    // console.log(e.pageX + " " + e.pageY);
    div.style.left = event.pageX -disX+ "px";
    div.style.top = event.pageY -disY+ "px"
    }

    //当鼠标再次点击
    document.onmouseup =function(e){
      document.onmousemove = null
    }

  }
```
>里面为什么要用document而不是用div是因为如果鼠标移动出浏览器的界面会反应不过来 而document不管你鼠标位置在哪会慢慢跟过去