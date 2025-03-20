<script setup lang="ts">
import { ref, watch } from 'vue'
import { downloadFile } from '@/utils'
import { cloneDeep } from 'lodash'
const dialogFormVisible = ref(false)

const announcement = ref({} as AnnouncementTypes.announcement)

const emits = defineEmits(['close'])
const isShowDialogFormVisible = () => {
  dialogFormVisible.value = !dialogFormVisible.value
}
const setAnnouncement = (announcementData: AnnouncementTypes.announcement) => {
  announcement.value = cloneDeep(announcementData)
}

defineExpose({
  isShowDialogFormVisible,
  setAnnouncement,
})
</script>

<template>
  <el-dialog
    @close="isShowDialogFormVisible"
    :model-value="dialogFormVisible"
    title="详情内容"
    width="900"
  >
    <el-row :gutter="10">
      <el-col>
        <el-form :model="announcement" label-width="auto">
          <el-form-item label="标题">
            <el-input disabled v-model="announcement.title" />
          </el-form-item>
          <el-form-item label="公司">
            <el-input
              disabled
              v-model="announcement.companyValue"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input disabled v-model="announcement.nickName" placeholder="" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input
              disabled
              v-model="announcement.createDate"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="更新人">
            <el-input
              disabled
              v-model="announcement.updateNickName"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input
              disabled
              v-model="announcement.updateDate"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="点击量">
            <el-tag type="success">{{ announcement.hits }}</el-tag>
          </el-form-item>
          <el-form-item label="状态">
            <el-tag :type="announcement.state ? 'success' : 'danger'">{{
              announcement.state ? '启用' : '禁用'
            }}</el-tag>
          </el-form-item>

          <el-form-item label="文件">
            <el-table :data="announcement.file" style="width: 100%">
              <el-table-column
                align="center"
                prop="name"
                label="文件名"
                width="width"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="url"
                label="文件地址"
                width="width"
              >
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作">
                <template #default="scope">
                  <AuthBtn
                    @click="downloadFile(scope.row.url, scope.row.name)"
                    content="下载"
                    name="adminAnnouncementAuth"
                    perm="DOWNLOAD"
                  >
                  </AuthBtn>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="内容">
            <div style="width: 900px" v-html="announcement.content"></div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped></style>
