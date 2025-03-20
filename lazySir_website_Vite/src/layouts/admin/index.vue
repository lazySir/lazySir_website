<template>
  <el-watermark :font="font" :content="watermark ? ['世高智能', 'Happy Working'] : ''">
    <component :is="LayoutComponents[layout as LayoutType]" />
  </el-watermark>
</template>

<script lang="ts" setup>
import { useAdminGlobalStore } from '@/stores/admin/global'
import { computed, type Component, watch, reactive } from 'vue'
//四种布局
//@ts-ignore
import LayoutVertical from '@/layouts/admin/Vertical/index.vue'
//@ts-ignore
import LayoutClassic from '@/layouts/admin/Classic/index.vue'
//@ts-ignore
import LayoutTransverse from '@/layouts/admin/Transverse/index.vue'
//@ts-ignore
import LayoutColumns from '@/layouts/admin/Columns/index.vue'
export type LayoutType = 'vertical' | 'classic' | 'transverse' | 'columns'
const LayoutComponents: Record<LayoutType, Component> = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns,
}
//控制当前组件是否销毁
const adminGlobalStore = useAdminGlobalStore()
const layout = computed(() => adminGlobalStore.layout)
watch(() => adminGlobalStore.theme, (newValue, oldValue) => {
  adminGlobalStore.setTheme(newValue)
}, { immediate: true })

const isDark = computed(() => adminGlobalStore.theme);
const watermark = computed(() => adminGlobalStore.watermark);

const font = reactive({ color: "rgba(0, 0, 0, .15)" });
watch(isDark, () => {
  if (isDark.value == 'dark') {
    font.color = "rgba(255, 255, 255, .15)"
  } else {
    font.color = "rgba(0, 0, 0, .15)"
  }
}, {
  immediate: true
});
</script>
<style scoped></style>
