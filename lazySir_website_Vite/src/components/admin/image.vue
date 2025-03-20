<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
const imgUrl = ref('')
const serverUrl = import.meta.env.VITE_SERVER_URL

// 定义接收的外部属性，包括图片路径、宽度和高度
const props = defineProps({
    img: {
        type: String,
        default: '@/assets/images/public/avatar.jpg'
    },
    width: {
        type: String,
        default: '100px'
    },
    height: {
        type: String,
        default: '100px'
    }
})

watch(props, (newValue, oldValue) => {
    if (newValue.img.includes('http')) {
        imgUrl.value = newValue.img
    } else {
        imgUrl.value = serverUrl + props.img
    }


}, { immediate: true })
</script>

<template>
    <el-image :style="{ width: props.width, height: props.height, borderRadius: '50%' }" :src="imgUrl" />
</template>

<style scoped></style>