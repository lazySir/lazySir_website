---
title: uuid
author: lazySir
tags: [node.js,npm]
description: uuid生成唯一身份识别码
cover: 
date: 2022-09-15
---
# 下载
不需要下载  脚手架默认拥有  （如果使用的vue-cli）
如果无 则

```JavaScript
npm install uuid
```
# 作用

生成一串随机字符串  作为唯一身份识别

# 如何生成？

```JavaScript
import { v4 as uuidv4 } from 'uuid';
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
```

# 一般使用

在src下创建utils文件夹

```JavaScript
import {v4 as uuidv4} from 'uuid'
//要生成一个随机字符串 且每次执行不能发生变化，游客身份永久存储
export const getUUID=()=>{
//1.先判断本地存储是否存在uuid
 let uuid_token=localStorage.getItem('UUIDTOKEN')
 //如果没有则生成
 if(!uuid_token){
   //生成游客临时身份
   uuid_token =uuidv4()
   //本地存储
   localStorage.setItem('UUIDTOKEN',uuid_token)
 }
 return uuid_token
}
```

外界想要获取直接

```JavaScript
import {getUUID} from '@/utils/uuid_token'

uuid_token:getUUID()
```