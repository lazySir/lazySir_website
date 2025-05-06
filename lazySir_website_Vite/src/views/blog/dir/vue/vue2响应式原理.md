---
title: vue2的响应式原理
author: lazySir
tags: [vue2]
description: vue2的响应式原理
cover: 
date: 2022-09-28
---
通过get 和 set

因为数组里的数据没有getter和setter所以就造成了数组不能响应式更新

怎么解决？

1.引入 vue  通过vue.set()添加

2.this.$set（）添加

delete 是删除   

# Object.defineProperty

## 参数

对象 属性 对象内容

## 属性

### 1.configurable（颜色会发生改变,可否删除）

当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。

默认为 false。

### 2.enumerable（可否遍历）

当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
默认为 false。
数据描述符还具有以下可选键值：

### 3.value（值）

该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。

默认为 undefined。

### 4.writable（值可否被改变）

当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符 (en-US)改变。
默认为 false。

### 5.get

属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。

默认为 undefined。

### 6.set

属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。
默认为 undefined。
