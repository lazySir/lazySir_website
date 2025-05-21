<!-- src/views/tools/index.vue -->
<script setup lang="ts">
// 工具数据
const tools = [
  {
    title: '智能 ToDo List',
    description: '极简但强大的任务管理工具，支持提醒、导入导出等功能。',
    url: 'https://www.lazysir.me/tools/todoList',
    icon: 'https://cdn.jsdelivr.net/gh/lazySir/image-host/lazySir_website/tools/todoList.png',
  },
  {
    title: 'WebCrypto 加密工具',
    description: '前端加密存储工具，支持 AES、PBKDF2、导出密钥等。',
    url: 'https://www.lazysir.me/tools/webCrypto',
    icon: 'https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/tools/webCrypto.png',
  },
  {
    title: '二维码生成器',
    description: '快速生成批量/单个二维码，支持自定义内容、大小、颜色等。',
    url: 'https://www.lazysir.me/tools/qrcode',
  },
]
</script>

<template>
  <div class="min-h-screen py-10">
    <!-- 页面标题 -->
    <div
      class="text-center mb-6 flex flex-col gap-3 items-center justify-center"
    >
      <h1 class="text-2xl font-bold">🛠 工具箱</h1>
      <p class="text-gray-600 dark:text-gray-400">
        简洁而高效的开发者工具集合。
      </p>
    </div>

    <!-- 工具卡片 -->
    <div class="max-w-6xl mx-auto px-4">
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <li
          v-for="tool in tools"
          :key="tool.title"
          class="relative flex min-h-24 cursor-pointer items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg"
        >
          <img
            :src="tool.icon"
            :alt="tool.title"
            class="w-14 h-14 rounded-lg object-contain shrink-0 border border-gray-200 dark:border-gray-700"
          />
          <div class="pl-4 flex-1">
            <h4 class="text-lg font-semibold">
              <a
                :href="tool.url"
                target="_blank"
                rel="noopener"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ tool.title }}
              </a>
            </h4>
            <p
              class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1"
            >
              {{ tool.description }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
