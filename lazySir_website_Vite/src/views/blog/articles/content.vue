<script setup lang="ts">
import { computed } from 'vue'
//解析MD的文件
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
interface Props {
  id: string
  codeColor: string
  previewTheme: string
  content: string
  isDark: boolean
}
const props = defineProps<Props>()
const cleanContent = computed(() => {
  return props.content.replace(/^---[\s\S]*?---/, '').trim()
})
</script>

<template>
  <div class="w-[70vw] p-4">
    <MdPreview
      :codeTheme="codeColor"
      :preview-theme="previewTheme"
      :theme="isDark ? 'dark' : 'light'"
      :id="id"
      :modelValue="cleanContent"
    />
  </div>
</template>

<style scoped></style>
