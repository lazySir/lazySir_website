<script setup lang="ts">
import { onMounted, ref, provide, watch } from 'vue'
import List from '@/views/admin/announcement/list.vue'
import Edit from '@/views/admin/announcement/edit.vue'
import { useAdminAnnouncementStore } from '@/stores/admin/announcement'
const adminAnnouncementStore = useAdminAnnouncementStore()
//过滤list搜索条件
const filterSearch = ref({} as AnnouncementTypes.getAnnouncements)
//获取公告列表
const getList = async () => {
  await adminAnnouncementStore.getAnnouncementList(filterSearch.value)
}
//当页面加载时，搜索公告列表
onMounted(async () => {
  await getList()
})
const announcement = ref({} as AnnouncementTypes.announcement)
//是否是编辑页面
const isEdit = ref(false)
//更换页面
const changePage = async (val: boolean) => {
  isEdit.value = val
  if (isEdit.value == false) {
    await getList()
  }
}
//过滤条件：当公司改变时
const handleCompany = (val: string) => {
  filterSearch.value.companyId = val
}
//是否展示搜索过滤内容
const isShowFilter = ref(true)
const handleIsShowFilter = () => {
  filterSearch.value = {
    limit: 10,
    page: 1,
  } as AnnouncementTypes.getAnnouncements
  isShowFilter.value = !isShowFilter.value
}
//过滤条件：当每页的页数改变时
const handleSizeChange = async (val: number) => {
  filterSearch.value.limit = val
  await getList()
}
//过滤条件：当当前页数改变时
const handleCurrentChange = async (val: number) => {
  filterSearch.value.page = val
  await getList()
}
//新增或修改公告
const handleEdit = async (val: AnnouncementTypes.announcement) => {
  announcement.value = val
  changePage(true)
}
const selected = ref<String[]>([])
//当选中发生改变时
const handleSelect = (val: Array<String>) => {
  selected.value = val
}
//列表实例
const ListRef = ref()
const handleDeleteAll = async () => {
  await ListRef.value.handleDelete(selected.value)
}
provide(/* 注入名 */ 'announcement', /* 值 */ announcement)
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
          <div style="margin-bottom: 10px"><el-text>更新人：</el-text></div>
          <el-input
            clearable
            v-model="filterSearch.updateNickName"
            style="width: 170px"
            placeholder="请输入更新人名称"
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
            @click="handleEdit"
            type="primary"
            content="新增"
            name="adminAnnouncementAuth"
            perm="CREATE"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            icon="search"
            @click="getList"
            type="primary"
            content="查询"
            name="adminAnnouncementAuth"
            perm="READ"
          >
          </AuthBtn>
        </el-col>
        <el-col :span="1.5">
          <AuthBtn
            :text="false"
            :disabled="selected.length < 1"
            @click="handleDeleteAll"
            type="danger"
            content="批量删除"
            name="adminAnnouncementAuth"
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
      @emits_select="handleSelect"
      @emits_get="getList"
      @emits_edit="handleEdit"
      ref="ListRef"
      v-if="!isEdit"
    />
    <el-row style="margin-top: 2px">
      <el-col :offset="9" :span="12">
        <el-pagination
          v-model:current-page="filterSearch.page"
          v-model:page-size="filterSearch.limit"
          :page-sizes="[5, 10, 20, 99]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="adminAnnouncementStore.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      /></el-col>
    </el-row>
  </el-card>
  <Edit @emits_changePage="changePage" v-else />
</template>

<style scoped></style>
