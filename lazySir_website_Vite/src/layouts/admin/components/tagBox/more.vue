<template>
    <el-dropdown trigger="click" :teleported="false">
        <el-button size="small" type="primary">
            <span>更多</span>
            <IconifyIcon name="ic:round-keyboard-arrow-down"></IconifyIcon>
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>

                <el-dropdown-item @click="closeCurrent">
                    <IconifyIcon style="margin-right: 3px;" :icon-style=iconStyle name="line-md:cancel"></IconifyIcon>
                    <span>关闭当前页</span>
                </el-dropdown-item>
                <el-dropdown-item @click="closeOther">
                    <IconifyIcon style="margin-right: 3px;" :icon-style=iconStyle
                        name="material-symbols:cancel-outline-rounded"></IconifyIcon>
                    <span>关闭其他页</span>
                </el-dropdown-item>
                <el-dropdown-item @click="closeAll">
                    <IconifyIcon style="margin-right: 3px;" :icon-style=iconStyle
                        name="fluent:calendar-cancel-16-regular"></IconifyIcon>
                    <span>关闭所有页</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
import { useAdminAsideStore } from '@/stores/admin/aside';
import { useAdminAccountStore } from '@/stores/admin/account';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
const adminAsideStore = useAdminAsideStore();
const adminAccountStore = useAdminAccountStore()

const route = useRoute();
const router = useRouter();
const iconStyle = ref({
    width: "15px",
    height: "15px",
})
const closeCurrent = () => {
    const { path } = route;
    const tag = adminAsideStore.tagList.find((tag) => {
        //@ts-ignore
        return tag.path === path || (tag.redirect === path)
    });
    if (tag) {
        adminAsideStore.deleteTag(tag.name); // 删除当前标签
    }
};

const closeOther = () => {
    const { path } = route;
    // 如果只有一个标签页，则直接返回，不执行关闭操作
    if (adminAsideStore.tagList.length <= 1) {
        return;
    }
    // 过滤 tagList，保留首页和当前标签页，关闭其他标签页
    //@ts-ignore
    adminAsideStore.tagList = adminAsideStore.tagList.filter(tag => tag.path === path || (tag.redirect === path) || tag.name == 'adminHome');
};

const closeAll = () => {
    adminAsideStore.resetTagBox();
    router.push({ name: 'adminHome' }); // 重置后跳转到首页
};
</script>

<style scoped></style>
