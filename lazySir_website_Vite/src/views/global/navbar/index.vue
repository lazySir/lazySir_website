<script setup lang="ts">
import { ref } from 'vue'
import SwitchTheme from '@/components/public/Switch/theme.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const activeIndex = ref(0)
</script>

<template>
  <nav class="m-auto flex h-[64px] max-w-[1500px] justify-between items-center">
    <div class="flex gap-3 items-center w-[200px] h-full">
      <img
        class="w-10 h-10"
        src="@/assets/images/public/author_avatar2.png"
        alt=""
      />
      <span class="font-bold text-blog_title_text dark:text-white"
        >lazySir</span
      >
    </div>
    <div class="flex w-full justify-end items-center gap-3 h-full">
      <div class="flex gap-5 justify-center items-center h-full">
        <span>博客</span>
        <span>个人作品展示</span>
        <span>线上作品</span>
        <span> | </span>
        <div class="flex items-center gap-5">
          <SwitchTheme />
          <span> | </span>
          <IconifyIcon name="grommet-icons:github" />
          <IconifyIcon name="grommet-icons:x" />
          <IconifyIcon name="cbi:costco" />
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
:deep(.el-collapse-item__header) {
  background-color: transparent;
}
</style>
