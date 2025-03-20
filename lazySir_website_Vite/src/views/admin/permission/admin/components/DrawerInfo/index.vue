<template>
    <el-drawer size="25%" v-model="isShowDrawer" title="管理员编辑">
        <el-scrollbar>
            <el-form :model="adminInfo">
                <!-- 头像 -->
                <el-form-item>
                    <adminImage class="avatar" :img="adminInfo.avatar" />
                </el-form-item>
                <el-form-item label="用户账号" label-width="80px">
                    <el-input v-model="adminInfo.username" />
                </el-form-item>
                <el-form-item label="用户昵称" label-width="80px">
                    <el-input placeholder="可以为空" v-model="adminInfo.nickname" />
                </el-form-item>
                <el-form-item label="手机号" label-width="80px">
                    <el-input placeholder="可以为空" v-model="adminInfo.phone" />
                </el-form-item>
                <el-form-item label="年龄" label-width="80px">
                    <el-input placeholder="可以为空" type="number" v-model="adminInfo.age" />
                </el-form-item>
                <el-form-item label="email" label-width="80px">
                    <el-input placeholder="可以为空" disabled v-model="adminInfo.email" />
                </el-form-item>
                <el-form-item label="状态" label-width="80px">
                    <el-switch style="--el-switch-on-color: #13ce66; " v-model="adminInfo.state"></el-switch>
                </el-form-item>
                <el-form-item label="地址" label-width="80px">
                    <el-input placeholder="可以为空" type="number" v-model="adminInfo.address" />
                </el-form-item>
                <el-form-item label="创建时间" label-width="80px">
                    <el-input disabled v-model="adminInfo.createDate" />
                </el-form-item>
                <el-form-item label="最近更新" label-width="80px">
                    <el-input disabled v-model="adminInfo.updateDate" />
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
import { ref } from 'vue'
import { useAdminUserStore } from '@/stores/admin/admin';
const adminUserStore = useAdminUserStore();

//是否打开抽屉
const isShowDrawer = ref(false);
//编辑的角色
const adminInfo = ref({} as AdminTypes.adminInfo);
//取消
const cancel = () => {
    isShowDrawer.value = false;
    //重置user
    adminInfo.value = {} as AdminTypes.adminInfo;
};
//确定
const entire = async () => {
    const res = await adminUserStore.addOrUpdateAdminInfo(adminInfo.value)
    if (res) {
        cancel()
    }
};

//打开抽屉
let openDrawer = (val: AdminTypes.adminInfo) => {
    isShowDrawer.value = true;
    adminInfo.value = JSON.parse(JSON.stringify(val));
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