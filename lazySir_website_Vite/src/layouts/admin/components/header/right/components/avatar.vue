<template>
  <el-dropdown>
    <div @mouseenter="changeActive" @mouseleave="changeActive">
      <AdminImage height="40px" width="40px" :img="adminAccountStore.adminInfo.avatar" />
      <el-icon v-if="isActive">
        <arrow-down />
      </el-icon>
      <el-icon v-else>
        <arrow-up />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="Refresh">
          <IconifyIcon style="margin-right: 3px;" :icon-style=iconStyle name="ic:outline-sync"></IconifyIcon>
          <span>刷新</span>
        </el-dropdown-item>

        <el-dropdown-item divided @click="adminAccountStore.logout">
          <el-icon>
            <SwitchButton />
          </el-icon>
          退出登陆
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useAdminAccountStore } from '@/stores/admin/account'
import { ElMessage } from 'element-plus';
const adminAccountStore = useAdminAccountStore()
let isActive = ref(true)
const changeActive = (): void => {
  isActive.value = !isActive.value
}
const iconStyle = ref({
  width: "15px",
  height: "15px",
})
const Refresh = async () => {
  const res = await adminAccountStore.getAdminInfo()
  if (res) {
    ElMessage.success('刷新成功！')
  }
}
</script>
<style scoped>
/* 默认移动上去会有一个黑色边框给她去除掉 */
:focus {
  outline: 0;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
