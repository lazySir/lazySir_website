<script setup lang="ts">
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  pageSizes: {
    type: Array as () => number[],
    default: () => [5, 10, 20, 30, 50, 60, 70, 100, 999],
  },
  size: {
    type: String,
    default: 'default', // small, large, etc.
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  background: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
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
</script>

<template>
  <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    :size="size"
    :disabled="disabled"
    :background="background"
    :layout="layout"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
