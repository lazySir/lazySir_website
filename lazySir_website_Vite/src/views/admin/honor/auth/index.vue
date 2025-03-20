<script setup lang="ts">
import HonorList from '@/views/admin/honor/list.vue'
import { useAdminHonorStore } from '@/stores/admin/honor'
import { ref, onMounted } from 'vue'
import Category from '@/components/admin/category.vue'
const adminHonorStore = useAdminHonorStore()
//搜索的过滤条件
const filterSearch = ref({
  limit: 10,
  page: 1,
} as AdminHonorTypes.getHonor)
//获取荣誉列表
const getHonorList = async () => {
  await adminHonorStore.getHonorList(filterSearch.value)
}
onMounted(async () => {
  await getHonorList()
})
//过滤条件：当limit发生改变时
const handleSizeChange = (val: number) => {
  filterSearch.value.limit = val
  getHonorList()
}
//过滤条件：当page发生改变时
const handleCurrentChange = (val: number) => {
  filterSearch.value.page = val
  getHonorList()
}
//荣誉列表组件实例
const honorListRef = ref()
//添加荣誉的执行函数
const handleAddHonor = () => {
  honorListRef.value.handleChangeHonorDialogVisible()
}

//是否显示过滤条件
const isShowFilter = ref(true)
const handleIsShowFilter = () => {
  isShowFilter.value = !isShowFilter.value
}
//当多选时
const selectedList = ref([] as Array<string>)
const handleSelectedChange = (val: Array<string>) => {
  selectedList.value = val
}
//删除多个荣誉
const handleDeleteHonor = async () => {
  await honorListRef.value.handleDelete(selectedList.value)
}
//过滤条件：当公司发生改变时
const handleCompany = (val: string) => {
  filterSearch.value.companyId = val
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <el-row v-if="isShowFilter" :gutter="10">
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>荣誉名称：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.name"
            style="width: 170px"
            placeholder="请输入荣誉名称"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>荣誉描述：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.description"
            style="width: 170px"
            placeholder="请输入荣誉描述"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>启用状态：</el-text></div>
          <el-select
            clearable
            v-model="filterSearch.state"
            placeholder="请选择启用状态"
            style="width: 170px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px"><el-text>公司：</el-text></div>
          <Category @sendValue="handleCompany" category1="公司" />
        </el-col>
        <el-col :span="3">
          <div style="margin-bottom: 10px">
            <el-text>获得时间起始值：</el-text>
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
            <el-text>获得时间截止值：</el-text>
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
            @click="handleAddHonor"
            type="primary"
            content="新增"
            name="adminHonorAuth"
            perm="CREATE"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            @click="getHonorList"
            icon="search"
            type="primary"
            content="查询"
            name="adminHonorAuth"
            perm="READ"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            :disabled="selectedList.length < 1"
            @click="handleDeleteHonor"
            type="danger"
            content="批量删除"
            name="adminHonorAuth"
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
          >
        </el-col>
      </el-row>
    </template>
    <HonorList
      @selected-change="handleSelectedChange"
      ref="honorListRef"
      @re-search="getHonorList"
    />
    <el-row style="margin-top: 3px" :gutter="10">
      <el-col :offset="8" :span="10">
        <el-pagination
          v-model:current-page="filterSearch.page"
          v-model:page-size="filterSearch.limit"
          :page-sizes="[5, 10, 15, 20, 25, 999]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="adminHonorStore.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      /></el-col>
    </el-row>
  </el-card>
</template>

<style scoped></style>
