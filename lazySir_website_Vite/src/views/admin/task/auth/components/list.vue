<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  list: taskTypes.taskList[]
}>()
const getLevelType = (level?: string) => {
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
const selectedTask = ref<string[]>([])
type openType = 'read' | 'update' | 'add'
const emits = defineEmits(['emitsDialog', 'selectedChange', 'emitsDelete'])
const openDialog = (type: openType, val?: taskTypes.taskList) => {
  emits('emitsDialog', type, val)
}
const handleSelectionChange = (val: taskTypes.taskList[]) => {
  selectedTask.value = val.map((item) => item.taskId)
  emits('selectedChange', selectedTask.value)
}
const handleDelete = (id: string) => {
  emits('emitsDelete', id)
}
</script>

<template>
  <el-table
    @selection-change="handleSelectionChange"
    highlight-current-row
    :data="props.list"
    border
    style="width: 100%"
  >
    <el-table-column type="selection" width="40" />
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="title"
      label="任务标题"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="taskName"
      label="任务代号"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="任务状态"
      sortable
      prop="statusValue"
      width="width"
    >
      <template #default="scope">
        <el-tag :type="getLevelType(scope.row.statusValue)">
          {{ scope.row.statusValue }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="授权状态"
      sortable
      prop="canViewContent"
      width="width"
    >
      <template #default="scope">
        <el-tag :type="scope.row.canViewContent ? 'success' : 'danger'">
          {{ scope.row.canViewContent ? '已授权' : '未授权' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="创建人"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.creator.nickname }}
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
      width="260"
      min-width="260"
    >
      <template #default="scope">
        <AuthBtn
          type="primary"
          v-if="!scope.row.canViewContent"
          content="解密"
          name="adminTaskAuth"
          perm="READ"
        >
        </AuthBtn>
        <AuthBtn
          type="primary"
          content="详情"
          @click="openDialog('read', scope.row)"
          name="adminTaskAuth"
          perm="READ"
        >
        </AuthBtn>
        <AuthBtn
          type="primary"
          content="编辑"
          @click="openDialog('update', scope.row)"
          name="adminTaskAuth"
          perm="UPDATE"
        >
        </AuthBtn>
        <el-popconfirm
          @confirm="handleDelete(scope.row.taskId)"
          :title="`是否确定删除${scope.row.title}`"
        >
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
