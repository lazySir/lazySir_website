<template>
  <template v-for="item in adminAccountStore.menus">
    <!-- 有子项 -->
    <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.meta.title">
      <template #title>
        <el-icon>
          <IconifyIcon :name="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <el-menu-item-group v-for="itemChildrens in item.children" :index="itemChildrens.meta.title"
        :key="itemChildrens.meta.title">
        <el-menu-item @click="handleClick(itemChildrens)" :index="itemChildrens.meta.title">
          <el-icon>
            <IconifyIcon :name="itemChildrens.meta.icon" />
          </el-icon>
          <span>{{ itemChildrens.meta.title }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <!-- 无子项 -->
    <el-menu-item v-else :index="item.meta.title" @click="handleClick(item)">
      <el-icon>
        <IconifyIcon :name="item.meta.icon" />
      </el-icon>

      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </template>
</template>
<script lang="ts" setup>
import { useAdminAsideStore } from '@/stores/admin/aside'
import { useAdminAccountStore } from '@/stores/admin/account'
const asideStore = useAdminAsideStore()
const adminAccountStore = useAdminAccountStore()
const handleClick = (item: MenuTypes.Menu) => {
  asideStore.pushPath(item.name)
  asideStore.addTag(item)
}
</script>
<style scoped>
/* 激活时的背景颜色为#E6F5F3 */
.el-menu-item.is-active {
  background-color: #e6f5f3;
}

:deep(.el-menu-item-group__title) {
  display: none !important;
}

.el-menu-item.is-active::before {
  content: '';
  background-color: #009788;
  position: absolute;
  left: 0;
  width: 4px;
  height: 100%;
}
</style>
