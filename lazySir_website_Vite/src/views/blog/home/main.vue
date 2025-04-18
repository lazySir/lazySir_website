<script setup lang="ts">
import { ref } from 'vue'

const tabs = ['Home', 'Apps', 'About', 'My']
const activeTab = ref(folderMap[0].folder)
import folderMap from '@/utils/blog'
import MorphingTabs from '@/components/public/inspiraUI/MorphingTabs.vue'
</script>

<template>
  <div class="flex w-full bg-blue-50 h-[70vh]">
    <!-- 左侧 -->
    <div class="flex-1">
      <el-card class="min-w-full p-2" shadow="hover">
        <MorphingTabs
          :tabs="folderMap.map((item) => item.folder)"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
          :tabBg="{ light: '#009688', dark: '#fff' }"
        >
        </MorphingTabs>
      </el-card>
    </div>
    <!-- 右侧 -->
    <div class="w-[20vw] bg-red-600">
      <span>右侧内容</span>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.el-card__body) {
  padding: 0px;
}
</style>
