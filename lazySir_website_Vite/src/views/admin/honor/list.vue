<script setup lang="ts">
import { useAdminHonorStore } from '@/stores/admin/honor'
import { useAdminNewsStore } from '@/stores/admin/news'
import { computed, ref } from 'vue'
import honorDialog from '@/views/admin/honor/dialog.vue'
import newsDialog from '@/views/admin/news/dialog.vue'

import { ElMessage } from 'element-plus'

const adminHonorStore = useAdminHonorStore()
const adminNewsStore = useAdminNewsStore()
const honorList = computed(() => {
  return adminHonorStore.honorList
})
const emits = defineEmits(['reSearch', 'selectedChange'])
//新闻详情
const newsDialogVisible = ref(false)
//新闻弹出框实例
const newsDialogRef = ref()
//新闻弹出框的控制
const handleChangeNewsDialogVisible = async (val: adminNewsTypes.news) => {
  newsDialogVisible.value = !newsDialogVisible.value
  if (val && val.newsId) {
    const res = await adminNewsStore.getNews({ newsId: val.newsId })
    if (res) {
      newsDialogRef.value.setNewsInfo(res)
    } else {
      ElMessage.error('获取新闻详情失败')
    }
  }
}
//荣誉详情
const honorDialogVisible = ref(false)
//荣誉弹出框实例
const honorDialogRef = ref()

//荣誉弹出框的控制
const handleChangeHonorDialogVisible = async (
  val: AdminHonorTypes.addOrUpdateHonor,
) => {
  if (val) {
    honorDialogRef.value.setHonorInfo(JSON.parse(JSON.stringify(val)))
  } else {
    emits('reSearch')
  }
  honorDialogVisible.value = !honorDialogVisible.value
}
//删除按钮的回调函数
const handleDelete = async (val: string[]) => {
  const res = await adminHonorStore.deleteHonor(val)
  if (res) {
    emits('reSearch')
  }
}
const selected = ref([] as Array<string>)
const handleSelectionChange = (val: AdminHonorTypes.honor[]) => {
  selected.value = val.map((item) => item.honorId)
  emits('selectedChange', selected.value)
}
defineExpose({
  handleChangeHonorDialogVisible,
  handleDelete,
})
</script>

<template>
  <el-table
    highlight-current-row
    @select="handleSelectionChange"
    :data="honorList"
    border
    style="width: 100%"
  >
    <el-table-column type="selection" width="40" />
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="name"
      label="荣誉名称"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      prop="description"
      label="荣誉描述"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="新闻标题"
      prop="newsTitle"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="公司"
      prop="companyValue"
      width="width"
    >
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
      label="获得时间"
      order
      prop="createDate"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="录入人"
      prop="nickName"
      width="width"
    >
    </el-table-column>

    <el-table-column
      align="center"
      show-overflow-tooltip
      sortable
      label="更新时间"
      order
      prop="updateDate"
      width="width"
    >
    </el-table-column>
    <el-table-column
      align="center"
      show-overflow-tooltip
      label="更新人"
      prop="updateNickName"
      width="width"
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
          v-if="scope.row.newsId"
          @click="handleChangeNewsDialogVisible(scope.row)"
          type="primary"
          content="详情"
          name="adminHonorAuth"
          perm="READ"
        >
        </AuthBtn>

        <AuthBtn
          @click="handleChangeHonorDialogVisible(scope.row)"
          type="primary"
          content="编辑"
          name="adminHonorAuth"
          perm="UPDATE"
        >
        </AuthBtn>

        <el-popconfirm
          @confirm="handleDelete([scope.row.honorId])"
          :title="`是否确定删除${scope.row.name}`"
        >
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
  <newsDialog
    ref="newsDialogRef"
    :dialog-form-visible="newsDialogVisible"
    @close="handleChangeNewsDialogVisible"
  />
  <honorDialog
    ref="honorDialogRef"
    :visible="honorDialogVisible"
    @close="handleChangeHonorDialogVisible"
  />
</template>

<style scoped></style>
