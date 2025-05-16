<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <el-timeline>
      <template v-for="(group, index) in blogStore.sortedBlogList" :key="index">
        <!-- 年份标题，不要时间点，只做文字显示 -->

        <div class="text-2xl font-bold text-gray-800 mb-4">
          {{ group.year }}
        </div>

        <!-- 博客列表 -->
        <el-timeline-item
          v-for="(blog, idx) in group.blogs"
          @click="blogStore.changeCurrentBlog(blog)"
          :key="`${index}-${idx}`"
          :timestamp="blog.date"
          type="primary"
          size="normal"
          hollow="true"
        >
          <div
            class="text-lg text-gray-800 font-medium cursor-pointer transition duration-200 hover:text-lazySir_green hover:translate-x-1"
          >
            {{ blog.title }}
          </div>
        </el-timeline-item>
      </template>
    </el-timeline>
  </div>
</template>

<script lang="ts" setup>
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
</script>
<style scoped>
::v-deep(.el-timeline-item__tail) {
  border-color: #bbd4d2 !important; /* Tailwind blue-500 */
}
/* 鼠标悬停在整个时间轴项上，改变左侧节点颜色 */
::v-deep(.el-timeline-item:hover .el-timeline-item__node) {
  background-color: #bbd4d2 !important; /* 你想要的颜色 */
  border-color: #bbd4d2 !important;
}
</style>
