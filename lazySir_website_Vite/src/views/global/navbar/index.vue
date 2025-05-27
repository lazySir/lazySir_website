<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useTemplateRef, ref, onMounted } from 'vue'
import SwitchTheme from '@/components/public/Switch/theme.vue'
import Search from '@/views/global/navbar/components/search.vue'
import Drawer from '@/views/global/navbar/components/drawer.vue'

onMounted(async () => {
  const { default: toolsConstantRoutes } = await import('@/router/tools/index')

  const toolsRoutes = toolsConstantRoutes.map((item) => {
    return {
      title: item.meta.title,
      name: item.name,
      path: item.path,
      children: item.children
        .filter((item) => item.meta.title !== '工具列表')
        .map((item) => ({
          name: item.name,
          title: item.meta.title,
          path: item.meta.url,
        })),
    }
  })
  menuList.value = [...blogRoutes, ...toolsRoutes] as MenuList[]
})

const router = useRouter()
const route = useRoute()
const drawerRef = useTemplateRef('drawer')
const openDrawer = () => {
  drawerRef.value?.open()
}

// 导航菜单列表
let blogRoutes = [
  { title: '首页', path: '/', name: 'Home' },
  { title: '博客', path: '/blog', name: 'BlogHome' },
  { title: '友链', path: '/friends', name: 'Friends' },
  { title: '归档', path: '/archive', name: 'Archive' },
]
interface MenuList {
  name: string
  path: string
  title: string
  children?: MenuList[]
}
// 将 menuList 改为 ref
let menuList = ref<MenuList[]>([])
// 判断主菜单是否激活（支持子路径）
const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

// 判断子菜单是否激活
const isChildActive = (childPath: string) => route.path === childPath

// 路由跳转函数
const handleClick = (name: string) => {
  router.push({ name: name })
}

// 外部跳转
const goTo = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <nav class="m-auto flex h-[64px] max-w-[1500px] justify-between items-center">
    <!-- Logo -->
    <div
      @click="openDrawer"
      class="flex gap-3 cursor-pointer items-center w-[200px] h-full"
    >
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
    <IconifyIcon
      class="block tablet:hidden"
      @click="openDrawer"
      name="uim:bars"
    />
    <Drawer ref="drawer" />

    <div
      class="text-sm dark:text-blog_title_text_dark text-blog_title_text hidden tablet:flex w-full justify-end items-center gap-3 h-full"
    >
      <div class="flex gap-5 justify-center items-center">
        <template v-for="(item, index) in menuList" :key="index">
          <!-- 有子菜单 -->
          <el-dropdown
            v-if="item.children && item.children.length"
            trigger="hover"
          >
            <span
              class="cursor-pointer text-sm"
              :class="isActive(item.path) ? 'text-lazySir_green font-bold' : ''"
            >
              {{ item.title }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(child, cIndex) in item.children"
                  :key="cIndex"
                  @click.native.prevent="handleClick(child.name)"
                  :class="
                    isChildActive(child.path)
                      ? 'text-lazySir_green font-bold'
                      : ''
                  "
                >
                  {{ child.title }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 无子菜单 -->
          <span
            v-else
            class="cursor-pointer"
            :class="isActive(item.path) ? 'text-lazySir_green font-bold' : ''"
            @click="handleClick(item.name)"
          >
            {{ item.title }}
          </span>
        </template>

        <!-- 搜索 -->
        <Search class="hidden tablet:flex cursor-pointer" />
        <span class="hidden laptop:flex"> | </span>

        <!-- 右侧图标 -->
        <div class="hidden laptop:flex items-center gap-5">
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
