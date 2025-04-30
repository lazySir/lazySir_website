<script setup lang="ts">
import { useRouter } from 'vue-router'
import RadiantText from '@/components/public/inspiraUI/RadiantText.vue'
import GradientButton from '@/components/public/inspiraUI/GradientButton.vue'
import AuroraBackground from '@/components/public/inspiraUI/Aurora.vue'
import { useTheme } from '@/hooks/useTheme'
import { computed } from 'vue'
const router = useRouter()
const toBlog = (name: string) => {
  router.push(name)
}

let { isDark } = useTheme()
const bgColor = computed(() => (isDark.value ? '#000' : '#fff'))
</script>

<template>
  <AuroraBackground>
    <div
      class="w-[90vw] mx-auto tablet:w-[1280px] h-[50vh] flex items-center justify-between"
    >
      <!-- 左侧 -->
      <div class="flex-1 gap-5 flex flex-col">
        <!-- 左侧上 -->
        <div class="flex flex-col items-start">
          <!-- 招呼 -->
          <div class="flex text-4xl">
            <span
              class="text-4xl font-bold text-blog_title_text bg-gradient-to-r from-blue-400 to-green-600 text-transparent bg-clip-text"
            >
              你好！我是LazySir </span
            >👋
          </div>
          <!-- 明亮文字 -->
          <RadiantText
            class="flex py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
            :duration="8"
          >
            <span class="pt-5 font-bold"
              >✨
              用文字留住片刻心动，用故事连接远方灵魂。写字，是我与世界最温柔的碰面方式。✨
            </span>
          </RadiantText>
        </div>
        <!-- 左侧下 -->
        <div class="flex gap-4">
          <GradientButton
            :colors="['#80ed99', '#38a3a5']"
            :bg-color="bgColor"
            @click="toBlog('Blog')"
          >
            <h1
              class="text-lg text-blog_title_text bg-gradient-to-r from-blue-400 to-green-600 text-transparent bg-clip-text"
            >
              博客
            </h1></GradientButton
          >
          <GradientButton
            :colors="['#80ed99', '#38a3a5']"
            :bg-color="bgColor"
            @click="toBlog('/')"
          >
            <h1
              class="text-lg text-blog_title_text bg-gradient-to-r from-blue-400 to-green-600 text-transparent bg-clip-text"
            >
              菜单
            </h1>
          </GradientButton>
          <GradientButton
            :colors="['#80ed99', '#38a3a5']"
            :bg-color="bgColor"
            @click="toBlog('adminLogin')"
          >
            <h1
              class="text-lg text-blog_title_text bg-gradient-to-r from-blue-400 to-green-600 text-transparent bg-clip-text"
            >
              后台
            </h1></GradientButton
          >
        </div>
      </div>
      <!-- 右侧 -->
      <div class="hidden tablet:block w-[400px] h-[400px]">
        <img src="@/assets/images/public/author_avatar2.png" alt="" />
      </div>
    </div>
  </AuroraBackground>
</template>

<style scoped></style>
