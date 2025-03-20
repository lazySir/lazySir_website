<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false,
  },
})

const recruitment = ref({} as RecruitmentTypes.Recruitment)
//赋值
const setRecruitment = (val: RecruitmentTypes.Recruitment) => {
  recruitment.value = val
}
const dialogFormVisible = computed(() => {
  return props.dialogFormVisible
})
const emits = defineEmits(['close'])
const close = () => {
  emits('close')
}
defineExpose({
  setRecruitment,
})
</script>

<template>
  <el-dialog
    @close="close"
    :model-value="dialogFormVisible"
    title="详情内容"
    width="900"
  >
    <el-row :gutter="10">
      <el-col>
        <el-form :model="recruitment" label-width="auto">
          <el-form-item label="招聘标题：">
            <el-input disabled v-model="recruitment.title" />
          </el-form-item>
          <el-form-item label="公司：">
            <el-input
              disabled
              v-model="recruitment.companyValue"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="职能类别：">
            <el-input
              disabled
              v-model="recruitment.categoryValue"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="学历：">
            <el-input
              disabled
              v-model="recruitment.degreeValue"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="工作经验：">
            <el-input
              disabled
              v-model="recruitment.experienceValue"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="地址：">
            <el-input
              disabled
              v-model="recruitment.addressValue"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="创建人：">
            <el-input disabled v-model="recruitment.nickName" placeholder="" />
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-input
              disabled
              v-model="recruitment.createDate"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="更新人：">
            <el-input
              disabled
              v-model="recruitment.updatedNickName"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="更新时间：">
            <el-input
              disabled
              v-model="recruitment.updateDate"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="启用状态：">
            <el-tag :type="recruitment.state ? 'success' : 'danger'">{{
              recruitment.state ? '启用' : '禁用'
            }}</el-tag>
          </el-form-item>
          <el-form-item label="热搜状态：">
            <el-tag :type="recruitment.isHot ? 'success' : 'danger'">{{
              recruitment.isHot ? '启用' : '禁用'
            }}</el-tag>
          </el-form-item>

          <el-form-item label="内容：">
            <div style="width: 900px" v-html="recruitment.content"></div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped></style>
