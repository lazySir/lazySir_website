<template>
  <el-tag style="margin-left: 15px;margin-right: 15px" type="success">
    欢迎您： {{ accountStore.adminInfo.nickname }}
  </el-tag>
</template>
<script lang="ts" setup>
import { useAdminAccountStore } from '@/stores/admin/account';
const accountStore = useAdminAccountStore();
</script>
<style scoped>
/* .username {
  margin: 0 20px;
  font-size: 15px;
  color: #303113;
  font-family: Microsoft YaHei;
} */
</style>
