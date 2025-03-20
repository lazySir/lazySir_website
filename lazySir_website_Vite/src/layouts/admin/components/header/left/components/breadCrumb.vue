<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAsideStore } from '@/stores/admin/aside';
import { useAdminGlobalStore } from '@/stores/admin/global';
const router = useRouter();
const adminAsideStore = useAdminAsideStore();
const adminGlobalStore = useAdminGlobalStore()
watch(
  () => router.currentRoute.value,
  (newValue: any) => {
    adminAsideStore.addBreadCrumb(newValue.name)
  },
  { immediate: true },
)
</script>

<template>
  <el-breadcrumb v-if="adminGlobalStore.isShowBread" separator="/">
    <el-breadcrumb-item @click="adminAsideStore.pushPath(item.name)"
      v-for="(item, index) in adminAsideStore.breadCrumbList" class="breadcrumb-item">
      <IconifyIcon v-if="adminGlobalStore.isShowBreadIcon" :name="item.meta.icon" style="margin-right:3px;" />
      <span :class="{ active: index === adminAsideStore.breadCrumbList.length - 1 }">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.el-breadcrumb {
  margin-left: 15px;
  height: 20px;
  line-height: 20px;
}

span {
  height: auto;
  font-size: 13px;
  line-height: 20px;
  font-weight: 550;
  color: #000;
}

:deep(.el-breadcrumb__inner) {
  display: flex !important;
}

.breadcrumb-item {
  cursor: pointer;
}

/* 修改el-breadcrumb的最后一个的span的字体颜色为粉色 */
.active {
  color: #606266;
  font-weight: 550;
}
</style>
