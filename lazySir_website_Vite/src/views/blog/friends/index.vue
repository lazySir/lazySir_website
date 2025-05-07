<script setup lang="ts">
import CopySite from '@/views/blog/friends/copySite.vue'
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
</script>

<template>
  <div class="min-h-screen py-10">
    <!-- 页面标题 -->
    <div
      class="text-center mb-6 flex flex-col gap-3 items-center justify-center"
    >
      <h1 class="text-2xl font-bold">🌐友链</h1>
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
    <CopySite />
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
