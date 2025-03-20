<script setup lang="ts" name="IconifyIcon">
import { Icon } from '@iconify/vue'
import type { CSSProperties } from 'vue'

interface IconifyProps {
  name: string // 图标的名称 ==> 必传
  color?: string // 图标的颜色 ==> 非必传
  iconStyle?: CSSProperties // 图标的样式 ==> 非必传
}

const props = withDefaults(defineProps<IconifyProps>(), {
  iconStyle: () => ({ width: '20px', height: '20px' }),
})
</script>

<template>
  <Icon :icon="props.name" :color="props.color" :style="props.iconStyle" />
</template>

<style>
svg {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
