<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const toBlog = (name: string) => {
  router.push(name)
}
</script>

<template>
  <div class="w-full h-[50vh] flex justify-between">
    <!-- 左侧 -->
    <div class="flex-1 flex flex-col justify-center">
      <h1
        class="text-4xl font-bold text-blog_title_text bg-gradient-to-r from-blue-400 to-green-600 text-transparent bg-clip-text"
      >
        你好！我是LazySir
      </h1>

      <p class="pt-4 text-blog_text">
        一个执着于用文字记录成长、用故事连接共鸣的写作者。探索与分享，是我与这个世界对话的方式。
      </p>
    </div>
    <!-- 右侧 -->
    <div class="img_bg">
      <img src="@/assets/images/public/author_avatar2.png" alt="" />
      <div class=""></div>
    </div>
  </div>
  <div>
    <el-button type="primary" @click="toBlog('Blog')">博客</el-button>
    <el-button type="primary" @click="toBlog('/')">菜单</el-button>
    <el-button type="primary" @click="toBlog('adminLogin')">后台</el-button>
  </div>
</template>
<style class="scoped">
.img_bg {
  height: 700px;
  width: 700px;
  background: (120deg, #69e395 30%, #41d1ff);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  color: transparent;
}
</style>
