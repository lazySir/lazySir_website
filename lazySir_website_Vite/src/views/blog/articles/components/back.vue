<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showScrollButtons = ref(false)
let scrollTimer: ReturnType<typeof setTimeout> | null = null

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollButtons.value = true

  // 如果已有定时器，先清除
  if (scrollTimer) clearTimeout(scrollTimer)

  // 设置新定时器，1.5 秒后隐藏按钮
  scrollTimer = setTimeout(() => {
    showScrollButtons.value = false
  }, 1500)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimer) clearTimeout(scrollTimer)
})
</script>

<template>
  <!-- 悬浮按钮 -->
  <div
    v-if="showScrollButtons"
    class="fixed bottom-6 right-2 laptop:right-[15%] flex flex-col gap-3 z-50"
  >
    <button
      @click="scrollToTop"
      class="text-lazySir_green border border-lazySir_green px-4 py-2 rounded-full hover:bg-lazySir_green hover:text-white transition"
    >
      <span class="block tablet:hidden">⬆</span>
      <span class="hidden tablet:block">⬆回到顶部</span>
    </button>
    <button
      @click="scrollToBottom"
      class="text-lazySir_green border border-lazySir_green px-4 py-2 rounded-full hover:bg-lazySir_green hover:text-white transition"
    >
      <span class="block tablet:hidden"> ⬇</span>
      <span class="hidden tablet:block"> ⬇去到底部</span>
    </button>
  </div>
</template>

<style scoped></style>
