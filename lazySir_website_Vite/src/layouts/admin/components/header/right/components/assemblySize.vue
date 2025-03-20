<template>

    <el-dropdown class="dropdown" trigger="click" @command="setAssemblySize">
        <IconifyIcon :color="globalStore.theme === 'dark' ? '' : 'black'" name="ic:baseline-format-size" />



        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="item in assemblySizeList" :key="item.value" :command="item.value"
                    :disabled="assemblySize === item.value">
                    {{ item.label }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAdminGlobalStore } from "@/stores/admin/global";
type AssemblySizeType = "large" | "default" | "small";

const globalStore = useAdminGlobalStore();
const assemblySize = computed(() => globalStore.assemblySize);

const assemblySizeList = [
    { label: "默认", value: "default" },
    { label: "大型", value: "large" },
    { label: "小型", value: "small" }
];

const setAssemblySize = (item: AssemblySizeType) => {
    if (assemblySize.value === item) return;
    globalStore.setSize(item);
};
</script>

<style scoped></style>