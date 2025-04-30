<script setup lang="ts">
//右侧信息栏位
import BlogList from '@/views/blog/home/mainLeft/components/list.vue'
import Navbar from '@/views/blog/home/mainLeft/components/nav.vue'
</script>

<template>
  <div class="w-[80vw] tablet:w-[55vw] tablet:max-w-[55vw]">
    <!-- 博客列表内容区域 -->
    <Navbar />
    <BlogList />
  </div>
</template>

<style scoped>
/* 移除 el-card 默认内边距 */
::v-deep(.el-card__body) {
  padding: 0px;
}
</style>
