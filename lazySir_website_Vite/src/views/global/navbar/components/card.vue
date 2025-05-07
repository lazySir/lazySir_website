<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'
const blogStore = useBlogStore()
// 你的菜单项列表
const menuList = [
  { name: '首页', path: '/' },
  { name: '博客', path: '/blog' },
  { name: '关于', path: '/about' },
  // 其他菜单项...
]

// 判断当前路径是否激活
const isActive = (path: string) => {
  return window.location.pathname === path
}

// 点击菜单项跳转
const handleClick = (path: string) => {
  window.location.href = path
}
// 外部跳转函数
const goTo = (url: string) => {
  window.location.href = url
}
</script>

<template>
  <!-- 抽屉内容 -->
  <div class="flex flex-col gap-6 justify-center items-center">
    <!-- INFO：头像、签名、以及一些tag -->
    <div>
      <img
        class="w-14 h-14 rounded-full"
        src="@/assets/images/public/author_avatar.jpg"
        alt=""
      />
    </div>

    <!-- 导航项 -->
    <div
      v-for="(item, index) in menuList"
      :key="index"
      class="cursor-pointer text-lg font-medium transition-all hover:text-lazySir_green"
      :class="isActive(item.path) ? 'text-lazySir_green font-bold' : ''"
      @click="handleClick(item.path)"
    >
      {{ item.name }}
    </div>

    <!-- 右侧图标区域 -->
    <div class="flex gap-6 mt-6">
      <SwitchTheme class="cursor-pointer text-lg" />
      <IconifyIcon
        @click="goTo('https://github.com/lazySir')"
        class="cursor-pointer text-lg hover:text-lazySir_green transition-colors"
        name="grommet-icons:github"
      />
      <IconifyIcon
        class="cursor-pointer text-lg hover:text-lazySir_green transition-colors"
        name="grommet-icons:x"
      />
      <IconifyIcon
        class="cursor-pointer text-lg hover:text-lazySir_green transition-colors"
        name="cbi:costco"
      />
    </div>
  </div>
</template>

<style scoped></style>
