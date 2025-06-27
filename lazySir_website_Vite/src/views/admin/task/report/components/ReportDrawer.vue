<script setup lang="ts">
import { ref } from 'vue'

const isShow = ref(false)
const reportDetail = ref({} as taskTypes.report)

const openDrawer = (report: taskTypes.report) => {
  reportDetail.value = report
  isShow.value = true
}
const closeDrawer = () => {
  isShow.value = false
}

const getStatusType = (status?: string) => {
  switch (status) {
    case '待处理':
      return 'warning'
    case '已处理':
      return 'success'
    case '驳回':
      return 'danger'
    default:
      return 'info'
  }
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

defineExpose({ openDrawer })
</script>

<template>
  <el-drawer
    @closed="closeDrawer"
    v-model="isShow"
    title="汇报详情"
    direction="rtl"
    size="540px"
    :with-header="true"
  >
    <!-- 📄 汇报信息 -->
    <el-card class="mb-4">
      <template #header>
        <div class="font-semibold text-gray-700">📄 汇报信息</div>
      </template>
      <div class="space-y-3 text-sm text-gray-700">
        <div><strong>汇报标题：</strong>{{ reportDetail.title }}</div>
        <div>
          <strong>汇报状态：</strong>
          <el-tag :type="getStatusType(reportDetail.statusValue)">
            {{ reportDetail.statusValue }}
          </el-tag>
        </div>
        <div>
          <strong>汇报内容：</strong>
          <div
            class="prose prose-sm max-w-none text-gray-800"
            v-html="reportDetail.content"
          />
        </div>
        <div><strong>备注：</strong>{{ reportDetail.note || '—' }}</div>
        <div>
          <strong>附件：</strong>
          <template v-if="reportDetail.attachment">
            <el-link
              :href="reportDetail.attachment"
              target="_blank"
              type="primary"
            >
              下载附件
            </el-link>
          </template>
          <template v-else>—</template>
        </div>
      </div>
    </el-card>

    <!-- 🧾 任务信息 -->
    <el-card class="mb-4">
      <template #header>
        <div class="font-semibold text-gray-700">🧾 任务信息</div>
      </template>
      <div class="space-y-3 text-sm text-gray-700">
        <div>
          <strong>任务标题：</strong>{{ reportDetail.task?.title || '—' }}
        </div>
        <div>
          <strong>任务代号：</strong>
          <el-tag type="success">
            {{ reportDetail.task?.taskName || '—' }}
          </el-tag>
        </div>
        <div>
          <strong>任务状态：</strong>
          <el-tag :type="getTaskStatusType(reportDetail.task?.statusValue)">
            {{ reportDetail.task?.statusValue }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 👤 其他信息 -->
    <el-card>
      <template #header>
        <div class="font-semibold text-gray-700">👤 其他信息</div>
      </template>
      <div class="space-y-3 text-sm text-gray-700">
        <div>
          <strong>汇报人：</strong>
          <el-tag type="primary">
            {{ reportDetail.reporter?.nickname || '—' }}
          </el-tag>
        </div>
        <div><strong>创建时间：</strong>{{ reportDetail.createDate }}</div>
        <div><strong>更新时间：</strong>{{ reportDetail.updateDate }}</div>
      </div>
    </el-card>
  </el-drawer>
</template>

<style scoped>
.prose :where(p, ul, ol, pre, code) {
  margin: 0;
}
</style>
