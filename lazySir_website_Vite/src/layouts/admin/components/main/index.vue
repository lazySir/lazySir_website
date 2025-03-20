<template>
  <div class="main_container">
    <el-scrollbar height="75vh">
      <router-view />
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
.main_container {
  box-sizing: border-box;
  padding: 20px;
  height: 100%;
  overflow-x: hidden;
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  box-shadow: 0 0 12px #0000000d;
}
</style>
