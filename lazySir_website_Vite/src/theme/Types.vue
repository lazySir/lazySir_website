<template>
    <div class="theme">
        <!-- :color="item.value == adminGlobalStore.theme ? `var(--el-color-primary)` : ''" -->
        <IconifyIcon :icon-style="iconStyle" :class="[{ 'active': item.value == adminGlobalStore.theme, 'icon': true },
        { 'themeColor': item.value == adminGlobalStore.theme ? `var(--el-color-primary)` : '' }]"
            @click="adminGlobalStore.setTheme(item.value)"
            :color="item.value == adminGlobalStore.theme ? `var(--el-color-primary)` : ''"
            v-for="(item, index) in icons" :name="item.icon" />
    </div>
</template>

<script setup lang="ts">
import { useAdminGlobalStore } from '@/stores/admin/global';
import { reactive, ref } from 'vue'
const adminGlobalStore = useAdminGlobalStore()
interface GlobalTypes {
    // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
    layoutTypes: "vertical" | "classic" | "transverse" | "columns";
    // 主题
    themeTypes: "light" | "dark" | "auto";
}
interface IconItem {
    value: GlobalTypes['themeTypes'];
    icon: string;
}
const iconStyle = ref({
    width: "40px",
    height: "40px",
})
//主题库
const icons: IconItem[] = reactive([
    { value: "auto", icon: 'gridicons:computer' },
    { value: "light", icon: 'ph:sun-light' },
    { value: "dark", icon: 'iconamoon:mode-dark-light' }
]);
//设置主题

</script>

<style scoped>
.theme {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.themeColor {
    color: var(--el-color-primary)
}

.icon {
    padding: 5px;
}

.active {
    border: 2px solid var(--el-color-primary);
    border-radius: 5px;
}
</style>