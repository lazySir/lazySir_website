<template>
    <div class="el-container">
        <el-container>
            <el-header class="header_container">
                <logoForm class="logo"></logoForm>
                <el-menu mode="horizontal" active-text-color="#009688" background-color="#ffffff" default-active="首页"
                    text-color="#333333">
                    <!-- 菜单 -->
                    <subMenu />
                </el-menu>
                <HeaderR class="r_container"></HeaderR>
            </el-header>
            <tagBox v-if="adminGlobalStore.isShowTab"></tagBox>
            <el-main>
                <Main></Main>
            </el-main>
            <el-footer v-if="adminGlobalStore.isShowFooter">
                <Footer class="footer"></Footer>
            </el-footer>
        </el-container>
    </div>
</template>
<script lang="ts" setup>
import logoForm from '@/layouts/admin/components/aside/components/logo.vue'
import HeaderR from '@/layouts/admin/components/header/right/index.vue'
import subMenu from '@/layouts/admin/components/aside/components/menu.vue'
import Main from '@/layouts/admin/components/main/index.vue'
import Footer from '@/layouts/admin/components/footer/index.vue'
import tagBox from '@/layouts/admin/components/tagBox/index.vue'
import { useAdminGlobalStore } from '@/stores/admin/global'
const adminGlobalStore = useAdminGlobalStore()
</script>
<style scoped>
.header_container {
    display: flex;
    justify-content: space-between;
    height: 55px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 55px;
}

.r_container {
    border-bottom: 1px solid #ebeef5;
}

.el-main {
    height: calc(100vh - 55px - 30px - 30px);
}

.logo {
    width: 200px;
    border-right: 1px solid #ebeef5;
}

.el-menu {
    flex: 2.5;
    height: 55px;

}

.el-footer {
    border-top: 1px solid #ebeef5;
    height: 30px;

}

.el-footer .footer {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>