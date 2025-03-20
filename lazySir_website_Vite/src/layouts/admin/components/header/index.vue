<script setup lang="ts">
import LeftComponents from '@/layouts/admin/components/header/left/index.vue'
import RightComponents from '@/layouts/admin/components/header/right/index.vue'
</script>

<template>
  <div class="header_container">
    <LeftComponents />
    <RightComponents />
  </div>
</template>

<style scoped>
.header_container {
  height: 100%;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
