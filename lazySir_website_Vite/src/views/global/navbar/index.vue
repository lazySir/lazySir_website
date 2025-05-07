<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import SwitchTheme from '@/components/public/Switch/theme.vue'
import Search from '@/views/global/navbar/components/search.vue'
import Drawer from '@/views/global/navbar/components/drawer.vue'
const router = useRouter()
const route = useRoute()

// 导航菜单列表
const menuList = [
  { name: '首页', path: '/' },
  { name: '博客', path: '/blog' },
  { name: '个人作品展示', path: '' }, // 暂无路径
  { name: '线上作品', path: '' }, // 暂无路径
  { name: '友链', path: '/friends' },
]

// 路由跳转函数
const handleClick = (path: string) => {
  if (!path) return
  router.push(path)
}

// 判断当前是否是激活路由
const isActive = (path: string) => route.path === path

// 外部跳转
const goTo = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <nav class="m-auto flex h-[64px] max-w-[1500px] justify-between items-center">
    <!-- Logo 和名称 -->
    <div class="flex gap-3 items-center w-[200px] h-full">
      <img
        class="w-10 h-10"
        src="@/assets/images/public/author_avatar2.png"
        alt=""
      />
      <span
        class="font-bold text-blog_title_text dark:text-blog_title_text_dark"
      >
        lazySir
      </span>
    </div>

    <!-- 菜单栏 -->
    <Drawer />
    <div
      class="hidden tablet:flex w-full justify-end items-center gap-3 h-full"
    >
      <div class="flex gap-5 justify-center items-center h-full">
        <!-- 导航项 -->
        <span
          v-for="(item, index) in menuList"
          :key="index"
          class="cursor-pointer"
          :class="isActive(item.path) ? 'text-lazySir_green font-bold' : ''"
          @click="handleClick(item.path)"
        >
          {{ item.name }}
        </span>

        <span> | </span>

        <!-- 搜索 -->
        <Search class="cursor-pointer" />

        <span> | </span>

        <!-- 右侧图标 -->
        <div class="flex items-center gap-5">
          <SwitchTheme class="cursor-pointer" />
          <span> | </span>
          <IconifyIcon
            @click="goTo('https://github.com/lazySir')"
            class="cursor-pointer"
            name="grommet-icons:github"
          />
          <IconifyIcon class="cursor-pointer" name="grommet-icons:x" />
          <IconifyIcon class="cursor-pointer" name="cbi:costco" />
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
