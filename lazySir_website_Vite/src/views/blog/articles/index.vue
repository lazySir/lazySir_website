<script setup lang="ts">
import { ref } from 'vue'
import markdownContent from '@/views/blog/dir/html/test测试.md?raw'
//左侧配置
import ConfigLeft from '@/views/blog/articles/config.vue'
//博客内容
import Content from '@/views/blog/articles/content.vue'
//右侧目录
import DirectoryRight from '@/views/blog/articles/directory.vue'
const tontent = ref(markdownContent)
const editorId = ref('preview-only')
//检测主题模式
import { useTheme } from '@/hooks/useTheme'
interface OptionType {
  value: string
  optionType: 'previewTheme' | 'code'
}
//md主题的preview-theme
const previewTheme = ref('default')
//md主题的代码块高亮显示code
const codeColor = ref('atom')
//当md配置改变时
const handleOptionsChange = (value: OptionType) => {
  if (value.optionType === 'previewTheme') {
    previewTheme.value = value.value
  }
  if (value.optionType === 'code') {
    codeColor.value = value.value
  }
}
//检测主题模式
const { isDark } = useTheme()
</script>
<template>
  <div class="flex">
    <!-- 左侧固定 -->
    <ConfigLeft @update:modelValue="handleOptionsChange" />
    <!-- 中间内容 -->
    <Content
      :id="editorId"
      :is-dark="isDark"
      :code-color="codeColor"
      :previewTheme="previewTheme"
      :content="tontent"
    />
    <!-- 右侧目录固定 -->
    <DirectoryRight :is-dark="isDark" :editor-id="editorId" />
  </div>
</template>
