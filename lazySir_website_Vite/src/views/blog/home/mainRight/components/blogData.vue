<script setup lang="ts">
import OpcityCard from '@/components/public/opcityCard.vue'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'
const blogStore = useBlogStore()
// 组装一个数组，方便 v-for 渲染
const stats = [
  { valueKey: 'total', label: '博客文章' },
  { valueKey: 'monthlyUpdate', label: '本月更新', prefix: '+' },
  { valueKey: 'weeklyUpdate', label: '本周更新', prefix: '+' },
]
// 解构需要用的数据（响应式）
const { total, monthlyUpdate, weeklyUpdate } = storeToRefs(blogStore)
</script>

<template>
  <OpcityCard
    class="w-[17vw] h-[12vw] flex flex-col justify-between items-center text-center"
  >
    <!-- 头像 -->
    <img
      class="w-[6vw] h-[6vw] object-cover"
      src="@/assets/images/public/author_avatar2.png"
      alt="头像"
    />
    <!-- 博客数量 -->
    <div class="flex items-center justify-between gap-3">
      <template v-for="(item, index) in stats" :key="item.valueKey">
        <div class="flex flex-col gap-2">
          <div>
            {{ item.prefix || '' }}
            {{ { total, monthlyUpdate, weeklyUpdate }[item.valueKey] }}
          </div>
          <div class="text-blog_text text-sm dark:text-blog_text_dark">
            {{ item.label }}
          </div>
        </div>
        <!-- 中间的竖线分隔符，最后一个不要加 -->
        <div
          class="text-blog_text text-xs dark:text-blog_text_dark"
          v-if="index < stats.length - 1"
        >
          |
        </div>
      </template>
    </div>
  </OpcityCard>
</template>
