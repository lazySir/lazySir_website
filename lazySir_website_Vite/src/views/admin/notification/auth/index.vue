<script setup lang="ts">
import { useTemplateRef, ref, onMounted } from 'vue'
import List from '@/views/admin/notification/auth/components/list.vue'
import { useNotificationStore } from '@/stores/admin/notification'
import Dialog from '@/views/admin/notification/auth/components/dialog.vue'

//notification的pinia
const notificationStore = useNotificationStore()
//dialog的ref
const DialogRef = useTemplateRef('DialogRef')

//过滤的搜索条件
const filterSearch = ref({} as NotificationTypes.getNotificationList)
//获取通知列表
const getList = async () => {
  await notificationStore.getNotificationList(filterSearch.value)
}

//页面加载时，发送获取请求
onMounted(() => {
  getList()
})

//打开弹窗
const handleOpenDialog = (
  type: 'add' | 'read' | 'update',
  val?: NotificationTypes.list,
) => {
  DialogRef.value?.openDialog(type, val)
}
//当每页条数改变时
const handleSizeChange = (val: number) => {
  filterSearch.value.limit = val
  getList()
}
//当页码改变时
const handleCurrentChange = (val: number) => {
  filterSearch.value.page = val
  getList()
}
//是否显示过滤条件
const isShowFilter = ref(true)
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
const deleteList = ref<Array<string>>([])
//删除的执行函数
const handleDelete = async (flag: boolean, val: Array<string>) => {
  if (flag) {
    await notificationStore.deleteNotification(val)
    getList()
  } else {
    deleteList.value = val
  }
}
//执行删除
const handleDeleteList = async () => {
  await notificationStore.deleteNotification(deleteList.value)
  getList()
}
const handleType = async (val: string) => {
  filterSearch.value.typeId = val
}
const handleLevel = async (val: string) => {
  filterSearch.value.levelId = val
}
</script>

<template>
  <el-card>
    <template #header>
      <el-row v-if="isShowFilter" :gutter="10">
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>标题：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.title"
            style="width: 170px"
            placeholder="请输入新闻标题"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>发布者：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.senderNickName"
            style="width: 170px"
            placeholder="请输入发布者名称"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>内容关键字：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.content"
            style="width: 170px"
            placeholder="请输入关键字"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>启用状态：</el-text></div>
          <el-select
            clearable
            v-model="filterSearch.state"
            placeholder="请选择启用状态"
            style="width: 170px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>通知类型：</el-text></div>
          <Category @sendValue="handleType" category1="通知类型" />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>通知等级：</el-text></div>
          <Category @sendValue="handleLevel" category1="优先等级" />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>创建时间起始值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.createDateFrom"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>创建时间截至值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.createDateTo"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
      </el-row>

      <el-row justify="end" :gutter="10">
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="handleOpenDialog('add', {} as NotificationTypes.list)"
            type="primary"
            content="新增通知"
            name="NotificationAuth"
            perm="CREATE"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="getList"
            icon="Search"
            type="primary"
            content="查询"
            name="NotificationAuth"
            perm="READ"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            :disabled="deleteList.length < 1"
            @click="handleDeleteList"
            type="danger"
            content="批量删除"
            name="NotificationAuth"
            perm="DELETES"
          >
          </AuthBtn>
        </el-col>

        <el-col :span="1.5">
          <el-button
            @click="isShowFilter = !isShowFilter"
            :icon="isShowFilter ? 'Hide' : 'View'"
            type="primary"
            >{{ isShowFilter ? '隐藏过滤' : '显示过滤' }}</el-button
          ></el-col
        >
      </el-row>
    </template>
    <List
      @deleteEmits="handleDelete"
      @openDialog="handleOpenDialog"
      :list="notificationStore.list"
    />
    <el-row style="margin-top: 2px">
      <el-col :offset="9" :span="12">
        <BasePagination
          v-model:current-page="filterSearch.page"
          v-model:page-size="filterSearch.limit"
          :total="notificationStore.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </el-card>

  <Dialog @submit="handleAddorUpdate" ref="DialogRef" />
  <!-- <div class="flex justify-center mt-6"></div> -->
</template>

<style scoped></style>
