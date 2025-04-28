<script setup lang="ts">
import OpcityCard from '@/components/public/opcityCard.vue'
import { computed } from 'vue'
import dayjs from 'dayjs' // 要安装 dayjs，npm install dayjs
const props = defineProps<{
  list: blogAPITypes.BlogFolder[]
}>()

// 计算总文章数
const totalBlogs = computed(() => {
  if (!props.list) return 0
  return props.list.reduce((total, folder) => total + folder.files.length, 0)
})

// 计算本月新增
const monthlyUpdate = computed(() => {
  if (!props.list) return 0
  const currentMonth = dayjs().format('YYYY-MM')
  let count = 0
  props.list.forEach((folder) => {
    folder.files.forEach((file) => {
      if (dayjs(file.date).format('YYYY-MM') === currentMonth) {
        count++
      }
    })
  })
  return count
})

// 计算本周新增
const weeklyUpdate = computed(() => {
  if (!props.list) return 0
  const startOfWeek = dayjs().startOf('week')
  const endOfWeek = dayjs().endOf('week')
  let count = 0
  props.list.forEach((folder) => {
    folder.files.forEach((file) => {
      const fileDate = dayjs(file.date)
      if (fileDate.isAfter(startOfWeek) && fileDate.isBefore(endOfWeek)) {
        count++
      }
    })
  })
  return count
})

// 组装一个数组，方便 v-for 渲染
const stats = [
  { valueKey: 'totalBlogs', label: '博客文章' },
  { valueKey: 'monthlyUpdate', label: '本月更新', prefix: '+' },
  { valueKey: 'weeklyUpdate', label: '本周更新', prefix: '+' },
]
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
            {{ { totalBlogs, monthlyUpdate, weeklyUpdate }[item.valueKey] }}
          </div>
          <div class="text-blog_text text-sm">{{ item.label }}</div>
        </div>
        <!-- 中间的竖线分隔符，最后一个不要加 -->
        <div class="text-blog_text text-xs" v-if="index < stats.length - 1">
          |
        </div>
      </template>
    </div>
  </OpcityCard>
</template>
