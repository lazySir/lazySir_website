<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminAnnouncementStore } from '@/stores/admin/announcement'
import Dialog from '@/views/admin/announcement/dialog.vue'
const adminAnnouncementStore = useAdminAnnouncementStore()
//获取列表
const list = computed(() => {
  return adminAnnouncementStore.list
})
//更新状态
const handleStateUpdate = async (val: AnnouncementTypes.announcement) => {
  await adminAnnouncementStore.addorUpdateAnnouncement(val)
}
//弹出框的实例
const DialogRef = ref()
const showDialog = (val: AnnouncementTypes.announcement) => {
  DialogRef.value.setAnnouncement(val)
  DialogRef.value.isShowDialogFormVisible()
}
const selectedList = ref<AnnouncementTypes.announcement[]>()
//编辑的事件
const emits = defineEmits<{
  (e: 'emits_edit', val: AnnouncementTypes.announcement): void
  (e: 'emits_get'): void
  (e: 'emits_select', val: Array<String>): void
}>()
const edit = (val: AnnouncementTypes.announcement) => {
  emits('emits_edit', val)
}
//当选中时触发
const handleSelect = (val: AnnouncementTypes.announcement[]) => {
  selectedList.value = val
  let arr = (val.map((item) => item.announcementId) as Array<string>) || []
  emits('emits_select', arr)
}
const handleDelete = async (val: Array<string>) => {
  const res = await adminAnnouncementStore.deleteAnnouncement(val)
  if (res) {
    emits('emits_get')
  }
}
defineExpose({
  handleDelete,
})
</script>

<template>
  <el-table @select="handleSelect" border :data="list" style="width: 100%">
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
      align="center"
      prop="hits"
      label="点击量"
      width="70"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="companyValue"
      label="公司"
    >
    </el-table-column>
    <el-table-column show-overflow-tooltip align="center" label="文件列表">
      <template #default="scope">
        <el-tag class="ml-1" type="primary" v-for="item in scope.row.file">
          {{ item.name }}
        </el-tag>
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
          content="详情"
          name="adminAnnouncementAuth"
          perm="READ"
        >
        </AuthBtn>

        <AuthBtn
          @click="edit(scope.row)"
          content="修改"
          name="adminAnnouncementAuth"
          perm="UPDATE"
        >
        </AuthBtn>

        <AuthBtn
          @click="handleDelete([scope.row.announcementId])"
          content="删除"
          name="adminAnnouncementAuth"
          perm="DELETE"
        >
        </AuthBtn>
      </template>
    </el-table-column>
  </el-table>
  <Dialog ref="DialogRef" />
</template>

<style scoped></style>
