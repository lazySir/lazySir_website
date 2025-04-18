<script setup lang="ts">
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
</script>

<template>
  <div class="w-[70vw] p-4">
    <MdPreview
      :codeTheme="codeColor"
      :preview-theme="previewTheme"
      :theme="isDark ? 'dark' : 'light'"
      :id="id"
      :modelValue="content"
    />
  </div>
</template>

<style scoped></style>
