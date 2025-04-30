<script setup lang="ts">
import TagList from '@/views/blog/home/mainRight/components/tagList.vue'
import SiteData from '@/views/blog/home/mainRight/components/siteData.vue'
import BlogDate from '@/views/blog/home/mainRight/components/blogData.vue'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'
const blogStore = useBlogStore()
const { tags } = storeToRefs(blogStore)
</script>

<template>
  <div class="hidden tablet:flex flex-col gap-2">
    <BlogDate />
    <TagList :tags="tags" />
    <SiteData />
  </div>
</template>

<style scoped></style>
