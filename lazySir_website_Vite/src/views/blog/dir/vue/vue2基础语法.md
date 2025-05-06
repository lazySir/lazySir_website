---
title: vue2基础语法
author: lazySir
tags: [Vue2]
description: vue2基础语法
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue.png
date: 2022-11-16
---

# v-once

总结一句话：只渲染一次

v-once: 
该指令后面不需要跟任何表达式(比如之前的v-for后面是由跟表达式的)
该指令表示元素和组件(组件后面才会学习)只渲染一次，不会随着数据的改变而改变。

```javascript
<div id="app">
  <h2>{{message}}</h2>
  <h2 v-once>{{message}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊'
    }
  })
</script>
```

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法1.png)


# v-html

总结一句话：按照html格式进行解析

该指令后面往往会跟上一个string类型
会将string的html解析出来并且进行渲染

```javascript
<div id="app">
  <h2>{{url}}</h2>
  <h2 v-html="url"></h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      url: '<a href="http://www.baidu.com">百度一下</a>'
    }
  })
</script>
```

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法2.png)

# v-text

v-text作用和Mustache比较相似：都是用于将数据显示在界面中
v-text通常情况下，接受一个string类型

且text会替换后面的内容

```javascript
<div id="app">
  <h2>{{message}}, 李银河!</h2>
  <h2 v-text="message">, 李银河!</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊'
    }
  })
</script>
```

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法3.png)

# v-pre

总结一句话：不会被渲染 原型显示

v-pre用于跳过这个元素和它子元素的编译过程，用于显示原本的Mustache语法。
比如下面的代码：
第一个h2元素中的内容会被编译解析出来对应的内容
第二个h2元素中会直接显示{{message}}

```javascript
<div id="app">
  <h2>{{message}}</h2>
  <h2 v-pre>{{message}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊'
    }
  })
</script>
```

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法4.png)
# v-cloak

斗篷

在vue解析之前, div中有一个属性v-cloak

在vue解析之后, div中没有一个属性v-cloak

```javascript
  <style>
    [v-cloak] {
      display: none;
    }
  </style>
</head>
<body>

<div id="app" v-cloak>
  <h2>{{message}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  // 在vue解析之前, div中有一个属性v-cloak
  // 在vue解析之后, div中没有一个属性v-cloak
  setTimeout(function () {
    const app = new Vue({
      el: '#app',
      data: {
        message: '你好啊'
      }
    })
  }, 1000)
</script>
```

# v-if、v-else-if、v-else

这三个指令与JavaScript的条件语句if、else、else if类似。
Vue的条件指令可以根据表达式的值在DOM中渲染或销毁元素或组件

v-if的原理：
v-if后面的条件为false时，对应的元素以及其子元素不会渲染。
也就是根本没有不会有对应的标签出现在DOM中。

## 登录切换小案例

```javascript
<div id="app">
  <span v-if="isUser">
    <label for="username">用户账号</label>
    <input type="text" id="username" placeholder="用户账号" key="username">
  </span>
  <span v-else>
    <label for="email">用户邮箱</label>
    <input type="text" id="email" placeholder="用户邮箱" key="email">
  </span>
  <button @click="isUser = !isUser">切换类型</button>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      isUser: true
    }
  })
</script>
```

### key的问题：

小问题：
如果我们在有输入内容的情况下，切换了类型，我们会发现文字依然显示之前的输入的内容。
但是按道理讲，我们应该切换到另外一个input元素中了。
在另一个input元素中，我们并没有输入内容。
为什么会出现这个问题呢？
问题解答：
这是因为Vue在进行DOM渲染时，出于性能考虑，会尽可能的复用已经存在的元素，而不是重新创建新的元素。
在上面的案例中，Vue内部会发现原来的input元素不再使用，直接作为else中的input来使用了。
解决方案：
如果我们不希望Vue出现类似重复利用的问题，可以给对应的input添加key
并且我们需要保证key的不同

# v-show

作用：

v-show的用法和v-if非常相似，也用于决定一个元素是否渲染：

## v-show与v-if的对比

