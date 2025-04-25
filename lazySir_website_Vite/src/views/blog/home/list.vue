<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getBlogList } from '@/utils/blog'
import { useRouter } from 'vue-router'

import CardLayout from '@/views/blog/home/components/cardLayout.vue'
import ListLayout from '@/views/blog/home/components/listLayout.vue'
import WaterfallLayout from '@/views/blog/home/components/waterfallLayout.vue'
import BasePagination from '@/components/public/basePagination.vue'

const router = useRouter()

// 路由跳转函数，跳转到对应文章详情页
const goArticle = (filename: string) => {
  router.push(`/blog/article/${filename}`)
}

// 所有博客数据（平铺的文件列表）
const allList = ref<blogAPITypes.BlogFile[]>([])

// 当前显示的博客数据（分页）
const list = ref<blogAPITypes.BlogFile[]>([])

// 展示样式（瀑布流、卡片、列表）
type ShowStyle = 'waterfall' | 'card' | 'list'
const props = defineProps<{
  showStyle: ShowStyle
  folder: string
}>()

// 分页相关的响应式变量
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页数量
const totalItems = ref(0) // 总数据量

// 计算当前页数据函数
const computePageList = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  list.value = allList.value.slice(start, end)
}
//监视folder变化，重新获取数据
watch(
  () => props.folder,
  async (newFolder: string) => {
    allList.value = (await getBlogList(newFolder)) as blogAPITypes.BlogFile[]
    totalItems.value = allList.value.length
    computePageList() // 计算第一页数据
  },
)
// 页面初始化时获取数据
onMounted(async () => {
  allList.value = (await getBlogList(props.folder)) as blogAPITypes.BlogFile[]
  totalItems.value = allList.value.length
  computePageList() // 计算第一页数据
})

// 页面大小改变时更新
const onPageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  computePageList()
}

// 当前页改变时更新
const onCurrentPageChange = (page: number) => {
  currentPage.value = page
  computePageList()
}
</script>

<template>
  <div class="flex flex-col mt-3">
    <!-- 瀑布流布局 -->
    <WaterfallLayout
      v-if="showStyle === 'waterfall'"
      :list="list"
      @goArticle="goArticle"
    />
    <CardLayout
      v-else-if="showStyle === 'card'"
      :list="list"
      @goArticle="goArticle"
    />
    <ListLayout :list="list" @goArticle="goArticle" v-else />

    <BasePagination
      class="self-center mt-3"
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :total="totalItems"
      @sizeChange="onPageSizeChange"
      @currentChange="onCurrentPageChange"
    />
  </div>
</template>

<style scoped></style>
