<template>
  <el-row justify="center">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="recruitment"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="标题:" prop="title" :rules="rules.title">
        <el-input v-model="recruitment.title" />
      </el-form-item>
      <el-row justify="space-between" :gutter="10">
        <el-col :span="6">
          <el-form-item
            prop="categoryId"
            label="职能类别:"
            :rule="rules.categoryId"
          >
            <Category
              :categoryId="getCategoryId"
              @sendValue="handleCategory"
              category1="职能类别"
            /> </el-form-item
        ></el-col>

        <el-col :span="9.5">
          <el-form-item
            prop="degreeId"
            label="工作经验:"
            :rules="rules.experienceId"
          >
            <Category
              :categoryId="getExperienceId"
              ref="companyRef"
              @sendValue="handleExperience"
              category1="工作经验"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-between" :gutter="10">
        <el-col :span="6">
          <el-form-item prop="companyId" label="公司:" :rules="rules.companyId">
            <Category
              :categoryId="getCompanyId"
              ref="companyRef"
              @sendValue="handleCompany"
              category1="公司"
            /> </el-form-item
        ></el-col>

        <el-col :span="9.5">
          <el-form-item prop="degreeId" label="学历:" :rules="rules.degreeId">
            <Category
              :categoryId="getDegreeId"
              ref="companyRef"
              @sendValue="handleDegree"
              category1="学历"
            /> </el-form-item
        ></el-col>
      </el-row>

      <el-form-item prop="addressId" label="地址:" :rules="rules.addressId">
        <Category
          :categoryId="getAddressId"
          @sendValue="handleAddress"
          category1="地址"
        />
      </el-form-item>
      <el-row>
        <el-col :span="19">
          <el-form-item label="是否热招:" prop="isHot">
            <el-switch
              v-model="recruitment.isHot"
              style="--el-switch-on-color: #13ce66"
              inline-prompt
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="是否启用:" prop="state">
            <el-switch
              v-model="recruitment.state"
              style="--el-switch-on-color: #13ce66"
              inline-prompt
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :rule="rules.content" label="内容:" prop="content">
        <wangEdit
          :content="getContent"
          @sendValue="changeContentValue"
          style="width: 510px; height: 500px; overflow-y: hidden"
        />
      </el-form-item>
    </el-form>
  </el-row>

  <el-row justify="center">
    <el-col :offset="11" :span="12">
      <AuthBtn
        v-if="recruitment.recruitmentId"
        :text="false"
        type="primary"
        @click="submitForm(ruleFormRef)"
        content="修改"
        name="recruitmentAuth"
        perm="UPDATE"
      >
      </AuthBtn>
      <AuthBtn
        v-else
        type="primary"
        :text="false"
        @click="submitForm(ruleFormRef)"
        content="确认"
        name="recruitmentAuth"
        perm="CREATE"
      >
      </AuthBtn>
      <el-button @click="handleChangePage">
        <IconifyIcon name="material-symbols:cancel-presentation-outline" />
        <span class="ml-1">取消</span></el-button
      >
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import wangEdit from '@/components/public/wangEdit.vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { useAdminRecruitmentStore } from '@/stores/admin/recruitment'
const adminRecruitmentStore = useAdminRecruitmentStore()
const ruleFormRef = ref<FormInstance>()
const emit = defineEmits(['changePage'])

// 表单验证规则
const rules = ref({
  categoryId: [{ required: true, message: '请选择类别', trigger: 'change' }],
  degreeId: [{ required: true, message: '请选择学历', trigger: 'change' }],
  experienceId: [
    { required: true, message: '请选择工作经验', trigger: 'change' },
  ],
  addressId: [{ required: true, message: '请选择地址', trigger: 'change' }],
  companyId: [{ required: true, message: '请选择公司', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  isHot: [{ required: true, message: '请选择是否热招', trigger: 'change' }],
  state: [{ required: true, message: '请选择是否启用', trigger: 'change' }],
  content: [{ required: true, message: '请输入招聘内容', trigger: 'blur' }],
})

// 切回列表页面
const handleChangePage = () => {
  emit('changePage', true)
}
const props = defineProps<{
  recruitment: RecruitmentTypes.Recruitment
}>()
const getAddressId = computed(() => {
  return props.recruitment.addressId
})
const getCompanyId = computed(() => {
  return props.recruitment.companyId
})
const getCategoryId = computed(() => {
  return props.recruitment.categoryId
})
const getDegreeId = computed(() => {
  return props.recruitment.degreeId
})
const getExperienceId = computed(() => {
  return props.recruitment.experienceId
})
const getContent = computed(() => {
  return props.recruitment.content
})

onMounted(() => {
  if (props.recruitment.title) {
    recruitment.value = props.recruitment
  }
})
// 更改 content
const changeContentValue = (val: string) => {
  recruitment.value.content = val
}

// 正在编辑的对象
const recruitment = ref({
  state: true,
  isHot: false,
} as RecruitmentTypes.Recruitment)

// 处理各个选择框的值
const handleAddress = (val: string) => {
  recruitment.value.addressId = val
}
const handleCompany = (val: string) => {
  recruitment.value.companyId = val
}
const handleCategory = (val: string) => {
  recruitment.value.categoryId = val
}
const handleDegree = (val: string) => {
  recruitment.value.degreeId = val
}
const handleExperience = (val: string) => {
  recruitment.value.experienceId = val
}
//提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await adminRecruitmentStore.addOrUpdateRecruitmentList(
        recruitment.value,
      )
      if (res) {
        handleChangePage()
      }
    } else {
      ElMessage.error('请检测信息是否填写完整')
    }
  })
}
</script>
