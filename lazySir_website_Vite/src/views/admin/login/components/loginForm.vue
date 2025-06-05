<template>
  <el-form ref="loginForm" :model="loginAdmin" :rules="loginRules" size="large">
    <el-form-item label="账号" prop="username">
      <el-input v-model="loginAdmin.username" placeholder="请输入账号">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        v-model="loginAdmin.password"
        placeholder="请输入密码"
        show-password
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="Plus" round @click="register()" size="large"
      >注册</el-button
    >
    <el-button
      :icon="UserFilled"
      round
      @click="handlerLogin()"
      size="large"
      type="success"
      :loading="loading"
    >
      登录
    </el-button>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { Plus, UserFilled } from '@element-plus/icons-vue'
import { useAdminAccountStore } from '@/stores/admin/account'
import { getTimeState } from '@/utils'
import { ElNotification } from 'element-plus'
const emit = defineEmits(['changeLogin'])
//pinia store
const adminAccountStore = useAdminAccountStore()
//获取表单实例
const loginForm = ref<any>(null)
//触发登录方法
function handlerLogin() {
  loginForm.value.validate(async (valid: boolean) => {
    if (!valid) {
      loading.value = false
      return false
    }

    loading.value = true
    try {
      const result = await adminAccountStore.login(loginAdmin)
      if (result) {
        resetForm()
        ElNotification({
          title: getTimeState(),
          message: '欢迎登录 lazysir_website 后台管理',
          type: 'success',
          duration: 3000,
        })
      }
    } catch (error) {
      // 可选：给出更友好的错误提示
      // ElMessage 可能已经在 axios 拦截器里处理过了
    } finally {
      // 保证 loading 状态一定会被关闭
      loading.value = false
    }

    return true
  })
}
const loginRules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 5, max: 20, message: '账号长度在 5 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '密码长度在 5 到 20 个字符', trigger: 'blur' },
  ],
})

let loginAdmin = reactive({} as AdminTypes.accountLogin)
//重置方法
function resetForm() {
  loginAdmin = {} as AdminTypes.accountLogin
}
//切换到注册
function register() {
  emit('changeLogin')
}
//loading
const loading = ref(false)
//监听enter键
onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e
    if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
      handlerLogin()
    }
  }
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
