---
title: vue2的全局事件总栈
author: lazySir
tags: [vue2]
description: vue2的全局事件总栈
cover: 
date: 2022-09-28
---
# 添加

main.js中

//添加事件总线对象
Vue.prototype.$bus = new Vue() 或者=this

# 理解

## 1.Vue 原型对象上包含事件处理的方法

1. $on(eventName, listener): 绑定自定义事件监听
2. $emit(eventName, data): 分发自定义事件
3. $off(eventName): 解绑自定义事件监听
4. $once(eventName, listener): 绑定事件监听, 但只能处理一次

## 2.所有组件实例对象的原型对象的原型对象就是 Vue 的原型对象

<br/>

1. 所有组件对象都能看到 Vue 原型对象上的属性和方法
2. Vue.prototype.$bus = new Vue(), 所有的组件对象都能看到$bus 这个属性
对象

# 发射事件

this.$bus.￥emit('deleteTodo', this.index)

# 接受事件

this.$bus.￥on('deleteTodo', this.deleteTodo)

# 解绑事件

this.$bus.￥off('deleteTodo')
