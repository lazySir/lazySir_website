<script setup lang="ts">
import { MdCatalog } from 'md-editor-v3'
const scrollElement = document.documentElement
// Props
interface Props {
  editorId: string
}
defineProps<Props>()
</script>

<template>
  <div
    class="w-[15vw] p-4 border-l sticky top-[80px] h-[calc(100vh-80px)] overflow-auto"
  >
    <h1 class="text-lg text-blog_title_text dark:text-blog_title_text_dark">
      📃目录
    </h1>
    <MdCatalog
      class="text-sm text-blog_text dark:text-blog_text_dark"
      :editorId="editorId"
      :scrollElement="scrollElement"
    />
  </div>
</template>

<style scoped>
/* 全局隐藏滚动条 */
div::-webkit-scrollbar {
  display: none;
}
:deep(.md-editor-catalog-link span:hover) {
  color: #009688 !important;
}

:deep(.md-editor-catalog-active > span) {
  color: #009688 !important;
}

:deep(.md-editor-catalog-indicator) {
  background-color: #009688 !important;
}
</style>
