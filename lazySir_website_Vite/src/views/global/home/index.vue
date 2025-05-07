<script setup lang="ts">
import { onMounted } from 'vue'
import AuroraBackground from '@/views/global/home/AuroraBackground.vue'
import Marquee from '@/views/global/home/Marquee.vue'
import TitleTag from '@/views/global/home/TitleTag.vue'
import { useBlogStore } from '@/stores/blog'
const blogStore = useBlogStore()

// 页面加载完成后获取博客结构数据
onMounted(async () => {
  await blogStore.getBlogList()
})
</script>

<template>
  <!-- 卡片 -->
  <AuroraBackground />
  <div class="w-[90vw] tablet:w-[1280px] mx-auto">
    <!-- 项目展示 -->
    <TitleTag icon="mdi:circle-medium" content="项目展示" />
    <Marquee />
  </div>
</template>
<style class="scoped"></style>
