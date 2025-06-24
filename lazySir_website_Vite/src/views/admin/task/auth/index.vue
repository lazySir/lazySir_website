<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TaskList from '@/views/admin/task/auth/components/list.vue'
import { useAdminTaskStore } from '@/stores/admin/task'
const adminTaskStore = useAdminTaskStore()
//筛选的数据条件
const filterData = ref<taskTypes.getTaskList>({})
//获取数据
const getData = async () => {
  const res = await adminTaskStore.getTaskList(filterData.value)
}
//加载的时候获取数据
onMounted(() => {
  getData()
})
</script>

<template>
  <TaskList :list="adminTaskStore.taskList" />
</template>

<style scoped></style>
