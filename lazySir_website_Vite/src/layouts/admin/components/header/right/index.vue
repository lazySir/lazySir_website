<template>
  <div class="r-content">
    <iconBox></iconBox>
    <username></username>
    <avatar></avatar>
  </div>
</template>
<script lang="ts" setup>
import avatar from '@/layouts/admin/components/header/right/components/avatar.vue'
import username from '@/layouts/admin/components/header/right/components/username.vue'
import iconBox from '@/layouts/admin/components/header/right/components/iconBox.vue'
</script>
<style scoped>
.r-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
