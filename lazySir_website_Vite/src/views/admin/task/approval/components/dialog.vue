<script setup lang="ts">
import { ref } from 'vue'

const isShow = ref(false)
const approvalInfo = ref<taskTypes.approval>({} as taskTypes.approval)

const openDialog = (val: taskTypes.approval) => {
  isShow.value = true
  approvalInfo.value = JSON.parse(JSON.stringify(val))
}

const handleClose = () => {
  isShow.value = false
  approvalInfo.value = {} as taskTypes.approval
}

const emits = defineEmits(['emitsConfirm'])
const handleConfirm = () => {
  emits('emitsConfirm', approvalInfo.value)
  handleClose()
}

const handleStatus = (id: string) => {
  approvalInfo.value.statusId = id
}
const getTaskStatusType = (level?: string) => {
  switch (level) {
    case '取消':
      return 'danger'
    case '解密':
      return 'primary'
    case '未开始':
      return 'info'
    case '完成':
      return 'success'
    case '进行中':
      return 'warning'
    case '已过期':
      return 'danger'
    default:
      return 'info'
  }
}
defineExpose({ openDialog })
</script>

<template>
  <el-drawer
    v-model="isShow"
    size="40%"
    :destroy-on-close="true"
    title="审批详情"
    class="p-4"
  >
    <!-- 任务信息 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="font-semibold text-lg text-gray-700">📌 任务信息</div>
      </template>
      <el-descriptions :column="1" size="small" border>
        <el-descriptions-item label="任务名称">{{
          approvalInfo.task?.taskName || '—'
        }}</el-descriptions-item>
        <el-descriptions-item label="任务标题">{{
          approvalInfo.task?.title || '—'
        }}</el-descriptions-item>
        <!-- 任务代号 -->
        <el-descriptions-item label="任务代号">
          <el-tag type="primary">{{
            approvalInfo.task?.taskName || '—'
          }}</el-tag></el-descriptions-item
        >

        <el-descriptions-item label="截止时间">{{
          approvalInfo.task?.deadline || '—'
        }}</el-descriptions-item>
        <el-descriptions-item label="任务状态">
          <el-tag :type="getTaskStatusType(approvalInfo.task?.statusValue)">
            {{ approvalInfo.task?.statusValue || '—' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 申请信息 -->
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="font-semibold text-lg text-gray-700">📝 申请信息</div>
      </template>
      <el-descriptions :column="1" size="small" border>
        <el-descriptions-item label="申请人">
          <el-tag type="info">{{
            approvalInfo.applicant?.nickname || '—'
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请时间">
          {{ approvalInfo.createDate || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="申请理由">
          <el-input
            type="textarea"
            :rows="3"
            v-model="approvalInfo.reason"
            disabled
          />
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 审批信息 -->
    <el-card shadow="never">
      <template #header>
        <div class="font-semibold text-lg text-gray-700">✅ 审批信息</div>
      </template>
      <el-descriptions :column="1" size="small" border>
        <el-descriptions-item
          v-if="approvalInfo.approver && approvalInfo.approver.nickname"
          label="审批人"
        >
          <el-tag type="info">{{
            approvalInfo.approver?.nickname || '—'
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审批状态">
          <Category
            @sendValue="handleStatus"
            category1="任务状态"
            :categoryId="approvalInfo.statusId"
          />
        </el-descriptions-item>

        <el-descriptions-item label="审批意见">
          <el-input
            type="textarea"
            :rows="3"
            v-model="approvalInfo.approveNote"
          />
        </el-descriptions-item>
        <el-descriptions-item v-if="approvalInfo.updateDate" label="审批时间">
          {{ approvalInfo.updateDate || '—' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.el-card {
  border-radius: 12px;
}
</style>
