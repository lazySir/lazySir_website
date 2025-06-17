<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Dialog from '@/views/admin/notification/receive/components/dialog.vue'
const DialogRef = useTemplateRef('DialogRef')
const readNotification = (val: NotificationTypes.receive) => {
  DialogRef.value?.openDialog(val)
}
const props = defineProps<{
  list: NotificationTypes.receive[]
}>()

const emits = defineEmits(['openDialog'])

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

//删除
</script>

<template>
  <el-table highlight-current-row :data="props.list" border style="width: 100%">
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="title"
      label="通知标题"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.notification.title }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="typeValue"
      label="通知范围"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.notification.typeValue }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="通知等级"
      sortable
      prop="levelValue"
      width="90"
    >
      <template #default="scope">
        <el-tag :type="getLevelType(scope.row.levelValue)">
          {{ scope.row.notification.levelValue }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column
      align="center"
      show-overflow-tooltip
      sortable
      label="是否已读"
      order
      prop="isRead"
      width="90px"
    >
      <template #default="scope">
        <el-tag :type="scope.row.isRead ? 'success' : 'danger'">{{
          scope.row.isRead ? '已读' : '未读'
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      sortable
      label="阅读时间"
      order
      prop="readAt"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="启用状态"
      width="83px"
    >
      <template #default="scope">
        <el-tag :type="scope.row.notification.state ? 'success' : 'danger'">{{
          scope.row.notification.state ? '启用' : '禁用'
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="接收人"
      width="width"
      prop="receiver"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      sortable
      label="接收时间"
      order
      prop="receiveDate"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="发起人"
      width="width"
    >
      <template #default="scope">
        {{ scope.row.notification.sender.nickname }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="创建时间"
      order
      prop="createDate"
    >
      <template #default="scope">
        {{ scope.row.notification.createDate }}
      </template>
    </el-table-column>

    <el-table-column
      align="center"
      fixed="right"
      label="操作"
      width="80"
      min-width="80"
    >
      <template #default="scope">
        <AuthBtn
          @click="readNotification(scope.row)"
          type="primary"
          content="详情"
          name="adminNotificationReceive"
          perm="UPDATE"
        >
        </AuthBtn>
      </template>
    </el-table-column>
  </el-table>
  <Dialog ref="DialogRef" />
</template>

<style scoped></style>
