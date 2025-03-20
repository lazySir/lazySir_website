<template>
    <!-- 用户列表  -->
    <personalInfo @showDrawer="FatherClick" />
    <!-- 抽屉 -->
    <personalDrawer ref="drawerInfo" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import personalInfo from '@/views/admin/personalCenter/infomation/info.vue'
import personalDrawer from '@/views/admin/personalCenter/infomation/drawer.vue'
const drawerInfo = ref<any>(null)
const FatherClick = () => {
    drawerInfo.value.openDrawer()
}
</script>
<style scoped></style>