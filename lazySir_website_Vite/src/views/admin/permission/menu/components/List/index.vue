<template>
  <!-- <div v-if="hasPermission(userStore.buttons.Menu.perm, 'READ')"> -->
  <AuthBtn
    :text="false"
    name="menuPermission"
    perm="CREATE"
    content="新增菜单"
    @click="addOrUpdate()"
    type="primary"
  >
  </AuthBtn>
  <AuthBtn
    :text="false"
    content="批量删除"
    perm="DELETES"
    name="menuPermission"
    @click="handleRemoveMenus()"
    :disabled="selectable.length == 0"
    type="danger"
  ></AuthBtn>
  <!-- 配置栏 -->
  <span class="radioLayout">
    <el-radio-group v-model="tableLayout">
      <el-radio-button value="fixed">均衡</el-radio-button>
      <el-radio-button value="auto">自适应</el-radio-button>
    </el-radio-group>
  </span>

  <span class="radioLayout">
    <el-radio-group v-model="buttonLayout">
      <el-radio-button :value="false">正方形</el-radio-button>
      <el-radio-button :value="true">圆形</el-radio-button>
    </el-radio-group>
  </span>
  <el-table
    highlight-current-row
    ref="multipleTableRef"
    @selection-change="handleSelectionChange"
    :data="filterTableData"
    style="width: 100%; margin-bottom: 20px"
    stripe
    :table-layout="(tableLayout as any)"
    row-key="path"
    :border="Border"
  >
    <el-table-column width="60" />
    <el-table-column type="selection" />

    <el-table-column width="83" align="center" label="路由图标">
      <template #default="scope">
        <el-tag>
          <IconifyIcon :name="scope.row.meta.icon"></IconifyIcon>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip align="center" label="路由名称">
      <template #default="scope">
        <el-tag>
          <span>{{ scope.row.meta.title }}</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip align="center" label="路由值">
      <template #default="scope">
        <el-tag>
          <span>{{ scope.row.name }}</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip align="center" label="路径">
      <template #default="scope">
        <el-tag>
          <span>{{ scope.row.path }}</span>
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column
      show-overflow-tooltip
      min-width="83"
      align="center"
      prop="sortOrder"
      label="启用状态"
    >
      <template #default="scope">
        <el-tag :type="scope.row.meta.state ? 'success' : 'danger'">
          <span>{{ scope.row.meta.state ? '启用' : '禁用' }}</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      width="83"
      align="center"
      sortable
      prop="sortOrder"
      text="center"
      label="排序值"
    >
      <template #default="scope">
        <el-tag type="info">
          <span>{{ scope.row.meta.sortOrder }}</span>
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      sortable
      prop="updateDate"
      label="创建时间"
    >
      <template #default="scope">
        <el-tag type="warning">
          <span>{{ scope.row.meta.createdDate }}</span>
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column
      show-overflow-tooltip
      align="center"
      sortable
      prop="updateDate"
      label="更新时间"
    >
      <template #default="scope">
        <el-tag type="warning">
          <span>{{ scope.row.meta.updatedDate }}</span>
        </el-tag>
      </template>
    </el-table-column>

    <!-- 搜索 -->
    <el-table-column fixed="right" width="240" min-width="240" align="center">
      <template #header>
        <el-input
          v-model="search"
          size="small"
          placeholder="输入权限名称查找"
        />
      </template>
      <!-- 操作 -->
      <template #default="scope">
        <!-- 按钮模式 -->
        <div>
          <AuthBtn
            type="primary"
            content="新增"
            name="menuPermission"
            perm="CREATE"
            size="small"
            :disabled="scope.row.meta.level > 2"
            @click="addOrUpdate({ ...scope.row }, 'add')"
            :circle="buttonLayout"
          ></AuthBtn>
          <!-- 修改 -->
          <AuthBtn
            type="primary"
            content="修改"
            name="menuPermission"
            perm="UPDATE"
            size="small"
            @click="addOrUpdate(scope.row, 'update')"
            :circle="buttonLayout"
          >
          </AuthBtn>
          <!-- 删除 -->

          <el-popconfirm
            @confirm="deleteMenu(scope.row.meta.menuId)"
            cancel-button-text="取消"
            confirm-button-text="确定"
            :title="`确定删除菜单：${scope.row.meta.title}?`"
          >
            <template #reference>
              <AuthBtn
                type="primary"
                content="删除"
                name="menuPermission"
                perm="DELETE"
                size="small"
                :circle="buttonLayout"
              ></AuthBtn>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- </div> -->
  <!-- <div v-else>
        {{ "没有查询权限" }}
    </div> -->
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminMenuStore } from '@/stores/admin/menu'

const selectable = ref([] as any)
const handleSelectionChange = (val: MenuTypes.Menu[]) => {
  selectable.value = val.map((item: MenuTypes.Menu) => {
    return item.meta.menuId
  })
}
const handleRemoveMenus = async () => {
  await menuStore.deleteMenu([...selectable.value])
}
const menuStore = useAdminMenuStore()
//父级边框
let Border = ref(true)
//表格布局
let tableLayout = ref('fixed')
//按钮形状
let buttonLayout = ref(false)
//子调用父方法
const emits = defineEmits(['showDrawer'])
const addOrUpdate = (row: MenuTypes.Menu | void, type: string | void) => {
  emits('showDrawer', row, type)
}
const deleteMenu = async (menuId: string) => {
  await menuStore.deleteMenu([menuId])
}

onMounted(() => {
  menuStore.getMenuList()
})
//搜索
const search = ref('')
const filterTableData = computed(() =>
  menuStore.menuList.filter(
    (data: MenuTypes.Menu) =>
      !search.value ||
      (data.meta as any).title
        .toLowerCase()
        .includes(search.value.toLowerCase()),
  ),
)
</script>
<style scoped>
.el-table {
  width: 100%;
  margin-top: 10px;
}

h3 {
  font-size: 18.72px;
  font-weight: bold;
  text-align: center;
}

.switchBorder,
.radioLayout {
  margin-left: 10px;
  float: right;
}

.text_btn {
  color: #409eff;
  cursor: pointer;
  padding: 10px;
  transition: all 0.3s ease;
  /* 添加过渡效果 */
}

.text_btn:hover {
  color: rgb(165, 191, 238);
}
</style>
