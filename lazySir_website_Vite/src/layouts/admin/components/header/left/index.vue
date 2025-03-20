<script setup lang="ts">
import breadCrumb from './components/breadCrumb.vue'
import hamburger from './components/hamburger.vue'
</script>

<template>
  <div class="l-content">
    <hamburger />
    <breadCrumb />
  </div>
</template>

<style scoped>
.l-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
