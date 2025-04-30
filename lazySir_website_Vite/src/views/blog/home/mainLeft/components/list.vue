<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog' // 假设你的 pinia 叫这个

import CardLayout from '@/views/blog/home/mainLeft/components/cardLayout.vue'
import ListLayout from '@/views/blog/home/mainLeft/components/listLayout.vue'
import WaterfallLayout from '@/views/blog/home/mainLeft/components/waterfallLayout.vue'
import BasePagination from '@/components/public/basePagination.vue'
const layoutMap = {
  waterfall: WaterfallLayout,
  card: CardLayout,
  list: ListLayout,
}

const layoutComponent = computed(() => {
  return layoutMap[blogStore.showStyle] || CardLayout
})
// 路由跳转
const router = useRouter()
const goArticle = (filename: string) => {
  router.push(`/blog/article/${filename}`)
}

// 取 pinia 里的 store
const blogStore = useBlogStore()

// 当前分页数据
const list = computed(() => blogStore.filteredBlogList)
console.log('s', list)
// 分页相关数据
const currentPage = computed({
  get: () => blogStore.currentPage,
  set: (val) => (blogStore.currentPage = val),
})
const pageSize = computed({
  get: () => blogStore.pageSize,
  set: (val) => (blogStore.pageSize = val),
})
const totalItems = computed(() => blogStore.total)

// 页面大小改变
const onPageSizeChange = (size: number) => {
  blogStore.pageSize = size
  blogStore.currentPage = 1 // 重置到第一页
}

// 当前页改变
const onCurrentPageChange = (page: number) => {
  blogStore.currentPage = page
}
</script>

<template>
  <div class="flex flex-col mt-3">
    <component :is="layoutComponent" :list="list" @goArticle="goArticle" />

    <BasePagination
      class="self-center mt-3 mb-3"
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :total="totalItems"
      @sizeChange="onPageSizeChange"
      @currentChange="onCurrentPageChange"
    />
  </div>
</template>

<style scoped></style>
