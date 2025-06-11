<template>
  <el-drawer
    :before-close="handleClose"
    v-model="drawer"
    :title="role.roleName + '：更新接口权限'"
    size="25%"
  >
    <!-- 整体内容 -->
    <el-scrollbar>
      <div class="drawer_content">
        <!-- 树形结构 -->
        <!-- 全选 / 反选 按钮 -->
        <div class="cursor-pointer flex justify-end gap-2 mb-2">
          <el-text @click="checkAll" type="primary">全选</el-text>
          <el-text @click="inverseCheck" type="primary">反选</el-text>
        </div>
        <el-tree
          ref="treeRef"
          :data="adminApiStore.groupedApis"
          show-checkbox
          node-key="apiId"
          :props="defaultProps"
        >
          <!-- 自定义节点内容 -->
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              {{
                data.isParent
                  ? data.group
                  : data.state
                  ? data.apiName
                  : data.apiName + '（该接口被禁用）' || node.label
              }}
            </span>
          </template>
        </el-tree>
        <!-- 尾部 -->
        <div class="drawer__footer">
          <el-button type="danger" @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue'

import { useAdminApiStore } from '@/stores/admin/api'

const adminApiStore = useAdminApiStore()

onMounted(() => {
  adminApiStore.getApiList({ limit: 1000, page: 1 })
})
const treeRef = ref<any>(null)
//树形控件参数配置
const defaultProps = {
  children: 'children',
}

//是否显示抽屉
const drawer = ref(false)
//编辑的角色信息
const role = ref({} as RoleTypes.mysqlGetRole)

//打开抽屉
const showDrawer = async (val: RoleTypes.mysqlGetRole) => {
  drawer.value = true
  role.value = JSON.parse(JSON.stringify(val))
  //获取角色的接口权限
  await adminApiStore.getRoleApi(role.value.roleId as string)
  setCheckedKeys(
    adminApiStore.roleApiIds ? (adminApiStore.roleApiIds as Array<string>) : [],
  )
}
//关闭抽屉的回调 与取消编辑
const handleClose = () => {
  role.value = {} as RoleTypes.mysqlGetRole

  drawer.value = false
}
// 设置节点的选中状态
const setCheckedKeys = (keys: Array<String>) => {
  //要等树形组件渲染完毕后才可以设置选中状态
  nextTick(() => {
    treeRef.value.setCheckedKeys(keys)
  })
}
// 全选所有节点
const checkAll = () => {
  const allKeys: string[] = []
  const getAllKeys = (nodes: any[]) => {
    for (const node of nodes) {
      if (!node.isParent && node.apiId) {
        allKeys.push(node.apiId)
      }
      if (node.children) {
        getAllKeys(node.children)
      }
    }
  }
  getAllKeys(adminApiStore.groupedApis)
  treeRef.value.setCheckedKeys(allKeys)
}

// 反选节点
const inverseCheck = () => {
  const checkedKeys: string[] = treeRef.value.getCheckedKeys()
  const allKeys: string[] = []
  const getAllKeys = (nodes: any[]) => {
    for (const node of nodes) {
      if (!node.isParent && node.apiId) {
        allKeys.push(node.apiId)
      }
      if (node.children) {
        getAllKeys(node.children)
      }
    }
  }
  getAllKeys(adminApiStore.groupedApis)
  const newChecked = allKeys.filter((key) => !checkedKeys.includes(key))
  treeRef.value.setCheckedKeys(newChecked)
}
///确认修改
const confirm = async () => {
  const checkedKeys = treeRef.value
    .getCheckedKeys()
    .filter((item: string) => item != undefined)

  const res = await adminApiStore.updateRoleApi(
    role.value.roleId as string,
    checkedKeys,
  )
  if (res) {
    handleClose()
  }
}

defineExpose({
  showDrawer,
})
</script>
<style scoped>
.drawer__footer {
  text-align: center;
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