v-if和v-show都可以决定一个元素是否渲染，那么开发中我们如何选择呢？
v-if当条件为false时，压根不会有对应的元素在DOM中。
v-show当条件为false时，仅仅是将元素的display属性设置为none而已。

## 开发中如何选择呢？

当需要在显示与隐藏之间切片很频繁时，使用v-show
当只有一次切换时，通过使用v-if

```javascript
<div id="app">
  <!--v-if: 当条件为false时, 包含v-if指令的元素, 根本就不会存在dom中-->
  <h2 v-if="isShow" id="aaa">{{message}}</h2>

  <!--v-show: 当条件为false时, v-show只是给我们的元素添加一个行内样式: display: none-->
  <h2 v-show="isShow" id="bbb">{{message}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      isShow: true
    }
  })
</script>

```

# v-for

v-for的语法类似于JavaScript中的for循环。
格式如下：item in items的形式。

## 不需要索引值

v-for="movie in movies"
依次从movies中取出movie，并且在元素的内容中，我们可以使用Mustache语法，来使用movie

## 需要索引值

语法格式：v-for=(item, index) in items
其中的index就代表了取出的item在原数组的索引值。

## 遍历数组案例

```javascript
<div id="app">
  <!--1.在遍历的过程中,没有使用索引值(下标值)-->
  <ul>
    <li v-for="item in names">{{item}}</li>
  </ul>

  <!--2.在遍历的过程中, 获取索引值-->
  <ul>
    <li v-for="(item, index) in names">
      {{index+1}}.{{item}}
    </li>
  </ul>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      names: ['why', 'kobe', 'james', 'curry']
    }
  })
</script>
```

## 遍历对象案例

```javascript
<div id="app">
  <!--1.在遍历对象的过程中, 如果只是获取一个值, 那么获取到的是value-->
  <ul>
    <li v-for="item in info">{{item}}</li>
  </ul>


  <!--2.获取key和value 格式: (value, key) -->
  <ul>
    <li v-for="(value, key) in info">{{value}}-{{key}}</li>
  </ul>


  <!--3.获取key和value和index 格式: (value, key, index) -->
  <ul>
    <li v-for="(value, key, index) in info">{{value}}-{{key}}-{{index}}</li>
  </ul>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      info: {
        name: 'why',
        age: 18,
        height: 1.88
      }
    }
  })
</script>
```

## 使用过程添加key

官方推荐我们在使用v-for时，给对应的元素或组件添加上一个:key属性。

### 为什么需要这个key属性呢（了解）？

这个其实和Vue的虚拟DOM的Diff算法有关系。
这里我们借用React’s diff algorithm中的一张图来简单说明一下：
当某一层有很多相同的节点时，也就是列表节点时，我们希望插入一个新的节点
我们希望可以在B和C之间加一个F，Diff算法默认执行起来是这样的。
即把C更新成F，D更新成C，E更新成D，最后再插入E，是不是很没有效率？

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法5.png)

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法6.png)
所以我们需要使用key来给每个节点做一个唯一标识
Diff算法就可以正确的识别此节点
找到正确的位置区插入新的节点。
所以一句话，key的作用主要是为了高效的更新虚拟DOM。

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法7.png)

```javascript
![截图](attachment:9658a7d4af1d45fcf0a8122116f3447d)<div id="app">
  <ul>
    <li v-for="item in letters" :key="item">{{item}}</li>
  </ul>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      letters: ['A', 'B', 'C', 'D', 'E']
    }
  })
</script>

```

# v-bind

作用：动态绑定属性

语法糖：  ：

## 绑定class

很多时候，我们希望动态的来切换class，比如：
当数据为某个状态时，字体显示红色。
当数据另一个状态时，字体显示黑色。
绑定class有两种方式：
对象语法
数组语法

### 绑定方式：对象语法

用法：

用法一：直接通过{}绑定一个类

<h2 :class="{'active': isActive}">Hello World</h2>

用法二：也可以通过判断，传入多个值

<h2 :class="{'active': isActive, 'line': isLine}">Hello World</h2>

用法三：和普通的类同时存在，并不冲突
注：如果isActive和isLine都为true，那么会有title/active/line三个类

<h2 class="title" :class="{'active': isActive, 'line': isLine}">Hello World</h2>

