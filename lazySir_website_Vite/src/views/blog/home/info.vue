<script setup lang="ts">
defineProps<{
  list: blogAPITypes.BlogFolder[]
}>()
import TagList from '@/views/blog/home/components/tagList.vue'
import SiteData from '@/views/blog/home/components/siteData.vue'
import BlogDate from '@/views/blog/home/components/blogData.vue'
</script>

<template>
  <div class="flex flex-col gap-2">
    <BlogDate :list="list" />
    <TagList :list="list" />
    <SiteData />
  </div>
</template>

<style scoped></style>
