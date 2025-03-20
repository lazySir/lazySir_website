<script setup lang="ts">
import { ref } from 'vue'
const dialogTableVisible = ref(false)
interface Option {
    key: number
    label: string

}
const handleIsShow = () => {
    dialogTableVisible.value = true
}
defineExpose({
    handleIsShow
})
const emit = defineEmits(['sendValue']);
const handleSend = () => {
    emit('sendValue', value.value)
}

const generateData = () => {
    const data: Option[] = []
    const states = [
        '发布人',
        '状态',
        '是否热招',

    ]

    states.forEach((city, index) => {
        data.push({
            label: city,
            key: index,
        })
    })
    return data
}

const data = ref<Option[]>(generateData())
const value = ref([])


</script>

<template>
    <el-dialog v-model="dialogTableVisible" width="650">
        <el-transfer @chang="handleSend" :titles="['未选择', '已选择']" :button-texts="['移除', '增加']" v-model="value"
            filterable filter-placeholder="搜索" :data="data" />
    </el-dialog>
</template>

<style scoped></style>
