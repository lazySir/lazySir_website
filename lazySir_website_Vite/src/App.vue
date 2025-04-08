<template>
  <el-config-provider :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import { useAdminGlobalStore } from '@/stores/admin/global'
import { storeToRefs } from 'pinia'
import { useThemeColor } from '@/hooks/useTheme'
const { initTheme } = useThemeColor()
const adminGlobalStore = useAdminGlobalStore()
const { theme } = storeToRefs(adminGlobalStore)
//页面加载时立刻执行一次主题颜色变更
watch(
  theme,
  (newValue, oldValue) => {
    initTheme()
  },
  { immediate: true },
)

// element assemblySize
const assemblySize = computed(() => adminGlobalStore.assemblySize)

// element button config
const buttonConfig = reactive({ autoInsertSpace: false })
</script>

<style></style>
