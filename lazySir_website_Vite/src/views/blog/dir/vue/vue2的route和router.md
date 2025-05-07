---
title: vue2的router和route
author: lazySir
tags: [vue2,vue-router]
description: vue2的一些config配置
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue.png
date: 2022-10-01
---
# 认识vue-router

目前前端流行的三大框架, 都有自己的路由实现:
Angular的ngRouter
React的ReactRouter
Vue的vue-router

当然, 我们的重点是vue-router
vue-router是Vue.js官方的路由插件，它和vue.js是深度集成的，适合用于构建单页面应用。
我们可以访问其官方网站对其进行学习: https://router.vuejs.org/zh/
vue-router是基于路由和组件的
路由用于设定访问路径, 将路径和组件映射起来.
在vue-router的单页面应用中, 页面的路径的改变就是组件的切换.

# 安装和使用vue-router

第一步：

```javascript
npm i vue-router
```

第二步：

```javascript
1.在src文件夹下创建router文件夹
2.在router文件夹中创建index.js文件
```

第三步：

```javascript
//在index.js文件中
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
let router = new VueRouter({
  routes: [],
})

export default router

```

第四步：

```javascript
//main.js中
import router from '@/router'
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')

```

第五步：

```javascript
//在App.vue中   或者任何你想显示路由组件的地方 加上router-view标签
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

```

# router-link

## 作用

该标签是一个vue-router中已经内置的组件, 它会被渲染成一个标签.
该标签会根据当前的路径, 动态渲染出不同的组件.
网页的其他内容, 比如顶部的标题/导航, 或者底部的一些版权信息等会和处于同一个等级.
在路由切换时, 切换的是挂载的组件, 其他内容不会发生改变.

## 属性

### to

to='路由组件地址'   例如 to='/home' 将地址转换成home

### tag:

tag可以指定之后渲染成什么组件, 比如上面的代码会被渲染成一个元素, 而不是```<a> ```

注意：router-link 默认是a标签

### replace:

replace不会留下history记录, 所以指定replace的情况下, 后退键返回不能返回到上一个页面中

### active-class:

当对应的路由匹配成功时, 会自动给当前元素设置一个router-link-active的class, 设置active-class可以修改默认的名称. 例如：active-class=‘active’ 在进行高亮显示的导航菜单或者底部tabbar时, 会使用到该类. 但是通常不会修改类的属性, 会直接使用默认的router-link-active即可. 

### 修改linkActiveClass

以上的属性都得一条条写 不能简写 但是active-class=‘xxx’可以统一修改 在router实例中写linkActiveClass=‘xxx’ 就统一进行了修改

![vue2的router和route](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2的router和route1.png)


# 配置组件和路径的映射关系

![vue2的router和route](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2的router和route2.png)


# 路由的默认路径

在routes最上面添加一个对象  

```javascript
  let router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home',   //默认显示的路由组件地址
    },
  ]
 )}
```

配置解析:
我们在routes中又配置了一个映射. 
path配置的是根路径: /
redirect是重定向, 也就是我们将根路径重定向到/home的路径下, 这样就可以得到我们想要的结果了.

# 路由懒加载

## 作用

当路由被访问的时候才加载对应组件

## 写法

### 方式一: 结合Vue的异步组件和Webpack的代码分析.（早期）

const Home = resolve => { require.ensure(['../components/Home.vue'], () => { resolve(require('../components/Home.vue')) })};

### 方式二: AMD写法

const About = resolve => require(['../components/About.vue'], resolve);

### 方式三: 在ES6中, 我们可以有更加简单的写法来组织Vue异步组件和Webpack的代码分割.(最新)

const Home = () => import('../components/Home.vue')

<br/>

# 路由的嵌套

## 认识嵌套路由

嵌套路由是一个很常见的功能
比如在home页面中, 我们希望通过/home/news和/home/message访问一些内容.
一个路径映射一个组件, 访问这两个路径也会分别渲染两个组件.

<br/>

路径和组件的关系如下:

![vue2的router和route](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2的router和route4.png)


## 路由嵌套的实现

1.创建对应的子组件, 并且在路由映射中配置对应的子路由.

```javascript
//例如：要在home组件中显示news组件
  let router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: home,   //默认显示的路由组件地址
      children:[
      {
        path:'news',    //注意： 子路由不需要在加 ‘/’
        component:new
      }
      ]
    },
  ]
 )}
```

2.在父路由中

```javascript
  <templete>
  <router-link />    //在需要显示的地方加上router-link
  </templete>
```

## 嵌套默认路径

和路由的默认路径方法一样 只是写在children

# 传递参数

### params的类型:

配置路由格式: /router/:id

传递的方式: 在path后面跟上对应的值

传递后形成的路径: /router/123, /router/abc

### query的类型:

配置路由格式: /router, 也就是普通配置
传递的方式: 对象中使用query的key作为传递方式
传递后形成的路径: /router?id=123, /router?id=abc

如果要使用query对象的写法 需要在路由配置里面加上name属性

```javascript
this.$route.push({
name:'',//如果没有name  
        //也可以使用 path 
        //且path不可以query和params一起使用而name可以
query:{
}
})
```

### 面试题


9）路由传参
params参数：路由需要占位，程序就崩了，属于URL当中一部分
query参数：路由不需要占位，写法类似于ajax当中query参数
路由传递参数先关面试题
 1:路由传递参数（对象写法）path是否可以结合params参数一起使用?
      答：不可以：不能这样书写，程序会崩掉
 2:如何指定params参数可传可不传? 
      答：在后面加上问号
 3:params参数可以传递也可以不传递，但是如果传递是空串，如何解决？
      答：使用undefined 
       this.$route.push({name:  , params:{keyword:''||undefined}})
 4:如果指定name与params配置, 但params中数据是一个"", 无法跳转，路径会出问题
      
 5: 路由组件能不能传递props数据?
      答：可以  三种写法
          方式一：布尔值写法：params
              在路由配置里 props：true   拿的时候props：传过来的key
          方式二：对象写法 额外的给路由组件传递一些props
            props：{a：1，b：2}
          方式三：函数写法：可以params参数，query参数，通过props传递给路由组件
          props：（$route）=>{return {keyword:$route.params.keyword,k:$route.query.k}}


### 重复提交query会报错的问题

原因是因为新版本的vue-router是一个promise对象

解决方案：

```javascript
//需要重写VueRouter.prototype原型对象身上的push|replace方法
//先把VueRouter.prototype身上的push|replace方法进行保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//重写VueRouter.prototype身上的push方法了
VueRouter.prototype.push = function(location, resolve, reject) {
  //第一个形参：路由跳转的配置对象（query|params）
  //第二个参数：undefined|箭头函数（成功的回调）
  //第三个参数:undefined|箭头函数（失败的回调）
  if (resolve && reject) {
    //push方法传递第二个参数|第三个参数（箭头函数）
    //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
    originPush.call(this, location, resolve, reject);
  } else {
    //push方法没有产地第二个参数|第三个参数
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
//重写VueRouter.prototype身上的replace方法了
VueRouter.prototype.replace = function(location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
```

## 获取参数

通过   route 对象

this.$route.params.属性

this.$route.query.属性

# route和router的区别

router为VueRouter实例，想要导航到不同的url，则使用router.push方法
$route为当前router跳转对象，里面可以获取name、path、query、params等 

![vue2的router和route](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue2的router和route5.png)


# 滚动行为

```javascript
  //滚动行为
  scrollBehavior(to,from,savePosition){
    //返回的y代表y在最上面
    return { x:0,y:0 }
  }
```
