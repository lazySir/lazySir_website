<script setup lang="ts">
import Theme from '@/components/public/Switch/theme.vue'
import mdConfig from '@/views/global/navbar/components/mdConfig.vue'
// 你的菜单项列表
const menuList = [
  { name: '首页', path: '/', icon: 'material-symbols:home-outline' },
  { name: '博客', path: '/blog', icon: 'ic:outline-article' },
  { name: '友链', path: '/friends', icon: 'weui:add-friends-outlined' },
  {
    name: '归档',
    path: '/archive',
    icon: 'material-symbols:archive-outline',
  },
  {
    name: '工具',
    path: '/tools/list',
    icon: 'guidance:tools',
  },
  {
    name: 'github',
    path: 'https://github.com/lazySir',
    icon: 'grommet-icons:github',
  },
  {
    name: 'space-x',
    path: '',
    icon: 'grommet-icons:x',
  },
  {
    name: 'CSDN',
    path: '',
    icon: 'cbi:costco',
  },
]

// 判断当前路径是否激活
const isActive = (path: string) => {
  return window.location.pathname === path
}

// 点击菜单项跳转
const handleClick = (path: string) => {
  window.location.href = path
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

    <!-- 右侧图标区域 -->
    <div class="flex gap-6 mt-6 flex-wrap">
      <el-tooltip
        v-for="item in menuList"
        class="box-item"
        effect="dark"
        :content="item.name"
        placement="bottom"
      >
        <!-- INFO：菜单项 -->
        <IconifyIcon
          @click="handleClick(item.path)"
          :name="item.icon"
          class="hover:text-lazySir_green transition-colors"
          :class="isActive(item.path) ? 'text-lazySir_green font-bold' : ''"
        />
      </el-tooltip>

      <el-tooltip
        class="box-item"
        effect="dark"
        content="主题切换"
        placement="bottom"
      >
        <Theme
      /></el-tooltip>
    </div>

    <mdConfig />
  </div>
</template>

<style scoped></style>
