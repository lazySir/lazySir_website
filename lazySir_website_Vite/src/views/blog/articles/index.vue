<script setup lang="ts">
import { ref } from 'vue'
//左侧配置
import ConfigLeft from '@/views/blog/articles/config.vue'
//博客内容
import Content from '@/views/blog/articles/content.vue'
//右侧目录
import DirectoryRight from '@/views/blog/articles/directory.vue'
//引入hooks将filename匹配对应的懒加载路由
import { useMarkdownLoader } from '@/hooks/useMarkdownLoader'
import { useRoute } from 'vue-router'
//检测主题模式
import { useTheme } from '@/hooks/useTheme'
const route = useRoute()
const { content } = useMarkdownLoader(route.params.filename as string)
const tontent = ref(content)
const editorId = ref('preview-only')
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
