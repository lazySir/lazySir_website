<template>
  <el-drawer
    :before-close="handleClose"
    v-model="drawer"
    :title="role.roleName + '：更新权限'"
    size="25%"
  >
    <!-- 整体内容 -->
    <el-scrollbar>
      <div class="drawer_content">
        <div class="cursor-pointer flex justify-end gap-2 mb-2">
          <el-text @click="checkAll" type="primary">全选</el-text>
          <el-text @click="inverseCheck" type="primary">反选</el-text>
        </div>
        <!-- 树形结构 -->
        <el-tree
          ref="treeRef"
          :data="adminMenuStore.menuList"
          show-checkbox
          node-key="path"
          :props="defaultProps"
        >
          <!-- 自定义节点内容 -->
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              {{
                data.meta.state
                  ? data.meta.title
                  : data.meta.title + '（该路由被禁用）' || node.label
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

import { useAdminMenuStore } from '@/stores/admin/menu'
import { useAdminPermissionStore } from '@/stores/admin/permission'
import { emit } from 'process'

const adminMenuStore = useAdminMenuStore()
const adminPermissionStore = useAdminPermissionStore()

onMounted(() => {
  adminMenuStore.getMenuList()
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
  await adminPermissionStore.getRoleMenu([role.value.roleId as string])
  if (adminPermissionStore.roleMenuList) {
    role.value.menuPath = adminPermissionStore.roleMenuList.map(
      (item) => item.path,
    ) as any
  }

  role.value.menuPath
    ? setCheckedKeys([...role.value.menuPath])
    : setCheckedKeys([])
}
//关闭抽屉的回调 与取消编辑
const handleClose = () => {
  role.value = {} as RoleTypes.Role
  // 清空树形组件的选中状态
  treeRef.value.setCheckedKeys([])
  drawer.value = false
}
// 全选所有启用节点（最多三层）
const checkAll = () => {
  const result: string[] = []

  const collectEnabledLeafPaths = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (!node.children || node.children.length === 0) {
        if (node.meta?.state) {
          result.push(node.path)
        }
      } else {
        collectEnabledLeafPaths(node.children)
      }
    })
  }

  collectEnabledLeafPaths(adminMenuStore.menuList)
  treeRef.value.setCheckedKeys(result)
}

// 反选启用节点（最多三层）
const inverseCheck = () => {
  const checked = treeRef.value.getCheckedKeys() as string[]
  const result: string[] = []

  const collectInverseLeafPaths = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (!node.children || node.children.length === 0) {
        // 是叶子节点
        if (node.meta?.state && !checked.includes(node.path)) {
          result.push(node.path)
        }
      } else {
        // 有子节点，继续递归
        collectInverseLeafPaths(node.children)
      }
    })
  }

  collectInverseLeafPaths(adminMenuStore.menuList)
  treeRef.value.setCheckedKeys(result)
}
// 设置节点的选中状态
const setCheckedKeys = (keys: Array<String>) => {
  //要等树形组件渲染完毕后才可以设置选中状态
  nextTick(() => {
    treeRef.value.setCheckedKeys(keys)
  })
}

///确认修改
const confirm = async () => {
  const checkedKeys = treeRef.value.getCheckedKeys()
  const res = adminPermissionStore.getMenusList(
    adminMenuStore.menuList,
  ) as MenuTypes.Menu[]
  let menuIds: Array<string> = []
  res.filter((item) => {
    //如果存在则获取meta.menuId
    if (checkedKeys.includes(item.path)) {
      menuIds.push(item.meta.menuId as string)
    }
  })
  const flag = await adminPermissionStore.changeRoleMenu(
    role.value.roleId as string,
    menuIds,
  )
  //关闭抽屉
  if (flag) {
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

.header_text {
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 18px;
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
