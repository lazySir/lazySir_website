<script setup lang="ts">
import { ref } from 'vue'
import InfoCard from '@/views/global/navbar/components/card.vue'
const drawer = ref(false)
//控制抽屉的打开和关闭
const open = () => {
  drawer.value = !drawer.value
}
//暴露出一个方法来控制抽屉的显示
defineExpose({
  open,
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer
    v-model="drawer"
    title="菜单"
    :with-header="false"
    :size="'50%'"
    class="drawer-style"
  >
    <InfoCard />
  </el-drawer>
</template>

<style scoped></style>
