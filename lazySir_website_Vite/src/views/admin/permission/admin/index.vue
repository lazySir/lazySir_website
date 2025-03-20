<template>
  <!-- 用户列表  -->
  <adminList @showDrawer="FatherClick" />
  <!-- 抽屉 -->
  <adminInfoDrawer ref="drawerInfo" />
  <adminAuthDrawer ref="drawerAuth" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import adminList from '@/views/admin/permission/admin/components/List/index.vue'
import adminInfoDrawer from '@/views/admin/permission/admin/components/DrawerInfo/index.vue'
import adminAuthDrawer from '@/views/admin/permission/admin/components/DrawerAuth/index.vue'
const drawerInfo = ref<any>(null)
const drawerAuth = ref<any>(null)
const FatherClick = (val: AdminTypes.adminInfo, type: string) => {
  if (type == 'edit') {
    drawerInfo.value.openDrawer(val)
  } else {
    drawerAuth.value.openDrawer(val)
  }

}
</script>
<style scoped></style>
