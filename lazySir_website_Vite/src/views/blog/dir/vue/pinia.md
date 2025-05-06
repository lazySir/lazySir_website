---
title: pinia
author: lazySir
tags: [vue3,pinia]
description: 文章介绍了Pinia作为Vuex的替代品，其简化了状态管理，移除了Mutations，支持同步和异步Actions。文章详细讲解了Pinia的安装、基本使用（包括state、actions、getters）、数据持久化配置以及模块化的实现，提供了清晰的代码示例来帮助理解和应用。
cover: 
date: 2023-03-03
---


# 一、介绍
pinia从使用角度和之前Vuex几乎是一样的，比Vuex更简单了。


在Vuex中有四个核心概念：
- State
- Getters
- Mutations
- Actions

在Pinia中：
- State
- Getters
- Actions ：同步异步都支持
>移除了Mutations

# 二、快速上手
## 1.安装
用你喜欢的包管理器安装 pinia：

```csharp
yarn add pinia
# 或者使用 npm
npm install pinia
```
## 2.基本使用与state
1. 在main.js中挂载pinia
```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
const app = createApp(App)

//引入pinia
import { createPinia } from 'pinia'
//创建Pinia实例
const pinia = createPinia()
app.use(pinia)

app.mount('#app')

```
2. 新建文件store/counter.js
```js
import { defineStore } from 'pinia'
// 创建store,命名规则： useXxxxStore
// 参数1：store的唯一表示
// 参数2：对象，可以提供state actions getters
const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0,
    }
  },
  getters: {
   
  },
  actions: {
    
  },
})

export default useCounterStore
```
3. 在组件中使用
```html
<script setup>
import useCounterStore from './store/counter'

const counter = useCounterStore()
</script>

<template>
  <h1>根组件---{{ counter.count }}</h1>
</template>

<style></style>
```

四种修改state的方式
```ts
import { defineStore } from 'pinia'
//1.定义容器
//参数1：容器的ID，必须唯一（可以自己取名），将来Pinia会把所有的容器挂在到跟容器
export const useMainStore = defineStore('main', {
  //相当于data
  //1.必须是函数，这样是为了在服务端渲染的时候便面交叉请求导致的数据状态污染
  //2.必须是箭头函数，这是为了更好的TS类型推导
  //3.返回值：一个函数，调用得到函数的返回值
  state: () => {
    return {
      count: 0,
      foo:'foo',
      arr:['学习']
    }
  },
  //相当于computed
  getters: {},
  //相当于methods
  actions: {},
})
```
在vue组件中获取store
```ts
import { useMainStore } from '../store'

const mainStore = useMainStore()

function handleChangeState() {
  //方法一：直接修改
  // mainStore.count++
  // mainStore.foo='hello'
  // mainStore.arr.push('world')

  // 方法二：使用$patch批量修改 
  // mainStore.$patch({
  //   count: mainStore.count + 1,
  //   foo: 'hello',
  //   arr: [...mainStore.arr, 'world']//但是这种方式对于数组来说不友好
  // })
  // 方法三：
  // mainStore.$patch(state =>{
  //   state.count++
  //   state.foo='hello'
  //   state.arr.push('world')
  // })

  //方法四：逻辑比较多的时候，可以使用action
  //在mainStore中
    actions: {
    changeState(){
      this.count++
      this.foo='hello'
      this.arr.push("hello")
    }
  },
  //组件中
  mainStore.changeState()
}
```

## 3.actions的使用
在pinia中没有mutations，只有actions，不管是同步还是异步的代码，都可以在actions中完成。
1. 在actions中提供方法并且修改数据
```js
import { defineStore } from 'pinia'
// 1. 创建store
// 参数1：store的唯一表示
// 参数2：对象，可以提供state actions getters
const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0,
    }
  },
  actions: {
    increment() {
      this.count++
    },
    incrementAsync() {
      setTimeout(() => {
        this.count++
      }, 1000)
    },
  },
})

export default useCounterStore
```
2. 在组件中使用
```html
<script setup>
import useCounterStore from './store/counter'

const counter = useCounterStore()
</script>

<template>
  <h1>根组件---{{ counter.count }}</h1>
  <button @click="counter.increment">加1</button>
  <button @click="counter.incrementAsync">异步加1</button>
</template>
```

## 4.getters的使用
pinia中的getters和vuex中的基本是一样的，也带有缓存的功能

1. 在getters中提供计算属性
```js
import { defineStore } from 'pinia'
// 1. 创建store
// 参数1：store的唯一表示
// 参数2：对象，可以提供state actions getters
const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0,
    }
  },
  getters: {
    double() {
      return this.count * 2
    },
  },
  actions: {
    increment() {
      this.count++
    },
    incrementAsync() {
      setTimeout(() => {
        this.count++
      }, 1000)
    },
  },
})

export default useCounterStore

```
2. 在组件中使用
```html
  <h1>根组件---{{ counter.count }}</h1>
  <h3>{{ counter.double }}</h3>
```

## 5.storeToRefs的使用
如果直接从pinia中解构数据，会丢失响应式， 使用storeToRefs可以保证解构出来的数据也是响应式的

```js
<script setup>
import { storeToRefs } from 'pinia'
import useCounterStore from './store/counter'

const counter = useCounterStore()
// 如果直接从pinia中解构数据，会丢失响应式
const { count, double } = counter

// 使用storeToRefs可以保证解构出来的数据也是响应式的
const { count, double } = storeToRefs(counter)
</script>
```

## 6.pinia模块化
在复杂项目中，不可能把多个模块的数据都定义到一个store中，一般来说会一个模块对应一个store，最后通过一个根store进行整合

1. 新建store/user.js文件
```js
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: 'zs',
      age: 100,
    }
  },
})

export default useUserStore

```
2. 新建store/index.js
```js
import useUserStore from './user'
import useCounterStore from './counter'

// 统一导出useStore方法
export default function useStore() {
  return {
    user: useUserStore(),
    counter: useCounterStore(),
  }
}

```

3. 在组件中使用

```html
<script setup>
import { storeToRefs } from 'pinia'
import useStore from './store'
const { counter } = useStore()

// 使用storeToRefs可以保证解构出来的数据也是响应式的
const { count, double } = storeToRefs(counter)
</script>

```

# 三、数据持久化
## 1.安装
```js
yarn add pinia-plugin-persistedstate
or
npm i  pinia-plugin-persistedstate
```

## 2.使用插件
在main.ts中注册
```js
import { createApp } from "vue";
import App from "./App.vue";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(App).use(pinia);
```
## 3.模块开启持久化
```js
const useHomeStore = defineStore("home",{
  // 开启数据持久化
  persist: true
  //或者写成
  persist:{
	enabled:true
	}
  // ...省略
});
```

## 4.按需缓存模块的数据
需求：不想所有数据都持久化处理，能不能按需持久化所需数据，怎么办？

可以用配置式写法，按需缓存某些模块的数据。

```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', s{
  state: () => {
    return {
      someState: 'hello pinia',
      nested: {
        data: 'nested pinia',
      },
    }
  },
  // 所有数据持久化
  // persist: true,
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'storekey',
    // 修改为 sessionStorage，默认为 localStorage
    storage: window.sessionStorage,
    // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
    paths: ['nested.data'],
  },
})
```
# 四、模板
```ts
import { defineStore } from 'pinia'
export const useXXXStore = defineStore('XXX', {
  state: () => {
  return{}
  },
  getters: {},
  actions: {},
})
```