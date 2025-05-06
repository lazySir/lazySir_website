---
title: js的set和map
author: lazySir
tags: [js]
description:  当你在开发 JavaScript 应用程序时，您通常需要处理数据。Set 和 Map 是两种非常有用的 JavaScript 数据结构，可以帮助您轻松地存储和访问数据。在本篇文章中，我们将深入探讨 Set 和 Map，让您了解这两种数据结构的基本概念、用法以及各自的优势。
cover: 
date: 2023-04-05
---
@[TOC](目录)

<hr>

# 一、介绍

当你在开发 JavaScript 应用程序时，您通常需要处理数据。Set 和 Map 是两种非常有用的 JavaScript 数据结构，可以帮助您轻松地存储和访问数据。在本篇文章中，我们将深入探讨 Set 和 Map，让您了解这两种数据结构的基本概念、用法以及各自的优势。

# 二、Set
Set 是一个由一组唯一且不重复的值组成的数据结构，它可以存储任何类型的值，包括原始类型和对象引用。Set 中的值按照插入的顺序排序，并且可以通过迭代器按顺序访问。由于 Set 中的值是唯一的，因此您可以使用 Set 来从数组或其他数据源中轻松地过滤重复的值。

## 1.Set 的基本操作
以下是一些常用的 Set 操作：

1. add(value)：将一个值添加到 Set 中。
2. has(value)：检查 Set 中是否存在一个值。
3. delete(value)：从 Set 中删除一个值。
4. clear()：清空 Set。
## 2.Set 示例
下面是一个使用 Set 的简单示例：
```js
javascript
Copy code
const mySet = new Set();
mySet.add('apple');
mySet.add('banana');
mySet.add('orange');
mySet.add('apple'); // 不会重复添加

console.log(mySet.size); // 3
console.log(mySet.has('banana')); // true

mySet.delete('orange');
console.log(mySet.size); // 2

mySet.clear();
console.log(mySet.size); // 0
```
在上述示例中，我们创建了一个新的 Set 实例，并向其中添加了几个字符串值。我们使用了 size 属性来获取 Set 中值的数量，并使用 has() 方法来检查 Set 中是否存在一个特定的值。我们还使用了 delete() 方法删除了一个值，并使用 clear() 方法清空整个 Set。

## 3.Set 迭代器
Set 迭代器允许您按照插入顺序遍历 Set 中的值。以下是一些常用的 Set 迭代器：

values()：返回一个包含 Set 中所有值的迭代器，按照插入顺序排列。
keys()：返回一个与 values() 方法相同的迭代器，仅用于兼容 Map。
entries()：返回一个包含 Set 中每个元素键值对的迭代器，其中键和值相等。在 Set 中，键和值相等是因为每个元素都是唯一的。
forEach(callbackFn, thisArg)：对 Set 中的每个元素执行回调函数，可选地提供 thisArg 参数来指定回调函数中的 this 上下文。

以下是一个使用 Set 迭代器的示例：
```js
javascript
Copy code
const mySet = new Set();
mySet.add('apple');
mySet.add('banana');
mySet.add('orange');

// 使用 values() 迭代器遍历 Set
for (const value of mySet.values()) {
  // 输出元素值
console.log(value);
}
// 使用 entries() 迭代器遍历 Set
for (const [key, value] of mySet.entries()) {
console.log(key, value);
}

// 使用 forEach() 方法遍历 Set
mySet.forEach((value, key, set) => {
console.log(value, key, set);
});
```
在上述示例中，我们使用 `values()` 方法返回一个迭代器，遍历 Set 中的值并输出它们。我们还使用 `entries()` 方法返回一个迭代器，遍历 Set 中的键值对并输出它们。最后，我们使用 `forEach()` 方法对 Set 中的每个元素执行回调函数，并输出它们的值、键和整个 Set 对象。

# 三、Map

Map 是一种键值对集合，其中每个元素由一个键和一个值组成。键可以是任何类型，值也可以是任何类型，包括原始类型和对象引用。Map 中的元素没有固定的顺序，但可以通过迭代器按插入顺序或其他方式访问。

## 1.Map 的基本操作

以下是一些常用的 Map 操作：

- `set(key, value)`：将一个键值对添加到 Map 中。
- `get(key)`：获取一个键对应的值。
- `has(key)`：检查 Map 中是否存在一个键。
- `delete(key)`：从 Map 中删除一个键值对。
- `clear()`：清空 Map。

## 2.Map 示例

下面是一个使用 Map 的简单示例：

```javascript
const myMap = new Map();
myMap.set('apple', 1);
myMap.set('banana', 2);
myMap.set('orange', 3);
myMap.set('apple', 4); // 覆盖已有的值

console.log(myMap.size); // 3
console.log(myMap.get('banana')); // 2

myMap.delete('orange');
console.log(myMap.size); // 2

myMap.clear();
console.log(myMap.size); // 0

```
在上述示例中，我们创建了一个新的 Map 实例，并向其中添加了几个键值对。我们使用了 size 属性来获取 Map 中键值对的数量，并使用 get() 方法来获取一个键对应的值。我们还使用了 delete() 方法删除了一个键值对，并使用 clear() 方法清空整个 Map。

## 3.Map 迭代器
Map 迭代器允许您按照插入顺序或其他方式遍历 Map 中的键值对。以下是一些常用的 Map 迭代器：

1. keys()：返回一个包含 Map 中所有键的迭代器，按照插入顺序排列。
2. values()：返回一个包含 Map 中所有值的迭代器，按照插入顺序排列。
3. entries()：返回一个包含 Map 中每个元素键值对的迭代器，按照插入顺序排列。
4. forEach(callbackFn, thisArg)：对 Map 中的每个元素执行回调函数，可选地提供 thisArg 参数来指定回调函数中的 this 上下文

以下是一个使用 Map 迭代器的示例：
```js
const myMap = new Map();
myMap.set('apple', 1);
myMap.set('banana', 2);
myMap.set('orange', 3);

// 使用 keys() 迭代器遍历 Map
for (const key of myMap.keys()) {
  console.log(key);
}

// 使用 values() 迭代器遍历 Map
for (const value of myMap.values()) {
  console.log(value);
}

// 使用 entries() 迭代器遍历 Map
for (const [key, value] of myMap.entries()) {
  console.log(key, value);
}

// 使用 forEach() 方法遍历 Map
myMap.forEach((value, key, map) => {
  console.log(value, key, map);
});
```

# 四、Set vs. Map
Set 和 Map 都提供了一种简单和高效的方式来存储和操作数据。它们都具有添加、删除、清空等基本操作，以及迭代器等用于访问元素的方法。但是，Set 和 Map 在某些方面也有所不同：

- Set 是一组唯一且不重复的值的集合，而 Map 是一种键值对集合。
- 在 Set 中，每个元素都是值；在 Map 中，每个元素都是一个键值对。
- 在 Set 中，元素按照插入顺序排列；在 Map 中，元素没有固定的顺序，但可以通过迭代器按插入顺序或其他方式访问。
- 在 Set 中，值本身就是元素的唯一标识；在 Map 中，键是元素的唯一标识。

因此，您可以根据需要选择使用 Set 或 Map。如果您**只需要一个集合，而不需要键值对，那么 Set 可能更适合**。如果您**需要存储键值对，那么 Map 是一个很好的选择。**


