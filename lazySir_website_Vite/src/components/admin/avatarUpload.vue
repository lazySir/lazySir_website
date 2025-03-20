<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useAdminAccountStore } from '@/stores/admin/account';
import API from '@/utils/API'
const adminAccountStore = useAdminAccountStore();
let imgUrl = ref('')

const props = defineProps(['myImg'])
const emits = defineEmits(['handleAvatarSuccess'])
onMounted(() => {
    imgUrl.value = props.myImg
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imgUrl.value = URL.createObjectURL(uploadFile.raw!)
    emits('handleAvatarSuccess', response.data.imgUrl)
    ElMessage.success(response.data.message)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像必须是JPG格式')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像大小不能大于2MB')
        return false
    }
    return true
}
//如果有传入数据，那就以传入的数据作为显示，
//如果没传入数据，那就以上传后显示的数据作为显示
const serverUrl = import.meta.env.VITE_SERVER_URL;
const avatarUrl = API.adminInfoAPI.uploadAvatar
const uploadAvatarUrl = `${serverUrl}${avatarUrl}`;
</script>

<template>
    <el-upload class="avatar-uploader" :headers="{ 'token': adminAccountStore.token }" name="img"
        :action="uploadAvatarUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <AdminImage v-if="imgUrl" :img="imgUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>


</template>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.avatar {
    border-radius: 50%;

    position: relative;
    left: 30%;

}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
