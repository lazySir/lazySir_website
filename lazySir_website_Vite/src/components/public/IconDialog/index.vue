<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import iconList from '@/utils/icons' // 从 utils 文件导入图标列表

// Props
interface Props {
  modelValue: string
}
const props = defineProps<Props>()

// Emits
const emits = defineEmits(['update:modelValue'])

// Selected icon state
const selectedIcon = ref(props.modelValue)

// Popover visibility state
const popoverVisible = ref(false) // 控制弹窗显示隐藏

// Watch modelValue to update selectedIcon when modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    selectedIcon.value = newValue
  },
)

// Pagination logic
const currentPage = ref(1)
const itemsPerPage = 20 // 每页显示的图标数量
const paginatedIcons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return iconList.slice(start, start + itemsPerPage) // 使用自定义图标列表
})

const totalPages = computed(() => Math.ceil(iconList.length / itemsPerPage))
// Handle pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Handle confirm
const confirmSelection = () => {
  emits('update:modelValue', selectedIcon.value) // 触发确认事件
  popoverVisible.value = false // 隐藏弹窗
}

// Handle cancel
const cancelSelection = () => {
  emits('update:modelValue', '') // 清空选中的图标
  popoverVisible.value = false // 隐藏弹窗
}

// Handle icon click
const selectIcon = (icon: string) => {
  selectedIcon.value = icon // 设置为当前选中的图标
}
</script>

<template>
  <el-popover :visible="popoverVisible" trigger="focus" :width="350">
    <template #reference>
      <!-- Use the selected icon to display in the button -->
      <el-button @click="popoverVisible = true">
        <IconifyIcon :name="modelValue" /> {{ modelValue }}
      </el-button>
    </template>
    <div class="el-icon-picker">
      <div class="icon-grid">
        <component
          v-for="icon in paginatedIcons"
          :key="icon"
          :class="['icon', { 'icon-active': icon === selectedIcon }]"
          @click="selectIcon(icon)"
        >
          <div class="icon-wrapper">
            <!-- Use IconifyIcon component to display icons -->
            <IconifyIcon :name="icon" />
          </div>
        </component>
      </div>

      <div class="pagination">
        <div class="left">
          <el-button
            @click="prevPage"
            size="default"
            :disabled="currentPage === 1"
            >上一页</el-button
          >
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <el-button
            @click="nextPage"
            size="default"
            :disabled="currentPage === totalPages"
            >下一页</el-button
          >
        </div>

        <div class="right">
          <el-button type="primary" @click="confirmSelection">确认</el-button>
          <el-button type="default" @click="cancelSelection">取消</el-button>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<style scoped>
.el-icon-picker {
  width: 330px;
  height: auto;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  max-height: 150px;
  overflow: hidden;
  flex-grow: 1;
}

.icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.icon:hover {
  background-color: #f5f7fa;
}

.icon-active {
  border-color: var(--el-color-primary);
  background-color: rgba(0, 123, 255, 0.4);
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 5px 0;
}

.left,
.right {
  display: flex;
  align-items: center;
}
</style>
