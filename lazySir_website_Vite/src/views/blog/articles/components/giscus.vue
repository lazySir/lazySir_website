<template>
  <!-- 用于挂载 giscus 评论插件的容器 -->
  <div class="giscus" ref="giscusContainer"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// 创建一个 ref 引用 DOM 元素，用于挂载 Giscus 的 <script>
const giscusContainer = ref(null)

onMounted(() => {
  // 创建一个 script 元素
  const script = document.createElement('script')

  // Giscus 客户端脚本地址
  script.src = 'https://giscus.app/client.js'

  // 异步加载，不阻塞页面渲染
  script.async = true

  // 跨域设置（Giscus 要求）
  script.crossOrigin = 'anonymous'

  // 下面是 Giscus 所需的各种配置属性

  // GitHub 仓库，格式：用户名/仓库名
  script.setAttribute('data-repo', 'lazySir/blog-comments')

  // GitHub 仓库的全局唯一 ID（从 giscus 官网生成脚本时自动带出）
  script.setAttribute('data-repo-id', 'R_kgDOOm6wig')

  // 你选定用于存放评论的 Discussions 分类名
  script.setAttribute('data-category', 'Announcements')

  // 该分类的唯一 ID（也是从 giscus 官网生成脚本时自动提供）
  script.setAttribute('data-category-id', 'DIC_kwDOOm6wis4CqFYI')

  // 评论映射规则，这里使用 pathname（即 URL 路径）
  script.setAttribute('data-mapping', 'pathname')

  // 是否启用严格匹配路径（0 = 否）
  script.setAttribute('data-strict', '0')

  // 是否开启 GitHub 表情反应功能（+1、❤️ 等）
  script.setAttribute('data-reactions-enabled', '1')

  // 是否发送评论元数据（一般设为 0）
  script.setAttribute('data-emit-metadata', '0')

  // 评论框输入框位置：bottom（下方）或 top（上方）
  script.setAttribute('data-input-position', 'bottom')

  // 默认使用的主题（也可以使用 preferred_color_scheme）
  script.setAttribute('data-theme', 'light')

  // 评论语言（此处为简体中文）
  script.setAttribute('data-lang', 'zh-CN')

  // 将 script 挂载到评论容器中
  giscusContainer.value.appendChild(script)
})
</script>
