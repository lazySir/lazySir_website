---
title: vue2的一些config配置
author: lazySir
tags: [vue2]
description: vue2的一些config配置
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue.png
date: 2022-09-29
---
# 运行配置

```javascript
   //执行npm run serve 默认打开的网址
   devServer:{
     host:'localhost',
     port:8080,
     open:true  
   }
```

# 代理跨域

```javascript
  //配置代理跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
      },
    },
  },
```

# 关闭eslint验证

```javascript
lintOnSave: false,
```

# map

## 作用

项目打包后，代码都是经过加密的，运行时报错，输出的错误信息无法准确的判断是哪里的代码报错

有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列报错

## 配置

```javascript
productionSourceMap:true|false
```
