<template>
  <div class="control">
    <!-- 添加角色 -->
    <div>
      <AuthBtn
        :text="false"
        content="添加角色"
        name="rolePermission"
        perm="CREATE"
        type="primary"
        @click="edit"
        >添加角色
      </AuthBtn>
      <!-- 批量删除角色 -->
      <el-popconfirm
        @confirm="deleteRole()"
        cancel-button-text="取消"
        confirm-button-text="确定"
        title="确定删除?"
      >
        <template #reference>
          <!-- v-show="hasPermission(userStore.buttons.Role.perm, 'DELETE')" -->
          <AuthBtn
            :text="false"
            name="rolePermission"
            content="批量删除"
            perm="DELETES"
            type="danger"
            :disabled="selected.length > 1 ? false : true"
            class="delete"
            >批量删除
          </AuthBtn>
        </template>
      </el-popconfirm>
    </div>

    <el-input
      v-model="search"
      placeholder="请输入角色名称搜索"
      :suffix-IconifyIcons="Search"
      style="border-radius: 400px; margin-left: 30px; width: 200px"
    ></el-input>
  </div>
  <el-table
    :border="true"
    highlight-current-row
    @selection-change="handleSelectionChange"
    :data="filterRoleList"
    style="width: 100%"
  >
    <el-table-column type="selection" width="40" />
    <el-table-column
      show-overflow-tooltip
      prop="roleName"
      align="center"
      label="名称"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      prop="code"
      align="center"
      label="状态"
      width="83"
    >
      <template #default="scope">
        <el-tag :type="scope.row.state ? 'success' : 'danger'">{{
          scope.row.state ? '启用' : '禁用'
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="description"
      align="center"
      label="备注"
      show-overflow-tooltip
    >
    </el-table-column>

    <el-table-column
      show-overflow-tooltip
      align="center"
      sortable
      prop="updateDate"
      label="更新时间"
      width="165"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="updateUsername"
      label="更新人"
      width="165"
    >
    </el-table-column>

    <el-table-column fixed="right" align="center" label="操作">
      <template #default="scope">
        <AuthBtn
          type="primary"
          content="菜单"
          name="rolePermission"
          perm="UPDATE"
          @click="edit(scope.row, 'menu')"
          size="small"
          icon="lock"
        >
        </AuthBtn>
        <AuthBtn
          type="primary"
          content="接口"
          name="rolePermission"
          perm="UPDATE"
          @click="edit(scope.row, 'api')"
          size="small"
          icon="lock"
        >
        </AuthBtn>
        <AuthBtn
          type="primary"
          content="编辑"
          name="rolePermission"
          perm="UPDATE"
          @click="edit(scope.row, 'edit')"
          size="small"
        >
        </AuthBtn>

        <el-popconfirm
          @confirm="deleteRole(scope.row.roleId)"
          cancel-button-text="取消"
          confirm-button-text="确定"
          title="确定删除?"
        >
          <template #reference>
            <AuthBtn
              type="primary"
              content="删除"
              name="rolePermission"
              perm="DELETE"
              size="small"
            >
            </AuthBtn>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="adminRoleStore.PageAndSize.page"
      v-model:page-size="adminRoleStore.PageAndSize.limit"
      :page-sizes="[3, 5, 7, 10]"
      layout=" prev, pager, next, jumper,sizes,total,"
      :total="adminRoleStore.PageAndSize.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useAdminRoleStore } from '@/stores/admin/role'
import { ref, onMounted, computed } from 'vue'
const adminRoleStore = useAdminRoleStore()
const selected = ref<String[]>([])
//搜索的内容
let search = ref('')
//将被选择的行的数据存储在selected中
const handleSelectionChange = (val: RoleTypes.Role[]) => {
  selected.value = val.map((item: RoleTypes.Role) => {
    return item.roleId as string
  })
}
// //删除角色
const deleteRole = async (val: string | void) => {
  // 判断是否是数字
  if (typeof val === 'string') {
    // 清空 selected.value
    selected.value = []
    selected.value.push(val)
  }
  await adminRoleStore.deleteRole(selected.value as any)
}

//获取角色列表
onMounted(() => {
  getData()
})
const getData = async () => {
  await adminRoleStore.getRoleList()
}
//搜索
const filterRoleList = computed(() => {
  return adminRoleStore.roleList.filter(
    (data: RoleTypes.Role) =>
      !search.value ||
      data.roleName.toLowerCase().includes(search.value.toLowerCase()),
  )
})
//子调用父方法
const emits = defineEmits(['showDrawer'])
//添加和编辑 ---> 打开抽屉
const edit = (val: RoleTypes.Role | any, type: string) => {
  emits('showDrawer', val, type)
}
const handleSizeChange = async () => {
  await adminRoleStore.getRoleList()
}
const handleCurrentChange = async () => {
  await adminRoleStore.getRoleList()
}
defineExpose({
  getData,
})
</script>
<style scoped>
.el-table {
  margin-top: 10px;
}

p {
  float: left;
  font-size: 17px;
  margin-left: 15px;
  cursor: pointer;
}

p:hover {
  background-color: rgba(124, 123, 123, 0.726);
}

.parentBorder {
  float: right;
}

.delete {
  margin-left: 10px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.control {
  display: flex;
  justify-content: space-between;
}

.demo-pagination-block {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
