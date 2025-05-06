---
title: 生成图片验证码
author: lazySir
tags: [node.js,npm]
description: node-svg-captcha生成图片验证码
cover: 
date: 2022-09-16
---

# 安装

```JavaScript
npm i svg-captcha --save
```

# 作用

生成图片验证码

# 使用方法

```JavaScript
var svgCaptcha = require('svg-captcha');

var c = svgCaptcha.create();
console.log(c);
// {data: '<svg.../svg>', text: 'abcd'}
//该函数返回的对象拥有以下属性

//data: string // svg 路径
//text: string // 验证码文字

```

# 参数

如果没有任何参数，则生成的 svg 图片有4个字符。

```JavaScript
var c = svgCaptcha.create({
  size: 4 // 验证码长度
ignoreChars: '0o1i' // 验证码字符中排除 0o1i
noise: 1 // 干扰线条的数量
color: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
background: '#cc9966' // 验证码图片背景颜色
});
```

# 不同的验证类型

```JavaScript
svgCaptcha.createMathExpr(options)
```

和前面的 api 的参数和返回值都一样。不同的是这个 api 生成的 svg 是一个算数式，而 text 属性上是算数式的结果。不过用法和之前是完全一样的

# 图片验证码案例

## 1.安装

```JavaScript
npm i svg-captcha --save
```

## 2.在使用的地方导入

```JavaScript
const svgCaptcha = require('svg-captcha');
```

## 3.获取验证码

### 3.1 安装cookie-parser 

```JavaScript
npm i cookie-parser --save
```

### 3.2 使用 cookie-parser

```JavaScript
const cookieParase = require('cookie-parser');
//作用是将获取到的session保存到cookie，方便前端访问验证
```

### 3.3 获取验证码(编写路由)

```JavaScript
//图片验证码包
const svgCaptcha = require('svg-captcha')
//作用是将获取到的session保存到cookie，方便前端访问验证
const cookieParase = require('cookie-parser')
exports.getSvgCaptcha = (req, res) => {
  var captcha = svgCaptcha.create({
    size: 5, // 验证码长度
    ignoreChars: "0oOiIl1", // 验证码字符中排除某些字符
    noise: 6, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
});
  // 保存到session,忽略大小写
  req.session = captcha.text.toLowerCase()//后面这东西的内容是验证码的内容
  //保存到cookie 方便前端调用验证
  res.cookie('captcha', req.session)
  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(String(captcha.data))//输出svg
}

```

## 4.返回数据

返回的就是个svg。

前端的img src属性直接写接口地址

```JavaScript
<img src="/api/getCaptcha" alt="captcha" >
```

## 5.验证验证码

在前端的cookie中

key：captcha

value：存储了图片的正确内容

```JavaScript
let captcha = document.cookie.split('=')[1]
    if(this.yzm != captcha){
      return this.$message.warning('验证码错误')
    }
```

