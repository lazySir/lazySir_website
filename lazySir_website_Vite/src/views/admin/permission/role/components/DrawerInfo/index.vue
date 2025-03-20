<template>
    <el-drawer :direction="direction" :before-close="handleClose" v-model="drawer" :title="title" size="25%">
        <!-- 整体内容 -->
        <el-scrollbar>
            <div class="drawer_content">
                <!-- 角色信息 -->
                <el-form :model="role">
                    <div class="header_text">基础编辑</div>
                    <el-form-item fixed="left" label="名称" label-width="80px">
                        <el-input placeholder="唯一值不可重复" v-model="role.roleName" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="启用状态" label-width="80px">
                        <el-switch v-model="role.state" style=" --el-switch-on-color: #13ce66" />
                    </el-form-item>
                    <el-form-item label="备注" label-width="80px">
                        <el-input placeholder="可为空" v-model="role.description" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="创建时间" label-width="80px">
                        <el-input disabled v-model="role.createDate" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="更新人" label-width="80px">
                        <el-input disabled v-model="role.createUsername" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="更新时间" label-width="80px">
                        <el-input disabled v-model="role.updateDate" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="更新人" label-width="80px">
                        <el-input disabled v-model="role.updateUsername" autocomplete="off" />
                    </el-form-item>
                </el-form>
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
import { ref, computed, onMounted } from "vue";
import { useAdminRoleStore } from "@/stores/admin/role";
import { useAdminMenuStore } from "@/stores/admin/menu";

const adminRoleStore = useAdminRoleStore();
const adminMenuStore = useAdminMenuStore();


onMounted(() => {
    adminMenuStore.getMenuList();
});


//树形空间展开方向
const direction = ref<any>("rtl");
//是否显示抽屉
const drawer = ref(false);
//编辑的角色信息
const role = ref({} as RoleTypes.mysqlGetRole);

//打开抽屉
const showDrawer = async (val: RoleTypes.mysqlGetRole) => {
    resetRole();
    if (val.roleId) {
        //赋值
        role.value = JSON.parse(JSON.stringify(val));
    } else {
        role.value.state = true
    }
    drawer.value = true;
};
//关闭抽屉的回调 与取消编辑
const handleClose = () => {
    drawer.value = false;
    resetRole();
};

///确认修改
const confirm = async () => {
    //发送请求
    const res: Boolean = await adminRoleStore.addOrUpdateRole(role.value);
    if (res) {
        await adminMenuStore.getMenuList();
        //关闭抽屉
        handleClose();
    }

};
//计算标题
const title = computed(() => {
    return role.value.roleName ? role.value.roleName + "编辑" : "添加角色";
});
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