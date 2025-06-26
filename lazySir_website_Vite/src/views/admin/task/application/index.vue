<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import List from '@/views/admin/task/application/components/list.vue'
import Dialog from '@/views/admin/task/application/components/dialog.vue'
import { useAdminTaskStore } from '@/stores/admin/task'
const adminTaskStore = useAdminTaskStore()
//筛选的数据条件
const filterSearch = ref<taskTypes.getApplication>({})
//获取数据
const getData = async () => {
  await adminTaskStore.getApplicationList(filterSearch.value)
  await adminTaskStore.getCanApplicationTask()
}
//ref
const listRef = useTemplateRef<InstanceType<typeof List>>('listRef')
const dialogRef = useTemplateRef<InstanceType<typeof Dialog>>('DialogRef')
//是否显示过滤条件
const isShowFilter = ref(true)

const handleStatus = (val: string) => {
  filterSearch.value.statusId = val
}
//当每页条数改变时
const handleSizeChange = (val: number) => {
  filterSearch.value.limit = val
  getData()
}
//打开dialog
const handleOpenDialog = () => {
  dialogRef.value?.openDialog()
}
//当页码改变时
const handleCurrentChange = (val: number) => {
  filterSearch.value.page = val
  getData()
}
//新增
const handleAddApplication = async (val: taskTypes.addApproval) => {
  const res = await adminTaskStore.addApproval(val)
  if (res) {
    getData()
  }
}

//加载的时候获取数据
onMounted(() => {
  getData()
})
</script>

<template>
  <el-card>
    <template #header>
      <el-row v-if="isShowFilter" :gutter="10">
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>任务代号：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.taskName"
            style="width: 170px"
            placeholder="请输入任务代号"
          ></el-input>
        </el-col>

        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>审批状态</el-text></div>
          <Category @sendValue="handleStatus" category1="审批状态" />
        </el-col>
      </el-row>

      <el-row justify="end" :gutter="10">
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="handleOpenDialog"
            icon="Search"
            type="primary"
            content="任务申请"
            name="adminTaskApplication"
            perm="CREATE"
          >
          </AuthBtn>
          <AuthBtn
            :text="false"
            @click="getData"
            icon="Search"
            type="primary"
            content="查询"
            name="adminTaskApplication"
            perm="READ"
          >
          </AuthBtn>
        </el-col>

        <el-col :span="1.5">
          <el-button
            @click="isShowFilter = !isShowFilter"
            :icon="isShowFilter ? 'Hide' : 'View'"
            type="primary"
            >{{ isShowFilter ? '隐藏过滤' : '显示过滤' }}</el-button
          ></el-col
        >
      </el-row>
    </template>
    <List :list="adminTaskStore.applicationList" />
    <el-row style="margin-top: 2px">
      <el-col :offset="9" :span="12">
        <BasePagination
          v-model:current-page="filterSearch.page"
          v-model:page-size="filterSearch.limit"
          :total="adminTaskStore.applicationTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </el-card>

  <Dialog
    @emitsSubmitForm="handleAddApplication"
    :can-application-task-list="adminTaskStore.canApplicationTask"
    ref="DialogRef"
  />
</template>

<style scoped></style>
