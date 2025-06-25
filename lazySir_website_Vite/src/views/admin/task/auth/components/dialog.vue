<script setup lang="ts">
import { ref, onMounted } from 'vue'
const isShow = ref(false)
//外部传入visible控制组件的显影性
import { reqGetAdminList } from '@/api/admin/accountInfo'
onMounted(() => {
  getUserList()
})
type OpenType = 'read' | 'update' | 'add'
const openType = ref<OpenType>('read')
//打开抽屉
const openDialog = (type: OpenType, val?: taskTypes.taskList) => {
  openType.value = type
  isShow.value = true
  if (val) {
    task.value = JSON.parse(JSON.stringify(val))
    selectedExectors.value = val.executors.map((item) => item.accountId)
    selectedViewers.value = val.viewers.map((item) => item.accountId)
  }
}
//当任务状态发生改变的时候
const handleStatus = (val: string) => {
  task.value.statusId = val
}
//当前正在编辑的任务
const task = ref({} as taskTypes.taskList)
//管理员列表
const adminList = ref<AdminTypes.adminInfo[]>([])

//触发函数
const emits = defineEmits(['submitForm'])
//确认的执行函数
const submitForm = () => {
  task.value.executorIds = selectedExectors.value
  task.value.viewerIds = selectedViewers.value
  emits('submitForm', task.value)
  closeHandle()
}
//取消的执行函数
const closeHandle = () => {
  isShow.value = false
  openType.value = 'read'
  selectedExectors.value = []
  selectedViewers.value = []
}
const selectedExectors = ref<string[]>([])
const selectedViewers = ref<string[]>([])
//获取所有人员列表
const getUserList = async () => {
  const res: RequestTypes.request = (await reqGetAdminList({
    page: 1,
    limit: 999,
  })) as any
  if (res.code == 200) {
    adminList.value = (res.data as any).users
  }
}

//将方法暴露出去
defineExpose({
  openDialog,
})
</script>
<template>
  <el-dialog
    @closed="closeHandle"
    title="任务详情"
    :model-value="isShow"
    width="500"
  >
    <el-form label-width="auto" :model="task">
      <el-form-item v-if="task.taskId" label="发布人" label-width="">
        <el-tag type="warning">{{ task.creator.nickname }}</el-tag>
      </el-form-item>
      <el-form-item label="任务标题" label-width="">
        <el-input
          :disabled="openType === 'read'"
          v-model="task.title"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="任务标题" label-width="">
        <el-tag v-if="openType === 'read'" type="primary">{{
          task.taskName
        }}</el-tag>
        <el-input v-else v-model="task.taskName" />
      </el-form-item>
      <el-form-item label="截至时间" label-width="">
        <el-date-picker
          :disabled="openType === 'read'"
          style="width: 170px"
          v-model="task.deadline"
          type="datetime"
          placeholder="请选择"
          format="YYYY/MM/DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="任务内容" label-width="">
        <el-input
          v-if="openType === 'add'"
          v-model="task.content"
          type="textarea"
          :rows="5"
        />
        <el-input
          v-else-if="openType == 'read'"
          :value="task.canViewContent ? task.content : '无权限查看'"
          type="textarea"
          :rows="5"
          :disabled="true"
        />

        <el-input
          v-else
          type="textarea"
          :rows="5"
          :disabled="!task.canViewContent"
          v-model="task.content"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="任务状态" label-width="">
        <el-tag v-if="openType === 'read'" type="primary">{{
          task.statusValue
        }}</el-tag>
        <Category
          v-else
          @sendValue="handleStatus"
          category1="任务状态"
          :categoryId="task.statusId"
        />
      </el-form-item>
      <el-form-item label="执行人员" prop="executors">
        <el-select
          :disabled="openType === 'read'"
          v-model="selectedExectors"
          multiple
          filterable
          placeholder="请选择接收人员"
          style="width: 100%"
        >
          <el-option
            v-for="item in adminList"
            :key="item.accountId"
            :label="item.nickname"
            :value="item.accountId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="授权人员" prop="viewers">
        <el-select
          :disabled="openType === 'read'"
          v-model="selectedViewers"
          multiple
          filterable
          placeholder="请选择授权人员"
          style="width: 100%"
        >
          <el-option
            v-for="item in adminList"
            :key="item.accountId"
            :label="item.nickname"
            :value="item.accountId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-row v-if="openType != 'read'" :gutter="10">
      <el-col :offset="9" :span="8">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="closeHandle()">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped></style>
