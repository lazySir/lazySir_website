---
title: dom的classList
author: lazySir
tags: [js]
description:  文章介绍了如何使用JavaScript中的classList属性来便捷地添加、删除和切换DOM元素的class，包括add、remove、toggle和contains等方法。通过案例展示了如何在实际代码中应用这些方法改变元素样式。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js.png
date: 2023-04-07
---




# 一、使用classList操作DOM元素的class属性

当我们使用JavaScript操作DOM元素时，有时候需要添加或删除元素的class属性。在这种情况下，可以使用DOM的classList属性。classList是一个DOM元素的属性，它返回一个DOMTokenList对象，该对象表示元素的class属性值。

classList属性提供了许多方便的方法来添加、删除、切换和检查元素的class属性。下面是一些classList的常用方法：

- `add(className)`: 将指定的class添加到元素的class列表中。
- `remove(className)`: 从元素的class列表中删除指定的class。
- `toggle(className)`: 如果元素的class列表中存在指定的class，则删除该class；否则添加该class。
- `contains(className)`: 检查元素的class列表中是否存在指定的class，如果存在，则返回true；否则返回false。
# 二、案例

下面是一个例子，演示如何使用classList属性来添加和删除元素的class属性：

```js
htmlCopy code<p id="my-para">This is a paragraph.</p>
<button onclick="addRed()">Add Red</button>
<button onclick="addBlue()">Add Blue</button>
<button onclick="removeColor()">Remove Color</button>

<script>
function addRed() {
  var para = document.getElementById("my-para");
  para.classList.add("red");
}

function addBlue() {
  var para = document.getElementById("my-para");
  para.classList.add("blue");
}

function removeColor() {
  var para = document.getElementById("my-para");
  para.classList.remove("red");
  para.classList.remove("blue");
}
</script>
```

在上面的例子中，我们定义了三个按钮来添加和删除元素的class属性。当单击"Add Red"按钮时，会将元素的class属性设置为"red"，从而将文本设置为红色。类似地，当单击"Add Blue"按钮时，会将元素的class属性设置为"blue"，从而将文本设置为蓝色。最后，当单击"Remove Color"按钮时，会从元素的class属性中删除"red"和"blue"。

# 三、结论

总之，classList是一个非常方便的属性，可以轻松地操作DOM元素的class属性。它的方法简单易用，可以让我们更好地控制和管理页面元素的样式。