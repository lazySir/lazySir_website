<template>
  <div class="menu-search-dialog">
    <IconifyIcon @click="handleOpen" name="ic:sharp-search" />
    <el-dialog
      v-model="isShowSearch"
      destroy-on-close
      :modal="false"
      :show-close="false"
      fullscreen
      @click="closeSearch"
    >
      <el-autocomplete
        v-model="searchMenu"
        ref="menuInputRef"
        value-key="path"
        placeholder="菜单搜索 ：支持菜单名称、路径"
        :fetch-suggestions="searchMenuList"
        @select="handleClickMenu"
        @click.stop
      >
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
        <template #default="{ item }">
          <IconifyIcon
            :name="item.meta.icon"
            :style="{ width: '20px', height: '20px' }"
            class="inline-block text-center"
          />
          <span class="text-center text-xs">
            {{ item.meta.title }}
          </span>
        </template>
      </el-autocomplete>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useAdminAccountStore } from '@/stores/admin/account'
import { useAdminAsideStore } from '@/stores/admin/aside'

const adminAsideStore = useAdminAsideStore()
const adminAccountStore = useAdminAccountStore()

// 打开搜索框
const handleOpen = () => {
  isShowSearch.value = true
}

// 是否显示搜索框
const isShowSearch = ref(false)
// 搜索的值
const searchMenu = ref('')

// 搜索的回调
const searchMenuList = (queryString: string, cb: any) => {
  const results = queryString
    ? uniqueMenuList.value.filter(filterNodeMethod(queryString))
    : uniqueMenuList.value
  cb(results)
}

// 筛选菜单
const filterNodeMethod = (queryString: string) => {
  return (restaurant: any) => {
    return (
      restaurant.path.toLowerCase().includes(queryString.toLowerCase()) ||
      restaurant.meta.title.toLowerCase().includes(queryString.toLowerCase())
    )
  }
}

// 搜索窗关闭
const closeSearch = () => {
  isShowSearch.value = false
}

// 点击搜索结果
const handleClickMenu = (menuItem: MenuTypes.Menu) => {
  searchMenu.value = ''
  adminAsideStore.addTag(menuItem)
  adminAsideStore.pushPath(menuItem.name)
  closeSearch()
}

// 拥有的权限菜单列表去重
const menuList = computed(() => {
  return adminAccountStore.menus.flatMap((obj: MenuTypes.Menu) => {
    return obj.children ? [obj, ...obj.children] : obj
  })
})

// 去重后的菜单列表
const uniqueMenuList = computed(() => {
  const seenNames = new Set()
  return menuList.value.filter((menuItem) => {
    if (seenNames.has(menuItem.name)) {
      return false
    } else {
      seenNames.add(menuItem.name)
      return true
    }
  })
})
</script>

<style scoped>
.el-icon {
  margin-left: 15px;
  cursor: pointer;
}

.menu-search-dialog :deep(.el-dialog) {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0 !important;
  box-shadow: unset !important;
}

.menu-search-dialog :deep(.el-dialog) .el-dialog__header {
  border-bottom: none !important;
}

.menu-search-dialog :deep(.el-autocomplete) {
  position: absolute;
  top: 100px;
  left: 50%;
  width: 550px;
  transform: translateX(-50%);
}

.menu-search-dialog :deep(.el-autocomplete) .el-input__wrapper {
  background-color: var(--el-bg-color);
}

.el-autocomplete__popper :deep(.el-icon) {
  position: relative;
  top: 2px;
  font-size: 16px;
}

.el-autocomplete__popper span {
  margin: 0 0 0 10px;
  font-size: 14px;
}
</style>
