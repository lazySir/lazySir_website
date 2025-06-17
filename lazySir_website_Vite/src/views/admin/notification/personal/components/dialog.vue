<template>
  <el-dialog @closed="closeDialog" v-model="isShowDialog" width="800" center>
    <div class="notification-content">
      <h2 class="text-xl font-bold text-center mb-4">
        {{ notificationInfo.notification.title }}
      </h2>

      <div class="text-xs flex justify-center gap-10 text-blog_text">
        <span>发布人：{{ notificationInfo.notification.senderNickname }}</span>
        <span>发布时间：{{ notificationInfo.notification.createDate }}</span>
        <div>
          通知等级：

          <el-tag :type="getLevelType(notificationInfo.notification.levelValue)"
            >{{ notificationInfo.notification.levelValue }}
          </el-tag>
        </div>
        <div>
          通知类型：
          <el-tag type="primary">
            {{ notificationInfo.notification.typeValue }}
          </el-tag>
        </div>
      </div>

      <el-divider></el-divider>

      <div class="text-base space-x-2 min-h-[40vh]">
        {{ notificationInfo.notification.content }}
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          :type="!notificationInfo.isRead ? 'primary' : 'danger'"
          @click="changeReadState"
          >{{ getReadState }}</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const notificationInfo = ref({} as NotificationTypes.personalNotification)
const isShowDialog = ref(false)
//控制dialog的开启
const openDialog = (val: NotificationTypes.personalNotification) => {
  isShowDialog.value = true
  notificationInfo.value = val
}
const closeDialog = () => {
  isShowDialog.value = false
}
//更改阅读状态
const emits = defineEmits(['changeReadState'])
const changeReadState = () => {
  emits('changeReadState', {
    isRead: !notificationInfo.value.isRead,
    notificationId: notificationInfo.value.notification.notificationId,
  })
}
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
const getReadState = computed(() => {
  return notificationInfo.value.isRead
    ? '等我再仔细阅读一下'
    : '我已知晓通知内容'
})
defineExpose({
  openDialog,
  closeDialog,
})
</script>
