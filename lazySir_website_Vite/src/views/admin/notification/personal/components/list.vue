<script setup lang="ts">
import { useTemplateRef, onMounted, ref } from 'vue'
import { useNotificationStore } from '@/stores/admin/notification'
const notificationStore = useNotificationStore()
import Dialog from '@/views/admin/notification/personal/components/dialog.vue'
const DialogRef = useTemplateRef('DialogRef')
const filterSearch = ref({
  limit: 10,
  page: 1,
} as NotificationTypes.personalNotificationGet)
//打开详情
const readNotification = (val: NotificationTypes.personalNotification) => {
  DialogRef.value?.openDialog(val)
}
//获取接收列表
const getList = async () => {
  const res = await notificationStore.getPersonalNotificationList(
    filterSearch.value,
  )
}
const handleChangeReadState = async (val: NotificationTypes.receiveUpdate) => {
  const res = await notificationStore.updateReceiver(val)
  if (res) {
    getList()
    DialogRef.value?.closeDialog()
  }
}

onMounted(() => {
  getList()
})

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
//当每页条数改变时
const handleSizeChange = async (val: number) => {
  filterSearch.value.limit = val
  await getList()
}
//当页码改变时
const handleCurrentChange = (val: number) => {
  filterSearch.value.page = val
  getList()
}
//删除
</script>

<template>
  <el-table
    highlight-current-row
    :data="notificationStore.ownList"
    border
    style="width: 100%"
  >
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
        {{ scope.row.notification.senderNickname }}
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
          name="adminNotificationPersonal"
          perm="READ"
        >
        </AuthBtn>
      </template>
    </el-table-column>
  </el-table>
  <BasePagination
    class="flex justify-center items-center"
    v-model:current-page="filterSearch.page"
    v-model:page-size="filterSearch.limit"
    :total="notificationStore.ownTotal"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
  <Dialog @changeReadState="handleChangeReadState" ref="DialogRef" />
</template>

<style scoped></style>