用法四：如果过于复杂，可以放在一个methods或者computed中
注：classes是一个计算属性

<h2 class="title" :class="classes">Hello World</h2>

```javascript
<div id="app">
  <!--<h2 class="active">{{message}}</h2>-->
  <!--<h2 :class="active">{{message}}</h2>-->

  <!--<h2 v-bind:class="{key1: value1, key2: value2}">{{message}}</h2>-->
  <!--<h2 v-bind:class="{类名1: true, 类名2: boolean}">{{message}}</h2>-->
  <h2 class="title" v-bind:class="{active: isActive, line: isLine}">{{message}}</h2>
  <h2 class="title" v-bind:class="getClasses()">{{message}}</h2>
  <button v-on:click="btnClick">按钮</button>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      isActive: true,
      isLine: true
    },
    methods: {
      btnClick: function () {
        this.isActive = !this.isActive
      },
      getClasses: function () {
        return {active: this.isActive, line: this.isLine}
      }
    }
  })
</script>
```

### 绑定方式：数组语法

用法：

用法一：直接通过{}绑定一个类

<h2 :class="['active']">Hello World</h2>

用法二：也可以传入多个值

<h2 :class=“[‘active’, 'line']">Hello World</h2>

用法三：和普通的类同时存在，并不冲突
注：会有title/active/line三个类

<h2 class="title" :class=“[‘active’, 'line']">Hello World</h2>

用法四：如果过于复杂，可以放在一个methods或者computed中
注：classes是一个计算属性

<h2 class="title" :class="classes">Hello World</h2>

```javascript
<div id="app">
  <h2 class="title" :class="[active, line]">{{message}}</h2>
  <h2 class="title" :class="getClasses()">{{message}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      active: 'aaaaaa',
      line: 'bbbbbbb'
    },
    methods: {
      getClasses: function () {
        return [this.active, this.line]
      }
    }
  })
</script>
```

## 绑定style

我们可以利用v-bind:style来绑定一些CSS内联样式。
在写CSS属性名的时候，比如font-size
我们可以使用驼峰式 (camelCase)  fontSize 
或短横线分隔 (kebab-case，记得用单引号括起来) ‘font-size’
绑定class有两种方式：
对象语法
数组语法

### 绑定方式：对象语法

用法：

:style="{color: currentColor, fontSize: fontSize + 'px'}"
style后面跟的是一个对象类型
对象的key是CSS属性名称
对象的value是具体赋的值，值可以来自于data中的属性

```javascript
  <style>
    .title {
      font-size: 50px;
      color: red;
    }
  </style>
</head>
<body>

<div id="app">
  <!--<h2 :style="{key(属性名): value(属性值)}">{{message}}</h2>-->

  <!--'50px'必须加上单引号, 否则是当做一个变量去解析-->
  <!--<h2 :style="{fontSize: '50px'}">{{message}}</h2>-->

  <!--finalSize当成一个变量使用-->
  <!--<h2 :style="{fontSize: finalSize}">{{message}}</h2>-->
  <h2 :style="{fontSize: finalSize + 'px', backgroundColor: finalColor}">{{message}}</h2>
  <h2 :style="getStyles()">{{message}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      finalSize: 100,
      finalColor: 'red',
    },
    methods: {
      getStyles: function () {
        return {fontSize: this.finalSize + 'px', backgroundColor: this.finalColor}
      }
    }
  })
</script>

```

### 绑定方式：数组语法

用法：

<div v-bind:style="[baseStyles, overridingStyles]"></div>
style后面跟的是一个数组类型
多个值以，分割即可

```javascript
<div id="app">
  <h2 :style="[baseStyle, baseStyle1]">{{message}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      baseStyle: {backgroundColor: 'red'},
      baseStyle1: {fontSize: '100px'},
    }
  })
</script>

```

# 计算属性

作用：将数据进行转化后再显示，或者需要将多个数据结合起来

## 计算属性的setter和getter

每个计算属性都包含一个getter和一个setter
在上面的例子中，我们只是使用getter来读取。
在某些情况下，你也可以提供一个setter方法（不常用）。
在需要写setter的时候，代码如下：

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法8.png)

