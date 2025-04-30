<script setup lang="ts">
import { ref } from 'vue'
interface OptionType {
  value: string
  optionType: 'previewTheme' | 'code'
}
const emit = defineEmits<{
  (e: 'update:modelValue', value: OptionType): void
}>()

//主题模式
const ThemeselectedOption = ref('default')
const ThemeOptions = [
  { label: 'default', value: 'default' },
  { label: 'github', value: 'github' },
  { label: 'vuepress', value: 'vuepress' },
  { label: 'mk-cute', value: 'mk-cute' },
  { label: 'smart-blue', value: 'smart-blue' },
  { label: 'cyanosis', value: 'cyanosis' },
]
const selectedChange = (value: OptionType) => {
  ThemeselectedOption.value = value.value
  emit('update:modelValue', value)
}
//代码块高亮
const CodeSelectedOption = ref('atom')
const CodeOptions = [
  { label: 'atom', value: 'atom' },
  { label: 'a11y', value: 'a11y' },
  { label: 'github', value: 'github' },
  { label: 'gradient', value: 'gradient' },
  { label: 'kimbie', value: 'kimbie' },
  { label: 'paraiso', value: 'paraiso' },
  { label: 'qtcreator', value: 'qtcreator' },
  { label: 'stackoverflow', value: 'stackoverflow' },
]
</script>

<template>
  <div
    class="w-[15vw] p-4 border-r sticky top-[80px] h-[calc(100vh-80px)] overflow-auto flex flex-col gap-6 bg-white"
  >
    <!-- 编辑器模式 -->
    <div class="flex flex-col gap-2">
      <div
        class="text-sm font-semibold text-gray-700 flex items-center justify-between"
      >
        <span>编辑器模式</span>
      </div>
      <el-dropdown trigger="click" class="w-full">
        <div
          class="el-dropdown-link flex items-center justify-between p-2 border rounded hover:bg-gray-100 cursor-pointer"
        >
          <span>{{ ThemeselectedOption }}</span>
          <el-icon><arrow-down /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in ThemeOptions"
              :key="item.value"
              @click="
                selectedChange({
                  value: item.value,
                  optionType: 'previewTheme',
                })
              "
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 代码块高亮模式 -->
    <div class="flex flex-col gap-2">
      <div
        class="text-sm font-semibold text-gray-700 flex items-center justify-between"
      >
        <span>代码块高亮</span>
      </div>
      <el-dropdown trigger="click" class="w-full">
        <div
          class="el-dropdown-link flex items-center justify-between p-2 border rounded hover:bg-gray-100 cursor-pointer"
        >
          <span>{{ CodeSelectedOption }}</span>
          <el-icon><arrow-down /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in CodeOptions"
              :key="item.value"
              @click="selectedChange({ value: item.value, optionType: 'code' })"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped></style>
