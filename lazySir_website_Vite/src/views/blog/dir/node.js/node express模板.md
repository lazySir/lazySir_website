---
title: express模板
author: lazySir
tags: [node.js,npm]
description: node-express模板
cover: 
date: 2022-09-15
---
​
```js
express生成服务器
//----------引包区-----------------

//引入express
const express = require('express')
//引入解析json的包
const bodyParser = require('body-parser')

//-----------构建实例区---------------
//创建express实例
const app = express()
//解决跨域问题
const cors = require('cors')

//------------使用插件区域-------------
app.use(cors())
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
//配置解析json数据的中间件
app.use(bodyParser.json({ limit: '1mb' })) //body-parser 解析json格式数据
app.use(
  bodyParser.urlencoded({
    //此项必须在 bodyParser.json 下面,为参数编码
    extended: true,
  }),
)
//-------------路由模块-----------------------

//---------------服务器------------------
//创建服务器
app.listen(3007, () => {
  console.log('api server is running at http://192.168.123.147:3007')
})
```

​