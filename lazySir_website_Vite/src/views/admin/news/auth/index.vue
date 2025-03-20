<script setup lang="ts">
import List from '@/views/admin/news/list.vue'
import Edit from '@/views/admin/news/edit.vue'

import { useAdminNewsStore } from '@/stores/admin/news'
const adminNewsStore = useAdminNewsStore()
import { ref, onMounted } from 'vue'
//是否显示过滤内容
const isShowFilter = ref(true)
//根据过滤信息：获取新闻咨询列表
const search = async () => {
  await adminNewsStore.getNewsList(filterSearch.value)
}
//活跃时发送获取信息列表请求
onMounted(() => {
  search()
})
//是否是编辑页面
const isEdit = ref(false)
//修改编辑页面
const handleIsEdit = () => {
  isEdit.value = !isEdit.value
  //如果不是在编辑页面重新发送获取请求
  if (isEdit.value === false) {
    search()
  }
}
//是否显示筛选条件
const handleIsShowFilter = () => {
  filterSearch.value = {
    limit: 10,
    page: 1,
  } as adminNewsTypes.getNews
  isShowFilter.value = !isShowFilter.value
}
//目前编辑的新闻
const editInfo = ref({} as adminNewsTypes.addorUpdateNews)
const handleUpdate = (val: adminNewsTypes.addorUpdateNews) => {
  editInfo.value = {} as adminNewsTypes.addorUpdateNews
  editInfo.value = val
  handleIsEdit()
}
//要筛选的信息条件
const filterSearch = ref({
  limit: 10,
  page: 1,
} as adminNewsTypes.getNews)
//新闻table的实例
const newsListRef = ref()
//批量删除函数
const handleDeleteAll = async () => {
  const res = await newsListRef.value.handleDeleteAll()

  if (res) {
    await search()
  }
}
//批量删除的个数
const selectedCount = ref(0)
//获取当前选中元素个数
const handleSelectedCount = (val: number) => {
  selectedCount.value = val
}
//过滤条件：当热搜词改变时
const handleHotWord = (val: string) => {
  filterSearch.value.hotSearchWordIds = val
}
//过滤条件：当公司改变时
const handleCompany = (val: string) => {
  filterSearch.value.companyId = val
}
//过滤条件：当每页的页数改变时
const handleSizeChange = async (val: number) => {
  filterSearch.value.limit = val
  await search()
}
//过滤条件：当当前页数改变时
const handleCurrentChange = async (val: number) => {
  filterSearch.value.page = val
  await search()
}
</script>

<template>
  <el-card v-if="!isEdit">
    <template #header>
      <el-row v-if="isShowFilter" :gutter="10">
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>标题：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.title"
            style="width: 170px"
            placeholder="请输入新闻标题"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>发布者：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.nickName"
            style="width: 170px"
            placeholder="请输入发布者名称"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>内容关键字：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.content"
            style="width: 170px"
            placeholder="请输入关键字"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>启用状态：</el-text></div>
          <el-select
            v-model="filterSearch.state"
            placeholder="请选择启用状态"
            style="width: 170px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>热搜词：</el-text></div>
          <Category @sendValue="handleHotWord" category1="热搜词" />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>公司：</el-text></div>
          <Category @sendValue="handleCompany" category1="公司" />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>点击量最小值：</el-text>
          </div>
          <el-input
            clearable
            v-model="filterSearch.hitsFrom"
            style="width: 170px"
            placeholder="请输入最小值"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>点击量最大值：</el-text>
          </div>
          <el-input
            clearable
            v-model="filterSearch.hitsTo"
            style="width: 170px"
            placeholder="请输入最大值"
          ></el-input>
        </el-col>
      </el-row>
      <el-row v-if="isShowFilter" :gutter="10">
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>创建时间起始值：</el-text>
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
            <el-text>创建时间截止值：</el-text>
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
            <el-text>更新时间截止值：</el-text>
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
            @click="handleUpdate"
            type="primary"
            content="新增"
            name="adminNewsAuth"
            perm="CREATE"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="search"
            icon="Search"
            type="primary"
            content="查询"
            name="adminNewsAuth"
            perm="READ"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            :disabled="selectedCount < 1"
            @click="handleDeleteAll"
            type="danger"
            content="批量删除"
            name="adminNewsAuth"
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
    <List
      @update:selected-count="handleSelectedCount"
      @reSearch="search"
      ref="newsListRef"
      @update:newsInfo="handleUpdate"
    />
    <el-row style="margin-top: 2px">
      <el-col :offset="9" :span="12">
        <el-pagination
          v-model:current-page="filterSearch.page"
          v-model:page-size="filterSearch.limit"
          :page-sizes="[5, 10, 20, 99]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="adminNewsStore.totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      /></el-col>
    </el-row>
  </el-card>
  <Edit
    @reSearch="search"
    @chang-page="handleIsEdit"
    :news-info="editInfo"
    v-else
  />
</template>

<style scoped></style>
