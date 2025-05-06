---
title: node-token
author: lazySir
tags: [node.js,npm]
description: node-token使用
cover: 
date: 2022-09-15
---

# 一、生成token
## 1.1下载

```JavaScript
npm install jsonwebtoken
```

## 1.2作用

生成token字符串

## 1.3生成

```JavaScript
//导入生成token的包
const jwt =require('jsonwebtoken')

//三个参数:  加密对象  解密字符串 有效时长
  
const tokenStr=jwt.sign(payload,jwtSecretKey（解密字符串）,{expiresIn:expiresIn（时长）})
```

## 1.4使用

```JavaScript
token:  'Bearer ' + tokenStr,  //Bearer 客户端使用需要加上 这边帮忙加上
```

# 二、设置需要token权限的接口
## 2.1下载

```JavaScript
npm install express-jwt
```
>注意：需要配合 jsonwebtoken使用
## 2.2设置需要保护的API接口

```JavaScript
const expressJWT=require('express-jwt')
//凡是以api开头的接口都不需要解密 path里面写的是正则表达式
app.use(expressJWT({secret:jwtSecretKey（解密字符串）}).unless({path:[/^\/api/]}))//解密过程
```

## 2.3客服端使用

```JavaScript
Header需要携带
key：Authorization
value:bearer +token <---注意bearer后面的空格
```

## 2.4校验token失败时的处理

```JavaScript
app.use( (err, req, res, next)=> {
  if (err.name === 'UnauthorizedError') {   
      //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    res.status(401).send('invalid token...');
  }
});
```

1. token过期时的err值

```JavaScript
{
    "name": "UnauthorizedError",
    "message": "jwt expired",
    "code": "invalid_token",
    "status": 401,
    "inner": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2017-08-03T10:08:44.000Z"
    }
}
```
2. token无效时的err值：

```JavaScript
{
    "name": "UnauthorizedError",
    "message": "invalid signature",
    "code": "invalid_token",
    "status": 401,
    "inner": {
        "name": "JsonWebTokenError",
        "message": "invalid signature"
    }
}
```