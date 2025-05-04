<template>
  <div class="article-search-dialog">
    <el-input
      @click="handleOpen"
      style="width: 240px"
      placeholder="搜索文章:支持标题或标签"
      :suffix-icon="Search"
    />
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
        placeholder="搜索文章:支持标题或标签"
        :fetch-suggestions="searchArticles"
        @select="handleSelectArticle"
        @click.stop
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>

        <!-- 每条搜索结果样式 -->
        <template #default="{ item }">
          <div
            class="flex flex-col text-sm text-gray-800 dark:text-gray-200 mb-4"
          >
            <!-- 增加间隔 -->
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
  margin-left: 2vw; /* 使用vw单位 */
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
  top: 10vh; /* 使用vh单位 */
  left: 50%;
  width: 60vw; /* 使用vw单位 */
  max-width: 700px; /* 设置最大宽度 */
  transform: translateX(-50%);
  height: 7vh; /* 使用vh单位 */
  max-height: 50vh; /* 设置最大高度 */
}

.article-search-dialog :deep(.el-autocomplete) .el-input__wrapper {
  background-color: var(--el-bg-color);
  font-size: 0.9vw; /* 使用更小的vw单位调整字体大小 */
  height: 100%; /* 使输入框占满整个容器 */
  padding: 1vh 1vw; /* 增加内边距，使用vh和vw单位 */
  overflow: hidden; /* 确保内容不会超出边界 */
}

/* 高亮关键词 */
:deep(.highlight) {
  background-color: #009688;
  padding: 0 0.2vw;
  color: #fff;
  border-radius: 2px;
  font-weight: bold;
}
</style>
