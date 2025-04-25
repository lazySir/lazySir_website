<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 引入获取博客结构化数据的工具方法
import { getStructuredBlogList } from '@/utils/blog'

// 博客结构化列表，包含多个文件夹及其内容
const structuredList = ref([] as blogAPITypes.BlogFolder[])

// 页面加载完成后获取博客结构数据
onMounted(async () => {
  structuredList.value = await getStructuredBlogList()
  activeTab.value = navList.value[0] ?? '' // 默认选中第一个标签，防止为空
})

// 计算属性：提取每个博客文件夹的 folder 名称用于导航标签
const navList = computed(() => {
  const folderList = structuredList.value.map((item) => item.folder)
  folderList.unshift('all') // 在数组的开头插入 'all'
  return folderList
})

// 当前选中的标签名，初始为空字符串，避免未定义
const activeTab = ref('')

// 引入自定义的标签组件和博客列表组件
import MorphingTabs from '@/components/public/inspiraUI/MorphingTabs.vue'
import BlogList from '@/views/blog/home/list.vue'

// Iconify 图标样式定义
const IconifyStyle = { width: '18px', height: '18px' }
// 可供切换的展示样式
const styleList = ref<blogAPITypes.DisplayModeOption[]>([
  {
    name: '列表',
    key: 'list',
    value:
      'streamline:interface-text-formatting-justified-align-justified-align-alignment-paragraph-formatting-text',
  },
  {
    name: '瀑布流',
    key: 'waterfall',
    value: 'streamline:layout-window-2',
  },

  {
    name: '卡片',
    key: 'card',
    value: 'streamline:interface-layout-border-full-grid-layout-layouts-module',
  },
])

// 当前展示样式，默认为瀑布流
const ShowStyle = ref<blogAPITypes.DisplayMode>('list')

// 切换展示样式的处理函数
const changeShowStyle = (key: blogAPITypes.DisplayMode) => {
  ShowStyle.value = key
}
</script>

<template>
  <div class="flex w-full min-h-[70vh]">
    <!-- 左侧内容区域 -->
    <div class="w-[60vw] max-w-[60vw]">
      <el-card class="min-w-full p-1" shadow="hover">
        <div class="flex justify-between">
          <!-- 顶部标签栏组件 -->
          <MorphingTabs
            :tabs="navList"
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
            :tabBg="{ light: '#009688', dark: '#fff' }"
          />
          <!-- 展示风格图标切换 -->
          <div class="flex justify-center items-center gap-2">
            <IconifyIcon
              v-for="item in styleList"
              :key="item.key"
              @click="changeShowStyle(item.key)"
              :style="IconifyStyle"
              :name="item.value"
              :color="item.key === ShowStyle ? '#009688' : '#000'"
            />
          </div>
        </div>
      </el-card>
      <!-- 博客列表内容区域 -->
      <BlogList :show-style="ShowStyle" :folder="activeTab" />
    </div>

    <!-- 右侧预留区域 -->
    <div class="w-[15vw] flex justify-center">
      <span>右侧内容</span>
    </div>
  </div>
</template>

<style scoped>
/* 移除 el-card 默认内边距 */
::v-deep(.el-card__body) {
  padding: 0px;
}
</style>
