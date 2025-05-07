<script setup lang="ts">
import { ref, onMounted } from 'vue'
import OpcityCard from '@/components/public/opcityCard.vue'
// 引入自定义的标签组件和博客列表组件
import MorphingTabs from '@/components/public/inspiraUI/MorphingTabs.vue'
import { useBlogStore } from '@/stores/blog'
const blogStore = useBlogStore()
onMounted(() => {
  if (blogStore.blogList.length === 0) {
    blogStore.getBlogList()
  }
})
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
</script>

<template>
  <OpcityCard class="w-full p-4 flex flex-col justify-between text-center">
    <div class="flex justify-between">
      <!-- 顶部标签栏组件 -->
      <MorphingTabs
        :tabs="blogStore.folderNames"
        :active-tab="blogStore.activeTab"
        @update:active-tab="blogStore.activeTab = $event"
        :tabBg="{ light: '#009688', dark: '#fff' }"
      />
      <!-- 展示风格图标切换 -->
      <div class="flex justify-center items-center gap-2">
        <IconifyIcon
          v-for="item in styleList"
          :key="item.key"
          @click="blogStore.changeShowStyle(item.key)"
          :style="IconifyStyle"
          :name="item.value"
          :color="item.key === blogStore.showStyle ? '#009688' : '#000'"
        />
      </div>
    </div>
  </OpcityCard>
</template>

<style scoped></style>
