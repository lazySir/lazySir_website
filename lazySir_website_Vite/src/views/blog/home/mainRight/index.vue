<script setup lang="ts">
import TagList from '@/views/blog/home/mainRight/components/tagList.vue'
import SiteData from '@/views/blog/home/mainRight/components/siteData.vue'
import BlogDate from '@/views/blog/home/mainRight/components/blogData.vue'
import RecentlyUpdate from '@/views/blog/home/mainRight/components/recentlyUpdate.vue'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'
const blogStore = useBlogStore()
const { tags } = storeToRefs(blogStore)
//点击最近更新的文章跳转
const goArticle = (blog: blogAPITypes.BlogFile) => {
  blogStore.changeCurrentBlog(blog)
}
</script>

<template>
  <div class="hidden tablet:flex flex-col gap-2">
    <BlogDate />
    <TagList :tags="tags" />
    <RecentlyUpdate @goArticle="goArticle" :list="blogStore.latestBlogs" />
    <SiteData />
  </div>
</template>

<style scoped></style>
