<template>
  <el-container class="common-layout-vertical">
    <el-aside width="auto">
      <Aside />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <TagBox v-if="adminGlobalStore.isShowTab" />
      <el-main>
        <Main />
      </el-main>
      <el-footer v-if="adminGlobalStore.isShowFooter">
        <Footer />
      </el-footer>
    </el-container>
  </el-container>
</template>
<script setup>
import { useAdminGlobalStore } from '@/stores/admin/global'
import Aside from '@/layouts/admin/components/aside/index.vue'
import Header from '@/layouts/admin/components/header/index.vue'
import Main from '@/layouts/admin/components/main/index.vue'
import Footer from '@/layouts/admin/components/footer/index.vue'
import TagBox from '@/layouts/admin/components/tagBox/index.vue'
const adminGlobalStore = useAdminGlobalStore()
</script>
<style scoped>
.el-header {
  --el-header-padding: 0 0px;
  --el-header-height: 55px;
  border-bottom: 1px solid #e4e7ed;
}

.el-main {
  box-sizing: border-box;
  padding: 10px 12px;
  background-color: #f2f3f5;
  height: calc(100vh - 55px - 30px - 30px);
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
</style>
