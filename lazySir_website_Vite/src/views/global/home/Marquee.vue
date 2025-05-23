<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 外部跳转
const goTo = (url: string) => {
  window.open(url, '_blank')
}
import type { ToolRoute } from '@/router/tools/index'
import Marquee from '@/components/public/inspiraUI/Marquee.vue'

interface ReviewItem {
  name: string
  username: string
  url?: string
  img: string
}
onMounted(async () => {
  const { default: toolsConstantRoutes } = await import('@/router/tools/index')
  const toolsRoutes = toolsConstantRoutes[0].children as ToolRoute[]
  const mapTools: ReviewItem[] = toolsRoutes
    .filter((item) => item.meta.title !== '工具列表')
    .map((item) => ({
      name: item.meta.title,
      username: item.meta.username || 'lazySir',
      url: item.meta.url,
      img: item.meta.img || '', // 修正为 icon 字段
    }))
  // 正确拼接数组
  reviews.value = [...reviews.value, ...mapTools]
})

let reviews = ref<ReviewItem[]>([
  {
    name: 'mock+vite+vue3 后台管理系统',
    username: 'lazySir',
    url: 'https://github.com/lazySir/vue3_ts_vite_pinia',
    img: '/home/mockVite.png',
  },
  {
    name: 'Nuxt3+node.js+prisma 商城权限管理系统',
    username: 'lazySir',
    url: 'https://github.com/lazySir/nuxtAdmin',
    img: '/home/nuxt.png',
  },
  {
    name: 'vue2+h5 移动端蘑菇街项目',
    username: 'lazySir',
    url: 'https://github.com/lazySir/mobile-supermall',
    img: '/home/mogu.png',
  },
  {
    name: 'vite+v3+node.js+prisma 公司官网首页',
    username: 'lazySir',
    img: '/home/sgznWeb.png',
  },
  {
    name: 'vueCli+vue2 权限系统',
    username: 'lazySir',
    url: 'https://github.com/lazySir/practice',
    img: '/home/vue2Mall.png',
  },
])
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center overflow-hidden rounded-lg bg-background"
  >
    <!-- First Marquee -->
    <Marquee pause-on-hover class="[--duration:20s]">
      <ReviewCard
        v-for="review in reviews"
        @click="goTo(review.url ? review.url : '')"
        :key="review.username"
        :img="review.img"
        :text="review.name"
        :link="review.username"
      />
    </Marquee>

    <!-- Left Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
    ></div>

    <!-- Right Gradient -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
    ></div>
  </div>
</template>
