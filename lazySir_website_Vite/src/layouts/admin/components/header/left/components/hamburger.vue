<template>
  <div @click="adminGlobalStore.changeCollapse()" style="padding: 0">
    <IconifyIcon class="hamburger" :class="{ 'is-active': !adminGlobalStore.isCollapse }" name="uis-right-indent" />
  </div>
</template>

<script setup lang="ts">
import { useAdminGlobalStore } from '@/stores/admin/global';
const adminGlobalStore = useAdminGlobalStore()
</script>
<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger:hover {
  cursor: pointer;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
