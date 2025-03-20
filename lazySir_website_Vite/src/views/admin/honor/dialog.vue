<script setup lang="ts">
import { computed, onMounted, ref, } from 'vue'
import { useAdminHonorStore } from '@/stores/admin/honor';
import { useAdminNewsStore } from '@/stores/admin/news';
import Category from '@/components/admin/category.vue'
const adminNewsStore = useAdminNewsStore()
const adminHonorStore = useAdminHonorStore()
//外部传入visible控制组件的显影性
const props = defineProps(['visible'])
onMounted(async () => {
    await adminNewsStore.getNewsList({ state: true })
})

//计算显影性
const visible = computed(() => {
    return props.visible
})
//当前在被编辑的honorInfo
const honorInfo = ref({} as AdminHonorTypes.honor)


const emits = defineEmits(['close'])
const close = () => {
    honorInfo.value = {} as AdminHonorTypes.honor
    emits('close')
}

const setHonorInfo = (val: AdminHonorTypes.honor) => {
    honorInfo.value = val
}
defineExpose({
    setHonorInfo
})
// 表单验证规则
const rules = {
    name: [
        { required: true, message: '荣誉名称不能为空', trigger: 'blur' },
        { min: 2, max: 50, message: '长度需在 2 到 50 个字符之间', trigger: 'blur' }
    ],

    createDate: [
        { required: true, message: '获得时间不能为空', trigger: 'blur' },
        { pattern: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, message: '请输入有效的日期格式 (YYYY-MM-DD hh:mm:ss)', trigger: 'blur' }
    ],
    companyId: [
        { required: true, message: '公司不能为空', trigger: 'blur' },
    ],
    description: [
        {
            validator: (rule: any, value: any, callback: any) => {
                if (value && value.length > 300) {
                    callback(new Error('描述最多可输入 300 个字符'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        }
    ]
}
const formRef = ref()
const handleNewsChange = (val: string) => {
    honorInfo.value.newsId = val
}
const handleCompany = (val: string) => {
    honorInfo.value.companyId = val;
}
const submitForm = () => {

    formRef.value.validate(async (valid: any) => {
        if (valid) {
            const res = await adminHonorStore.addorUpdateHonor(honorInfo.value)
            if (res) {
                close()
            }
        }
    });
};
</script>

<template>
    <el-dialog :show-close="false" title="荣誉信息" :model-value="visible" width="500">
        <el-form ref="formRef" :model="honorInfo" :rules="rules" label-width="80px">
            <el-form-item label="荣誉名称" prop="name">
                <el-input style="width:240px " v-model="honorInfo.name" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="新闻标题">
                <el-select clearable v-model="honorInfo.newsTitle" @change="handleNewsChange" filterable
                    placeholder="请选择关联新闻" style="width: 240px">
                    <el-option v-for="item in adminNewsStore.newsList" :key="item.newsId" :label="item.title"
                        :value="item.newsId" />
                </el-select>
            </el-form-item>
            <el-form-item label="公司" prop="companyId">
                <Category @sendValue="handleCompany" category1="公司" :categoryId="honorInfo.companyId" />
            </el-form-item>
            <el-form-item label="启用状态">
                <el-switch v-model="honorInfo.state" active-color="#13ce66"></el-switch>
            </el-form-item>

            <el-form-item label="获得时间" prop="createDate">
                <el-date-picker v-model="honorInfo.createDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择时间" />
            </el-form-item>

            <el-form-item label="荣誉描述" prop="description">
                <el-input type="textarea" v-model="honorInfo.description" placeholder=""></el-input>
            </el-form-item>
        </el-form>

        <el-row :gutter="10">
            <el-col :offset="9" :span="8">
                <el-button type="primary" @click="submitForm">确认</el-button>
                <el-button @click="close">取消</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<style scoped></style>
