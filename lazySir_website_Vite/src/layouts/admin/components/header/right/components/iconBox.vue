<script setup lang="ts">
import Collapse from '@/layouts/admin/components/header/right/components/collapse.vue'
import Search from '@/layouts/admin/components/header/right/components/search.vue'
import Clothes from '@/layouts/admin/components/header/right/components/clothes/index.vue'
import assemblySize from '@/layouts/admin/components/header/right/components/assemblySize.vue'
import Bell from '@/layouts/admin/components/header/right/components/bell.vue'
</script>

<template>
  <div class="icons">
    <IconifyIcon name="iconoir:language" />

    <Clothes />
    <assemblySize />
    <Search />
    <Collapse />
    <Bell />
  </div>
</template>

<style scoped>
.icons {
  display: flex;
  gap: 20px;
  cursor: pointer;
}
</style>
