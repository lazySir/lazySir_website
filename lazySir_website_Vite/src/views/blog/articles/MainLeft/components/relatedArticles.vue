<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'
import { computed } from 'vue'

const blogStore = useBlogStore()

// 将相关文章按年份分组并按日期降序排序
const blogsByYear = computed(() => {
  const grouped: Record<string, blogAPITypes.BlogFile[]> = {}

  blogStore.relatedBlogs.forEach((blog: blogAPITypes.BlogFile) => {
    const year = blog.date ? new Date(blog.date).getFullYear() : '未知年份'
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(blog)
  })

  // 对每个年份内的文章按日期降序排序
  Object.keys(grouped).forEach((year) => {
    grouped[year].sort((a, b) => {
      // 确保 date 是有效的字符串或日期
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA // 降序排序
    })
  })

  // 返回按年份降序排序的 entries
  return Object.entries(grouped).sort((a, b) => +b[0] - +a[0])
})

//点击文字后调用pinia跳转页面
const goArticle = (blog: blogAPITypes.BlogFile) => {
  blogStore.changeCurrentBlog(blog)
}
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4 text-center">📚相关文章</h2>

    <div v-for="[year, blogs] in blogsByYear" :key="year" class="mb-6">
      <h3 class="text-lg font-semibold mb-2">📅 {{ year }}</h3>
      <ul class="gap-1 flex flex-col items-center">
        <li
          v-for="blog in blogs"
          :key="blog.path"
          :class="[
            'cursor-pointer',
            blog.filename === blogStore.currentBlog.filename
              ? ' text-lazySir_green' // 当前文章，灰色
              : 'text-blog_text hover:text-lazySir_green', // 其他文章，蓝色和hover效果
          ]"
          @click="goArticle(blog)"
        >
          {{ blog.title }}
        </li>
      </ul>
    </div>
  </div>
</template>
