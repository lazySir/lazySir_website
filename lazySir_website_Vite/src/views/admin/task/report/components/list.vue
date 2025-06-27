<script setup lang="ts">
const props = defineProps<{
  list: taskTypes.report[] // 把类型名按你的定义替换成真实的
}>()
const emits = defineEmits(['emitsRead', 'emitsEdit'])
//阅读的处理函数
const handleRead = (data: taskTypes.report) => {
  emits('emitsRead', data)
}
const handleEmit = (data: taskTypes.report) => {
  emits('emitsEdit', data)
}
// 状态Tag样式
const getStatusType = (status?: string) => {
  switch (status) {
    case '待处理':
      return 'warning'
    case '已处理':
      return 'success'
    case '驳回':
      return 'danger'
    default:
      return 'info'
  }
}

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
</script>

<template>
  <el-table :data="props.list" border highlight-current-row style="width: 100%">
    <el-table-column label="汇报标题" align="center" show-overflow-tooltip>
      <template #default="scope">
        {{ scope.row.title }}
      </template>
    </el-table-column>

    <el-table-column label="所属任务" align="center" show-overflow-tooltip>
      <template #default="scope">
        {{ scope.row.task.title }}（{{ scope.row.task.taskName }}）
      </template>
    </el-table-column>

    <el-table-column label="汇报人" align="center" show-overflow-tooltip>
      <template #default="scope">
        {{ scope.row.reporter.nickname }}
      </template>
    </el-table-column>

    <el-table-column label="任务状态" align="center" width="100">
      <template #default="scope">
        <el-tag :type="getTaskStatusType(scope.row.task.statusValue)">
          {{ scope.row.task.statusValue }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="汇报状态" align="center" width="100">
      <template #default="scope">
        <el-tag :type="getStatusType(scope.row.statusValue)">
          {{ scope.row.statusValue }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="附件" align="center" width="80">
      <template #default="scope">
        <el-link
          v-if="scope.row.attachment"
          :href="scope.row.attachment"
          target="_blank"
          type="primary"
        >
          下载
        </el-link>
        <span v-else>—</span>
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
    <el-table-column
      align="center"
      fixed="right"
      label="操作"
      width="260"
      min-width="260"
    >
      <template #default="scope">
        <AuthBtn
          @click="handleRead(scope.row)"
          type="primary"
          content="详情"
          name="adminTaskAuth"
          perm="READ"
        >
        </AuthBtn>
        <AuthBtn
          type="primary"
          content="编辑"
          @click="handleEmit(scope.row)"
          name="adminTaskAuth"
          perm="UPDATE"
        >
        </AuthBtn>
        <!-- @confirm="handleDelete(scope.row.taskId)" -->
        <el-popconfirm :title="`是否确定删除${scope.row.title}`">
          <template #reference>
            <AuthBtn
              type="primary"
              content="删除"
              name="adminTaskAuth"
              perm="DELETE"
            >
            </AuthBtn>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
