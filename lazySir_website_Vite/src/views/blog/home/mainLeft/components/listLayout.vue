<script setup lang="ts">
import opcityCard from '@/components/public/opcityCard.vue'
defineProps<{
  list: Array<blogAPITypes.BlogFile>
}>()

const emit = defineEmits(['goArticle'])

const goArticle = (filename: string) => {
  emit('goArticle', filename)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <opcityCard
      class="flex flex-col justify-between"
      v-for="item in list"
      :key="item.filename"
      @click="goArticle(item.filename)"
    >
      <div class="flex flex-col sm:flex-row gap-4 p-4">
        <div class="flex-1 flex flex-col pr-4 min-w-0">
          <!-- 标题部分 -->
          <div
            class="text-xl font-semibold text-blog_title_text mb-2 line-clamp-1 dark:text-blog_title_text_dark"
          >
            {{ item.title }}
          </div>

          <!-- 描述部分 -->
          <div class="text-blog_text text-sm mb-3 dark:text-blog_text_dark">
            {{ item.description }}
          </div>

          <!-- 信息部分 -->
          <div
            class="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-auto dark:text-blog_text_dark"
          >
            <span>📅 日期：{{ item.date }}</span>
            <span>👤 作者：lazySir</span>
            <span class="flex flex-wrap gap-1 items-center">
              🏷️ 标签：
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="text-lazySir_green bg-blue-50 rounded px-2 py-0.5"
              >
                {{ tag }}
              </span>
            </span>
            <span>⏱️ 阅读需要：9分钟</span>
          </div>
        </div>
        <!-- 图片部分 -->
        <img
          :src="item.cover || '/blog/default_blogImg.png'"
          alt="封面"
          class="hidden tablet:block w-32 h-32 object-cover rounded-lg shadow-sm ml-4"
        />
      </div>
    </opcityCard>
  </div>
</template>

<style scoped></style>
