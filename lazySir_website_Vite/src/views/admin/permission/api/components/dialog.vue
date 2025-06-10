<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
// 是否可编辑
const isEditable = ref(true)
// 控制弹框显示
const dialogTableVisible = ref(false)

// 当前确认提交的数据（不直接用于绑定表单）
const apiForm = ref<AdminApiTypes.Api>({} as AdminApiTypes.Api)
// 表单使用的编辑副本
const editForm = ref<AdminApiTypes.Api>({
  state: true,
  requireAuth: false,
} as AdminApiTypes.Api)

// 弹框标题
const getDialogTitle = computed(() => {
  return apiForm.value.apiId ? `${apiForm.value.apiName} 接口` : '添加接口'
})

// 清除数据
const clearApiForm = () => {
  apiForm.value = {} as AdminApiTypes.Api
  editForm.value = {} as AdminApiTypes.Api
  isEditable.value = false
  dialogTableVisible.value = false
}

// 打开弹框
const handleDialogOpen = (isEdit: boolean, data?: AdminApiTypes.Api) => {
  dialogTableVisible.value = true
  if (data) {
    editForm.value = JSON.parse(JSON.stringify(data || {})) as AdminApiTypes.Api
    apiForm.value = JSON.parse(JSON.stringify(data || {})) as AdminApiTypes.Api
  }
  isEditable.value = isEdit
}

const emit = defineEmits<{
  (e: 'addOrUpdateApiEmit', data: AdminApiTypes.Api): void
}>()

const handleGroup = (val: string) => {
  editForm.value.groupId = val
}
const handleMethods = (val: string) => {
  editForm.value.methodId = val
}

// 表单校验规则
const rules = ref<FormRules>({
  apiName: [
    { required: true, message: '请输入 API 名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  apiPath: [
    { required: true, message: '请输入路径', trigger: 'blur' },
    {
      pattern: /^\/[a-zA-Z0-9\/:_\-]*$/,
      message: '路径格式不合法，示例：/api/user/:id',
      trigger: 'blur',
    },
  ],
  methodId: [{ required: true, message: '请选择请求方法', trigger: 'change' }],
  groupId: [{ required: true, message: '请选择所属分组', trigger: 'change' }],
})
// 表单引用
const formRef = ref<FormInstance>()

// 确认按钮
const handleConfirm = async () => {
  if (formRef.value) await formRef.value.validate()
  apiForm.value = JSON.parse(JSON.stringify(editForm.value))
  apiForm.value.requireAuth = Boolean(apiForm.value.requireAuth)
  apiForm.value.state = Boolean(apiForm.value.state)
  emit('addOrUpdateApiEmit', apiForm.value)
}
// 暴露方法给父组件
defineExpose({
  handleDialogOpen,
  clearApiForm,
})
</script>

<template>
  <!-- 弹框 -->
  <el-dialog
    center
    @close="clearApiForm"
    v-model="dialogTableVisible"
    :title="getDialogTitle"
    width="500"
  >
    <el-form ref="formRef" :rules="rules" label-width="auto" :model="editForm">
      <el-form-item prop="apiName" label="API 名称">
        <el-input :disabled="!isEditable" v-model="editForm.apiName" />
      </el-form-item>
      <el-form-item prop="apiPath" label="路径">
        <el-input :disabled="!isEditable" v-model="editForm.apiPath" />
      </el-form-item>
      <el-form-item prop="methodId" label="请求方法">
        <!-- <el-input :disabled="!isEditable" v-model="editForm.method" /> -->
        <Category
          v-if="isEditable"
          :categoryId="editForm.methodId"
          @sendValue="handleMethods"
          category1="请求方式"
        />
        <el-input
          v-else
          :disabled="!isEditable"
          v-model="editForm.methodValue"
          placeholder="非编辑状态下显示方法名称"
        />
      </el-form-item>
      <el-form-item prop="description" label="描述">
        <el-input
          :disabled="!isEditable"
          type="textarea"
          v-model="editForm.description"
        />
      </el-form-item>
      <el-form-item prop="groupId" label="所属分组">
        <Category
          v-if="isEditable"
          :categoryId="editForm.groupId"
          @sendValue="handleGroup"
          category1="API分组名称"
        />
        <el-input
          v-else
          :disabled="!isEditable"
          v-model="editForm.groupValue"
          placeholder="非编辑状态下显示分组名称"
        />
      </el-form-item>
      <el-form-item prop="state" label="是否启用">
        <el-switch :disabled="!isEditable" v-model="editForm.state" />
      </el-form-item>
      <el-form-item prop="requireAuth" label="需要权限">
        <el-switch :disabled="!isEditable" v-model="editForm.requireAuth" />
      </el-form-item>

      <el-form-item v-if="!isEditable" label="创建时间">
        <el-date-picker
          v-model="editForm.createDate"
          type="datetime"
          disabled
        />
      </el-form-item>
      <el-form-item v-if="!isEditable" label="更新时间">
        <el-date-picker
          v-model="editForm.updateDate"
          type="datetime"
          disabled
        />
      </el-form-item>
      <el-form-item v-if="!isEditable" label="创建人">
        <el-input v-model="editForm.createNickname" disabled />
      </el-form-item>
      <el-form-item v-if="!isEditable" label="更新人">
        <el-input v-model="editForm.updateNickname" disabled />
      </el-form-item>
    </el-form>

    <!-- 弹框底部 -->
    <template #footer>
      <div class="dialog-footer">
        <AuthBtn
          v-if="editForm.apiId"
          :text="false"
          type="primary"
          content="修改"
          @click="handleConfirm"
          name="permissionApi"
          perm="UPDATE"
        />
        <AuthBtn
          v-else
          type="primary"
          :text="false"
          content="确认"
          @click="handleConfirm"
          name="permissionApi"
          perm="CREATE"
        />
        <el-button @click="clearApiForm">
          <IconifyIcon name="material-symbols:cancel-presentation-outline" />
          <span class="ml-1">取消</span>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
