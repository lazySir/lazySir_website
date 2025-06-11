<template>
  <!-- 信息表显示 -->
  <RoleList @showDrawer="FatherClick" />
  <!-- 弹窗 -->
  <DrawerInfo ref="infoRef" />
  <DrawerMenuAuth ref="menuRef" />
  <DrawerInterfaceAuth ref="apiRef" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import RoleList from '@/views/admin/permission/role/components/List/index.vue'
import DrawerInfo from '@/views/admin/permission/role/components/DrawerInfo/index.vue'
import DrawerMenuAuth from '@/views/admin/permission/role/components/DrawerAuth/menu.vue'
import DrawerInterfaceAuth from '@/views/admin/permission/role/components/DrawerAuth/api.vue'
const infoRef: any = ref(null)
const menuRef: any = ref(null)
const apiRef: any = ref(null)
//父调用子方法
const FatherClick = (val: RoleTypes.Role | any, type: string) => {
  if (type == 'menu') {
    menuRef.value.showDrawer(val)
  } else if (type == 'api') {
    apiRef.value.showDrawer(val)
  } else {
    infoRef.value.showDrawer(val)
  }
}
</script>
<style scoped></style>
