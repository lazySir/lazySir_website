<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

// 控制展开
const expanded = ref(false)
// 控制是否需要显示"查看更多"
const showExpandButton = ref(false)

// 标签数据（可以改成props）
const tags = [
  '前端',
  '后端',
  '算法',
  '数据结构',
  '人工智能',
  '云计算',
  '大数据',
  '数据库',
  '安全',
  '架构',
  'DevOps',
  '微服务',
  '测试',
  '性能优化',
  '项目管理',
  '区块链',
  '物联网',
  '游戏开发',
  '爬虫',
  '机器学习',
  '深度学习',
  'NLP',
  '前端',
  '后端',
  '算法',
  '数据结构',
  '前端',
  '后端',
  '算法',
  '数据结构',
  '人工智能',
  '云计算',
  '大数据',
  '数据库',
  '安全',
  '架构',
  'DevOps',
  '微服务',
  '测试',
  '性能优化',
  '项目管理',
  '区块链',
  '物联网',
  '游戏开发',
  '爬虫',
  '机器学习',
  '深度学习',
  'NLP',
  '前端',
  '后端',
  '算法',
  '数据结构',
]

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

// 初始化检测
onMounted(() => {
  nextTick(() => {
    checkOverflow()
  })
})
</script>

<template>
  <!-- 标签显示 -->
  <div
    class="w-[17vw] p-4 rounded-2xl bg-white/30 shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all flex flex-col"
  >
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
  </div>
</template>

<style scoped></style>
