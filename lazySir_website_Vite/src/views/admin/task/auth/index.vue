<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import TaskList from '@/views/admin/task/auth/components/list.vue'
import Dialog from '@/views/admin/task/auth/components/dialog.vue'
import { useAdminTaskStore } from '@/stores/admin/task'
const adminTaskStore = useAdminTaskStore()
//筛选的数据条件
const filterSearch = ref<taskTypes.getTaskList>({})
//获取数据
const getData = async () => {
  const res = await adminTaskStore.getTaskList(filterSearch.value)
}
//是否显示过滤条件
const isShowFilter = ref(true)
//ref
const dialogRef = useTemplateRef('DialogRef')
type openType = 'read' | 'update' | 'add'
const handleOpenDialog = (type: openType, val?: taskTypes.taskList) => {
  dialogRef.value?.openDialog(type, val)
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
const AddOrUpdateTaskHndle = async (val: taskTypes.addOrUpdateTask) => {
  const res = await adminTaskStore.addOrUpdateTask(val)
  if (res) {
    getData()
  }
}
//被选中的任务
const selectedTask = ref<string[]>([])
const handleSelectedChange = (val: string[]) => {
  selectedTask.value = val
}
//批量删除
const handleDeletes = async () => {
  const res = await adminTaskStore.deleteTask(selectedTask.value)
  if (res) {
    getData()
  }
}
const handleDelete = async (id: string) => {
  const res = await adminTaskStore.deleteTask([id])
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
          <div style="margin-bottom: 10px"><el-text>任务标题：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.title"
            style="width: 170px"
            placeholder="请输入任务标题"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>创建人：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.creatorNickname"
            style="width: 170px"
            placeholder="请输入发布者名称"
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

        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>结束时间起始值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.deadlineFrom"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>结束时间截至值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.deadlineTo"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
      </el-row>

      <el-row justify="end" :gutter="10">
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="handleOpenDialog('add', {} as taskTypes.taskList)"
            type="primary"
            content="新增通知"
            name="adminTaskAuth"
            perm="CREATE"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="getData"
            icon="Search"
            type="primary"
            content="查询"
            name="adminTaskAuth"
            perm="READ"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            :disabled="selectedTask.length < 1"
            @click="handleDeletes"
            type="danger"
            content="批量删除"
            name="adminTaskAuth"
            perm="DELETES"
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
    <TaskList
      @emitsDialog="handleOpenDialog"
      @selectedChange="handleSelectedChange"
      @emitsDelete="handleDelete"
      :list="adminTaskStore.taskList"
    />
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

  <Dialog @submitForm="AddOrUpdateTaskHndle" ref="DialogRef" />
</template>

<style scoped></style>
