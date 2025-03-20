<template>
    <el-drawer v-model="isShowDrawer" title="用户编辑">
        <el-scrollbar>
            <el-form>
                <el-form-item label="角色" label-width="80px">
                    <el-checkbox @change="handleCheckAllChange" :indeterminate="isIndeterminate"
                        v-model="checkedAll">全选</el-checkbox>
                    <el-checkbox @change="handleCheckReverse" v-model="checkedReverse">反选</el-checkbox>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-checkbox-group @change="handleCheckedChange" v-model="selectedRole">
                        <el-checkbox v-for="role in adminRoleStore.roleList" :value="role.roleName"
                            :key="role.roleId">{{ displayRoleName(role) }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="drawer__footer">
                <el-button type="danger" @click="cancel">取消</el-button>
                <el-button type="primary" @click="entire">确认</el-button>
            </div>
        </el-scrollbar>
    </el-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminRoleStore } from '@/stores/admin/role'
import { useAdminPermissionStore } from '@/stores/admin/permission'
import { useAdminUserStore } from '@/stores/admin/admin'
const adminRoleStore = useAdminRoleStore();
const adminPermissionStore = useAdminPermissionStore()
const adminUserStore = useAdminUserStore()
onMounted(async () => {
    await adminRoleStore.getRoleList()
})

// 控制抽屉是否显示
const isShowDrawer = ref(false);

// 编辑中的角色信息
const adminInfo = ref({} as AdminTypes.adminInfo);

// 所有角色名称
const allRoles = computed(() => {
    return adminRoleStore.roleList
        .filter((item: RoleTypes.Role) => item.state !== false)
        .map((item: RoleTypes.Role) => item.roleName);
});

// 被选中的角色
const selectedRole = ref<string[]>([]);

// 全选和反选状态
const checkedAll = ref(false);
const checkedReverse = ref(false);
const isIndeterminate = ref(true)

// 角色名称显示函数
const displayRoleName = (role: RoleTypes.Role) => {
    return role.state ? role.roleName : `${role.roleName}（该角色被禁用）`;
}

// 全选
const handleCheckAllChange = (val: boolean) => {
    selectedRole.value = val ? allRoles.value : [];
    checkedReverse.value = false
};

// 反选
const handleCheckReverse = () => {
    selectedRole.value = allRoles.value.filter(item => !selectedRole.value.includes(item));
    checkedAll.value = false
};
const handleCheckedChange = (value: string[]) => {
    const checkedCount = value.length
    checkedAll.value = checkedCount === adminRoleStore.roleList.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < adminRoleStore.roleList.length
}

// 取消
const cancel = () => {
    isShowDrawer.value = false;
    adminInfo.value = {} as AdminTypes.adminInfo;
    checkedAll.value = false
    selectedRole.value = []
    checkedReverse.value = false
    isIndeterminate.value = true
};

const getSelectedRoleIds = () => {
    return selectedRole.value.map(roleName => {
        const role = adminRoleStore.roleList.find(role => role.roleName === roleName);
        return role ? role.roleId : null;
    }).filter(id => id !== null); // 过滤掉 null 值
};
// 确认
const entire = async () => {
    const roleIds = getSelectedRoleIds()
    const res = await adminPermissionStore.changeAdminRole(roleIds as string[], adminInfo.value.accountId as string)
    if (res) {
        adminUserStore.getAdminList()
        cancel()
    }
};

// 打开抽屉
const openDrawer = (role: RoleTypes.Role) => {
    isShowDrawer.value = true;
    adminInfo.value = JSON.parse(JSON.stringify(role));
    if ((adminInfo.value.roles as []).length == 0) {
        isIndeterminate.value = false
    } else {
        selectedRole.value = (adminInfo.value.roles as any).map((item: RoleTypes.Role) => item.roleName);
        if (selectedRole.value.length == adminRoleStore.roleList.length) {
            checkedAll.value = true
            isIndeterminate.value = false

        }
    }
};

defineExpose({ openDrawer });
</script>

<style scoped>
.header_text {
    text-align: center;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 18px;
}

.avatar {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

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
