<script setup lang="ts">
import { ref } from 'vue'
import InfoCard from '@/views/global/navbar/components/card.vue'
const drawer = ref(false)
</script>

<template>
  <!-- 移动端显示的菜单按钮 -->
  <IconifyIcon
    class="block tablet:hidden"
    @click="drawer = true"
    name="uim:bars"
  />

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
