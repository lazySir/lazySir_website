<template>
    <!-- <div v-if="hasPermission(userStoree.buttons.User.perm, 'READ')"> -->
    <div class="control">
        <el-input v-model="search" style="width: 200px" :prefix-icon="Search" placeholder="输入用户账号查询"></el-input>
        <div class="control2">
            <el-radio-group v-model="small">
                <el-radio-button :value="false">默认</el-radio-button>
                <el-radio-button :value="true">小</el-radio-button>
            </el-radio-group>
            <span class="parentBorder">
                边框: <el-switch v-model="parentBorder" />
            </span>

            <div>
                背景:
                <el-switch v-model="background" class="ml-2" />
            </div>
            <div class="ml-4">
                禁用分页: <el-switch v-model="disabled" class="ml-2" />
            </div>
        </div>
    </div>

    <el-table highlight-current-row :border="parentBorder" :data="filterUserList" style="width: 100%">
        <el-table-column fixed="left" header-align="center" align="center" label="头像" width="80" min-width="80px">
            <template #default="scope">

                <adminImage width="35px" height="35px" :img="scope.row.avatar" />
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="username" header-align="center" align="center" label="账号">
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" prop="nickname" label="用户昵称">
        </el-table-column>

        <el-table-column show-overflow-tooltip header-align="center" align="center" label="角色">
            <template #default="scope">
                <el-tag class="roleList" v-for="item in scope.row.roles" :type="item.state ? 'primary' : 'danger'"
                    :key="item.roleId">
                    {{ item.roleName }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="state" label="状态" width="83">
            <template #default="scope">
                <el-tag :type="scope.row.state ? 'success' : 'danger'">{{
                    scope.row.state ? "正常" : "禁用"
                }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" sortable align="center" prop="createDate"
            label="创建时间">

        </el-table-column>
        <el-table-column show-overflow-tooltip sortable header-align="center" align="center" prop="updateDate"
            label="更新时间">

        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" label="操作" width="300" min-width="300">
            <template #default="scope">
                <AuthBtn type="primary" content="角色" name="adminPermission" perm="UPDATE" size="small"
                    @click="edit(scope.row, 'auth')" icon="user"></AuthBtn name="adminPermission">
                <AuthBtn type="primary" content="编辑" name="adminPermission" perm="UPDATE" size="small"
                    @click="edit(scope.row, 'edit')" ></AuthBtn name="adminPermission">
                <AuthBtn type="primary" content="重置" name="adminPermission" perm="UPDATE" size="small"
                    @click="resetPwd(scope.row.accountId)" icon="refreshLeft"></AuthBtn name="adminPermission">
                <el-popconfirm cancel-button-text="取消" confirm-button-text="确认"
                    @confirm="deleteAdmin(scope.row.accountId)" :title="`确定删除:${scope.row.username}?`">
                    <template #reference>
                        <AuthBtn type="primary" content="删除" perm="DELETE" name="adminPermission" size="small"
                            >
                        </AuthBtn name="adminPermission">
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <el-pagination v-model:current-page="adminUserStore.PageAndSize.page"
            v-model:page-size="adminUserStore.PageAndSize.limit" :page-sizes="[3, 5, 7, 10]" :small="small"
            :disabled="disabled" :background="background" layout=" prev, pager, next, jumper,sizes,total,"
            :total="adminUserStore.PageAndSize.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
    <!-- </div> -->
    <!-- <div v-else>
      {{ "没有查询权限" }}
    </div> -->
</template>
<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
import { ref, computed, onMounted } from "vue";
import { useAdminUserStore } from '@/stores/admin/admin'
const adminUserStore = useAdminUserStore();
const parentBorder = ref(true);
const search = ref("");
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const filterUserList = computed(() => {
    return adminUserStore.adminList.filter((item: AdminTypes.adminInfo) =>
        item.username.includes(search.value)
    );
});
onMounted(() => {
    adminUserStore.getAdminList();
});
const emits = defineEmits(["showDrawer"]);
//编辑按钮
const edit = (val: AdminTypes.adminInfo, type: string) => {
    emits("showDrawer", val, type);
};
//管理员重置密码
const resetPwd = async (accountId: string) => {
    await adminUserStore.resetPwdByAdmin(accountId)
}
//删除按钮
const deleteAdmin = async (accountId: string) => {
    const flag = await adminUserStore.deleteAdmin(accountId);
    if (flag) {
        adminUserStore.getAdminList();
    }
};
const handleSizeChange = async () => {
    await adminUserStore.getAdminList();
};
const handleCurrentChange = async () => {
    await adminUserStore.getAdminList();
};
</script>
<style scoped>
.el-input {
    width: 150px;
}

.search {
    margin-left: 10px;
    margin-right: 10px;
}

.el-table {
    margin-top: 10px;
}

.parentBorder {
    margin-left: 10px;
}

.roleList {
    margin: 0 5px;
}

.control {
    display: flex;
    justify-content: space-between;


}

.control>.control2 {
    display: flex;
    justify-content: center;
}

.demo-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}
</style>