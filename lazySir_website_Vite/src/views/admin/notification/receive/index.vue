<script setup lang="ts">
import { onMounted, ref } from 'vue'
import List from '@/views/admin/notification/receive/components/list.vue'

import { useNotificationStore } from '@/stores/admin/notification'
const notificationStore = useNotificationStore()
const filterSearch = ref({} as NotificationTypes.receiveGet)
//获取接收列表
const getList = async () => {
  const res = await notificationStore.getReceiverList(filterSearch.value)
}
onMounted(() => {
  getList()
})
const handleType = async (val: string) => {
  filterSearch.value.typeId = val
}
const handleLevel = async (val: string) => {
  filterSearch.value.levelId = val
}
const isShowFilter = ref(true)
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
            <el-text>接收时间起始值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.receiveDateFrom"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>接收时间截至值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.receiveDateTo"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
      </el-row>
      <el-row v-if="isShowFilter" :gutter="10">
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>阅读状态：</el-text></div>
          <el-select
            clearable
            v-model="filterSearch.isRead"
            placeholder="请选择阅读状态"
            style="width: 170px"
          >
            <el-option label="已读" :value="true" />
            <el-option label="未读" :value="false" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>接收者：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.receiverNickname"
            style="width: 170px"
            placeholder="请输入接收者名称"
          ></el-input>
        </el-col>
      </el-row>
      <el-row justify="end" :gutter="10">
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="getList"
            icon="Search"
            type="primary"
            content="查询"
            name="adminNotificationReceive"
            perm="READ"
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

    <List :list="notificationStore.receiveList" />

    <BasePagination
      class="flex justify-center items-center"
      v-model:current-page="filterSearch.page"
      v-model:page-size="filterSearch.limit"
      :total="notificationStore.receiveTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<style scoped></style>
