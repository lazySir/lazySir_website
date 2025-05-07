---
title: 发送邮箱验证码
author: lazySir
tags: [node.js,npm]
description: node-nodemailer发送邮箱验证码
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/node.js/cover.png
date: 2022-10-01
---
# 作用

可以发送邮箱信息

# 验证码案例

## 发送邮箱接口

```javascript
// 发送邮件的接口
router.get('/email', function (req, res, next) {
  //保存验证码和邮箱，时间
  let student = {};
  let email = req.query.email;
  let code = createSixNum();
  console.log(code);
  let time = new Date().getTime();
  student.initCode = code;
  student.time = time;
  student.email = email;
  student = JSON.stringify(student);
  // 放入缓存中
  localStorage.setItem(email,student)
 
  let sql = `select * from student where email= "${email}"`;
  db(sql, (err, data) => {
    if (data.length) {
      res.send({
        code: 0,
        message: "邮箱已注册"
      })
    } else {
      var mail = {
        // 发件人
        from: '<969060742@qq.com>',
        // 主题
        subject: '验证码',//邮箱主题
        // 收件人
        to: email,//前台传过来的邮箱
        // 邮件内容，HTML格式
        text: '用' + code + '作为你的验证码'//发送验证码
      };
      maileConfig(mail)
      res.json({
        code: 200,
        message: "发送成功"
      })
    }
  })
 
 
  // 随机产生六位验证码
  function createSixNum() {
    var Num = "";
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  }
});
```

## 校验接口

```javascript
//验证码校验（注册）
router.post("/jiaoyan", (req, res) => {
  
  let obody = req.body;
  // 获取缓存
  let student = localStorage.getItem(obody.email)
  console.log(student);
  student = JSON.parse(student);
 
  const registerTime = new Date().getTime()
  if (registerTime - student.time >= 5 * 1000 * 60) {
    res.send({
      code: -1,
      msg: '验证码已过期'
    })
  }
 
  // console.log(student);
  // console.log(obody);
  if (student.initCode === obody.code) {
      let sql = `INSERT INTO student (name,email,password) VALUES('${obody.name}','${obody.email}','${obody.password}')`;
      db(sql,(err,data)=>{
 
          res.send({
            code: 1,
            message: "注册成功",
            data:data
          })
      })
      // 注册成功删除缓存
      localStorage.removeItem(obody.email);
      console.log("----------------------");
      console.log(localStorage.getItem(obody.email));
      console.log("----------------------");
 
  }
  else {
    res.send({
      code: 0,
      message: "验证码输入错误"
    })
 
  }
 
})
```

## 配置

你不可能天真的以为这就完了把，在搞这些以前还需要下载安装邮件模块，缓存模块。以及邮件代码的配置。

1.首先自己创建一个maileFonfig.js

2.然后引入到写上面两个接口的文件中

3.下载所有的模块并引入

cnpm install nodemailer  --save

cnpm install  node-localstorage --save

4.引入

const maileConfig = require("./maileConfig");

// 引入缓存模块

const LocalStorage = require('node-localstorage').LocalStorage,

localStorage = new LocalStorage('./scratch');

## maileConfig.js

```javascript
// 准备：进入邮箱：设置>账户>POP3/SMTP服务(开启之后记得复制密钥)
 
//maileConfig.js
const nodemailer = require('nodemailer');
 
//创建一个smtp服务器
const config = {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
        user: '1192719918@qq.com',//开发者邮箱
        pass: 'goauaydaqqewgbbh',//开发者密钥
    }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);
 
//发送邮件
module.exports = function (mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};
```
