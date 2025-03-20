<script setup lang="ts">
import Category from '@/components/admin/category.vue'
import RecruitmentList from '@/views/admin/recruitment/list.vue'
import Edit from '@/views/admin/recruitment/edit.vue'
import { ref, onMounted } from 'vue'
import { useAdminRecruitmentStore } from '@/stores/admin/recruitment'
const adminRecruitmentStore = useAdminRecruitmentStore()

//过滤条件
const filterValues = ref({
  limit: 10,
  page: 1,
} as RecruitmentTypes.GetRecruitment)
//是否显示过滤配置
const isShowFilter = ref(true)
//当前选中的招聘条件
const recruitment = ref({} as RecruitmentTypes.Recruitment)
//用于判断当前的页面是编辑页面还是显示页面
const pageState = ref(true)
//新闻列表实例
const RecruitmentListRef = ref(null)
//当前选择的个数
const selectNum = ref(0)
onMounted(async () => {
  await handleGetList()
})
const handleGetList = async () => {
  await adminRecruitmentStore.getRecruitmentList(filterValues.value)
}
//过滤条件：当地址发生改变
const handleAddress = (val: string) => {
  filterValues.value.addressId = val
}
//过滤条件：当公司发生改变
const handleCompany = (val: string) => {
  filterValues.value.companyId = val
}
//过滤条件：当职能类别发生改变
const handleCategory = (val: string) => {
  filterValues.value.categoryId = val
}
//
//过滤条件：当学历发生改变
const handleDegree = (val: string) => {
  filterValues.value.degreeId = val
}
//
const handleExperience = (val: string) => {
  filterValues.value.experienceId = val
}
//切换页面
const handleChangePage = (val: boolean) => {
  pageState.value = val
  if (pageState.value == true) {
    recruitment.value = {} as RecruitmentTypes.Recruitment
    handleGetList()
  }
}
//切换成编辑页面
const handleUpdate = (val: RecruitmentTypes.Recruitment) => {
  recruitment.value = val
  handleChangePage(false)
}
//过滤条件：条数发生改变
const handleSizeChange = (val: number) => {
  filterValues.value.limit = val
  handleGetList()
}
//过滤条件：当前页发生改变
const handleCurrentChange = (val: number) => {
  filterValues.value.page = val
  handleGetList()
}
//过滤条件：是否显示过滤条件
const handleIsShowFilter = () => {
  isShowFilter.value = !isShowFilter.value
  filterValues.value = {
    limit: 10,
    page: 1,
  } as RecruitmentTypes.GetRecruitment
}
const handleDelete = async () => {
  await (RecruitmentListRef.value as any).handleDeleteAll()
  await handleGetList()
}
const handleSelectedChange = (val: number) => {
  selectNum.value = val
}
</script>

<template>
  <div v-if="pageState">
    <el-card>
      <template #header>
        <el-row v-if="isShowFilter">
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>发布人：</el-text></div>
            <el-input
              clearable
              style="width: 170px"
              v-model="filterValues.nickName"
              placeholder="请输入发布人昵称"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>标题：</el-text></div>
            <el-input
              clearable
              style="width: 170px"
              v-model="filterValues.title"
              placeholder="请输入标题"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>关键字：</el-text></div>
            <el-input
              clearable
              style="width: 170px"
              v-model="filterValues.content"
              placeholder="请输入内容关键字"
            ></el-input>
          </el-col>

          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>地址：</el-text></div>
            <Category @sendValue="handleAddress" category1="地址" />
          </el-col>
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>职能类别：</el-text></div>
            <Category @sendValue="handleCategory" category1="职能类别" />
          </el-col>
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>学历：</el-text></div>
            <Category @sendValue="handleDegree" category1="学历" />
          </el-col>
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>是否热招：</el-text></div>
            <el-select
              style="width: 170px"
              v-model="filterValues.isHot"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>启用状态：</el-text></div>
            <el-select
              style="width: 170px"
              v-model="filterValues.state"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row v-if="isShowFilter">
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>工作经验：</el-text></div>
            <Category @sendValue="handleExperience" category1="工作经验" />
          </el-col>
          <el-col :span="3">
            <div style="margin-bottom: 10px"><el-text>公司：</el-text></div>
            <Category @sendValue="handleCompany" category1="公司" />
          </el-col>
        </el-row>
        <el-row justify="end" :gutter="10">
          <el-col :span="1.5">
            <AuthBtn
              :text="false"
              @click="handleChangePage(false)"
              content="新增"
              name="recruitmentAuth"
              perm="CREATE"
              type="primary"
            >
            </AuthBtn>
          </el-col>
          <el-col :span="1.5">
            <AuthBtn
              :text="false"
              @click="handleGetList"
              content="查询"
              icon="search"
              type="primary"
              name="recruitmentAuth"
              perm="READ"
            >
            </AuthBtn>
          </el-col>
          <el-col :span="1.5">
            <AuthBtn
              :disabled="selectNum <= 1"
              :text="false"
              @click="handleDelete()"
              type="danger"
              content="批量删除"
              name="recruitmentAuth"
              perm="DELETES"
            >
            </AuthBtn>
          </el-col>
          <el-col :span="1.5">
            <el-button
              @click="handleIsShowFilter"
              :icon="isShowFilter ? 'Hide' : 'View'"
              type="primary"
              >{{ isShowFilter ? '隐藏过滤' : '显示过滤' }}</el-button
            ></el-col
          >
        </el-row>
      </template>
      <RecruitmentList
        ref="RecruitmentListRef"
        @selectedChange="handleSelectedChange"
        @re-search="handleGetList"
        @updateRecruitment="handleUpdate"
      />
      <el-row style="margin-top: 2px">
        <el-col :offset="9" :span="12">
          <el-pagination
            v-model:current-page="filterValues.page"
            v-model:page-size="filterValues.limit"
            :page-sizes="[5, 10, 15, 20, 99]"
            layout=" prev, pager, next, jumper,sizes,total,"
            :total="adminRecruitmentStore.totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
  <div v-else>
    <Edit :recruitment="recruitment" @changePage="handleChangePage" />
  </div>
</template>

<style scoped></style>
