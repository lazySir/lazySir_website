<script setup lang="ts">
import Tabbar from '@/layouts/order/components/tabbar/index.vue'
import Navbar from '@/layouts/order/components/navbar/index.vue'
</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer>
    <Tabbar />
  </footer>
</template>

<style scoped></style>
