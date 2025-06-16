<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useNotificationStore } from '@/stores/admin/notification'
import Dialog from '@/views/admin/notification/dialog.vue'
const notificationStore = useNotificationStore()
const getList = async (val?: NotificationTypes.getNotificationList) => {
  await notificationStore.getNotificationList(val)
  handleUpdate()
}
onMounted(() => {
  getList()
})
const DialogRef = useTemplateRef('DialogRef')
// @select="handleSelectionChange"
const handleOpenDialog = (
  type: 'add' | 'read' | 'update',
  val?: NotificationTypes.list,
) => {
  DialogRef.value?.openDialog(type, val)
}
//更新或新增
const handleAddorUpdate = async (
  val: NotificationTypes.addOrupdateNotification,
) => {
  const res = await notificationStore.addOrUpdateNotification(val)
  if (res) {
    DialogRef.value?.closed()
    getList()
  }
}
const emits = defineEmits(['update'])
const handleUpdate = () => {
  emits('update', notificationStore.total)
}
defineExpose({
  handleOpenDialog,
  getList,
})
// 显示不同颜色类型：success / warning / danger / info / default
const getLevelType = (level?: string) => {
  switch (level) {
    case '最高级':
      return 'danger'
    case '高':
      return 'warning'
    case '中':
      return 'info'
    case '低':
      return ''
    case '计划':
      return 'success'
  }
}
</script>

<template>
  <el-table
    highlight-current-row
    :data="notificationStore.list"
    border
    style="width: 100%"
  >
    <el-table-column type="selection" width="40" />
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="title"
      label="通知标题"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="typeValue"
      label="通知范围"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="通知等级"
      prop="levelValue"
      width="width"
    >
      <template #default="scope">
        <el-tag :type="getLevelType(scope.row.levelValue)">
          {{ scope.row.levelValue }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="发起人"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.sender.nickname }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="启用状态"
      width="83px"
    >
      <template #default="scope">
        <el-tag :type="scope.row.state ? 'success' : 'danger'">{{
          scope.row.state ? '启用' : '禁用'
        }}</el-tag>
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
      width="240"
      min-width="240"
    >
      <template #default="scope">
        <AuthBtn
          @click="handleOpenDialog('read', scope.row)"
          type="primary"
          content="详情"
          name="adminHonorAuth"
          perm="READ"
        >
        </AuthBtn>
        <AuthBtn
          @click="handleOpenDialog('update', scope.row)"
          type="primary"
          content="编辑"
          name="adminHonorAuth"
          perm="UPDATE"
        >
        </AuthBtn>
        <!-- @confirm="handleDelete([scope.row.honorId])" -->
        <el-popconfirm :title="`是否确定删除${scope.row.name}`">
          <template #reference>
            <AuthBtn
              type="primary"
              content="删除"
              name="adminHonorAuth"
              perm="DELETE"
            >
            </AuthBtn>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <Dialog @submit="handleAddorUpdate" ref="DialogRef" />
</template>

<style scoped></style>
