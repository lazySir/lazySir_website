<script setup lang="ts">
import { useAdminAccountStore } from '@/stores/admin/account';
const adminAccountStore = useAdminAccountStore();
const emits = defineEmits(["showDrawer"]);

// 获取字段值，如果未填写则返回 '未填写'
const getField = (value: string | undefined | number) => {
    return value ? value : '未填写';
};

// 编辑按钮
const edit = () => {
    emits("showDrawer");
};
</script>

<template>
    <div class="infoHeader">
        <el-button @click="edit()">修改个人信息</el-button>
        <el-tag type="success">绿色：已填写信息</el-tag>
        <el-tag type="danger">红色：未填写信息</el-tag>
    </div>

    <el-descriptions border>
        <el-descriptions-item :rowspan="2" :width="140" label="头像" align="center">
            <AdminImage :img="adminAccountStore.adminInfo.avatar" />
        </el-descriptions-item>

        <el-descriptions-item label="昵称">
            <el-tag size="small"
                :type="getField(adminAccountStore.adminInfo.nickname) === '未填写' ? 'danger' : 'success'">
                {{ getField(adminAccountStore.adminInfo.nickname) }}
            </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="手机号">
            <el-tag size="small" :type="getField(adminAccountStore.adminInfo.phone) === '未填写' ? 'danger' : 'success'">
                {{ getField(adminAccountStore.adminInfo.phone) }}
            </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="年龄">
            <el-tag size="small" :type="getField(adminAccountStore.adminInfo.age) === '未填写' ? 'danger' : 'success'">
                {{ getField(adminAccountStore.adminInfo.age) }}
            </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="性别">
            <el-tag size="small" :type="adminAccountStore.adminInfo.gender === undefined ? 'danger' : 'success'">
                {{ adminAccountStore.adminInfo.gender == 1 ? '男' : '女' }}
            </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="邮箱">
            <el-tag size="small" :type="getField(adminAccountStore.adminInfo.email) === '未填写' ? 'danger' : 'success'">
                {{ getField(adminAccountStore.adminInfo.email) }}
            </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="角色">
            <el-tag type="success" style="margin-right: 3px;" v-for="item in adminAccountStore.adminInfo.roles"
                :key="item.roleName" size="small">
                {{ item.roleName }}
            </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="地址">
            <el-tag size="small" :type="getField(adminAccountStore.adminInfo.address) === '未填写' ? 'danger' : 'success'">
                {{ getField(adminAccountStore.adminInfo.address) }}
            </el-tag>
        </el-descriptions-item>
    </el-descriptions>
</template>

<style scoped>
.infoHeader {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px
}
</style>
