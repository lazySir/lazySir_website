<script setup lang="ts">
import navBar from '@/layouts/blog/components/navbar.vue'
// import NavBarMobile from '@/layouts/front/components/navbar_mobile.vue'
// import Footer from '@/layouts/front/components/footer.vue'
</script>

<template>
  <div
    class="before:content-[''] before:fixed before:inset-0 before:-z-10 before:bg-[url('@/assets/images/blog/blog_bg.png')] before:opacity-[10%] before:bg-repeat before:min-h-full"
  >
    <header>
      <!-- <navBar class="hidden tablet:block" /> -->
      <navBar />
      <!-- <NavBarMobile class="block tablet:hidden" /> -->
    </header>
    <el-scrollbar :height="'calc(100vh - 60px)'">
      <main>
        <router-view></router-view>
      </main>
      <!-- <footer class="w-[100vw] h-[150px] tablet:w-full"><Footer /></footer> -->
    </el-scrollbar>
  </div>
</template>

<style scoped>
.test::bofore {
  content: '';
  inset: 0;
  position: fixed;
  top: 0;
  z-index: -1;
  background-image: url(../../assets/images/blog/blog_bg.png);
  background-repeat: repeat;
  min-height: 100%;
}
</style>
