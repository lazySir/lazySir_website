<script setup lang="ts">
const props = defineProps<{
  list: taskTypes.application[]
}>()

// 根据任务状态返回 Element Plus Tag 类型
const getTaskStatusType = (status?: string) => {
  switch (status) {
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

// 根据审批状态返回 Element Plus Tag 类型
const getTagTypeByStatus = (status?: string): string => {
  switch (status) {
    case '拒绝':
      return 'danger'
    case '待审核':
      return 'warning'
    case '通过':
      return 'success'
    default:
      return 'info'
  }
}
</script>

<template>
  <el-table :data="props.list" border highlight-current-row style="width: 100%">
    <el-table-column label="任务标题" align="center" show-overflow-tooltip>
      <template #default="scope">
        {{ scope.row.task.title }}
      </template>
    </el-table-column>

    <el-table-column label="任务代号" align="center" show-overflow-tooltip>
      <template #default="scope">
        {{ scope.row.task.taskName }}
      </template>
    </el-table-column>

    <el-table-column label="审批人" align="center" show-overflow-tooltip>
      <template #default="scope">
        {{ scope.row.approver?.nickname || '——' }}
      </template>
    </el-table-column>

    <el-table-column label="原因" align="center" show-overflow-tooltip>
      <template #default="scope">
        {{ scope.row.reason || '—' }}
      </template>
    </el-table-column>

    <el-table-column label="任务状态" align="center" show-overflow-tooltip>
      <template #default="scope">
        <el-tag :type="getTaskStatusType(scope.row.task.statusValue)">
          {{ scope.row.task.statusValue }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="审批状态" align="center" show-overflow-tooltip>
      <template #default="scope">
        <el-tag :type="getTagTypeByStatus(scope.row.statusValue)">
          {{ scope.row.statusValue }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="审批备注" align="center" show-overflow-tooltip>
      <template #default="scope">
        {{ scope.row.approveNote || '—' }}
      </template>
    </el-table-column>

    <el-table-column
      label="创建时间"
      prop="createDate"
      align="center"
      width="160"
    >
      <template #default="scope">
        {{ scope.row.createDate }}
      </template>
    </el-table-column>

    <el-table-column
      label="更新时间"
      prop="updateDate"
      align="center"
      width="160"
    >
      <template #default="scope">
        {{ scope.row.updateDate }}
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
