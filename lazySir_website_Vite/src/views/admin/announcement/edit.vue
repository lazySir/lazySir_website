<script setup lang="ts">
import { ref, inject, Ref } from 'vue'
import WangEdit from '@/components/public/wangEdit.vue'
import API from '@/utils/API'
import fileUpload from '@/components/admin/fileUpload.vue'
import { useAdminAnnouncementStore } from '@/stores/admin/announcement'
import { ElMessage } from 'element-plus'
const adminAnnouncementStore = useAdminAnnouncementStore()
let announcement = ref({
  state: true,
} as AnnouncementTypes.announcement)
const inject_announcement =
  inject<Ref<AnnouncementTypes.announcement>>('announcement')
if (inject_announcement?.value.announcementId) {
  announcement.value = JSON.parse(JSON.stringify(inject_announcement.value))
}
// 校验规则
const rules = ref({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  companyId: [{ required: true, message: '请选择公司', trigger: 'change' }],
  state: [{ required: true, message: '启用状态不能为空', trigger: 'change' }],
})
// 表单引用
const formRef = ref()
//emits
const emits = defineEmits(['emits_changePage'])
//切换回列表页面
const cancel = () => {
  announcement.value = {
    state: true,
  } as AnnouncementTypes.announcement
  emits('emits_changePage', false)
}
// 当内容发生改变时
const changeContentValue = (val: string) => {
  announcement.value.content = val
}
// 当公司选择发生改变时触发函数
const handleCompany = (val: string) => {
  announcement.value.companyId = val
}
//文件上传改变时触发函数
const deleteFileList = (val: string) => {
  announcement.value.file = announcement.value.file.filter((item) => {
    return item.name != val
  })
}
const addFileList = (val: { name: string; url: string }) => {
  announcement.value.file = announcement.value.file
    ? announcement.value.file
    : []
  announcement.value.file.push(val)
}
// 提交表单
const handleSubmit = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const res = await adminAnnouncementStore.addorUpdateAnnouncement(
        announcement.value,
      )
      // 提交数据逻辑
      if (res) {
        cancel()
      }
    } else {
      ElMessage.error('表单验证未通过')
    }
  })
}
</script>

<template>
  <el-row>
    <el-col :offset="6" :span="12">
      <el-form
        label-width="auto"
        :model="announcement"
        ref="formRef"
        :rules="rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="announcement.title"></el-input>
        </el-form-item>
        <el-form-item label="公司:" prop="companyId">
          <Category
            :categoryId="announcement.companyId"
            ref="companyRef"
            @sendValue="handleCompany"
            category1="公司"
          />
        </el-form-item>
        <el-form-item label="启用状态" prop="state">
          <el-switch
            v-model="announcement.state"
            active-color="#13ce66"
          ></el-switch>
        </el-form-item>

        <!-- 上传附件 -->
        <el-form-item label="附件">
          <fileUpload
            @delete:fileList="deleteFileList"
            @add:file-list="addFileList"
            :action="API.announcementAPI.adminUploadFile.url"
            :file-list="announcement.file"
          />
        </el-form-item>
        <el-form-item label="内容">
          <wangEdit
            :upload-image-url="API.announcementAPI.adminUploadImage.url"
            :content="announcement.content"
            @sendValue="changeContentValue"
            style="height: 500px; overflow-y: hidden"
          />
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <el-row>
    <el-col :offset="11" :span="12">
      <AuthBtn
        v-if="announcement.announcementId"
        :text="false"
        type="primary"
        @click="handleSubmit"
        content="更新"
        name="adminAnnouncementAuth"
        perm="UPDATE"
      >
      </AuthBtn>
      <AuthBtn
        v-else
        :text="false"
        type="primary"
        @click="handleSubmit"
        content="新增"
        name="adminAnnouncementAuth"
        perm="CREATE"
      >
      </AuthBtn>

      <el-button @click="cancel()">
        <IconifyIcon name="material-symbols:cancel-presentation-outline" />
        <span class="ml-1">取消</span></el-button
      >
    </el-col>
  </el-row>
</template>

<style scoped></style>