## 为什么要有计算属性？

methods和computed看起来都可以实现我们的功能，

那么为什么还要多一个计算属性这个东西呢？
原因：计算属性会进行缓存，如果多次使用时，计算属性只会调用一次。

# 事件监听

作用：绑定事件监听器
缩写：@
预期：Function | Inline Statement | Object
参数：event

## v-on基础

v-on：事件监听 ：keyup/keydown/click

## v-on参数

当通过methods中定义方法，以供@click调用时，需要注意参数问题：
情况一：如果该方法不需要额外参数，那么方法后的()可以不添加。
但是注意：如果方法本身中有一个参数，那么会默认将原生事件event参数传递进去
情况二：如果需要同时传入某个参数，同时需要event时，可以通过$event传入事件。

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法9.png)

![vue](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2基础语法10.png)

## v-on修饰符

1：.stop - 调用 event.stopPropagation()。

（当多对标签进行重叠的时候, 你点击最上面的一层标签的时候, 会自动的冒泡到他下面的所有标签上面
而.stop就是阻止冒泡使用的）
2：.prevent - 调用 event.preventDefault()。 （自定义默认事件例如submint按钮会默认直接提交数据）
.{keyCode | keyAlias} - 只当事件是从特定键触发时才触发回调。
3：.native - 监听组件根元素的原生事件。
4：.once - 只触发一次回调。

```javascript
<div id="app">
  <!--1. .stop修饰符的使用-->
  <div @click="divClick">
    aaaaaaa
    <button @click.stop="btnClick">按钮</button>
  </div>

  <!--2. .prevent修饰符的使用-->
  <br>
  <form action="baidu">
    <input type="submit" value="提交" @click.prevent="submitClick">
  </form>

  <!--3. .监听某个键盘的键帽-->
  <input type="text" @keyup.enter="keyUp">

  <!--4. .once修饰符的使用-->
  <button @click.once="btn2Click">按钮2</button>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊'
    },
    methods: {
      btnClick() {
        console.log("btnClick");
      },
      divClick() {
        console.log("divClick");
      },
      submitClick() {
        console.log('submitClick');
      },
      keyUp() {
        console.log('keyUp');
      },
      btn2Click() {
        console.log('btn2Click');
      }
    }
  })
</script>

```

# v-model

v-model其实是一个语法糖，它的背后本质上是包含两个操作：
1.v-bind绑定一个value属性
2.v-on指令给当前元素绑定input事件

## 原理

<input type="text" v-model="message">
等同于
<input type="text" v-bind:value="message" v-on:input="message = $event.target.value">

```javascript
<div id="app">
  <!--<input type="text" v-model="message">-->
  <!--<input type="text" :value="message" @input="valueChange">-->
  <input type="text" :value="message" @input="message = $event.target.value">
  <h2>{{message}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊'
    },
    methods: {
      valueChange(event) {
        this.message = event.target.value;
      }
    }
  })
</script>
```

## v-model绑定radio

<br/>

```javascript
<div id="app">
  <label for="male">
    <input type="radio" id="male" value="男" v-model="sex">男
  </label>
  <label for="female">
    <input type="radio" id="female" value="女" v-model="sex">女
  </label>
  <h2>您选择的性别是: {{sex}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      sex: '女'
    }
  })
</script>
```

## v-model绑定checkbox

复选框分为两种情况：单个勾选框和多个勾选框

<br/>

单个勾选框：
v-model即为布尔值。
此时input的value并不影响v-model的值。

```javascript
<div id="app">
  1.checkbox单选框
  <label for="agree">
    <input type="checkbox" id="agree" v-model="isAgree">同意协议
 </label>
  <h2>您选择的是: {{isAgree}}</h2>
  <button :disabled="!isAgree">下一步</button>
  </div>
  <script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      isAgree: false, // 单选框
    }
  })
</script>
```

多个复选框：
当是多个复选框时，因为可以选中多个，所以对应的data中属性是一个数组。
当选中某一个时，就会将input的value添加到数组中。

