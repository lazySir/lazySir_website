---
title: 可逆加密与解密
author: lazySir
tags: [node.js,npm]
description: node-crypto-js可逆加密与解密
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/node.js/cover.png
date: 2022-10-01
---
# 下载

```javascript
npm install crypto-js
```

# 作用

对数据进行加密与解密

# 实例

```javascript
const CryptoJS = require("crypto-js");

// 加密
// key：密钥，text：明文
function encrypt(key, text) {
    return CryptoJS.AES.encrypt(text, key).toString();
}

// 解密
// key：密钥，cipherText密文
function decrypt(key, cipherText) {
    let bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8)
}

let key = "abc"
let text = "猪二哥"
let ciphertext = encrypt(key, text)
console.log("密文：" + ciphertext)
let originalText = decrypt(key, ciphertext)
console.log("明文：" + originalText)

```
