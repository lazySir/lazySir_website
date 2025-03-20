<template>
  <el-button
    v-if="showButton"
    :link="text"
    :type="buttonType"
    :plain="isDarkMode"
    :icon="props.icon ? props.icon : ''"
    v-bind="$attrs"
  >
    <IconifyIcon
      v-if="!props.icon"
      :name="icon"
      :style="{ width: '15px', height: '15px' }"
    ></IconifyIcon>
    <span :class="{ 'ml-1': !props.icon }">{{ props.content }}</span>
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminGlobalStore } from '@/stores/admin/global' // 引入全局 store
import { hasPermission } from '@/utils/permission' // 引入权限判断函数
import { useAdminAccountStore } from '@/stores/admin/account'

type OBNumber = {
  CREATE: number
  DELETE: number
  UPDATE: number
  READ: number
  DELETES: number
  UPLOAD: number
  DOWNLOAD: number
}

interface Menu extends MenuTypes.Menu {
  permBtn?: number
}
//判断
// 获取 Pinia Store
const adminGlobalStore = useAdminGlobalStore()
const adminAccountStore = useAdminAccountStore()
// 判断当前是否是暗黑模式
const isDarkMode = computed(() => adminGlobalStore.theme === 'dark')

// 设置按钮类型，暗黑模式下设置为 info 类型
const buttonType = computed(() => (isDarkMode.value ? 'info' : 'primary'))

// 查找对应菜单的 permBtn 并判断权限
const findMenu = (menus: Menu[], name: string): Menu | undefined => {
  return menus.find((menu) => {
    if (menu.name === name) {
      return true // 返回匹配的菜单对象
    }
  })
}

// 使用 props 的 name 和 perm 进行权限判断
const props = withDefaults(
  defineProps<{
    name: string
    perm: keyof OBNumber
    size?: string
    icon?: string
    content?: string
    text?: boolean
  }>(),
  {
    text: true,
  },
)

const showButton = computed(() => {
  const menu = findMenu(adminAccountStore.flatMenus, props.name) // 使用从 store 中获取的 menus
  if (menu && menu.permBtn !== undefined) {
    // 判断权限
    return hasPermission(menu.permBtn, props.perm)
  }
  return false
})
// 获取对应的菜单 icon，如果外部传递了 icon 则使用外部传递的值
const icon = computed(() => {
  return props.icon ? props.icon : getIconFromEnv(props.perm)
})
const size = computed(() => {
  return props.size || 'default' // 使用外部传入的 icon，如果没有传入则为空字符串
})
//默认为文字模式 true ，如果有传入text：false
const text = computed(() => {
  return props.text == true ? true : false
})
// 定义一个函数用于从环境变量中获取对应perm的图标
const getIconFromEnv = (perm: keyof OBNumber): string => {
  switch (perm) {
    case 'CREATE':
      return import.meta.env.VITE_AUTH_BTN_ICON_CREATE
    case 'UPDATE':
      return import.meta.env.VITE_AUTH_BTN_ICON_UPDATE
    case 'DELETE':
      return import.meta.env.VITE_AUTH_BTN_ICON_DELETE
    case 'READ':
      return import.meta.env.VITE_AUTH_BTN_ICON_READ
    case 'DELETES':
      return import.meta.env.VITE_AUTH_BTN_ICON_DELETES
    case 'UPLOAD':
      return import.meta.env.VITE_AUTH_BTN_ICON_UPLOAD
    case 'DOWNLOAD':
      return import.meta.env.VITE_AUTH_BTN_ICON_DOWNLOAD
    default:
      return import.meta.env.VITE_AUTH_BTN_ICON_DEFAULT
  }
}
</script>

<style scoped></style>
