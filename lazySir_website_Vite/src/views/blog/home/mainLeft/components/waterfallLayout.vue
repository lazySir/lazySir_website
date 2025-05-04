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
  <div class="columns-1 sm:columns-2 xl:columns-3 gap-4 space-y-4">
    <OpcityCard
      v-for="(item, index) in list"
      :key="item.filename"
      @click="goArticle(item)"
      class="fade-in-up mb-4 break-inside-avoid shadow-md transition-transform duration-300 hover:scale-[1.01] cursor-pointer"
      :style="{ animationDelay: `${index * 200}ms` }"
      shadow="hover"
    >
      <div class="flex flex-col gap-3 p-2">
        <img
          v-if="item.cover"
          :src="item.cover"
          alt="封面"
          class="w-full object-cover rounded-lg shadow-sm"
        />

        <div
          class="text-xl font-semibold text-blog_title_text dark:text-blog_title_text_dark"
        >
          {{ item.title }}
        </div>

        <div
          class="text-blog_text text-sm whitespace-pre-line dark:text-blog_text_dark"
        >
          {{ item.description }}
        </div>

        <div
          class="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-2 dark:text-blog_text_dark"
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
        </div>
      </div>
    </OpcityCard>
  </div>
</template>

<style scoped>
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
