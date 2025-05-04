<script setup lang="ts">
import { ref } from 'vue'

// 友链数据
const friends = [
  {
    title: '愧怍',
    description: '道阻且长，行则将至',
    website: 'https://kuizuo.me',
    avatar: 'https://kuizuo.me/img/logo.png',
  },
  {
    title: 'Vue.js',
    description: '渐进式 JavaScript 框架。',
    website: 'https://vuejs.org',
    avatar: 'https://vuejs.org/images/logo.png',
  },
  {
    title: 'Tailwind CSS',
    description: '功能类优先的 CSS 框架。',
    website: 'https://tailwindcss.com',
    avatar: 'https://tailwindcss.com/favicons/favicon-32x32.png',
  },
]

// 本站信息
const siteInfo = `title: 'lazySir'
description: '平安喜乐,万事胜意'
website: 'lazySir.me'
avatar: 'https://matuimg.com/i/2025/05/04/128smlk.png'
`.trim()

const copied = ref(false)

function copySiteInfo() {
  navigator.clipboard.writeText(siteInfo).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  })
}
</script>

<template>
  <div class="min-h-screen py-10">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold">🌐 友链</h1>
      <p class="text-gray-600 dark:text-gray-400">网络如桥，友情无碍。</p>
    </div>

    <!-- 友链卡片 -->
    <div class="max-w-6xl mx-auto px-4">
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <li
          v-for="friend in friends"
          :key="friend.title"
          class="relative flex min-h-24 cursor-pointer items-center rounded-lg bg-white dark:bg-gray-800 px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg"
        >
          <img
            :src="friend.avatar"
            :alt="friend.title"
            class="w-16 h-16 rounded-full object-contain shrink-0"
          />
          <div class="pl-4 flex-1">
            <h4 class="text-lg font-semibold">
              <a
                :href="friend.website"
                target="_blank"
                rel="noopener"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ friend.title }}
              </a>
            </h4>
            <p
              class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1"
            >
              {{ friend.description }}
            </p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 复制本站信息按钮 -->
    <div class="fixed bottom-4 left-4">
      <el-button
        size="small"
        type="primary"
        @click="copySiteInfo"
        class="transition-all hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400"
      >
        复制本站信息
      </el-button>
      <transition name="fade">
        <span
          v-if="copied"
          class="text-green-600 dark:text-green-400 text-xs font-medium mt-2"
        >
          ✅ 已复制
        </span>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
