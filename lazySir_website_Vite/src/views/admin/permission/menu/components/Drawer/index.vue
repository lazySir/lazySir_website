<template>
    <el-drawer size="25%" v-model="dialogVisible">
        <template #header>
            <h4>{{ title }}</h4>
        </template>
        <template #default>
            <el-form :model="menu">
                <el-form-item label="路由名称" label-width="80px">
                    <el-input v-model="menu.menuName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="路由值" label-width="80px">
                    <el-input placeholder="唯一值不可重复" v-model="menu.menuValue" autocomplete="off" />
                </el-form-item>
                <el-form-item label="路径" label-width="80px">
                    <el-input placeholder="唯一值不可重复" v-model="menu.path" autocomplete="off" />
                </el-form-item>
                <el-form-item label="启用状态" label-width="80px">
                    <el-switch v-model="menu.state" active-color="#13ce66" />
                </el-form-item>
                <el-form-item label="排序值" label-width="80px">
                    <el-input placeholder="用于路由排序，类型为数字" type="number" v-model="menu.sortOrder" />
                </el-form-item>
                <el-form-item label="描述" label-width="80px">
                    <el-input placeholder="路由的描述说明，可以为空" v-model="menu.description" autocomplete="off" />
                </el-form-item>

                <el-form-item label-width="80px" label="图标">
                    <IconDialog v-model="menu.icon as string" />
                </el-form-item>
                <el-form-item label="级别" label-width="80px">
                    <el-input disabled placeholder="级别超过3之后不可新增路由" v-model="menu.level" />
                </el-form-item>
                <el-form-item label="创建时间" label-width="80px">
                    <el-input disabled :value="menu.createdDate" autocomplete="off" />
                </el-form-item>
                <el-form-item label="创建人" label-width="80px">
                    <el-input disabled :value="menu.createNickname" autocomplete="off" />
                </el-form-item>
                <el-form-item label="更新时间" label-width="80px">
                    <el-input disabled :value="menu.updatedDate" autocomplete="off" />
                </el-form-item>
                <el-form-item label="更新人" label-width="80px">
                    <el-input disabled :value="menu.updateNickname" autocomplete="off" />
                </el-form-item>


            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button type="danger" @click="handleClose">取消</el-button>

            </div>
        </template>


    </el-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useAdminMenuStore } from "@/stores/admin/menu";
import IconDialog from '@/components/public/IconDialog/index.vue'
//定义dialogVisible的值
let dialogVisible = ref(false);
let menu = ref({} as MenuTypes.mysqlMenu);
const menuStore = useAdminMenuStore();
watch(dialogVisible, (newValue, oldValue) => {
    if (newValue == false) {
        menu = ref({} as MenuTypes.mysqlMenu);
    }
})
// 打开抽屉
function showDrawer(row: MenuTypes.Menu, type: string) {
    //将drawer打开
    dialogVisible.value = true;
    if (type) {
        //说明是编辑
        if (type === 'update') {
            menu.value = {
                menuId: row.meta.menuId,
                menuName: row.meta.title || "",
                menuValue: row.name || "",
                path: row.path,
                state: row.meta.state as boolean,
                sortOrder: row.meta.sortOrder,
                description: row.meta.description || "",
                level: row.meta.level,
                parentId: row.meta.parentId,
                icon: row.meta.icon,
                createdDate: row.meta.createdDate,
                updatedDate: row.meta.updatedDate,
                createNickname: row.meta.createNickname,
                updateNickname: row.meta.updateNickname,
            };
        }
        //说明是新增子路由
        else {
            menu.value = {
                menuName: "",
                menuValue: "",
                parentId: row.meta.menuId,
                path: "",
                state: true,
                description: "",
                level: row.meta.level + 1,
                icon: "",
            };
        }

    } else {
        menu.value.state = true
        menu.value.level = 1
    }
}
//暴露方法
defineExpose({ showDrawer });

//计算标题
const title = computed(() => {
    return menu.value.menuId ? "编辑路由" : "添加路由";
});
//计算label名称
const labelName = computed(() => {
    return menu.value.menuId ? "路由Id:" : "自动生成Id";
});
//取消事件
const handleClose = () => {
    dialogVisible.value = false;
};
//确定事件
const confirm = async () => {
    //关闭弹窗
    const res = await menuStore.addOrUpdateMenu(menu.value);
    if (res) {
        dialogVisible.value = false;
    }


};
//确认事件
</script>

<style scoped>
.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>