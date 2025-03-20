<script setup lang="ts">
import Dialog from '@/views/admin/recruitment/dialog.vue'
import { useAdminRecruitmentStore } from '@/stores/admin/recruitment'
import { ref, watch } from 'vue'
const adminRecruitmentStore = useAdminRecruitmentStore()
const emits = defineEmits(['updateRecruitment', 'reSearch', 'selectedChange'])
const handleUpdate = (val: RecruitmentTypes.Recruitment) => {
  emits('updateRecruitment', val)
}
const handleStateUpdate = async (val: RecruitmentTypes.Recruitment) => {
  await adminRecruitmentStore.addOrUpdateRecruitmentList(val)
}
//删除按钮
const handleDelete = async (val: RecruitmentTypes.DeleteRecruitment) => {
  const res = await adminRecruitmentStore.deleteRecruitmentList(val)
  if (res) {
    emits('reSearch')
  }
  return res
}
const selectedList = ref([] as Array<String>)
const handdleSeclect = (val: Array<RecruitmentTypes.Recruitment>) => {
  selectedList.value = val.map((item) => item.recruitmentId)
}
watch(selectedList, (newValue, oldValue) => {
  emits('selectedChange', newValue.length)
})
const handleDeleteAll = async () => {
  const res = await handleDelete(selectedList.value as any)
  if (res) {
    selectedList.value = []
  }
} //是否显示diaLog
const dialogVisible = ref(false)
const DialogRef = ref()
//打开详情
const showDialog = (val: adminNewsTypes.news) => {
  dialogVisible.value = !dialogVisible.value
  if (val) {
    DialogRef.value.setRecruitment(JSON.parse(JSON.stringify(val)))
  }
}
defineExpose({
  handleDeleteAll,
})
</script>

<template>
  <el-table
    @select="handdleSeclect"
    highlight-current-row
    border
    :data="adminRecruitmentStore.recruitmentList"
    style="width: 100%"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column
      show-overflow-tooltip
      prop="title"
      align="center"
      label="标题"
    />
    <el-table-column prop="name" align="center" label="急招" width="83">
      <template #default="scope">
        <el-tag :type="scope.row.isHot ? 'success' : 'danger'">{{
          scope.row.isHot ? '是' : '否'
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="name" align="center" label="状态" width="83">
      <template #default="scope">
        <el-switch
          @change="handleStateUpdate(scope.row)"
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
      prop="addressValue"
      label="地址"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      prop="companyValue"
      label="公司"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      prop="categoryValue"
      label="职能类别"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      prop="degreeValue"
      label="学历"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      prop="experienceValue"
      label="工作经验"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      prop="nickName"
      label="发布人"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      prop="createDate"
      sortable
      label="创建时间"
      align="center"
    />
    <el-table-column
      show-overflow-tooltip
      prop="updateDate"
      sortable
      label="更新时间"
      align="center"
    />
    <el-table-column
      align="center"
      label="操作"
      fixed="right"
      min-width="230"
      width="230"
    >
      <template #default="scope">
        <AuthBtn
          type="primary"
          @click="showDialog(scope.row)"
          content="详情"
          name="recruitmentAuth"
          perm="READ"
        >
        </AuthBtn>
        <AuthBtn
          type="primary"
          @click="handleUpdate(scope.row)"
          content="编辑"
          name="recruitmentAuth"
          perm="UPDATE"
        >
        </AuthBtn>
        <AuthBtn
          type="primary"
          @click="handleDelete([scope.row.recruitmentId] as any)"
          content="删除"
          name="recruitmentAuth"
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
