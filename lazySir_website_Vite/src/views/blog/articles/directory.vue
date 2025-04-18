<script setup lang="ts">
import { MdCatalog } from 'md-editor-v3'
const scrollElement = document.documentElement
// Props
interface Props {
  editorId: string
  isDark: boolean
}
const props = defineProps<Props>()
</script>

<template>
  <div
    class="w-[15vw] p-4 border-l sticky top-[80px] h-[calc(100vh-80px)] overflow-auto"
  >
    <MdCatalog
      :theme="isDark ? 'dark' : 'light'"
      :editorId="editorId"
      :scrollElement="scrollElement"
    />
  </div>
</template>

<style scoped></style>
