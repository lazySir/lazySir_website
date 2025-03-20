<template>
  <el-scrollbar>
    <div class="sysDictionaryContainer">
      <!-- 一级字典 -->
      <div class="wrapper">
        <div class="header">
          <div>
            <AuthBtn
              :text="false"
              @click="addOrUpdateSysDictionary('add')"
              content="新增"
              name="systemDictionaryAuth"
              perm="CREATE"
              size="default"
              type="primary"
            >
            </AuthBtn>
            <AuthBtn
              :text="false"
              :disabled="dictionaryIds1.length < 1"
              @click="deleteBtn(dictionaryIds1, 1)"
              content="批量删除"
              name="systemDictionaryAuth"
              perm="DELETES"
              size="default"
              type="danger"
            >
            </AuthBtn>
          </div>

          <div>
            <el-input
              :suffix-icon="Search"
              style="width: 200px"
              v-model="search1"
              placeholder="请输入名称查找"
            >
            </el-input>
            <AuthBtn
              :text="false"
              @click="searchData(1)"
              content="搜索"
              icon="search"
              name="systemDictionaryAuth"
              perm="READ"
              size="default"
            >
            </AuthBtn>
          </div>
        </div>

        <el-table
          ref="tableRef"
          @selection-change="handleSelectChange1"
          highlight-current-row
          @row-click="getChildData"
          row-key="date"
          :data="sysDictionaryStore.sysDictionary1"
          border
          height=" 475"
          style="width: 600px"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            width="auto"
            show-overflow-tooltip
            align="center"
            prop="key"
            label="英文名称"
          />
          <el-table-column
            width="auto"
            align="center"
            show-overflow-tooltip
            prop="value"
            label="名称"
          />

          <el-table-column
            width="83"
            prop="state"
            align="center"
            label="状态"
            :filters="[
              { text: '启用', value: true },
              { text: '禁用', value: false },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.state === false ? 'danger' : 'success'"
                disable-transitions
                >{{ scope.row.state ? '启用' : '禁用' }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column width="240" align="center" label="操作">
            <template #default="scope">
              <AuthBtn
                type="primary"
                @click="addOrUpdateSysDictionary('add', scope.row)"
                content="新增"
                name="systemDictionaryAuth"
                perm="CREATE"
                size="small"
              >
              </AuthBtn>

              <AuthBtn
                type="primary"
                @click="addOrUpdateSysDictionary('update', scope.row)"
                content="修改"
                name="systemDictionaryAuth"
                perm="UPDATE"
                size="small"
              >
              </AuthBtn>
              <AuthBtn
                type="primary"
                @click="deleteBtn([scope.row.dictionaryId], 1)"
                content="删除"
                name="systemDictionaryAuth"
                perm="DELETE"
                size="small"
              >
              </AuthBtn>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          class="pagination"
          v-model:current-page="page1"
          v-model:page-size="limit1"
          :page-sizes="[10, 15, 20, 30, 999]"
          size="small"
          layout=" prev, pager, next,sizes,total"
          :total="sysDictionaryStore.totalCount1"
        />
      </div>
      <!-- 二级字典 -->
      <div
        v-if="
          sysDictionaryStore.sysDictionary2.length > 0 ||
          search2 ||
          selectedRow1
        "
        class="wrapper"
      >
        <div class="header">
          <AuthBtn
            :text="false"
            :disabled="dictionaryIds2.length < 1"
            @click="deleteBtn(dictionaryIds2, 2)"
            content="批量删除"
            name="systemDictionaryAuth"
            perm="DELETES"
            size="default"
            type="danger"
          >
          </AuthBtn>

          <div>
            <el-input
              :suffix-icon="Search"
              style="width: 200px"
              v-model="search2"
              placeholder="请输入名称查找"
            >
            </el-input>
            <AuthBtn
              :text="false"
              @click="searchData(2)"
              content="搜索"
              icon="search"
              name="systemDictionaryAuth"
              perm="READ"
              size="default"
            >
            </AuthBtn>
          </div>
        </div>

        <el-table
          @selection-change="handleSelectChange2"
          ref="tableRef"
          @row-click="getChildData"
          highlight-current-row
          row-key="date"
          :data="sysDictionaryStore.sysDictionary2"
          border
          height=" 475"
          style="width: 600px"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="key"
            label="英文名称"
          />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="value"
            label="名称"
          />

          <el-table-column
            width="83"
            align="center"
            prop="state"
            label="状态"
            :filters="[
              { text: '启用', value: true },
              { text: '禁用', value: false },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.state === false ? 'danger' : 'success'"
                disable-transitions
                >{{ scope.row.state ? '启用' : '禁用' }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            min-width="240"
            width="240"
          >
            <template #default="scope">
              <AuthBtn
                type="primary"
                @click="addOrUpdateSysDictionary('add', scope.row)"
                content="新增"
                name="systemDictionaryAuth"
                perm="CREATE"
                size="small"
              >
              </AuthBtn>

              <AuthBtn
                type="primary"
                @click="addOrUpdateSysDictionary('update', scope.row)"
                content="修改"
                name="systemDictionaryAuth"
                perm="UPDATE"
                size="small"
              >
              </AuthBtn>
              <AuthBtn
                type="primary"
                @click="deleteBtn([scope.row.dictionaryId], 2)"
                content="删除"
                name="systemDictionaryAuth"
                perm="DELETE"
                size="small"
              >
              </AuthBtn>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          class="pagination"
          v-model:current-page="page2"
          v-model:page-size="limit2"
          :page-sizes="[10, 15, 20, 30, 999]"
          size="small"
          layout=" prev, pager, next,sizes,total"
          :total="sysDictionaryStore.totalCount2"
        />
      </div>
      <!-- 三级字典 -->
      <div
        v-if="
          sysDictionaryStore.sysDictionary3.length > 0 ||
          search3 ||
          selectedRow2
        "
        class="wrapper"
      >
        <div class="header">
          <AuthBtn
            :text="false"
            :disabled="dictionaryIds3.length < 1"
            @click="deleteBtn(dictionaryIds3, 3)"
            content="批量删除"
            name="systemDictionaryAuth"
            perm="DELETES"
            size="default"
            type="danger"
          >
          </AuthBtn>
          <div>
            <el-input
              :suffix-icon="Search"
              style="width: 200px"
              v-model="search3"
              placeholder="请输入名称查找"
            >
            </el-input>
            <AuthBtn
              :text="false"
              @click="searchData(3)"
              content="搜索"
              icon="search"
              name="systemDictionaryAuth"
              perm="READ"
              size="default"
            >
            </AuthBtn>
          </div>
        </div>

        <el-table
          highlight-current-row
          @row-click="getChildData"
          ref="tableRef"
          row-key="date"
          :data="sysDictionaryStore.sysDictionary3"
          border
          height="475"
          style="width: 600px"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="key"
            label="英文名称"
          />
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="value"
            label="名称"
          />

          <el-table-column
            width="83"
            align="center"
            prop="state"
            label="状态"
            :filters="[
              { text: '启用', value: true },
              { text: '禁用', value: false },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.state === false ? 'danger' : 'success'"
                disable-transitions
                >{{ scope.row.state ? '启用' : '禁用' }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <AuthBtn
                type="primary"
                @click="addOrUpdateSysDictionary('update', scope.row)"
                content="修改"
                name="systemDictionaryAuth"
                perm="UPDATE"
                size="small"
              >
              </AuthBtn>
              <AuthBtn
                type="primary"
                @click="deleteBtn([scope.row.dictionaryId], 3)"
                content="删除"
                name="systemDictionaryAuth"
                perm="DELETE"
                size="small"
              >
              </AuthBtn>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange3"
          @current-change="handleCurrentChange3"
          class="pagination"
          v-model:current-page="page3"
          v-model:page-size="limit3"
          :page-sizes="[10, 15, 20, 30, 999]"
          size="small"
          layout=" prev, pager, next,sizes,total"
          :total="sysDictionaryStore.totalCount3"
        />
      </div>
    </div>
  </el-scrollbar>
  <!-- 弹出框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500" draggable>
    <el-form
      :model="editSysDictionary"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item label="英文名称">
        <el-input v-model="editSysDictionary.key" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="editSysDictionary.value" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="editSysDictionary.state"
          class="ml-2"
          style="--el-switch-on-color: #13ce66"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="editSysDictionary.description" />
      </el-form-item>
      <el-form-item label="级别">
        <el-input disabled v-model="editSysDictionary.level" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="confirm()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import type { TableInstance } from 'element-plus'
import { useSysDictionaryStore } from '@/stores/admin/sysDictionary'
import { Search } from '@element-plus/icons-vue'
import { useAdminGlobalStore } from '@/stores/admin/global'
const adminGlobalStore = useAdminGlobalStore()
const sysDictionaryStore = useSysDictionaryStore()
const page1 = ref(1)
const limit1 = ref(10)
const search1 = ref('')
const page2 = ref(1)
const limit2 = ref(10)
const search2 = ref('')
const page3 = ref(1)
const limit3 = ref(10)
const search3 = ref('')
//当前编辑的字典
const editSysDictionary = ref({} as sysDictionaryTypes.sysDictionary)

onMounted(() => {
  sysDictionaryStore.getSysDictionary({
    page: page1.value,
    limit: limit1.value,
    level: 1,
  })
})
//弹出框
const dialogVisible = ref(false)
//table的实例
const tableRef = ref<TableInstance>()
//过滤状态
const filterTag = (value: boolean, row: sysDictionaryTypes.sysDictionary) => {
  return row.state == value
}
//获取子字典
const getChildData = (value: sysDictionaryTypes.sysDictionary) => {
  if (value.level == 1) {
    selectedRow1.value = value
    selectedRow2.value = null
    selectedRow3.value = null
    sysDictionaryStore.sysDictionary2 = []
    sysDictionaryStore.sysDictionary3 = []
  } else if (value.level == 2) {
    sysDictionaryStore.sysDictionary3 = []
    selectedRow2.value = value
    selectedRow3.value = null
  } else if (value.level === 3) {
    // 点击三级行时，不影响一级和二级的选中行
    selectedRow3.value = value
  }

  getData()
}

const handleSizeChange1 = async (val: number) => {
  limit1.value = val
  const res = await sysDictionaryStore.getSysDictionary({
    page: page1.value,
    limit: limit1.value,
    value: search1.value,
    level: 1,
  })
  if (res) {
    selectedRow2.value = null
    selectedRow3.value = null
    sysDictionaryStore.sysDictionary2 = []
    sysDictionaryStore.sysDictionary3 = []
  }
}
const handleCurrentChange1 = async (val: number) => {
  page1.value = val
  const res = await sysDictionaryStore.getSysDictionary({
    page: page1.value,
    limit: limit1.value,
    value: search1.value,
    level: 1,
  })
  if (res) {
    selectedRow2.value = null
    selectedRow3.value = null
    sysDictionaryStore.sysDictionary2 = []
    sysDictionaryStore.sysDictionary3 = []
  }
}
const handleSizeChange2 = async (val: number) => {
  limit2.value = val
  const res = await sysDictionaryStore.getSysDictionary({
    page: page2.value,
    limit: limit2.value,
    value: search2.value,
    level: 2,
    parentId: selectedRow1.value?.dictionaryId,
  })
  if (res) {
    selectedRow3.value = null
    sysDictionaryStore.sysDictionary3 = []
  }
}
const handleCurrentChange2 = async (val: number) => {
  page2.value = val
  const res = await sysDictionaryStore.getSysDictionary({
    page: page2.value,
    limit: limit2.value,
    value: search2.value,
    level: 2,
    parentId: selectedRow1.value?.dictionaryId,
  })
  if (res) {
    selectedRow3.value = null
    sysDictionaryStore.sysDictionary3 = []
  }
}
const handleSizeChange3 = async (val: number) => {
  limit3.value = val
  await sysDictionaryStore.getSysDictionary({
    page: page3.value,
    limit: limit3.value,
    value: search3.value,
    level: 3,
    parentId: selectedRow2.value?.dictionaryId,
  })
}
const handleCurrentChange3 = async (val: number) => {
  page3.value = val
  await sysDictionaryStore.getSysDictionary({
    page: page3.value,
    limit: limit3.value,
    value: search3.value,
    level: 3,
    parentId: selectedRow2.value?.dictionaryId,
  })
}
//弹出框取消按钮
const cancel = () => {
  dialogVisible.value = false
  editSysDictionary.value = {} as sysDictionaryTypes.sysDictionary
}
//弹出框确认按钮
const confirm = async () => {
  const flag = await sysDictionaryStore.addOrUpdateSysDictionary(
    editSysDictionary.value,
  )
  if (flag) {
    if (editSysDictionary.value.level == 1) {
      sysDictionaryStore.getSysDictionary({
        page: page1.value,
        limit: limit1.value,
        value: search1.value,
        level: 1,
      })
    } else if (editSysDictionary.value.level == 2) {
      sysDictionaryStore.getSysDictionary({
        page: page2.value,
        limit: limit2.value,
        value: search2.value,
        level: 2,
        parentId: editSysDictionary.value.parentId,
      })
    } else {
      sysDictionaryStore.getSysDictionary({
        page: page3.value,
        limit: limit3.value,
        value: search3.value,
        level: 3,
        parentId: editSysDictionary.value.parentId,
      })
    }
    cancel()
  }
}
//点击的时候高亮显示
const selectedRow1 = ref<sysDictionaryTypes.sysDictionary | null>(null)
const selectedRow2 = ref<sysDictionaryTypes.sysDictionary | null>(null)
const selectedRow3 = ref<sysDictionaryTypes.sysDictionary | null>(null)

//新增或修改系统字典
const addOrUpdateSysDictionary = (
  key: string,
  value?: sysDictionaryTypes.sysDictionary,
) => {
  editSysDictionary.value = {} as sysDictionaryTypes.sysDictionary
  dialogVisible.value = true
  if (key == 'add') {
    editSysDictionary.value.state = true
    //如果有东西传入说明添加的不是第一级
    if (value) {
      editSysDictionary.value.parentId = value.dictionaryId
      if (value.dictionaryId) {
        editSysDictionary.value.level = value.level + 1
      }
    } else {
      editSysDictionary.value.level = 1
    }
  } else {
    editSysDictionary.value = JSON.parse(
      JSON.stringify(value),
    ) as sysDictionaryTypes.sysDictionary
  }
}
//选中table-item 发请求获取子菜单
const getData = () => {
  if (selectedRow3.value) {
    return
  } else if (selectedRow2.value) {
    sysDictionaryStore.getSysDictionary({
      page: page3.value,
      limit: limit3.value,
      value: search3.value,
      level: 3,
      parentId: selectedRow2.value.dictionaryId,
    })
  } else if (selectedRow1.value) {
    sysDictionaryStore.getSysDictionary({
      page: page2.value,
      limit: limit2.value,
      value: search2.value,
      level: 2,
      parentId: selectedRow1.value.dictionaryId,
    })
  }
}
//搜索功能
const searchData = (value: number) => {
  if (value === 1) {
    sysDictionaryStore.getSysDictionary({
      page: 1,
      limit: limit1.value,
      value: search1.value,
      level: 1,
    })
    sysDictionaryStore.sysDictionary2 = []
    sysDictionaryStore.sysDictionary3 = []
    selectedRow1.value = null
    selectedRow2.value = null
    selectedRow3.value = null
    search2.value = ''
    search3.value = ''
  } else if (value === 2) {
    sysDictionaryStore.getSysDictionary({
      page: 1,
      limit: limit2.value,
      value: search2.value,
      level: 2,
      parentId: selectedRow1.value?.dictionaryId,
    })
    sysDictionaryStore.sysDictionary3 = []
    selectedRow2.value = null
    selectedRow3.value = null
    search3.value = ''
  } else {
    sysDictionaryStore.getSysDictionary({
      page: 1,
      limit: limit3.value,
      value: search3.value,
      level: 3,
      parentId: selectedRow2.value?.dictionaryId,
    })
  }
}

//删除系统字典
const deleteBtn = async (dictionaryIds: string[], level: number) => {
  const flag = await sysDictionaryStore.deleteSysDictionary(dictionaryIds)
  if (flag) {
    if (level === 1) {
      sysDictionaryStore.getSysDictionary({
        page: page1.value,
        limit: limit1.value,
        level: 1,
      })
    } else if (level == 2) {
      sysDictionaryStore.getSysDictionary({
        page: page2.value,
        limit: limit2.value,
        value: search2.value,
        level: 2,
        parentId: selectedRow1.value ? selectedRow1.value.dictionaryId : '',
      })
    } else if (level == 3) {
      sysDictionaryStore.getSysDictionary({
        page: page3.value,
        limit: limit3.value,
        value: search3.value,
        level: 3,
        parentId: selectedRow2.value ? selectedRow2.value.dictionaryId : '',
      })
    }
  }
}
//计算弹出框的标题
const dialogTitle = computed(() => {
  return editSysDictionary.value.dictionaryId
    ? `修改系统字典:${editSysDictionary.value.value}`
    : '新增系统字典'
})
//存储要批量删除的系统字典项
const dictionaryIds1 = ref([] as string[])
const handleSelectChange1 = (val: sysDictionaryTypes.sysDictionary[]) => {
  dictionaryIds1.value = val.map((item) => item.dictionaryId)
}
const dictionaryIds2 = ref([] as string[])
const handleSelectChange2 = (val: sysDictionaryTypes.sysDictionary[]) => {
  dictionaryIds2.value = val.map((item) => item.dictionaryId)
}
const dictionaryIds3 = ref([] as string[])
const handleSelectChange3 = (val: sysDictionaryTypes.sysDictionary[]) => {
  dictionaryIds3.value = val.map((item) => item.dictionaryId)
}
</script>
<style scoped>
.sysDictionaryContainer {
  display: flex;
}

.wrapper {
  /* width: 100%; */
  margin: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.dialogItem {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

:deep(.el-table .dark-row) {
  --hight-light-color: rgb(148.6, 212.3, 117.1);
  --el-table-tr-bg-color: var(--hight-light-color);
}

:deep(.el-table .light-row) {
  --hight-light-color: #2c4d39;
  --el-table-tr-bg-color: var(--hight-light-color);
}
</style>
