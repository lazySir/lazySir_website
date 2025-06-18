<script setup lang="ts">
import { ref } from 'vue'
//外部传入visible控制组件的显影性
import { reqGetAdminList } from '@/api/admin/accountInfo'
//正在编辑的通知详情信息
const EditInfo = ref<NotificationTypes.addOrupdateNotification>({
  sender: { nickname: '' },
} as NotificationTypes.list)
//是否打开dialog
const isShow = ref(false)
//阅读还是编辑
const openType = ref<'add' | 'read' | 'update'>('read')
const openDialog = (
  type: 'add' | 'read' | 'update',
  val?: NotificationTypes.list,
) => {
  isShow.value = true
  EditInfo.value = JSON.parse(JSON.stringify(val))
  openType.value = type
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
const selectedReceivers = ref<string[]>([])

const emits = defineEmits(['submit'])
const submitForm = () => {
  EditInfo.value.receiverIds = selectedReceivers.value
  emits('submit', EditInfo.value)
}
const handleLevel = (val: string) => {
  EditInfo.value.levelId = val
}
const adminList = ref<AdminTypes.adminInfo[]>([])
const handleType = async (val: string) => {
  EditInfo.value.typeId = val
  if (val == '71ccb4b5-ad38-4fd7-8fa6-7dec2fe1b205') {
    getUserList()
  }
}
//获取所有人员列表
const getUserList = async () => {
  const res: RequestTypes.request = (await reqGetAdminList({
    page: 1,
    limit: 999,
  })) as any
  if (res.code == 200) {
    adminList.value = (res.data as any).users
  }
}
//清空数据
const closed = () => {
  EditInfo.value = {
    sender: { nickname: '' },
  } as NotificationTypes.addOrupdateNotification
  openType.value = 'read'
  isShow.value = false
  selectedReceivers.value = []
}
//暴露方法
defineExpose({
  openDialog,
  closed,
})
</script>
<template>
  <el-dialog
    @closed="closed"
    title="通知详情"
    :model-value="isShow"
    width="500"
  >
    <el-form ref="formRef" :model="EditInfo" label-width="80px">
      <el-form-item label="通知标题" prop="name">
        <el-input
          :disabled="openType === 'read'"
          style="width: 240px"
          v-model="EditInfo.title"
          placeholder=""
        ></el-input>
      </el-form-item>

      <el-form-item label="通知内容">
        <el-input
          :disabled="openType == 'read'"
          type="textarea"
          v-model="EditInfo.content"
          placeholder=""
        ></el-input>
      </el-form-item>
      <el-form-item v-if="EditInfo.sender" label="发起人" prop="sender">
        <el-tag type="primary">
          {{ EditInfo.sender.nickname }}
        </el-tag>
      </el-form-item>

      <el-form-item label="启用状态" prop="state">
        <el-tag
          :type="EditInfo.state ? 'success' : 'danger'"
          v-if="openType == 'read'"
        >
          {{ EditInfo.state ? '启用' : '禁用' }}
        </el-tag>
        <el-switch v-model="EditInfo.state" v-else> </el-switch>
      </el-form-item>

      <el-form-item label="通知等级" prop="levelId">
        <el-tag
          v-if="openType == 'read'"
          :type="getLevelType(EditInfo.levelValue)"
        >
          {{ EditInfo.levelValue }}
        </el-tag>

        <Category
          v-else
          @sendValue="handleLevel"
          category1="优先等级"
          :categoryId="EditInfo.levelId"
        />
      </el-form-item>

      <el-form-item
        v-if="openType == 'read'"
        label="创建时间"
        prop="createDate"
      >
        <el-input
          :disabled="openType == 'read'"
          style="width: 240px"
          v-model="EditInfo.createDate"
          placeholder=""
        ></el-input>
      </el-form-item>
      <el-form-item label="通知类型" prop="typeId">
        <el-tag type="primary" v-if="openType != 'add'">
          {{ EditInfo.typeValue }}
        </el-tag>
        <Category
          v-else
          @sendValue="handleType"
          category1="通知类型"
          :categoryId="EditInfo.typeId"
        />
      </el-form-item>
      <el-form-item
        v-if="
          openType == 'add' &&
          adminList.length > 0 &&
          EditInfo.typeId == '71ccb4b5-ad38-4fd7-8fa6-7dec2fe1b205'
        "
        label="接收人员"
        prop="receiver"
      >
        <el-select
          v-model="selectedReceivers"
          multiple
          filterable
          placeholder="请选择接收人员"
          style="width: 100%"
        >
          <el-option
            v-for="item in adminList"
            :key="item.accountId"
            :label="item.nickname"
            :value="item.accountId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="EditInfo.receiver" label="已接收人员" prop="receiver">
        <span> {{ EditInfo.receiver.join('、') }} </span>
      </el-form-item>
    </el-form>

    <el-row v-if="openType != 'read'" :gutter="10">
      <el-col :offset="9" :span="8">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="closed()">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped></style>
