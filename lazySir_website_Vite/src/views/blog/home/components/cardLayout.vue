<script setup lang="ts">
defineProps<{
  list: Array<blogAPITypes.BlogFile>
}>()

const emit = defineEmits(['goArticle'])

const goArticle = (filename: string) => {
  emit('goArticle', filename)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <el-card
      v-for="item in list"
      :key="item.filename"
      @click="goArticle(item.filename)"
      class="transition-all duration-300 hover:scale-[1.01] shadow-md"
      shadow="hover"
    >
      <div class="flex p-2 flex-col gap-3">
        <img
          :src="item.cover || '/blog/default_blogImg.png'"
          alt="封面"
          class="w-full h-48 object-cover rounded-lg shadow-sm"
        />

        <div class="text-xl font-semibold text-blog_title_text">
          {{ item.title }}
        </div>

        <div class="text-blog_text text-sm line-clamp-3">
          {{ item.description }}
        </div>

        <div class="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-2">
          <span>📅 日期：{{ item.date }}</span>
          <span>👤 作者：lazySir</span>
          <span class="flex gap-1 items-center">
            🏷️ 标签：
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="text-blue-500 bg-blue-50 rounded px-2 py-0.5"
            >
              {{ tag }}
            </span>
          </span>
          <span>⏱️ 阅读需要：9分钟</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped></style>
