<template>
  <div class="article-search-dialog">
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
        v-model="searchInput"
        ref="inputRef"
        :trigger-on-focus="false"
        value-key="title"
        placeholder="搜索文章：支持标题或标签"
        :fetch-suggestions="searchArticles"
        @select="handleSelectArticle"
        @click.stop
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>

        <!-- 每条搜索结果样式 -->
        <template #default="{ item }">
          <div class="flex flex-col text-sm text-gray-800 dark:text-gray-200">
            <span v-html="highlightMatch(item.title)"></span>
            <div class="text-xs mt-1 text-gray-500">
              🏷️ 标签：
              <span
                v-for="tag in item.tags || []"
                :key="tag"
                v-html="highlightMatch(tag)"
                class="mr-2"
              />
            </div>
          </div>
        </template>
      </el-autocomplete>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { Search } from '@element-plus/icons-vue'

const blogStore = useBlogStore()
const isShowSearch = ref(false)
const searchInput = ref('')

// 打开弹窗
const handleOpen = () => {
  isShowSearch.value = true
}

// 关闭
const closeSearch = () => {
  isShowSearch.value = false
  searchInput.value = ''
}

// 查找逻辑
const searchArticles = (query: string, cb: Function) => {
  const flatList = blogStore.blogList.flatMap((folder) =>
    folder.files.map((file) => ({
      ...file,
      folder: folder.folder,
    })),
  )

  const results = query
    ? flatList.filter(
        (item) =>
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          (item.tags || []).some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
      )
    : flatList

  cb(results.slice(0, 10)) // 最多展示10条
}

// 在 highlightMatch 函数前添加转义方法
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 修改后的高亮函数
const highlightMatch = (text: string) => {
  const keyword = escapeRegExp(searchInput.value)
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 跳转详情
const handleSelectArticle = (article: blogAPITypes.BlogFile) => {
  blogStore.changeCurrentBlog(article)
  isShowSearch.value = false
  searchInput.value = ''
}
</script>

<style scoped>
.el-icon {
  margin-left: 15px;
  cursor: pointer;
}

.article-search-dialog :deep(.el-dialog) {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0 !important;
  box-shadow: unset !important;
}

.article-search-dialog :deep(.el-dialog) .el-dialog__header {
  border-bottom: none !important;
}

.article-search-dialog :deep(.el-autocomplete) {
  position: absolute;
  top: 100px;
  left: 50%;
  width: 550px;
  transform: translateX(-50%);
}

.article-search-dialog :deep(.el-autocomplete) .el-input__wrapper {
  background-color: var(--el-bg-color);
}

/* 高亮关键词 */
/* 修改后 */
:deep(.highlight) {
  background-color: #009688;
  padding: 0 2px;
  color: #fff;
  border-radius: 2px;
  font-weight: bold;
}
</style>
