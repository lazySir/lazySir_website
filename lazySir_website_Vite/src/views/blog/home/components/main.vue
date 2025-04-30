<script setup lang="ts">
//右侧信息栏位

import MainRight from '@/views/blog/home/mainRight/index.vue'
import MainLeft from '@/views/blog/home/mainLeft/index.vue'
</script>

<template>
  <div class="flex w-full min-h-[70vh] gap-3">
    <!-- 左侧内容区域 -->
    <MainLeft />
    <!-- 右侧预留区域 -->
    <MainRight />
  </div>
</template>

<style scoped>
/* 移除 el-card 默认内边距 */
::v-deep(.el-card__body) {
  padding: 0px;
}
</style>
