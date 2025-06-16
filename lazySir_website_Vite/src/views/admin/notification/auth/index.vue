<script setup lang="ts">
import { useTemplateRef, ref } from 'vue'
import List from '@/views/admin/notification/list.vue'

const listRef = useTemplateRef('listRef')
const addNotification = () => {
  listRef.value?.handleOpenDialog('add', {} as NotificationTypes.list)
}

const filterSearch = ref({} as NotificationTypes.getNotificationList)
const total = ref(0)
const handleUpdate = (val: number) => {
  total.value = val
}
const handleSizeChange = (val: number) => {
  filterSearch.value.limit = val
  listRef.value?.getList(filterSearch.value)
}
const handleCurrentChange = (val: number) => {
  filterSearch.value.page = val
  listRef.value?.getList(filterSearch.value)
}
</script>

<template>
  <el-button class="mb-2" @click="addNotification" type="primary"
    >发送通知</el-button
  >
  <List @update="handleUpdate" ref="listRef" />

  <div class="flex justify-center mt-6">
    <BasePagination
      v-model:current-page="filterSearch.page"
      v-model:page-size="filterSearch.limit"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped></style>