```javascript
<div id="app">

  <!--2.checkbox多选框-->
  <input type="checkbox" value="篮球" v-model="hobbies">篮球
  <input type="checkbox" value="足球" v-model="hobbies">足球
  <input type="checkbox" value="乒乓球" v-model="hobbies">乒乓球
  <input type="checkbox" value="羽毛球" v-model="hobbies">羽毛球
  <h2>您的爱好是: {{hobbies}}</h2>

  <label v-for="item in originHobbies" :for="item">
    <input type="checkbox" :value="item" :id="item" v-model="hobbies">{{item}}
  </label>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      hobbies: [], // 多选框,
      originHobbies: ['篮球', '足球', '乒乓球', '羽毛球', '台球', '高尔夫球']
    }
  })
</script>
```

##  v-model绑定select类型

和checkbox一样，select也分单选和多选两种情况。

<br/>

单选：只能选中一个值。
v-model绑定的是一个值。
当我们选中option中的一个时，会将它对应的value赋值到mySelect中

<br/>

多选：可以选中多个值。
v-model绑定的是一个数组。
当选中多个值时，就会将选中的option对应的value添加到数组mySelects中

```javascript
<div id="app">
  <!--1.选择一个-->
  <select name="abc" v-model="fruit">
    <option value="苹果">苹果</option>
    <option value="香蕉">香蕉</option>
    <option value="榴莲">榴莲</option>
    <option value="葡萄">葡萄</option>
  </select>
  <h2>您选择的水果是: {{fruit}}</h2>

  <!--2.选择多个-->
  <select name="abc" v-model="fruits" multiple>
    <option value="苹果">苹果</option>
    <option value="香蕉">香蕉</option>
    <option value="榴莲">榴莲</option>
    <option value="葡萄">葡萄</option>
  </select>
  <h2>您选择的水果是: {{fruits}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      fruit: '香蕉',
      fruits: []
    }
  })
</script>
```

## v-model修饰符

lazy修饰符：
默认情况下，v-model默认是在input事件中同步输入框的数据的。
也就是说，一旦有数据发生改变对应的data中的数据就会自动发生改变。
lazy修饰符可以让数据在失去焦点或者回车时才会更新：

<br/>

number修饰符：
默认情况下，在输入框中无论我们输入的是字母还是数字，都会被当做字符串类型进行处理。
但是如果我们希望处理的是数字类型，那么最好直接将内容当做数字处理。
number修饰符可以让在输入框中输入的内容自动转成数字类型：

<br/>

trim修饰符：
如果输入的内容首尾有很多空格，通常我们希望将其去除
trim修饰符可以过滤内容左右两边的空格

<br/>

```javascript
<div id="app">
  <!--1.修饰符: lazy-->
  <input type="text" v-model.lazy="message">
  <h2>{{message}}</h2>


  <!--2.修饰符: number-->
  <input type="number" v-model.number="age">
  <h2>{{age}}-{{typeof age}}</h2>

  <!--3.修饰符: trim-->
  <input type="text" v-model.trim="name">
  <h2>您输入的名字:{{name}}</h2>
</div>

<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
      age: 0,
      name: ''
    }
  })

  var age = 0
  age = '1111'
  age = '222'
</script>
```

# 自定义指令

## 1.注册全局指令

Vue.directive('my-directive', function(el, binding){
el.innerHTML = binding.value.toupperCase()
})

## 2.注册局部指令

directives : {
'
my-directive' : {
bind (el, binding) {
el.innerHTML = binding.value.toupperCase()
}
}
}

1. 使用指令
v-my-directive='xxx'

# 监视属性-watch

## 介绍

在vue中，使用watch来响应数据的变化。

## 一般使用

在不需要深度监听或者立即执行的时候 直接写监听的对象（）{}方法即可

## 深度监听

在需要对对象深度监听的时候 可以将监听对象写成一个对象的形式

### handler方法 

如果对象发生变化 则会执行handler方法

### immediate属性

如果给对象加上一个属性 immediate：true 则会先执行一遍handler方法

### deep属性

如果监听的是一个对象 只有当对象的地址发生变化才会被监听到

这时候想监听对象里的属性发生变化就需要加上deep属性

```javascript
watch:{
  object:{
    handler(newValue,oldValue){},
    immediate:true //默认是false,
    deep:true //默认是true
  }
}
```
