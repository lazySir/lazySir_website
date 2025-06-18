<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-icon size="20px">
          <el-badge
            :value="notificationStore.getPersonalUnRead.length"
            class="item"
          >
            <IconifyIcon name="mdi-bell-outline" />
          </el-badge>
        </el-icon>
      </template>

      <el-tabs v-model="activeName">
        <el-tab-pane
          :label="`通知(${notificationStore.getPersonalUnRead.length})`"
          name="first"
        >
          <el-scrollbar
            v-if="notificationStore.getPersonalUnRead.length"
            max-height="300px"
            class="px-1"
          >
            <div class="flex flex-col divide-y divide-gray-200">
              <div
                v-for="(time, index) in notificationStore.getPersonalUnRead"
                :key="index"
                class="flex items-center py-5 last:border-b-0"
              >
                <AdminImage
                  height="40px"
                  width="40px"
                  class="mr-2"
                  :img="time.notification.senderAvatar"
                />
                <div class="flex flex-col space-y-1">
                  <span
                    class="text-sm truncate max-w-[200px] cursor-pointer hover:text-lazySir_green"
                    @click="readNotification(time)"
                  >
                    {{ time.notification.title }}
                    {{ emojis[index % emojis.length] }}
                  </span>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div
            v-else
            class="flex flex-col items-center justify-center h-[260px] leading-[45px] text-gray-400"
          >
            <div>暂无通知</div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="消息(0)" name="second">
          <div
            class="flex flex-col items-center justify-center h-[260px] leading-[45px] text-gray-400"
          >
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>

  <Dialog @changeReadState="handleChangeReadState" ref="dialogRef" />
</template>

<script lang="ts" setup>
import { ref, useTemplateRef, onMounted } from 'vue'
import Dialog from '@/views/admin/notification/personal/components/dialog.vue'
import { useNotificationStore } from '@/stores/admin/notification'

const notificationStore = useNotificationStore()
const dialogRef = useTemplateRef('dialogRef')
const activeName = ref('first')

// 打开通知详情
const readNotification = (val: NotificationTypes.personalNotification) => {
  dialogRef.value?.openDialog(val)
}

// 获取通知列表
const getList = async () => {
  await notificationStore.getPersonalNotificationList({ limit: 999, page: 1 })
}

const handleChangeReadState = async (val: NotificationTypes.receiveUpdate) => {
  const res = await notificationStore.updateReceiver(val)
  if (res) {
    getList()
    dialogRef.value?.closeDialog()
  }
}

onMounted(() => {
  getList()
})

// 表情符号循环使用
const emojis = ['🧡', '💙', '💚', '💜', '💛']
</script>
