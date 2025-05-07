---
title: css3--nth-child的用法
author: lazySir
tags: [css,css3]
description: CSS的 :nth-child 选择器是一个强大的工具，允许我们根据它们在父元素中的位置选择元素。这为我们提供了更大的灵活性来控制页面上的元素。
cover:  https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/css/css图片.png
date: 2023-06-08
---

# 使用CSS nth-child选择器

CSS的 `:nth-child` 选择器是一个强大的工具，允许我们根据它们在父元素中的位置选择元素。这为我们提供了更大的灵活性来控制页面上的元素。

## 基本用法

基本形式为 `:nth-child(n)`，其中 `n` 是一个整数，表示要选择的子元素的位置。例如，`.item:nth-child(3)` 将选择每个父元素中的第三个 `.item` 子元素。

```css
.item:nth-child(3) {
    color: red;
}
```

## 使用公式

更复杂的是，你可以使用 `an+b` 形式的公式，其中 `a` 和 `b` 是任何整数，`n` 是一个计数器，从0开始。例如，`:nth-child(2n+1)` 会选择所有奇数位置的元素，`:nth-child(3n+1)` 则会选择第1、4、7...位置的元素。

```css
.item:nth-child(2n+1) {
    color: green;
}
```

## 从零开始

虽然 `nth-child` 是从1开始计数的（在HTML中，第一个元素的索引为1），但在 `an+b` 公式中，`n` 是从0开始的。例如，`:nth-child(3n)` 会选择第0（不存在）、3、6、9...位置的元素。也就是说，`:nth-child(3n)` 实际上不会选择任何第0个子元素，因为没有第0个子元素。

```css
.item:nth-child(3n) {
    background-color: blue;
}
```

## 关键点

记住，`:nth-child` 选择器查看的是元素在其父元素中的位置，而不是它在文档中的位置或它在其类别中的位置。所以，如果你有一个列表，它包含两种不同的类元素，`:nth-child` 会考虑所有的子元素，而不仅仅是特定的类别。

```html
<ul>
    <li class="odd">1</li>
    <li class="even">2</li>
    <li class="odd">3</li>
    <li class="even">4</li>
</ul>
```

```css
.odd:nth-child(2n) {
    color: orange;
}
```
在上面的例子中，没有 `.odd` 元素会被染色，因为 `nth-child(2n)` 实际上在选择所有偶数位置的元素，而 `.odd` 元素都在奇数位置。

## 结论

学习和理解 `:nth-child` 选择器的用法可以使你在编写CSS时更加灵活和高效。希望这篇文章能帮助你更好地理解这个强大的选择器，并在你的下一个项目中找到它的用途

。