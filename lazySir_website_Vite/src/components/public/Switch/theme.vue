<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <IconifyIcon
    :name="isDark ? 'mdi:weather-night' : 'material-symbols:sunny-outline'"
    class="icon hover:scale-110 hover:text-lazySir_green transition duration-300 cursor-pointer"
    @click="toggleTheme()"
  />
</template>

<style scoped>
.icon {
  font-size: 24px;
}
</style>
