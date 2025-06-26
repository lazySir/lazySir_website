<script setup lang="ts">
import { ref } from 'vue'
const isShow = ref(false)

const approvalInfo = ref<taskTypes.addApproval>({} as taskTypes.addApproval)
//打开抽屉
const openDialog = (taskId: string) => {
  isShow.value = true

  approvalInfo.value.taskId = taskId
}
const closed = () => {
  isShow.value = false
  approvalInfo.value = {} as taskTypes.addApproval
}
const emits = defineEmits(['emitsAddApproval'])
const submitForm = () => {
  emits('emitsAddApproval', approvalInfo.value)
  closed()
}
//将方法暴露出去
defineExpose({
  openDialog,
})
</script>
<template>
  <el-dialog
    @closed="closed"
    title="授权申请"
    :model-value="isShow"
    width="500"
  >
    <el-form label-width="auto" :model="approvalInfo">
      <el-form-item label="申请理由" label-width="">
        <el-input
          v-model="approvalInfo.reason"
          type="textarea"
          :rows="5"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :offset="9" :span="8">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="closed">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped></style>
