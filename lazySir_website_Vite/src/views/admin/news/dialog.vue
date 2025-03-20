<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps({
    dialogFormVisible: {
        type: Boolean,
        default: false
    },
})

const newsInfo = ref({} as adminNewsTypes.news)
//赋值
const setNewsInfo = (val: adminNewsTypes.news) => {
    newsInfo.value = val

}
const dialogFormVisible = computed(() => {
    return props.dialogFormVisible
})
const emits = defineEmits(['close'])
const close = () => {
    emits('close')
}
defineExpose({
    setNewsInfo
})
</script>

<template>
    <el-dialog @close="close" :model-value="dialogFormVisible" title="详情内容" width="900">
        <el-row :gutter="10">
            <el-col>
                <el-form :model="newsInfo" label-width="auto">
                    <el-form-item label="标题">
                        <el-input disabled v-model="newsInfo.title" />
                    </el-form-item>
                    <el-form-item label="公司">
                        <el-input disabled v-model="newsInfo.companyValue" placeholder="" />
                    </el-form-item>
                    <el-form-item label="创建人">
                        <el-input disabled v-model="newsInfo.nickName" placeholder="" />
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-input disabled v-model="newsInfo.createDate" placeholder="" />
                    </el-form-item>
                    <el-form-item label="更新人">
                        <el-input disabled v-model="newsInfo.updateNickName" placeholder="" />
                    </el-form-item>
                    <el-form-item label="更新时间">
                        <el-input disabled v-model="newsInfo.updateDate" placeholder="" />
                    </el-form-item>
                    <el-form-item label="点击量">
                        <el-tag type="success">{{ newsInfo.hits }}</el-tag>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-tag :type="newsInfo.state ? 'success' : 'danger'">{{ newsInfo.state ? '启用' : '禁用'
                            }}</el-tag>
                    </el-form-item>

                    <el-form-item label="热搜词">
                        <el-tag type="success" v-for="item in newsInfo.hotSearchWordValues">
                            {{ item }}
                        </el-tag>
                    </el-form-item>

                    <el-form-item label="内容">
                        <div style='width: 900px;' v-html="newsInfo.content"></div>
                    </el-form-item>


                </el-form>

            </el-col>
        </el-row>

    </el-dialog>
</template>

<style scoped></style>
