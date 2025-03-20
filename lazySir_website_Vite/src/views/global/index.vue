<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const toBlog = (name: string) => {
  router.push(name)
}
</script>

<template>
  <div>
    <el-button type="primary" @click="toBlog('Blog')">博客</el-button>
    <el-button type="primary" @click="toBlog('/')">菜单</el-button>
    <el-button type="primary" @click="toBlog('adminLogin')">后台</el-button>
  </div>
</template>

<style scoped></style>
