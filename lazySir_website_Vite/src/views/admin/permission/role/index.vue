<template>
  <!-- 信息表显示 -->
  <RoleList @showDrawer="FatherClick" />
  <!-- 弹窗 -->
  <DrawerInfo ref="infoRef" />
  <DrawerAuth ref='authRef' />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import RoleList from '@/views/admin/permission/role/components/List/index.vue'
import DrawerInfo from '@/views/admin/permission/role/components/DrawerInfo/index.vue'
import DrawerAuth from '@/views/admin/permission/role/components/DrawerAuth/index.vue'
const infoRef: any = ref(null)
const authRef: any = ref(null)
//父调用子方法
const FatherClick = (val: RoleTypes.Role | any, type: string) => {
  if (type == 'auth') {
    authRef.value.showDrawer(val)
  } else {
    infoRef.value.showDrawer(val)
  }
}
</script>
<style scoped></style>
