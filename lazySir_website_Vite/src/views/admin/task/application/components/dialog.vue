<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const isShow = ref(false)

const props = defineProps<{
  canApplicationTaskList: taskTypes.canApplicationTask[]
}>()

// 当前申请数据
const applicationInfo = ref<taskTypes.addApproval>({
  taskId: '',
  reason: '',
})
const getTaskStatusType = (level?: string) => {
  switch (level) {
    case '取消':
      return 'danger'
    case '解密':
      return 'primary'
    case '未开始':
      return 'info'
    case '完成':
      return 'success'
    case '进行中':
      return 'warning'
    case '已过期':
      return 'danger'
    default:
      return 'info'
  }
}
// 打开弹窗时初始化
const openDialog = () => {
  applicationInfo.value = { taskId: '', reason: '' }
  isShow.value = true
}

// 获取当前选中的任务（用于展示创建人、状态）
const selectedTask = computed(() =>
  props.canApplicationTaskList.find(
    (item) => item.taskId === applicationInfo.value.taskId,
  ),
)

// 表单校验
const formRef = ref<FormInstance>()
const rules = ref<FormRules>({
  taskId: [{ required: true, message: '请选择任务', trigger: 'change' }],
  reason: [{ required: true, message: '请输入原因', trigger: 'blur' }],
})

// 提交方法
const emits = defineEmits(['emitsSubmitForm'])
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emits('emitsSubmitForm', applicationInfo.value)
      closeHandle()
    }
  })
}

const closeHandle = () => {
  isShow.value = false
}

defineExpose({ openDialog })
</script>

<template>
  <el-dialog
    title="任务申请"
    width="500"
    :model-value="isShow"
    @closed="closeHandle"
  >
    <el-form
      ref="formRef"
      :model="applicationInfo"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="可申请任务" prop="taskId">
        <el-select
          v-model="applicationInfo.taskId"
          placeholder="请选择任务"
          style="width: 100%"
          :value-key="'taskId'"
          :teleported="false"
        >
          <template
            v-for="task in props.canApplicationTaskList"
            :key="task.taskId"
          >
            <el-option :value="task.taskId" :label="task.taskName">
              <div class="task-option">
                <div class="task-title">
                  {{ task.title }}（{{ task.taskName }}）
                </div>
                <div class="task-meta">
                  创建人：{{ task.creatorNickname }} ｜ 状态：
                  <el-tag
                    size="small"
                    :type="getTaskStatusType(task.statusValue)"
                    effect="light"
                  >
                    {{ task.statusValue }}
                  </el-tag>
                </div>
              </div>
            </el-option>
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label="申请原因" prop="reason">
        <el-input
          type="textarea"
          v-model="applicationInfo.reason"
          placeholder="请输入申请理由"
          :rows="4"
        />
      </el-form-item>

      <!-- 选中任务后展示简要信息 -->
      <el-descriptions
        v-if="selectedTask"
        :column="1"
        border
        class="mb-4"
        size="small"
        title="任务信息"
      >
        <el-descriptions-item label="创建人">
          {{ selectedTask.creatorNickname }}
        </el-descriptions-item>
        <el-descriptions-item label="任务状态">
          <el-tag :type="getTaskStatusType(selectedTask.statusValue)">
            {{ selectedTask.statusValue }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-form>

    <el-row justify="end" class="mt-4">
      <el-button type="primary" @click="submitForm">确认</el-button>
      <el-button @click="closeHandle">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<style scoped>
.task-option {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}
.task-title {
  font-weight: 600;
  color: #303133;
}
.task-meta {
  font-size: 12px;
  color: #909399;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
