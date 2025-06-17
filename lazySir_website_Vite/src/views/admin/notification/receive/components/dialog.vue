<template>
  <el-dialog
    @closed="closed"
    v-model="isShowDialog"
    title="通知详情"
    width="800"
    center
  >
    <div class="notification-content">
      <!-- 标题 -->
      <h2 class="text-xl font-bold text-center mb-4">
        {{ notificationInfo.notification.title }}
      </h2>

      <!-- 元信息 -->
      <div class="text-xs flex justify-center gap-10 text-blog_text">
        <span>发布人：{{ notificationInfo.notification.sender.nickname }}</span>
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

      <!-- 分隔线 -->
      <el-divider></el-divider>

      <!-- 正文内容 -->
      <div class="text-base space-x-2 min-h-[40vh]">
        {{ notificationInfo.notification.content }}
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const notificationInfo = ref({} as NotificationTypes.receive)
const isShowDialog = ref(false)
//控制dialog的开启
const openDialog = (val: NotificationTypes.receive) => {
  isShowDialog.value = true
  notificationInfo.value = val
}
const closed = () => {
  isShowDialog.value = false
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

defineExpose({
  openDialog,
})
</script>
