<template>
    <div class="el-container">
        <el-container>
            <el-header>
                <logoForm class="logo"></logoForm>
                <Header class="Header"></Header>
            </el-header>
            <tagBox v-if="adminGlobalStore.isShowTab"></tagBox>
            <el-container>
                <el-aside width="auto">
                    <Aside class="aside-container"></Aside>
                </el-aside>
                <el-container>
                    <el-main>
                        <Main></Main>
                    </el-main>
                    <el-footer v-if="adminGlobalStore.isShowFooter">
                        <Footer></Footer>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
<script lang="ts" setup>
import tagBox from '@/layouts/admin/components/tagBox/index.vue'
import logoForm from '@/layouts/admin/components/aside/components/logo.vue'
import Header from '@/layouts/admin/components/header/index.vue'
import Aside from '@/layouts/admin/components/aside/index.vue'
import Main from '@/layouts/admin/components/main/index.vue'
import Footer from '@/layouts/admin/components/footer/index.vue'
import { useAdminGlobalStore } from '@/stores/admin/global'
const adminGlobalStore = useAdminGlobalStore()
</script>
<style scoped>
.el-header {
    width: 100vw;
    height: 55px;
    display: flex;
    padding: 0;
    /* border-right: 1px solid #e4e7ed; */
    /* .logo{
    width: 200px;
  } */
}

.el-header .logo {
    width: 208px;
    border-right: 1px solid #e4e7ed;

}



.el-header .Header {
    width: calc(100vw - 165.88px);

}

.Header {
    height: 54.5px !important;
    border-bottom: 1px solid #e4e7ed !important;
    margin-bottom: 1px;
}

.el-footer {
    height: 30px;
    background: #ffffff;
    border-top: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    justify-content: center;
}

.el-aside {
    border-right: 1px solid #e4e7ed;


}

.el-aside .aside-container {
    height: calc(100vh - 55px - 30px);
}

.el-main {
    box-sizing: border-box;
    padding: 10px 12px;
    background-color: #f2f3f5;
    height: calc(100vh - 55px - 30px - 30px);
}
</style>