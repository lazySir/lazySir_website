<script setup lang="ts">
import navBar from '@/views/global/navbar/index.vue'
</script>

<template>
  <div
    class="before:content-[''] before:fixed before:inset-0 before:-z-10 before:bg-[url('@/assets/images/blog/blog_bg.png')] before:opacity-[10%] before:bg-repeat before:min-h-full"
  >
    <header>
      <navBar />
    </header>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped></style>
