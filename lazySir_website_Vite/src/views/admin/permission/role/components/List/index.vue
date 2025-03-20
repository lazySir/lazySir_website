<template>
  <!-- <div v-if="hasPermission(userStore.buttons.Role.perm, 'READ')"> -->
  <div class="control">
    <!-- 添加角色 -->
    <!-- v-show="hasPermission(userStore.buttons.Role.perm, 'CREATE')" -->
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

    <!-- 分页控制 -->

    <el-radio-group v-model="small">
      <el-radio-button :value="false">默认</el-radio-button>
      <el-radio-button :value="true">小</el-radio-button>
    </el-radio-group>
    <div>
      背景:
      <el-switch v-model="background" class="ml-2" />
    </div>
    <div class="ml-4">
      禁用分页: <el-switch v-model="disabled" class="ml-2" />
    </div>
    <span class="isShowBorder"
      >显示边框: <el-switch v-model="isShowBorder"
    /></span>
    <el-input
      v-model="search"
      placeholder="请输入角色名称搜索"
      :suffix-IconifyIcons="Search"
      style="border-radius: 400px; margin-left: 30px; width: 200px"
    ></el-input>
  </div>
  <el-table
    highlight-current-row
    @selection-change="handleSelectionChange"
    :border="isShowBorder"
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
      prop="createDate"
      label="创建时间"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="createUsername"
      label="创建人"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      sortable
      prop="updateDate"
      label="更新时间"
      min-width="165"
    >
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      align="center"
      prop="updateUsername"
      label="更新人"
      min-width="165"
    >
    </el-table-column>

    <el-table-column
      fixed="right"
      align="center"
      label="操作"
      width="230"
      min-width="230"
    >
      <template #default="scope">
        <AuthBtn
          type="primary"
          content="权限"
          name="rolePermission"
          perm="UPDATE"
          @click="edit(scope.row, 'auth')"
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
      :small="small"
      :disabled="disabled"
      :background="background"
      layout=" prev, pager, next, jumper,sizes,total,"
      :total="adminRoleStore.PageAndSize.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- </div> -->
  <!-- <div v-else>
      {{ "没有查询权限" }}
    </div> -->
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useAdminRoleStore } from '@/stores/admin/role'
import { ref, onMounted, computed } from 'vue'
const adminRoleStore = useAdminRoleStore()
//是否显示边框
const isShowBorder = ref(true)
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

const small = ref(false)
const background = ref(false)
const disabled = ref(false)
//获取角色列表
onMounted(() => {
  adminRoleStore.getRoleList()
})
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
