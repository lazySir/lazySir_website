<template>
    <div class="password-page">
        <el-form :model="passwordForm" :rules="rules" ref="passwordFormRef" label-width="100px" class="password-form">
            <el-form-item label="当前密码" prop="oldPassword">
                <el-input v-model="passwordForm.oldPassword" placeholder="请输入当前密码" show-password></el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" placeholder="请输入新密码" show-password></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" placeholder="请再次输入新密码" show-password></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="resetForm">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useAdminAccountStore } from '@/stores/admin/account';
const adminAccountStore = useAdminAccountStore()
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

const rules = {
    oldPassword: [
        { required: true, message: '请输入当前密码', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 5, max: 20, message: '密码长度应为5到20个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: (rule: any, value: any, callback: any) => {
                if (value !== passwordForm.value.newPassword) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        }
    ]
};

const passwordFormRef = ref();

const onSubmit = () => {
    passwordFormRef.value.validate(async (valid: any) => {
        if (valid) {
            const res = await adminAccountStore.EditPwd(passwordForm.value.newPassword, passwordForm.value.oldPassword)
            if (res) {
                // 处理修改密码的逻辑
                ElMessage.success('密码修改成功');
                // 清空表单
                passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
            }

        }
    });
};

const resetForm = () => {
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
};
</script>

<style scoped>
.password-page {
    /* position: relative; */



    /* transform: translate(-50% -50%); */
    /* margin: 0 auto; */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.el-input {
    width: 300px;
}


.el-form-item {
    margin-bottom: 20px;
}

.el-button {
    width: 100px;
    margin-right: 10px;
}
</style>
