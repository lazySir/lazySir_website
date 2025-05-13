<template>
  <!-- 用于挂载 giscus 评论插件的容器 -->
  <div class="giscus" ref="giscusContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, useTemplateRef, watch } from 'vue'

// 定义 Props
const props = defineProps<{
  theme: 'light' | 'dark'
}>()

// DOM 容器 ref
const giscusContainer = useTemplateRef('giscusContainer')

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'

  // Giscus 配置
  script.setAttribute('data-repo', 'lazySir/blog-comments')
  script.setAttribute('data-repo-id', 'R_kgDOOm6wig')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOOm6wis4CqFYI')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', props.theme) // 初始主题
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')

  // 插入 script 到容器
  if (giscusContainer.value) {
    giscusContainer.value.appendChild(script)
  }
})

// 监听 theme 改变，向 Giscus iframe 发送主题切换消息
watch(
  () => props.theme,
  (newTheme) => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe.giscus-frame',
    )
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme: newTheme,
            },
          },
        },
        'https://giscus.app',
      )
    }
  },
)
</script>
