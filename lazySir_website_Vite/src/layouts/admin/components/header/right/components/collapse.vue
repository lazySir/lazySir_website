<template>
    <el-icon size="20px" @click="changeToggle">
        <IconifyIcon name='ic-baseline-zoom-in-map' v-if="isToggle" />
        <IconifyIcon name='ic-baseline-zoom-out-map' v-else />
    </el-icon>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
const { toggle } = useFullscreen()
const isToggle = ref(false)
const changeToggle = (): void => {
    toggle()
    isToggle.value = !isToggle.value
}
</script>

<style scoped lang="scss"></style>