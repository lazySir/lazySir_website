---
title: vuex
author: lazySir
tags: [Vue2, vuex]
description: vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vuex1.png
date: 2022-09-28
---
# Vuex介绍

## 单界面的状态管理

<br/>

<br/>

![vuex1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vuex1.png)


## Vuex状态管理图例

![vuex1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vuex2.png)


# Vuex的引入

### 创建vuex实例

首先，我们需要在某个地方存放我们的Vuex代码：
这里，我们先创建一个文件夹store，并且在其中创建一个index.js文件
在index.js文件中写入如下代码：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {}
const mutations = {}
const actions = {}
const getters = {}


const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

export default store

```

## 挂载到Vue实例中

其次，我们让所有的Vue组件都可以使用这个store对象
来到main.js文件，导入store对象，并且放在new Vue中
这样，在其他Vue组件中，我们就可以通过this.$store的方式，获取到这个store对象了

```javascript
import store from './store'
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

```

# Vuex核心概念

Vuex有几个比较核心的概念:

State
Getters
Mutation
Action
Module

## 1.State

### 作用

定义变量，对象，数组。

### 使用

```javascript
const state={
 let a = '' ,
 let b = {}，
 let c = []
}
```

### 调用

```javascript
// 方式一：自己直接读取, dataName代指state内自己命名的数据
this.$store.state.自定义模块命名.dataName
 
// 方式二：借助mapState读取
...mapState('自定义模块命名',['dataName','...','...'])
```

## 2.Getters

### 作用 

对state数据进行获取并进行一些操作

### 参数

1. state   获取state中定义的参数
2. getters  可以调用Getters中其他已定义的方法

### 调用

```javascript
// 方式一：自己直接读取, dataName代指getters内自己命名的数据
this.$store.getters['自定义模块命名/dataName']
```

```javascript
// 方式二：借助mapGetters读取
...mapGetters('自定义模块命名',['dataName','...','...'])
```

## 3.Mutation

### 作用

更新与拿state的数据（唯一方式），提交Mutation

### 参数

1. state      获取state中定义的属性 并且可以进行更新
2. payload    Actions中dispatch过来的参数

### 调用

```javascript
// 方式一：自己直接commit, data代值传入的数据名
this.$store.commit('自定义模块命名/mutations中方法名', data)
 
// 方式二：借助mapMutations
...mapMutations('自定义模块命名',{事件1: "mutations方法1", 事件2: "mutations方法2"，...})
```

## 4.Action

### 作用

可以进行一些异步操作    请求后端数据 接着调用Mutation 将后端请求来的数据赋值给state

### 参数

1. context    上下文：相当于缩小版的 store 
2. payload   可以接受传递过来的值

### 调用

```javascript
// 方式一：自己直接dispatch, data代值传入的数据
this.$store.dispatch('自定义模块命名/actions中方法名', data)
 
// 方式二：借助mapActions
...mapActions('自定义模块命名',{事件1: "actions中方法名1", 事件2: "actions中方法名2"，...})
```

## 5.认识Module

### 作用：

将每个仓库进行模块化封装

![vuex1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vuex3.png)


### 两种抽离封装方式

#### 方式一

```javascript
const state = {}
const mutations = {}
const actions = {}
const getters = {}
export default {
  state,
  actions,
  mutations,
  getters
}

```

#### 方式二

```
export default {
  namespaced: true,
  state:{},
  mutations:{},
  actions: {},
  getters:{},
}
//这种方式是为了能够使用
//mapAction|State|Getters|Mutations 
//因为需要命名空间

```

## 6.四种map结构

### 1.mapState

- 一般在conputed中使用 ...mapState 分为对象写法与数组写法
- 对象写法：...mapState({自定义名称：'value'})
- 数组写法：...mapState(['value'])不可以自定义名称 只能和state使用相同的key
- 本质：this.$store.state.value
- 注意数组写法不能与data中定义的key发生冲突

### 2.mapGetters

- 一般在conputed中使用 ...mapGetters 分为对象写法与数组写法
- 对象写法：...mapGetters({自定义名称：'value'})
- 数组写法：...mapGetters(['value'])不可以自定义名称 只能和getters使用相同的方法名称
- 本质：this.$store.getters.value

### 3.mapActions

- 一般在methods中使用 ...mapActions 分为对象写法与数组写法
- 对象写法：...mapActions({自定义名称：'value'})
- 数组写法：...mapActions(['value'])不可以自定义名称 只能和actions使用相同的方法名称
- 本质：this.$store.dispath（'mutations中定义的方法'）

4. ### 4.mapMutations

- 一般在methods中使用 ...mapMutations 分为对象写法与数组写法
- 对象写法：...mapMutations({自定义名称：'value'})
- 数组写法：...mapMutations(['value'])不可以自定义名称 只能和mutations使用相同的方法名称
- 本质：this.$store.commit（'mutations中定义的方法'）

### 5.modules

如果是在modules中的对象使用四种map

则在各个mapXXXX（）的第一个参数传入modules中定义的名称（记得加引号）。之后则可正常使用

注意：这种方法需要在每个modules对象中加入一个属性namespaced:true否则会报错

 使用后不需要再this.$store 直接this.方法即可

## 7.开启命名空间后的读取与调用

### state数据

```javascript
// 方式一：自己直接读取, dataName代指state内自己命名的数据
this.$store.state.自定义模块命名.dataName
 
// 方式二：借助mapState读取
...mapState('自定义模块命名',['dataName','...','...'])
```

### getters数据

```javascript
// 方式一：自己直接读取, dataName代指getters内自己命名的数据
this.$store.getters['自定义模块命名/dataName']

// 方式二：借助mapGetters读取
...mapGetters('自定义模块命名',['dataName','...','...'])
```

### 调用dispatch

```javascript
// 方式一：自己直接dispatch, data代值传入的数据
this.$store.dispatch('自定义模块命名/actions中方法名', data)
 
// 方式二：借助mapActions
...mapActions('自定义模块命名',{事件1: "actions中方法名1", 事件2: "actions中方法名2"，...})
```

### 调用commit

```javascript
// 方式一：自己直接commit, data代值传入的数据名
this.$store.commit('自定义模块命名/mutations中方法名', data)
 
// 方式二：借助mapMutations
...mapMutations('自定义模块命名',{事件1: "mutations方法1", 事件2: "mutations方法2"，...})
```

# 
