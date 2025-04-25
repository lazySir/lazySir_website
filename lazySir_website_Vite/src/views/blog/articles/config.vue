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
    class="w-[15vw] p-4 border-r sticky top-[80px] h-[calc(100vh-80px)] overflow-auto"
  >
    <div class="flex items-center justify-center">
      <span>编辑器模式：</span>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          {{ ThemeselectedOption
          }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in ThemeOptions"
              @click="
                selectedChange({
                  value: item.value,
                  optionType: 'previewTheme',
                })
              "
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div>
      <span>代码块高亮模式：</span>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          {{ CodeSelectedOption
          }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in CodeOptions"
              @click="selectedChange({ value: item.value, optionType: 'code' })"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped></style>
