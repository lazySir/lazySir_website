<template>
    <el-icon size="20px">
        <IconifyIcon name="mingcute-t-shirt-line" @click="open"></IconifyIcon>
        <ClotherDrawer ref="drawerRef" />
    </el-icon>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import ClotherDrawer from '@/layouts/admin/components/header/right/components/clothes/drawer.vue'
const drawerRef: any = ref(null)
const open = () => {
    drawerRef.value.showDrawer()
}
</script>
<style scoped></style>