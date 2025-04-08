<script setup lang="ts">
import NavBar from '@/views/global/navbar/index.vue'
import home from '@/views/global/home/index.vue'
</script>

<template>
  <Header>
    <NavBar />
  </Header>

  <Main class="mx-auto w-[1280px]">
    <home />
  </Main>
</template>

<style scoped></style>
