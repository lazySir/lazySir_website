<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
// 本站信息
const siteInfo = `title: 'lazySir'
description: '平安喜乐,万事胜意'
website: 'lazySir.me'
avatar: 'https://matuimg.com/i/2025/05/04/128smlk.png'
`.trim()

function copySiteInfo() {
  navigator.clipboard.writeText(siteInfo).then(() => {
    ElMessage.success('本站信息已复制到剪贴板！')
  })
}
</script>

<template>
  <!-- 复制本站信息按钮 -->
  <aside
    class="hidden tablet:block tablet:fixed bottom-4 left-4 bg-black text-white p-2 rounded-lg font-mono"
  >
    <div class="flex justify-between items-center">
      <div class="flex space-x-2 text-red-500">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <p @click="copySiteInfo" class="text-xs cursor-pointer">复制</p>
    </div>
    <div class="mt-4">
      <p class="text-white text-xs">title: 'lazySir'</p>
      <p class="text-white text-xs">description: '平安喜乐,万事胜意'</p>
      <p class="text-white text-xs">website: 'lazySir.me'</p>
      <p class="text-white text-xs">avatar: 'https://matuimg.com/</p>
      <p class="text-white text-xs">i/2025/05/04/128smlk.png'</p>
    </div>
  </aside>

  <div class="fixed tablet:hidden bottom-4 left-4">
    <el-button
      size="small"
      type="primary"
      @click="copySiteInfo"
      class="transition-all hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400"
    >
      复制本站信息
    </el-button>
  </div>
</template>

<style scoped></style>
