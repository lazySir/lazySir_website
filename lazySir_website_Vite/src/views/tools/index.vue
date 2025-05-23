<!-- src/views/tools/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

//从路由中获取工具路由
import { ToolRoute } from '@/router/tools/index'
const toolRoutes = ref<ToolRoute[]>([])
onMounted(async () => {
  const { default: toolsConstantRoutes } = await import('@/router/tools/index')
  toolRoutes.value = toolsConstantRoutes[0].children as ToolRoute[]
})
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
          v-for="tool in toolRoutes"
          :key="tool.meta.title"
          class="relative flex min-h-24 cursor-pointer items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg"
        >
          <img
            :src="tool.meta.img"
            :alt="tool.meta.title"
            class="w-14 h-14 rounded-lg object-contain shrink-0 border border-gray-200 dark:border-gray-700"
          />
          <div class="pl-4 flex-1">
            <h4 class="text-lg font-semibold">
              <a
                :href="tool.meta.url"
                target="_blank"
                rel="noopener"
                class="text-blog_title_text dark:text-blog_title_text_dark hover:underline"
              >
                {{ tool.meta.title }}
              </a>
            </h4>
            <p
              class="text-sm text-blog_text dark:text-blog_text_dark line-clamp-2 mt-1"
            >
              {{ tool.meta.description }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
