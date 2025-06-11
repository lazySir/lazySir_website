<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  currentPage: Number,
  pageSize: Number,
  total: Number,
  pageSizes: {
    type: Array as () => number[],
    default: () => [5, 10, 20, 30, 50, 60, 70, 100, 999],
  },
  size: {
    type: String,
    default: 'small',
  },
  disabled: Boolean,
  background: Boolean,
})

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'sizeChange', value: number): void
  (e: 'currentChange', value: number): void
}>()

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('sizeChange', size)
}

const handleCurrentChange = (page: number) => {
  emit('update:currentPage', page)
  emit('currentChange', page)
}

// 🧠 动态 layout
const isTablet = ref(false)

const layout = computed(() =>
  isTablet.value
    ? 'total, sizes, prev, pager, next, jumper'
    : 'prev, pager, next',
)

const handleResize = () => {
  isTablet.value = window.innerWidth >= 768 // Tailwind 的 md: 768px
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <el-pagination
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    :total="props.total"
    :page-sizes="props.pageSizes"
    :size="props.size"
    :disabled="props.disabled"
    :background="props.background"
    :layout="layout"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
