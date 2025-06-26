<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import List from '@/views/admin/task/approval/components/list.vue'
import Dialog from '@/views/admin/task/approval/components/dialog.vue'
import { useAdminTaskStore } from '@/stores/admin/task'
const adminTaskStore = useAdminTaskStore()
//筛选的数据条件
const filterSearch = ref<taskTypes.getApprovalList>({})
//获取数据
const getData = async () => {
  const res = await adminTaskStore.getApprovalList(filterSearch.value)
}
//是否显示过滤条件
const isShowFilter = ref(true)
//ref
const dialogRef = useTemplateRef('DialogRef')
type openType = 'read' | 'update' | 'add'
const handleOpenDialog = (val: taskTypes.approval) => {
  dialogRef.value?.openDialog(val)
}
const handleStatus = (val: string) => {
  filterSearch.value.statusId = val
}
//当每页条数改变时
const handleSizeChange = (val: number) => {
  filterSearch.value.limit = val
  getData()
}
//当页码改变时
const handleCurrentChange = (val: number) => {
  filterSearch.value.page = val
  getData()
}
//新增或修改任务
const handleUpdateApproval = async (val: taskTypes.updateApproval) => {
  const res = await adminTaskStore.updateApproval(val)
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
          <div style="margin-bottom: 10px"><el-text>申请人：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.applicantNickname"
            style="width: 170px"
            placeholder="请输入申请人姓名"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>审批人：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.approverNickname"
            style="width: 170px"
            placeholder="请输入审批人姓名"
          ></el-input>
        </el-col>
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
          <div style="margin-bottom: 10px"><el-text>任务状态：</el-text></div>
          <Category @sendValue="handleStatus" category1="任务状态" />
        </el-col>
      </el-row>

      <el-row justify="end" :gutter="10">
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="getData"
            icon="Search"
            type="primary"
            content="查询"
            name="adminTaskApproval"
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
    <List @emitsDialog="handleOpenDialog" :list="adminTaskStore.approvalList" />
    <el-row style="margin-top: 2px">
      <el-col :offset="9" :span="12">
        <BasePagination
          v-model:current-page="filterSearch.page"
          v-model:page-size="filterSearch.limit"
          :total="adminTaskStore.taskTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </el-card>

  <Dialog @emitsConfirm="handleUpdateApproval" ref="DialogRef" />
</template>

<style scoped></style>
