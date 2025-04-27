<script setup lang="ts">
import TagList from '@/views/blog/home/components/tagList.vue'
import SiteDate from '@/views/blog/home/components/siteData.vue'
// 定义 props
defineProps<{
  totalBlogs: number
  monthlyUpdate: number
  weeklyUpdate: number
}>()

// 组装一个数组，方便 v-for 渲染
const stats = [
  { valueKey: 'totalBlogs', label: '博客文章' },
  { valueKey: 'monthlyUpdate', label: '本月更新', prefix: '+' },
  { valueKey: 'weeklyUpdate', label: '本周更新', prefix: '+' },
]
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="w-[17vw] h-[12vw] p-4 rounded-2xl bg-white/30 shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all flex flex-col justify-between items-center text-center"
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
              {{ item.prefix || ''
              }}{{ { totalBlogs, monthlyUpdate, weeklyUpdate }[item.valueKey] }}
            </div>
            <div class="text-blog_text text-sm">{{ item.label }}</div>
          </div>
          <!-- 中间的竖线分隔符，最后一个不要加 -->
          <div class="text-blog_text text-xs" v-if="index < stats.length - 1">
            |
          </div>
        </template>
      </div>
    </div>
    <TagList />
    <SiteDate />
  </div>
</template>

<style scoped></style>
