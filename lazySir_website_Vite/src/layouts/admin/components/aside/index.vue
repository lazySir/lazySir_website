<script setup lang="ts">
import Logo from '@/layouts/admin/components/aside/components/logo.vue'
import subMenu from '@/layouts/admin/components/aside/components/menu.vue'
import { useAdminGlobalStore } from '@/stores/admin/global';
const adminGlobalStore = useAdminGlobalStore()
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <div class="aside_container">
    <Logo v-if="adminGlobalStore.layout == 'vertical'" :is-collapse="adminGlobalStore.isCollapse" />
    <el-scrollbar class="scroll-container">
      <el-menu :collapse="adminGlobalStore.isCollapse" active-text-color="#009688" background-color="#ffffff"
        class="el-menu-vertical-demo" :default-active="route.meta.title" text-color="#333333">
        <subMenu />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>
/* 让el-menu铺满整个容器 */
.aside_container {
  height: 100vh;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  height: 100%;
  border: 0;
}

.scroll-container {
  height: calc(100% - 100px);
  /* 调整这里的值以适应logoForm的高度 */
  overflow-y: auto;
}
</style>
