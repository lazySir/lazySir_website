<script setup lang="ts">
import { reqGetSysDictionary } from '@/api/admin/sysDictionary'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import wangEdit from '@/components/public/wangEdit.vue'
import API from '@/utils/API'
import { useAdminNewsStore } from '@/stores/admin/news'
import { ElMessage } from 'element-plus'

const adminNewsStore = useAdminNewsStore()
const props = defineProps<{
  newsInfo: adminNewsTypes.addorUpdateNews
}>()

const newsInfo = ref({
  state: true,
} as adminNewsTypes.addorUpdateNews)
const selecetedHotWord = ref([] as string[])
interface HotWordReq extends RequestTypes.request {
  data: {
    data: sysDictionaryTypes.sysDictionary[]
  }
}

onMounted(() => {
  if (props.newsInfo.newsId) {
    newsInfo.value = props.newsInfo
    selecetedHotWord.value = props.newsInfo.hotSearchWordIds || ([] as any)
  }
  getHotWord()
})
//当选择的热搜词改变时
const changeHotWord = (val: string[]) => {
  newsInfo.value.hotSearchWordIds = [...val] as any
}
// 热搜词列表
const hotSearchWord = ref([] as sysDictionaryTypes.sysDictionary[])
//获取热搜词列表
const getHotWord = async () => {
  const res: HotWordReq = (await reqGetSysDictionary({
    parentId: '124c5a63-7707-4879-a6e5-0b6e7638f024',
    state: true,
  })) as any
  if (res.code == 200) {
    hotSearchWord.value = res.data.data
  }
}
//获取选中的公司Id
const getCompanyId = computed(() => {
  return props.newsInfo.companyId
})
//获取内容
const getContent = computed(() => {
  return props.newsInfo.content
})

const changeContentValue = (val: string) => {
  newsInfo.value.content = val
}

const handleCompany = (val: string) => {
  newsInfo.value.companyId = val
}

const emits = defineEmits(['changPage', 'reSearch'])
const cancel = () => {
  emits('changPage')
}

// 表单校验规则
const rules = ref({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  companyId: [{ required: true, message: '请选择公司', trigger: 'change' }],
  state: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
})

const formRef = ref() // 用于引用表单实例

const onSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const dataToSubmit = { ...newsInfo.value }

      // 在提交时处理 hotSearchWordIds
      if (Array.isArray(dataToSubmit.hotSearchWordIds)) {
        dataToSubmit.hotSearchWordIds = JSON.stringify(
          dataToSubmit.hotSearchWordIds,
        )
      }

      const res = await adminNewsStore.addOrUpdateNews(dataToSubmit)
      if (res) {
        emits('reSearch')
        cancel()
      }
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}
</script>

<template>
  <el-row>
    <el-col :offset="7" :span="17">
      <el-form
        label-width="auto"
        :model="newsInfo"
        :rules="rules"
        ref="formRef"
        style="max-width: 600px"
      >
        <el-form-item label="标题:" prop="title">
          <el-input v-model="newsInfo.title" />
        </el-form-item>
        <el-form-item label="公司:" prop="companyId">
          <Category
            :categoryId="getCompanyId"
            ref="companyRef"
            @sendValue="handleCompany"
            category1="公司"
          />
        </el-form-item>
        <el-form-item label="状态:" prop="state">
          <el-switch v-model="newsInfo.state" />
        </el-form-item>

        <el-form-item label="热搜词:">
          <el-checkbox-group @change="changeHotWord" v-model="selecetedHotWord">
            <el-checkbox
              border
              v-for="item in hotSearchWord"
              :value="item.dictionaryId"
              name="type"
            >
              {{ item.value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="内容:" prop="content">
          <wangEdit
            :upload-image-url="API.newsAPI.adminUploadNewsImage.url"
            :content="getContent"
            @sendValue="changeContentValue"
            style="height: 500px; overflow-y: hidden"
          />
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <el-row>
    <el-col :offset="11" :span="4">
      <AuthBtn
        v-if="newsInfo.newsId"
        :text="false"
        @click="onSubmit"
        type="primary"
        content="修改"
        name="adminNewsAuth"
        perm="UPDATE"
      >
      </AuthBtn>
      <AuthBtn
        v-else
        :text="false"
        @click="onSubmit"
        type="primary"
        content="确认"
        name="adminNewsAuth"
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
