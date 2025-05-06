---
title: vee-validate表单验证
author: lazySir
tags: [vue,npm]
description: vee-validate 是一个用于 Vue.js 的表单验证库，提供了简单易用的 API 和灵活的验证规则。
cover: 
date: 2022-10-01
---
# 下载

```javascript
# install with yarn
yarn add vee-validate

# install with npm
npm install vee-validate --save  //一般用2
```

# 作用

表单验证

# 使用

## main.js

```javascript
//引入表单校验插件
import '@/plugins/validate'
```

## plugins

在src文件下创建plugins文件夹--->创建validate.js

```javascript
//vee-validate插件：表单验证区域
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'   // 引入中文提示信息 message
Vue.use(VeeValidate)

//表单验证
VeeValidate.Validator.localize('zh_CN', {
  messages: {
  ...zh_CN.messages,
  is: (field) => `${field}必须与密码相同` // 修改内置规则的 message，让确认密码和密码相同
  },
  attributes: { // 给校验的 field 属性名映射中文名称
  phone: '手机号',   
  code: '验证码',
  password:'密码',
  password1:'确认密码',
  isCheck:'协议'
  }
  })

  //自定义校验规则
VeeValidate.Validator.extend("tongyi", {
  validate: (value) => {
    return value;
  },
  getMessage: (field) => field + "必须同意",
});

```

## template

```javascript
      <div class="content">
        <label>手机号:</label>
        <input
          placeholder="请输入你的手机号"
          v-model="phone"
          name="phone"
          v-validate="{ required: true, regex: /^1\d{10}$/ }"
          :class="{ invalid: errors.has('phone') }"
        />
        <span class="error-msg">{{ errors.first("phone") }}</span>
      </div>
      <div class="content">
        <label>验证码:</label>
        <input
          placeholder="请输入你的验证码"
          v-model="code"
          name="code"
          v-validate="{ required: true, regex: /^\d{6}$/ }"
          :class="{ invalid: errors.has('code') }"
        />
        <button style="width:100px;height:38px" @click="requireCode">
          获取验证码
        </button>
        <span class="error-msg">{{ errors.first("code") }}</span>
      </div>
      <div class="content">
        <label>登录密码:</label>
        <input
          placeholder="请输入你的密码"
          v-model="password"
          name="password"
          v-validate="{ required: true, regex: /^[0-9A-Za-z]{8,20}$/ }"
          :class="{ invalid: errors.has('password') }"
        />
        <span class="error-msg">{{ errors.first("password") }}</span>
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input
          placeholder="请输入确认密码"
          v-model="password1"
          name="password1"
          v-validate="{ required: true, is: password }"
          :class="{ invalid: errors.has('password1') }"
        />
        <span class="error-msg">{{ errors.first("password1") }}</span>
      </div>
      <div class="controls">
        <input
          type="checkbox"
          v-model="agree"
          name="agree"
          v-validate="{ required: true, tongyi: true }"
          :class="{ invalid: errors.has('agree') }"
        />
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span class="error-msg">{{ errors.first("agree") }}</span>
      </div>
```

## 注册按钮

```javascript
    //注册
    async user1Register() {
      //判断是否都填写完成
      const success = await this.$validator.validateAll()
      if (success) {
        try {
          const { phone, code, password, password1 } = this
         await this.userRegister({ phone, code, password })
          //如果成功 路由跳转到登录
          this.$router.push('/login')
        } catch (error) {
          alert(error.message)
        }
      }else{
        alert('请填写完整')
      }
    },
```
