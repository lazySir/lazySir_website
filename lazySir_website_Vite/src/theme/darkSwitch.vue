<template>
    <el-switch @change="changeTheme" v-model="isActive" class="mt-2"
        style="--el-switch-on-color: #0d0d0d; --el-switch-off-color: #8B8989" inline-prompt :active-icon="Moon"
        :inactive-icon="Sunny" />
</template>

<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useAdminGlobalStore } from '@/stores/admin/global';
const adminGlobalStore = useAdminGlobalStore()
let isActive = ref(false)
//改变主题
const changeTheme = () => {
    adminGlobalStore.setTheme(isActive.value ? 'dark' : 'auto')
}
watch(() => adminGlobalStore.theme, (newValue, oldValue) => {
    adminGlobalStore.setTheme(newValue)
    if (newValue == 'dark') {
        isActive.value = true
    } else {
        isActive.value = false
    }
}, { immediate: true })

</script>
<style scoped>
.el-switch {
    margin-left: 15px;
}
</style>