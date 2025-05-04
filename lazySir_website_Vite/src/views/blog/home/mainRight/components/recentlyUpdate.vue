<script setup lang="ts">
import OpcityCard from '@/components/public/opcityCard.vue'
defineProps<{
  list: Array<blogAPITypes.BlogFile>
}>()
const emit = defineEmits(['goArticle'])

const goArticle = (blog: blogAPITypes.BlogFile) => {
  emit('goArticle', blog)
}
</script>

<template>
  <OpcityCard
    class="w-full sm:w-[17vw] gap-2 flex flex-col rounded-lg p-4 shadow-lg"
  >
    <span
      class="text-sm font-semibold text-blog_title_text dark:text-blog_title_text_dark"
      >🚀 最近更新</span
    >

    <!-- 最近更新的笔记列表 -->
    <div class="flex flex-col gap-3 dark:text-gray-300">
      <div
        v-for="item in list"
        :key="item.filename"
        @click="goArticle(item)"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <!-- Emoji 和标题 -->
          <span class="">📝</span>
          <span
            class="text-sm font-medium truncate"
            style="
              max-width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
          >
            {{ item.title }}
          </span>
        </div>
        <div class="text-xs text-gray-500 mt-1 dark:text-gray-400">
          🗓️ 更新于:
          {{
            new Date(item.date ? item.date : '1970-01-01').toLocaleDateString()
          }}
        </div>
      </div>
    </div>
  </OpcityCard>
</template>

<style scoped></style>
