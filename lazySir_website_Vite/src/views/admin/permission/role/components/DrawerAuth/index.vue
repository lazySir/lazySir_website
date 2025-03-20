<template>
    <el-drawer :direction="direction" :before-close="handleClose" v-model="drawer" :title="role.roleName + '：更新权限'"
        size="25%">
        <!-- 整体内容 -->
        <el-scrollbar>
            <div class="drawer_content">
                <div class="header_text">权限编辑</div>
                <!-- 树形结构 -->
                <el-tree ref="treeRef" :data="adminMenuStore.menuList" show-checkbox default-expand-all node-key="path"
                    :props="defaultProps">
                    <!-- 自定义节点内容 -->
                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            {{
                                data.meta.state
                                    ? data.meta.title
                                    : data.meta.title + "（该路由被禁用）" || node.label
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
import { ref, nextTick, onMounted } from "vue";

import { useAdminMenuStore } from "@/stores/admin/menu";
import { useAdminPermissionStore } from '@/stores/admin/permission'

const adminMenuStore = useAdminMenuStore();
const adminPermissionStore = useAdminPermissionStore();

onMounted(() => {
    adminMenuStore.getMenuList();
});
const treeRef = ref<any>(null);
//树形控件参数配置
const defaultProps = {
    children: "children"
};
//树形空间展开方向
const direction = ref<any>("rtl");
//是否显示抽屉
const drawer = ref(false);
//编辑的角色信息
const role = ref({} as RoleTypes.mysqlGetRole);

//打开抽屉
const showDrawer = async (val: RoleTypes.mysqlGetRole) => {
    drawer.value = true;
    role.value = JSON.parse(JSON.stringify(val));
    await adminPermissionStore.getRoleMenu([role.value.roleId as string])
    if (adminPermissionStore.roleMenuList) {
        role.value.menuPath = adminPermissionStore.roleMenuList.map(item => item.path) as any
    }
    role.value.menuPath ? setCheckedKeys([...role.value.menuPath]) : setCheckedKeys([]);
};
//关闭抽屉的回调 与取消编辑
const handleClose = () => {
    resetRole();
    drawer.value = false;
};
// 设置节点的选中状态
const setCheckedKeys = (keys: Array<String>) => {
    //要等树形组件渲染完毕后才可以设置选中状态
    nextTick(() => {
        treeRef.value.setCheckedKeys(keys);
    });
};

///确认修改
const confirm = async () => {
    const checkedKeys = treeRef.value.getCheckedKeys();
    const res = adminPermissionStore.getMenusList(adminMenuStore.menuList) as MenuTypes.Menu[]
    let menuIds: Array<string> = []
    res.filter(item => {
        //如果存在则获取meta.menuId
        if (checkedKeys.includes(item.path)) {
            menuIds.push(item.meta.menuId as string)
        }
    })
    const flag = await adminPermissionStore.changeRoleMenu(role.value.roleId as string, menuIds)
    //关闭抽屉
    if (flag) {
        handleClose();
    }
};

//重置role
const resetRole = () => {
    role.value = {} as RoleTypes.Role;
};
//修改抽屉方向
const directionDrawer = (val: any) => {
    direction.value = val;
};
defineExpose({
    showDrawer,
    directionDrawer, // 将该函数暴露出去
});
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