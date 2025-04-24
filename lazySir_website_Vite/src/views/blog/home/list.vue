<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBlogList } from '@/utils/getBlogStructure'
import { useRouter } from 'vue-router'

const router = useRouter()
const goArticle = (filename: string) => {
  router.push(`/blog/article/${filename}`)
}
const list = ref<Array<BlogList>>()
// 显示样式的枚举类型
type ShowStyle = 'waterfall' | 'card' | 'list'

// 定义 props 接收一个当前的样式类型
defineProps<{
  showStyle: ShowStyle
}>()

interface BlogList {
  path: string
  filename: string
  title: string
  date: string
  tags: string[]
  description: string
  cover: string
  hot: boolean
}
onMounted(async () => {
  list.value = await getBlogList()
})
</script>

<template>
  <div class="flex flex-col">
    <!-- 瀑布流布局 -->
    <div
      v-if="showStyle === 'waterfall'"
      class="columns-1 sm:columns-2 xl:columns-3 gap-4 space-y-4"
    >
      <el-card
        v-for="item in list"
        :key="item.title"
        @click="goArticle(item.filename)"
        class="mb-4 break-inside-avoid shadow-md transition-transform duration-300 hover:scale-[1.01]"
        shadow="hover"
      >
        <div class="flex flex-col gap-3">
          <img
            v-if="item.cover"
            :src="item.cover"
            alt="封面"
            class="w-full object-cover rounded-lg shadow-sm"
          />

          <div class="text-xl font-semibold text-blog_title_text">
            {{ item.title }}
          </div>

          <div class="text-blog_text text-sm whitespace-pre-line">
            {{ item.description }}
          </div>

          <div
            class="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-2"
          >
            <span>📅 日期：{{ item.date }}</span>
            <span>👤 作者：lazySir</span>
            <span class="flex gap-1 items-center">
              🏷️ 标签：
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="text-blue-500 bg-blue-50 rounded px-2 py-0.5"
              >
                {{ tag }}
              </span>
            </span>
            <span>⏱️ 阅读需要：9分钟</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 卡片布局 -->
    <div
      v-else-if="showStyle === 'card'"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <el-card
        v-for="item in list"
        :key="item.title"
        class="transition-all duration-300 hover:scale-[1.01] shadow-md"
        shadow="hover"
      >
        <div class="flex flex-col gap-3">
          <img
            v-if="item.cover"
            :src="item.cover"
            alt="封面"
            class="w-full h-48 object-cover rounded-lg shadow-sm"
          />

          <div class="text-xl font-semibold text-blog_title_text">
            {{ item.title }}
          </div>

          <div class="text-blog_text text-sm line-clamp-3">
            {{ item.description }}
          </div>

          <div
            class="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-2"
          >
            <span>📅 日期：{{ item.date }}</span>
            <span>👤 作者：lazySir</span>
            <span class="flex gap-1 items-center">
              🏷️ 标签：
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="text-blue-500 bg-blue-50 rounded px-2 py-0.5"
              >
                {{ tag }}
              </span>
            </span>
            <span>⏱️ 阅读需要：9分钟</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 列表布局 -->
    <div v-else>列表布局</div>
    <!-- <el-pagination
      class="self-center mt-4"
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[100, 200, 300, 400]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<style scoped></style>
