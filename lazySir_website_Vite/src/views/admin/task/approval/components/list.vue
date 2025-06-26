<script setup lang="ts">
const props = defineProps<{
  list: taskTypes.approval[]
}>()
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
const getTagTypeByStatus = (status?: string): string => {
  switch (status) {
    case '拒绝':
      return 'danger'
    case '待审批':
      return 'warning'
    case '通过':
      return 'success'
    default:
      return 'info'
  }
}

const emits = defineEmits(['emitsDialog'])
const openDialog = (val: taskTypes.approval) => {
  emits('emitsDialog', val)
}
</script>
<!-- @selection-change="handleSelectionChange" -->
<template>
  <el-table
    highlight-current-row
    :data="props.list"
    border
    max-height="250"
    style="width: 100%"
  >
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="申请人"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.applicant.nickname }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="任务标题"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.task.title }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="taskName"
      label="任务代号"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.task.taskName }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="任务状态"
      sortable
      width="width"
    >
      <template #default="scope">
        <el-tag :type="getTaskStatusType(scope.row.task.statusValue)">
          {{ scope.row.task.statusValue }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="审批状态"
      sortable
      prop="statusValue"
      width="width"
    >
      <template #default="scope">
        <el-tag :type="getTagTypeByStatus(scope.row.statusValue)">
          {{ scope.row.statusValue }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column
      align="center"
      show-overflow-tooltip
      sortable
      label="创建时间"
      order
      prop="createDate"
    >
    </el-table-column>

    <el-table-column
      align="center"
      fixed="right"
      label="操作"
      width="140"
      min-width="140"
    >
      <template #default="scope">
        <AuthBtn
          type="primary"
          content="审批"
          @click="openDialog(scope.row)"
          name="adminTaskApproval"
          perm="UPDATE"
        >
        </AuthBtn>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
