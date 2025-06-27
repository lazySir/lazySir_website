<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import List from '@/views/admin/task/report/components/list.vue'
import Drawer from '@/views/admin/task/report/components/ReportDrawer.vue'
import EditPage from '@/views/admin/task/report/components/addOrEdit.vue'
import { useAdminTaskStore } from '@/stores/admin/task'
import { report } from 'process'
const adminTaskStore = useAdminTaskStore()
//筛选的数据条件
const filterSearch = ref<taskTypes.getReportList>({})
//获取数据
const getData = async () => {
  const res = await adminTaskStore.getTaskReportList(filterSearch.value)
}
//是否是编辑页面
const isEdit = ref(false)
//ref
const drawerRef = useTemplateRef('Drawer')
const pageRef = useTemplateRef('pageRef')
//是否显示过滤条件
const isShowFilter = ref(true)
//新增或更新汇报的执行函数
const handleAddOrUpdateReport = async (val: taskTypes.addOrUpdateReport) => {
  const res = await adminTaskStore.addOrUpdateReport(val)
  if (res) {
    pageRef.value?.cancel()
    getData()
  }
}
//阅读的执行函数，打开抽屉
const handleRead = (val: taskTypes.report) => {
  drawerRef.value?.openDrawer(val)
}
//是否显示编辑页面
const handleChangePage = (val: boolean) => {
  editReport.value = {} as taskTypes.report
  isEdit.value = val
}
//筛选条件
const handleStatus = (val: string) => {
  filterSearch.value.statusId = val
}
//当每页条数改变时
const handleSizeChange = (val: number) => {
  filterSearch.value.limit = val
  getData()
}
//当页码改变时
const handleCurrentChange = (val: number) => {
  filterSearch.value.page = val
  getData()
}

const editReport = ref<taskTypes.report>({} as taskTypes.report)
const handleEdit = (val: taskTypes.report) => {
  handleChangePage(true)
  editReport.value = val
}
//被选中的汇报
const selectedTask = ref<string[]>([])
const handleSelectedChange = (val: string[]) => {
  selectedTask.value = val
}
//批量删除
const handleDeletes = async () => {
  const res = await adminTaskStore.deleteReport(selectedTask.value)
  if (res) {
    getData()
  }
}
const handleDelete = async (id: string) => {
  const res = await adminTaskStore.deleteReport([id])
  if (res) {
    getData()
  }
}
//加载的时候获取数据
onMounted(() => {
  getData()
})
</script>

<template>
  <el-card v-if="!isEdit">
    <template #header>
      <el-row v-if="isShowFilter" :gutter="10">
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>任务标题：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.title"
            style="width: 170px"
            placeholder="请输入任务标题"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>汇报人：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.reporterNickname"
            style="width: 170px"
            placeholder="请输入汇报人名称"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>任务代号：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.taskName"
            style="width: 170px"
            placeholder="请输入任务代号"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>备注：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.taskName"
            style="width: 170px"
            placeholder="请输入备注"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>汇报进展：</el-text></div>
          <Category @sendValue="handleStatus" category1="汇报进展" />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>汇报内容：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.content"
            style="width: 170px"
            placeholder="请输入汇报内容"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>汇报时间起始值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.createDateFrom"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>汇报时间截至值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.createDateTo"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>更新时间起始值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.updateDateFrom"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>更新时间截至值：</el-text>
          </div>
          <el-date-picker
            style="width: 170px"
            v-model="filterSearch.updateDateTo"
            type="datetime"
            placeholder="请选择"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-col>
      </el-row>

      <el-row justify="end" :gutter="10">
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="handleChangePage"
            type="primary"
            content="任务汇报"
            name="adminTaskAuth"
            perm="CREATE"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="getData"
            icon="Search"
            type="primary"
            content="查询"
            name="adminTaskAuth"
            perm="READ"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            :disabled="selectedTask.length < 1"
            @click="handleDeletes"
            type="danger"
            content="批量删除"
            name="adminTaskAuth"
            perm="DELETES"
          >
          </AuthBtn>
        </el-col>

        <el-col :span="1.5">
          <el-button
            @click="isShowFilter = !isShowFilter"
            :icon="isShowFilter ? 'Hide' : 'View'"
            type="primary"
            >{{ isShowFilter ? '隐藏过滤' : '显示过滤' }}</el-button
          ></el-col
        >
      </el-row>
    </template>
    <List
      @emitsEdit="handleEdit"
      @emitsRead="handleRead"
      :list="adminTaskStore.taskReportList"
    />
    <el-row style="margin-top: 2px">
      <el-col :offset="9" :span="12">
        <BasePagination
          v-model:current-page="filterSearch.page"
          v-model:page-size="filterSearch.limit"
          :total="adminTaskStore.taskReportTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
      <Drawer ref="Drawer" />
    </el-row>
  </el-card>
  <EditPage
    ref="pageRef"
    :report-prop="editReport"
    @emitsAddOrUpdate="handleAddOrUpdateReport"
    @emits_changePage="handleChangePage"
    v-else
  />
</template>

<style scoped></style>
