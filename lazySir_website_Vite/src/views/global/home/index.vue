<script setup lang="ts">
import AuroraBackground from '@/views/global/home/AuroraBackground.vue'
import Marquee from '@/views/global/home/Marquee.vue'
import TitleTag from '@/views/global/home/TitleTag.vue'
</script>

<template>
  <!-- 卡片 -->
  <AuroraBackground />
  <div class="w-[90vw] tablet:w-[1280px] mx-auto">
    <!-- 项目展示 -->
    <TitleTag icon="mdi:circle-medium" content="项目展示" />
    <Marquee />
  </div>
</template>
<style class="scoped"></style>
