<script setup lang="ts">
import { ref } from 'vue'
import SvgIcon from '@/components/public/IconifyIcon/index.vue'
// import AuthBtn from '@/components/public/AuthBtn/index.vue'
const name = ref('ep:menu')
</script>

<template>
  <div class="ms-w-">
    <AuthBtn name="rolePermission" perm="DELETE" type="danger">删除</AuthBtn>
    <AuthBtn
      content="修改"
      name="menuPermission"
      perm="UPDATE"
      size="small"
      type="primary"
    >
    </AuthBtn>
    <!-- <AuthBtn :permBtn="menus" perm="CREATE" />
    <AuthBtn :permBtn="menus" perm="UPDATE" />
    <AuthBtn :permBtn="menus" perm="READ" /> -->
    <button class="bg-sky-500 hover:bg-sky-700 border-1">Save changes</button>
  </div>
  <SvgIcon :name="name" />
</template>

<style scoped></style>
