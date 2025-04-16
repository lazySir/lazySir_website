<script setup lang="ts">
import AuroraBackground from '@/views/global/home/AuroraBackground.vue'
import Marquee from '@/views/global/home/Marquee.vue'
import TitleTag from '@/views/global/home/TitleTag.vue'
</script>

<template>
  <AuroraBackground />
  <div class="w-[1280px] mx-auto">
    <TitleTag icon="mdi:circle-medium" content="项目展示" />
    <Marquee />
  </div>
</template>
<style class="scoped"></style>
