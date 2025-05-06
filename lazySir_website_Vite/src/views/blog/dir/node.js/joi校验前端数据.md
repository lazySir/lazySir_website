---
title: 校验前端数据
author: lazySir
tags: [node.js,npm]
description: hapi/joi校验前端数据
cover: 
date: 2022-10-01
---
# 一、作用

定义验证规则

# 二、下载

```javascript
npm i @hapi/joi
```

# 三、导入

```
const joi = require("@hapi/joi")
```

# 四、定义带有验证规则的对象

```javascript
// 定义对象的验证规则
const schema = {
  /* 
  属性1:验证规则1,
  属性2:验证规则2,
  ......
  */
};

//示例：
const schema = {
      // 该属性的值为字符串类型，长度为2-5之间，不为空，如果不符合规则，则抛出“请输入正确规则的username”的异常
    username: Joi.string().min(2).max(5).required().error(new Error('请输入正确规则的username')),
  // 该属性的值为数字类型，值只能为1998-2020之间，如果不符合规则，则抛出“请输入正确规则的birth”的异常
    birth: Joi.number().min(1998).max(2020).error(new Error('请输入正确规则的birth'))
};

```

# 五、API方法介绍

1. .string()：数据必须为字符串类
2. .number()：数据必须为数字类型
3. .integer()：数据必须为整数类型
4. .alphanum()：数据只能包含[a-zA-Z0-9]的字符
5. .max(number|string)：number：最大长度 | string：最大日期
6. .min(number|string)：number：最小长度 | string：最小日期
7. .required()：数据为必填项，不能为null或undefined
8. .pattern(正则表达式)：以正则表达式的形式验证数据
9. .regex(正则表达式)：定义字段必须匹配正则规则。
10. .email()：验证邮箱
11. .joi.ref(key:string)：引言同辈的键值，就是拿到value
12. .not(values:any[])：当前属性的值不能同参数值相同
13. .valid(...values:any[])：当前属性的值必须于参数值相同
14. .dataUri()：当前字段为可以是URL地址
15. .allow(...values:any[])：该字段允许为指定参数的值
16. .default(any[])：设置该字段的默认值，值可以为string、number、boolean……等
17. .error(new Error('错误信息'))：在不符合验证条件的时候会返回错误信息
    
    ==注意==：使用规则：先确定类型（string number）string类型的才能使用正则表达式

# 六、进行数据验证

## 法一：

```javascript
// 向外部共享一个接口
// data：要验证的数据对象
module.exports = function(data) {
    // 通过解构，拿到错误信息字符串error
    // var {异常字符串,值}= 验证规则对象.validate(要验证的数据);
    var { error, value } = schema.validate(data);
      // error ：异常字符串，value：值
    // 如果异常信息字符串不为空，则证明抛出了异常信息
    if (error) {
        // 就返回异常信息
        return error;
    }
    // 否则返回空
    return null;
};

```

## 法二：

1. 通过npm包
   ```javascript
   npm i @escook/express-joi
   ```
2. 导入包
   ```javascript
   const expressJoi =require('@escook/express-joi')
   ```
3. 导入定义规则
   ```javascript
   const {user_schema_email} =require('../../schema/user')
   //需要在定义规则的时候exports.user_schema_email对象
   ```
4. 使用
   ```javascript
   router.get('/getAllGoodsCategory',expressJoi(user_schema_email),userGoods_handle.getAllGoodsCategory)
   ```

# 七、常用验证规则

## 7.1修改密码

```javascript
// 判断的验证规则，新密码不能与旧密码一致
const schemapwd = joi.object({
    // 旧密码：字符串，最小长度6，最大18，不为空
    oldpwd: joi.string().min(6).max(18).required().error(new Error("密码为6-18位任意字符！")),
    // 新密码：不能与旧密码的值相同
    newpwd: joi.not(joi.ref("oldpwd")).error(new Error("新密码不能和旧密码相同！")),
    // 重复密码：类型任意，不能为空，校验规则：必须和新密码相同
    aginpwd: joi.any().required().valid(joi.ref("newpwd")).error(new Error("重复密码和新密码不一致！")),
});

```

## 7.2登录验证

```javascript
const schema = joi.object({
        // 账号
    ulogid: joi.string().required().alphanum().min(6).max(11).error(new Error("输入登录账号格式有误！")),
    // 密码
    upwd: joi.string().required().min(6).max(18).error(new Error("用户密码为6-18位任意字符"))
});

```

## 7.3注册验证

```javascript
const schema = joi.object({
        // 用户名
    uname: joi.string().required().error(new Error("用户名格式有误！")),
    // 邮箱
    uemail: joi.string().required().pattern(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).error(new Error("邮箱格式有误！")),
    // 账号
    ulogid: joi.string().required().alphanum().min(6).max(11).error(new Error("账号格式有误！")),
    // 密码
    upwd: joi.string().required().min(6).max(18).error(new Error("用户密码为6-18位任意字符")),
});

```

## 7.4 路径/url地址/base64编码

```javascript
const schemaavatar = joi.object({
    avatar: joi.string().dataUri().required().error(new Error("请选择图像！"))
});

```

## 7.5排序验证

```javascript
const page = joi.object({
    sort: joi.string().required().default("asc").allow("asc").allow("desc").error(new Error("排序格式有误!"))
});

```
