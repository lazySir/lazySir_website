<template>
  <el-form ref="registerForm" :rules="registerRules" :model="registerAdmin" label-width="100px">
    <el-form-item label="账号" prop="username">
      <el-input v-model="registerAdmin.username" placeholder="请输入账号">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="registerAdmin.password" placeholder="请输入密码" show-password>
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="password2">
      <el-input v-model="registerAdmin.password2" placeholder="请再次输入密码" show-password>
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon> </template></el-input>
    </el-form-item>
    <el-form-item label="内部码" prop="register_code">
      <el-input v-model="registerAdmin.register_code" placeholder="请输入内部注册码">
        <template #prefix>
          <el-icon class="el-input__icon">
            <CircleCheck />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round @click="login()" size="large">返回登录</el-button>
    <el-button :icon="Plus" round @click="handlerRegister()" size="large" type="success">
      注册
    </el-button>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Plus, CircleClose } from '@element-plus/icons-vue'
import { useAdminAccountStore } from '@/stores/admin/account'
const AdminAccountStore = useAdminAccountStore()
const registerForm = ref<any>(null)
let registerAdmin = reactive({} as AdminTypes.accountRegister)
const emit = defineEmits(['changeLogin'])
//注册
function handlerRegister() {
  registerForm.value.validate(async (valid: boolean) => {
    if (valid) {
      const flag = await AdminAccountStore.register(registerAdmin)
      if (flag) {
        login()
        resetForm()
      }
    }
  })
}
//重置
function resetForm() {
  registerAdmin = {} as AdminTypes.accountRegister
}
//切换到登录
function login() {
  emit('changeLogin')
}
//定义校验密码是否一致
const validatePass2 = (rule: any, value: any, callback: any): void => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerAdmin.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
//定义注册信息校验规则
const registerRules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
  ],
  password2: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' },
  ],
  register_code: [
    { required: true, message: '请输入内部码', trigger: 'blur' },
    { message: '请输入有效内部码', trigger: 'blur' },
  ],
})
</script>
<style scoped>
.login-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
  white-space: nowrap;
}

.login-btn .el-button {
  width: 185px;
}
</style>
