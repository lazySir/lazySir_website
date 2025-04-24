<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref(folderMap[0].folder)
import folderMap from '@/utils/blog'
import MorphingTabs from '@/components/public/inspiraUI/MorphingTabs.vue'
import BlogList from '@/views/blog/home/list.vue'
const IconifyStyle = { width: '18px', height: '18px' }
type ShowStyle = 'waterfall' | 'card' | 'list'
interface showStyleList {
  name: string
  key: ShowStyle
  value: string
}
const styleList = ref<Array<showStyleList>>([
  {
    name: '瀑布流',
    key: 'waterfall',
    value: 'streamline:layout-window-2',
  },
  {
    name: '列表',
    key: 'list',
    value:
      'streamline:interface-text-formatting-justified-align-justified-align-alignment-paragraph-formatting-text',
  },
  {
    name: '卡片',
    key: 'card',
    value: 'streamline:interface-layout-border-full-grid-layout-layouts-module',
  },
])
const ShowStyle = ref<ShowStyle>('waterfall')
const changeShowStyle = (key: ShowStyle) => {
  ShowStyle.value = key
}
</script>

<template>
  <div class="flex w-full bg-blue-50 min-h-[70vh]">
    <!-- 左侧 -->
    <div class="w-[60vw] max-w-[60vw]">
      <el-card class="min-w-full p-1" shadow="hover">
        <div class="flex justify-between">
          <MorphingTabs
            :tabs="folderMap.map((item) => item.folder)"
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
            :tabBg="{ light: '#009688', dark: '#fff' }"
          >
          </MorphingTabs>
          <div class="flex justify-center items-center gap-2">
            <IconifyIcon
              v-for="item in styleList"
              @click="changeShowStyle(item.key)"
              :style="IconifyStyle"
              :name="item.value"
              :color="item.key === ShowStyle ? '#009688' : '#000'"
            />
          </div>
        </div>
      </el-card>
      <BlogList :show-style="ShowStyle" :folder="activeTab" />
    </div>
    <!-- 右侧 -->
    <div class="w-[15vw] flex justify-center bg-red-600">
      <span>右侧内容</span>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.el-card__body) {
  padding: 0px;
}
</style>
