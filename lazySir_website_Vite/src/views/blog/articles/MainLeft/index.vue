<script setup lang="ts">
import RelatedArticles from '@/views/blog/articles/MainLeft/components/relatedArticles.vue'
</script>

<template>
  <div
    class="w-[15vw] p-1 top-[80px] sticky h-[calc(100vh-80px)] overflow-auto text-blog_title_text dark:text-blog_title_text_dark"
  >
    <!-- 标签相关的文章 -->
    <RelatedArticles />
  </div>
</template>
