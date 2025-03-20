<template>
  <div>
    <MenuList @showDrawer="FatherClick" />
    <MenuDrawer ref="drawerRef" />

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MenuList from '@/views/admin/permission/menu/components/List/index.vue'
import MenuDrawer from '@/views/admin/permission/menu/components/Drawer/index.vue'
const drawerRef: any = ref(null)
//父调用子方法
const FatherClick = (val: MenuTypes.Menu | any, type: string) => {
  drawerRef.value.showDrawer(val, type)
}
</script>
<style scoped></style>
