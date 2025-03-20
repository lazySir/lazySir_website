<template>
  <div class="logo">
    <!-- <img src="@/assets/vue.svg" alt="" /> -->
    <img
      style="height: 35px"
      src="@/assets/images/public/shigaoLogo.png"
      alt=""
    />
    <img
      v-if="!props.isCollapse"
      style="height: 45px"
      src="@/assets/images/public/shigaoText.png"
      alt=""
    />
    <!-- <h1  class="title">世高智能</h1> -->
  </div>
</template>
<script lang="ts" setup>
let props = defineProps(['isCollapse']) //数组|对象写法都可以
</script>
<style scoped>
.logo {
  box-sizing: border-box;
  height: 55px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 21.5px;
  font-weight: 700;
  color: #303133;
  white-space: nowrap;
}
</style>
