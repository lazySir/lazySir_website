<script setup lang="ts">
import { ref, watch } from 'vue'
//左侧配置
import ConfigLeft from '@/views/blog/articles/MainLeft/index.vue'
//博客内容
import Content from '@/views/blog/articles/components/content.vue'
//右侧目录
import DirectoryRight from '@/views/blog/articles/MainRight/index.vue'
//引入hooks将filename匹配对应的懒加载路由
import { useMarkdownLoader } from '@/hooks/useMarkdownLoader'
import { useBlogStore } from '@/stores/blog'
const blogStore = useBlogStore()
const { content } = useMarkdownLoader(blogStore.currentBlog.filename as string)
watch(
  () => blogStore.currentBlog.filename,
  () => {
    location.reload()
  },
)

//检测主题模式
import { useTheme } from '@/hooks/useTheme'

const editorId = ref('preview-only')

//检测主题模式
const { isDark } = useTheme()
</script>
<template>
  <div class="flex">
    <!-- 左侧固定 -->
    <ConfigLeft class="hidden tablet:block" />
    <!-- 中间内容 -->
    <Content
      :id="editorId"
      :is-dark="isDark"
      :code-color="blogStore.codeColor"
      :previewTheme="blogStore.previewTheme"
      :content="content || ''"
    />
    <!-- 右侧目录固定 -->
    <DirectoryRight
      class="hidden tablet:block"
      :is-dark="isDark"
      :editor-id="editorId"
    />
  </div>
</template>
