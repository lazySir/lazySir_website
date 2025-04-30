<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import OpcityCard from '@/components/public/opcityCard.vue'
const props = defineProps({
  tags: Array as () => string[],
})
// 控制展开
const expanded = ref(false)
// 控制是否需要显示"查看更多"
const showExpandButton = ref(false)

// 获取标签容器元素
const tagsRef = ref<HTMLElement>()

// 检查标签是否超出最大高度
const checkOverflow = () => {
  if (tagsRef.value) {
    const realHeight = tagsRef.value.scrollHeight
    const visibleHeight = tagsRef.value.clientHeight
    // 如果实际高度大于可视高度，说明溢出了
    showExpandButton.value = realHeight > visibleHeight
  }
}

onMounted(() => {
  nextTick(() => {
    checkOverflow()
  })
})
// 监听tags变化，重新检测
watch(
  () => props.tags,
  async () => {
    await nextTick()
    checkOverflow()
  },
  { deep: true }, // tags数组内部元素变化也能监听到
)
</script>

<template>
  <!-- 标签显示 -->
  <OpcityCard class="w-[17vw] flex flex-col">
    <span class="text-sm mb-2 dark:text-blog_title_text_dark">🏷️标签</span>

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
