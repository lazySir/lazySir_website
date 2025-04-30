<script setup lang="ts">
import BlurReveal from '@/components/public/inspiraUI/BlurReveal.vue'
</script>

<template>
  <div class="flex h-64 flex-col items-center justify-center w-full">
    <div
      class="hidden tablet:block text-5xl font-medium dark:text-blog_title_text_dark"
    >
      你好,欢迎来到lazySir博客
    </div>
    <div
      class="block tablet:hidden text-5xl font-medium dark:text-blog_title_text_dark"
    >
      lazySir博客
    </div>
    <BlurReveal class="pt-4 text-blog_title_text dark:text-blog_text_dark">
      <span class="hidden tablet:block"
        >✨每一天都是一个新的开始，去追求你想要的生活。</span
      >
      <span class="block tablet:hidden">✨去追求你想要的生活。</span>
    </BlurReveal>
  </div>
</template>

<style scoped></style>
