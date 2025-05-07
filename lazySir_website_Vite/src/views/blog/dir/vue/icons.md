---
title: icons
author: lazySir
tags: [vue3,icons]
description: vue3中使用icons
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue3.png
date: 2023-03-14
---
# 前言
在使用element-plus组件库开发后台管理系统时图标不够用

# 一、使用icons插件库
## 下载
```
npm i -D unplugin-icons
```
## 配置
由于我使用的是vite所以这里介绍vite
```
// vite.config.ts
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    Icons({ /* options */ }),
  ],
})
```
其他的配置去[https://github.com/antfu/unplugin-icons#configuration](https://github.com/antfu/unplugin-icons#configuration)查看

options的配置：
```
Icons({
  scale: 1.2, // Scale of icons against 1em
  defaultStyle: '', // Style apply to icons
  defaultClass: '', // Class names apply to icons
  compiler: null, // 'vue2', 'vue3', 'jsx'
  jsx: 'react', // 'react' or 'preact'
})
```

## 配置完成后
去哪里查看图标？
## 图标库
图标库地址：[https://icones.js.org/](https://icones.js.org/)
全部下载
```
npm i -D @iconify/json
```
使用：
找到要使用的图标之后点击Unplugin Icons
![icons1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/icons1.png)

```html
<template>
<MaterialSymbols360  />
</template>

<script setup>
import MaterialSymbols360 from '~icons/material-symbols/360'
</script>
```
# 二、优化
此时使用图标还是要import 还是很麻烦，有没有什么办法帮我们自动引入
## 1.下载
```js
pnpm i unplugin-vue-components -D
```
## 2.配置
vite配置
```js
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'


export default {
  plugins: [
    Components({
      resolvers: [
        IconsResolver()
      ],
    }),
  ],
}
```
其他配置：[https://github.com/antfu/unplugin-icons#migrate-from-vite-plugin-icons](https://github.com/antfu/unplugin-icons#migrate-from-vite-plugin-icons)
## 3.使用
此时使用方式和刚刚略微有点不同
还是刚刚的图标网址
找到想要的图标后直接点击复制名字
![icons1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/icons2.png)

将“：”改为“-” 在最前面添加一个“i-”
![icons1](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/icons3.png)

即可

# 三、封装组件库
组件库地址：
1. https://icon-sets.iconify.design/
2. https://icones.js.org/
## 1.下载插件
iconify
```
npm install @iconify/vue -D
```
按需自动导入图标组件库
```
npm install unplugin-icons -D
```
按需自动导入组件(可选)
```
pnpm install unplugin-vue-components -D
```
## 2.vite.config.ts
```
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig {
	plugins: [
	  Vue(),
    Components({
      // 自动按需导入组件目录
      dirs: ["src/components"],
      resolvers: [
        // 自动按需加载iconify图标库图标
        IconsResolver()
      ]
    })
    Icons({
      // 自动安装图标
      autoInstall: true
    })
  ]
}

```
## 3.使用
### 3.1 方式一
```
<i-图标集-标图名/>
如Element Plus的图标: <i-ep-user/>
如Ant Design的图标: <i-ant-design-user-outlined/>
```
### 3.2 方式二

封装组件 IconifyIcon，目录 
src\components\IconifyIcon\index.vue
```html
<script setup lang="ts" name="IconifyIcon">
import { Icon } from "@iconify/vue";
import type { CSSProperties } from "vue";

interface IconifyProps {
  name: string; // 图标的名称 ==> 必传
  color?: string; // 图标的颜色 ==> 非必传
  iconStyle?: CSSProperties; // 图标的样式 ==> 非必传
}

const props = withDefaults(defineProps<IconifyProps>(), {
  iconStyle: () => ({ width: "20px", height: "20px" }),
});
</script>

<template>
  <Icon :icon="props.name" :color="props.color" :style="props.iconStyle" />
</template>

<style>
svg {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

```
组件内使用
```html
<script setup lang="ts" name="IconifyIcon">
import SvgIcon from "@/components/IconifyIcon/index.vue";

const iconStyle = { width: "100px", height: "100px", color: "#0d9488" };
</script>

<template>
	<IconifyIcon name="ep:menu" color="#0d9488" :icon-style="iconStyle" />
</template>

```