<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAdminNewsStore } from '@/stores/admin/news'
import Dialog from '@/views/admin/news/dialog.vue'
const adminNewsStore = useAdminNewsStore()

const emits = defineEmits([
  'update:newsInfo',
  'reSearch',
  'update:selectedCount',
])
const handleUpdate = (val: adminNewsTypes.addorUpdateNews) => {
  emits('update:newsInfo', val)
}
//更新新闻信息状态
const handleUpdateNews = async (val: adminNewsTypes.news) => {
  const dataToSubmit = { ...val }
  dataToSubmit.hotSearchWordIds = JSON.stringify(val.hotSearchWordIds)
  await adminNewsStore.addOrUpdateNews(dataToSubmit)
}
//获取store的新闻列表
const newsList = computed(() => {
  return adminNewsStore.newsList
})
//被选中的新闻
const selectedId = ref([] as Array<String>)
//获取背选中的新闻个数
watch(selectedId, (newValue, oldValue) => {
  emits('update:selectedCount', newValue.length)
})
//当被选中的新闻发生变化时
const handleSelectionChange = (val: Array<adminNewsTypes.news>) => {
  selectedId.value = val.map((item) => item.newsId)
}
//单个删除请求：删除成功后需要发送消息重新刷新
const handleDelete = async (val: string) => {
  const res = await adminNewsStore.deleteNews([val])
  if (res) {
    emits('reSearch')
  }
}
//多个删除请求
const handleDeleteAll = async () => {
  const res = await adminNewsStore.deleteNews(selectedId.value)
  if (res) {
    return true
  }
  return false
}
//是否显示diaLog
const dialogVisible = ref(false)
//打开详情
const showDialog = (val: adminNewsTypes.news) => {
  dialogVisible.value = !dialogVisible.value
  if (val) {
    DialogRef.value.setNewsInfo(JSON.parse(JSON.stringify(val)))
  }
}
//弹窗的实例
const DialogRef = ref()
defineExpose({
  handleDeleteAll,
})
</script>

<template>
  <el-table
    highlight-current-row
    @selection-change="handleSelectionChange"
    border
    :data="newsList"
    style="width: 100%"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="title"
      label="标题"
      width="width"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      label="状态"
      width="70"
    >
      <template #default="scope">
        <el-switch
          @change="handleUpdateNews(scope.row)"
          v-model="scope.row.state"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          inline-prompt
          active-text="是"
          inactive-text="否"
        ></el-switch>
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="hits"
      label="点击量"
      width="100"
    >
    </el-table-column>

    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="companyValue"
      label="公司"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      label="热搜词"
      width="width"
    >
      <template #default="scope">
        <el-tag v-for="item in scope.row.hotSearchWordValues" :key="item">{{
          item
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="createDate"
      label="发布时间"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="updateDate"
      label="更新时间"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="updateNickName"
      label="编辑者"
    >
    </el-table-column>
    <el-table-column
      fixed="right"
      align="center"
      min-width="240"
      width="240"
      label="操作"
    >
      <template #default="scope">
        <AuthBtn
          @click="showDialog(scope.row)"
          type="primary"
          content="详情"
          name="adminNewsAuth"
          perm="READ"
        >
        </AuthBtn>
        <AuthBtn
          icon="edit"
          @click="handleUpdate(scope.row)"
          type="primary"
          content="修改"
          name="adminNewsAuth"
          perm="UPDATE"
        >
        </AuthBtn>
        <AuthBtn
          @click="handleDelete(scope.row.newsId)"
          type="primary"
          content="删除"
          name="adminNewsAuth"
          perm="DELETE"
        >
        </AuthBtn>
      </template>
    </el-table-column>
  </el-table>
  <Dialog
    @close="showDialog"
    ref="DialogRef"
    :dialog-form-visible="dialogVisible"
  />
</template>

<style scoped></style>
