<script setup lang="ts">
import { ref, computed } from 'vue'
defineProps<{
  groups: string[]
}>()
// 是否可编辑
const isEditable = ref(true)
// 控制弹框显示
const dialogTableVisible = ref(false)

// 当前确认提交的数据（不直接用于绑定表单）
const apiForm = ref<AdminApiTypes.Api>({} as AdminApiTypes.Api)
// 表单使用的编辑副本
const editForm = ref<AdminApiTypes.Api>({} as AdminApiTypes.Api)

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
  editForm.value = JSON.parse(JSON.stringify(data || {})) as AdminApiTypes.Api
  apiForm.value = JSON.parse(JSON.stringify(data || {})) as AdminApiTypes.Api
  isEditable.value = isEdit
}

const emit = defineEmits<{
  (e: 'addOrUpdateApiEmit', data: AdminApiTypes.Api): void
}>()

// 确认按钮
const handleConfirm = () => {
  apiForm.value = JSON.parse(JSON.stringify(editForm.value))
  apiForm.value.requireAuth = Boolean(apiForm.value.requireAuth)
  apiForm.value.state = Boolean(apiForm.value.state)
  emit('addOrUpdateApiEmit', apiForm.value)
  clearApiForm()
}
//请求方法
const requestMethods = computed(() => {
  return ['GET', 'POST', 'PUT', 'DELETE']
})
// 暴露方法给父组件
defineExpose({
  handleDialogOpen,
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
    <el-form label-width="auto" :model="editForm">
      <el-form-item label="API 名称">
        <el-input :disabled="!isEditable" v-model="editForm.apiName" />
      </el-form-item>
      <el-form-item label="路径">
        <el-input :disabled="!isEditable" v-model="editForm.apiPath" />
      </el-form-item>
      <el-form-item label="请求方法">
        <!-- <el-input :disabled="!isEditable" v-model="editForm.method" /> -->
        <el-select
          v-model="editForm.method"
          :disabled="!isEditable"
          filterable
          default-first-option
          placeholder="请选择或输入分组"
        >
          <el-option
            v-for="item in requestMethods"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          :disabled="!isEditable"
          type="textarea"
          v-model="editForm.description"
        />
      </el-form-item>
      <el-form-item label="所属分组">
        <el-select
          v-model="editForm.group"
          :disabled="!isEditable"
          :clearable="true"
          filterable
          allow-create
          default-first-option
          placeholder="请选择或输入分组"
        >
          <el-option
            v-for="item in groups"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch :disabled="!isEditable" v-model="editForm.state" />
      </el-form-item>
      <el-form-item label="需要权限">
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
