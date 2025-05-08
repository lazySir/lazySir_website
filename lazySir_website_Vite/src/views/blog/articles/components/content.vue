<script setup lang="ts">
import { computed } from 'vue'
// 计算阅读时间
import { calcReadingTime } from '@/utils/blog'
// 解析MD的文件
import { MdPreview } from 'md-editor-v3'
// 解析前置 frontmatter 内容
import { parseFrontmatter } from '@/utils/blog'
import { useRouter } from 'vue-router'

import 'md-editor-v3/lib/preview.css'

interface Props {
  id: string
  codeColor: string
  previewTheme: string
  content: string
  isDark: boolean
}

const props = defineProps<Props>()

const router = useRouter()

// 解析出前置信息
const formatterInfo = computed(() => {
  return parseFrontmatter(props.content) as blogAPITypes.BlogFile
})

const readTime = computed(() => {
  return calcReadingTime(props.content)
})

// 去掉前置区域后的正文内容
const cleanContent = computed(() => {
  return props.content.replace(/^---[\s\S]*?---/, '').trim()
})

// 返回上一页
const goBack = () => {
  router.push('/blog')
}
</script>

<template>
  <div class="tablet:w-[70vw] w-[100vw] p-4">
    <!-- 前置信息展示区域 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">
        {{ formatterInfo.title || '空' }}
      </h1>

      <!-- 作者、日期、标签一行排列 -->
      <div class="flex flex-wrap items-center text-gray-500 text-sm gap-4">
        <span>✍ 作者：{{ formatterInfo.author || '未知' }}</span>
        <span>🗓 日期：{{ formatterInfo.date || '无日期' }}</span>
        <span>⏱ 阅读需要：{{ readTime }}分钟</span>
        <span class="flex items-center flex-wrap gap-1">
          🏷 标签：
          <span
            v-for="tag in formatterInfo.tags || []"
            :key="tag"
            class="text-lazySir_green bg-blue-50 rounded px-2 py-0.5"
          >
            {{ tag }}
          </span>
        </span>
      </div>
    </div>

    <!-- 正文内容 -->
    <MdPreview
      :codeTheme="codeColor"
      :preview-theme="previewTheme"
      :theme="isDark ? 'dark' : 'light'"
      :id="id"
      :modelValue="cleanContent"
    />
    <!-- 返回按钮 -->
    <div class="m-3 flex justify-center">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-lazySir_green border border-lazySir_green px-4 py-2 rounded-full hover:bg-lazySir_green hover:text-white transition"
      >
        ← 返回博客列表
      </button>
    </div>
  </div>
</template>

<style scoped></style>
