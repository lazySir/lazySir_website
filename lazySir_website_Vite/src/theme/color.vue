<template>
  <el-color-picker
    @change="changePrimary"
    v-model="primary"
    :predefine="predefineColors"
    show-alpha
  >
  </el-color-picker>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import { useAdminGlobalStore } from '@/stores/admin/global'
import { useThemeColor } from '@/hooks/useTheme'
import { storeToRefs } from 'pinia'
const adminGlobalStore = useAdminGlobalStore()
const { primary } = storeToRefs(adminGlobalStore)
const { changePrimary } = useThemeColor()

const predefineColors = ref([
  '#009688',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgb(255, 120, 0)',
  'hsl(181, 100%, 37%)',
])
</script>
<style scoped></style>
