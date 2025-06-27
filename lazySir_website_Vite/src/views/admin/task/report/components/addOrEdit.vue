<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
const props = defineProps<{
  reportProp: taskTypes.report
}>()

import WangEdit from '@/components/public/wangEdit.vue'
import { reqGetCanReportTask } from '@/api/admin/task'
import fileUpload from '@/components/admin/fileUpload.vue'
import API from '@/utils/API'
//获取任务代号
const getTaskName = computed(() => {
  return taskList.value.find((item) => item.taskId === report.value.task.taskId)
    ?.taskName
})
//获取可汇报任务
interface TaskItem {
  taskId: string
  title: string
  taskName: string
  creatorNickname: string
  statusId: string
  statusValue: string
}
const taskList = ref<TaskItem[]>([])
const getData = async () => {
  const res = await reqGetCanReportTask()
  taskList.value = res.data.list
}

onMounted(() => {
  getData()
  handleEdit(props.reportProp)
})
import { ElMessage } from 'element-plus'

// 汇报数据对象（编辑/新增）
let report = ref({} as taskTypes.report)
const handleEdit = (data: taskTypes.report) => {
  //   report.value = JSON.parse(JSON.stringify(data))
  //   report.value.attachment = JSON.parse(report.value.attachment as any)
  if (data.attachment.length > 0) {
    data.attachment = JSON.parse(data.attachment as any)
  } else {
    data.attachment = []
  }
  report.value = JSON.parse(JSON.stringify(data))
}
// 校验规则
const rules = ref({
  title: [
    { required: true, message: '汇报标题不能为空', trigger: 'blur' },
    { max: 255, message: '不能超过255个字符', trigger: 'blur' },
  ],
  taskId: [{ required: true, message: '请选择任务', trigger: 'change' }],
  statusId: [{ required: true, message: '请选择汇报状态', trigger: 'change' }],
  content: [
    { required: true, message: '汇报内容不能为空', trigger: 'blur' },
    { max: 100000, message: '内容不能超过10万字符', trigger: 'blur' },
  ],
  note: [{ max: 1000, message: '备注不能超过1000字符', trigger: 'blur' }],
})

// 表单引用
const formRef = ref()

// emits
const emits = defineEmits(['emits_changePage', 'emitsAddOrUpdate'])

// 取消返回
const cancel = () => {
  report.value = {} as taskTypes.report
  emits('emits_changePage', false)
}

// 富文本内容更新
const changeContentValue = (val: string) => {
  report.value.content = val
}

// 上传附件
const deleteFileList = (name: string) => {
  report.value.attachment = report.value.attachment.filter(
    (item) => item.name !== name,
  )
}
const addFileList = (val: { name: string; url: string }) => {
  report.value.attachment = report.value.attachment || []
  report.value.attachment.push(val)
}

// 提交汇报
const handleSubmit = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      report.value.attachment = JSON.stringify(report.value.attachment) as any
      emits('emitsAddOrUpdate', report.value)
    } else {
      ElMessage.error('表单验证未通过')
    }
  })
}
const getTaskStatusType = (status?: string) => {
  switch (status) {
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
const handleStatus = (id: string) => {
  report.value.statusId = id
}
watch(props.reportProp, (newValue, oldValue) => {
  handleEdit(newValue)
})
defineExpose({
  cancel,
})
</script>

<template>
  <el-row>
    <el-col :offset="6" :span="12">
      <el-form
        ref="formRef"
        :model="report"
        :rules="rules"
        label-width="auto"
        class="pt-4"
      >
        <!-- 任务选择 -->
        <el-form-item v-if="!report.reportId" label="关联任务" prop="taskId">
          <el-select
            v-model="report.taskId"
            placeholder="请选择任务"
            style="width: 100%"
            :teleported="false"
          >
            <template v-for="task in taskList" :key="task.taskId">
              <el-option :value="task.taskId" :label="task.taskName">
                <div class="task-option">
                  <div class="task-meta text-xs text-gray-500 mt-1">
                    任务代号：<el-tag type="success">{{
                      task.taskName
                    }}</el-tag>
                    | 创建人：
                    <el-tag type="primary" size="small" effect="light">
                      {{ task.creatorNickname }}
                    </el-tag>
                    | 状态：
                    <el-tag
                      size="small"
                      :type="getTaskStatusType(task.statusValue)"
                      effect="light"
                      class="ml-1"
                    >
                      {{ task.statusValue }}
                    </el-tag>
                  </div>
                </div>
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="关联任务" v-else>
          <el-tag type="success">{{ getTaskName }}</el-tag>
        </el-form-item>
        <!-- 👇 当前选中的任务额外展示（如果你需要） -->

        <!-- 标题 -->
        <el-form-item label="汇报标题" prop="title">
          <el-input v-model="report.title" maxlength="255" show-word-limit />
        </el-form-item>

        <!-- 状态选择 -->
        <el-form-item label="汇报进展" prop="statusId">
          <Category
            @sendValue="handleStatus"
            category1="汇报进展"
            :categoryId="report.statusId"
          />
        </el-form-item>

        <!-- 附件上传 -->
        <el-form-item label="附件">
          <fileUpload
            @delete:fileList="deleteFileList"
            @add:file-list="addFileList"
            :action="API.taskReportApi.uploadTaskFile.url"
            :file-list="report.attachment"
          />
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="report.note"
            type="textarea"
            :rows="3"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <!-- 富文本内容 -->
        <el-form-item label="汇报内容" prop="content">
          <wangEdit
            :upload-image-url="API.taskReportApi.uploadTaskImage.url"
            :content="report.content"
            @sendValue="changeContentValue"
            style="height: 500px; overflow-y: hidden"
          />
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

  <el-row class="mt-6">
    <el-col :offset="11" :span="12">
      <AuthBtn
        v-if="report.reportId"
        :text="false"
        type="primary"
        @click="handleSubmit"
        content="更新"
        name="adminTaskAuth"
        perm="UPDATE"
      />
      <AuthBtn
        v-else
        :text="false"
        type="primary"
        @click="handleSubmit"
        content="新增"
        name="adminTaskAuth"
        perm="CREATE"
      />
      <el-button @click="cancel">
        <IconifyIcon name="material-symbols:cancel-presentation-outline" />
        <span class="ml-1">取消</span>
      </el-button>
    </el-col>
  </el-row>
</template>
