<script setup lang="ts">
const props = defineProps<{
  list: blogAPITypes.BlogFolder[] // 接收的是 BlogFolder 数组
}>()
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import OpcityCard from '@/components/public/opcityCard.vue'

// 控制展开
const expanded = ref(false)
// 控制是否需要显示"查看更多"
const showExpandButton = ref(false)

// 获取标签容器元素
const tagsRef = ref<HTMLElement>()

// 从 list 中提取所有标签，并去重
const tags = computed(() => {
  const allTags: string[] = []
  // 遍历每个 BlogFolder
  props.list.forEach((folder: blogAPITypes.BlogFolder) => {
    // 遍历每个 BlogFolder 中的 BlogFile
    folder.files.forEach((file: blogAPITypes.BlogFile) => {
      if (file.tags) {
        allTags.push(...file.tags)
      }
    })
  })
  // 去重
  return [...new Set(allTags)]
})

// 检查标签是否超出最大高度
const checkOverflow = () => {
  if (tagsRef.value) {
    const realHeight = tagsRef.value.scrollHeight
    const visibleHeight = tagsRef.value.clientHeight
    // 如果实际高度大于可视高度，说明溢出了
    showExpandButton.value = realHeight > visibleHeight
  }
}

// 初始化检测
onMounted(() => {
  nextTick(() => {
    checkOverflow()
  })
})

// 监听tags变化，重新检查是否溢出
watch(tags, () => {
  nextTick(() => {
    checkOverflow()
  })
})
</script>

<template>
  <!-- 标签显示 -->
  <OpcityCard class="w-[17vw] flex flex-col">
    <span class="text-sm mb-2">🏷️标签</span>

    <!-- 标签区 -->
    <div
      ref="tagsRef"
      class="flex flex-wrap gap-2 mt-1 cursor-pointer transition-all overflow-hidden"
      :class="{ 'max-h-[40vh]': !expanded }"
    >
      <span
        v-for="tag in tags"
        :key="tag"
        class="text-lazySir_green bg-blue-50 rounded px-2 py-0.5 text-sm"
      >
        {{ tag }}
      </span>
    </div>

    <!-- 只在超出时才显示 -->
    <div
      v-if="showExpandButton"
      class="mt-2 text-xs text-gray-500 bg-white/70 px-2 py-0.5 rounded-full cursor-pointer self-center hover:bg-white/90"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起' : '查看更多' }}
    </div>
  </OpcityCard>
</template>

<style scoped></style>
