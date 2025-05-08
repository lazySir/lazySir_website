<script setup lang="ts">
import { ref } from 'vue'
import DropSelector from '@/views/blog/articles/MainLeft/components/dropSelector.vue'
import { useBlogStore } from '@/stores/blog'
const blogStore = useBlogStore()
interface OptionType {
  value: string
  optionType: 'previewTheme' | 'code'
}

// 编辑器主题
const ThemeselectedOption = ref('default')
const ThemeOptions = [
  { label: 'default', value: 'default' },
  { label: 'github', value: 'github' },
  { label: 'vuepress', value: 'vuepress' },
  { label: 'mk-cute', value: 'mk-cute' },
  { label: 'smart-blue', value: 'smart-blue' },
  { label: 'cyanosis', value: 'cyanosis' },
]

// 代码高亮
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

const selectedChange = (value: OptionType) => {
  if (value.optionType === 'previewTheme') {
    blogStore.previewTheme = value.value
  } else {
    blogStore.codeColor = value.value
  }
}
</script>

<template>
  <div class="p-2">
    <h2 class="text-base font-bold text-center mb-4">⚙️md配置</h2>
    <DropSelector
      label="编辑器模式:"
      :options="ThemeOptions"
      :selected="ThemeselectedOption"
      option-type="previewTheme"
      @change="selectedChange"
    />

    <DropSelector
      class="mt-5"
      label="代码块高亮模式:"
      :options="CodeOptions"
      :selected="CodeSelectedOption"
      option-type="code"
      @change="selectedChange"
    />
  </div>
</template>

<style scoped></style>
