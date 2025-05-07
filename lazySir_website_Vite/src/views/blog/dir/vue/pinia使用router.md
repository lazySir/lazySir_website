---
title: pinia使用router
author: lazySir
tags: [vue3,pinia]
description: 尝试使用过useRouter方法 结果无效
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/vue/vue3.png
date: 2023-04-04
---
# 一、问题

pinia中无法使用router

# 二、解决方案

尝试使用过useRouter方法 结果无效

<br/>

封装pinia.ts

```js
import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import router from '@/router'
import { Router } from 'vue-router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router
  }
}

export const setupPinia = (app: any) => {
  const pinia = createPinia()
  pinia.use(({ store }) => {
    store.router = markRaw(router)
  })
  
  //持久化pinia
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
}

```

main.ts中

```js
import { setupPinia } from './store/pinia'
setupPinia(app)
```
