<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type UploadInstance } from 'element-plus'
import { useAdminAccountStore } from '@/stores/admin/account'
const adminAccountStore = useAdminAccountStore()
const uploadRef = ref<UploadInstance>()

import type { UploadProps } from 'element-plus'
const props = defineProps<{
    // 属性名: 属性对应的类型
    fileList: {
        name: string;
        url: string;
    }[];  // 注意这里应该是数组类型，因为从语义上通常是一组文件列表数据
    action: string;
}>();
const serverUrl = import.meta.env.VITE_SERVER_URL
const actionUrl = serverUrl + props.action
interface fileItem {
    name: string;
    url: string;
}


const newFileList = ref([] as fileItem[])
if (props.fileList && props.fileList.length > 0) {
    newFileList.value = props.fileList
}
const emits = defineEmits(['add:fileList', 'delete:fileList'])
//上传成功的回调
const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    if (response.code == 200) {
        emits('add:fileList', response.data)
    }
}
//删除成功的回调
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    //删除的逻辑，如果他的file的status是success，则发送删除的触发函数
    if (file.status == 'success') {
        emits('delete:fileList', file.name)
    }
}
//上传服务器
const submitUpload = () => {
    uploadRef.value!.submit()
}
// 上传前文件类型检查
const beforeUpload = (file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const isNotImage = !['image/jpeg', 'image/png', 'image/gif'].includes(file.type);

    if (!isNotImage) {
        ElMessage.error('图片文件不能上传，请选择非图片文件。');
        return false; // 阻止上传
    }

    if (file.size > maxSize) {
        ElMessage.error('文件大小不能超过50MB，请选择合适的文件。');
        return false; // 阻止上传
    }

    return true; // 允许上传
};

</script>

<template>

    <el-upload ref="uploadRef" :on-remove="handleRemove" :before-upload="beforeUpload" :on-success="handleSuccess"
        :headers="{ 'token': adminAccountStore.token }" class="upload-demo" name="file" v-model:file-list="newFileList"
        :action="actionUrl" :auto-upload="false">
        <template #trigger>
            <el-button type="primary">选择文件</el-button>
        </template>
        <template #tip>
            <div class="text-red-500">
                不允许上传图片格式的文件且大小不能超过50mb！
            </div>
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload">
            上传服务器
        </el-button>

    </el-upload>

</template>

<style scoped></style>
