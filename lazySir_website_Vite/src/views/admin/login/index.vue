<template>
  <div class="login-container">
    <div class="login-box">
      <SwitchDark class="dark" />
      <div class="login-left">
        <img
          class="login-left-img"
          src="@/assets/images/admin/login/login_left.png"
          alt="login"
        />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <!-- <img class="login-icon" src="@/assets/images/admin/login/sgzn_logo.png" alt="" /> -->
          <h2 class="logo-text">lazySir - 后台管理系统</h2>
        </div>
        <!-- 登录 -->
        <LoginForm
          @changeLogin="controlPage.changeState"
          v-if="!controlPage.signUpMode"
        />
        <!-- 注册 -->
        <RegisterFrom @changeLogin="controlPage.changeState" v-else />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import LoginForm from './components/loginForm.vue'
import RegisterFrom from './components/registerForm.vue'
import SwitchDark from '@/theme/darkSwitch.vue'
//控制登录或者注册页面
const controlPage = reactive<AdminTypes.accountPageState>({
  //标记登录注册页面
  signUpMode: false,
  //改变登录注册页面
  changeState: function (): void {
    controlPage.signUpMode = !controlPage.signUpMode
  },
})
</script>
<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  min-height: 550px;
  background-color: #eeeeee;
  background-image: url('../../../assets/images/admin/login/login_bg.svg');
  /* Adjusted path to relative */
  background-size: cover;
}

.login-container .login-box {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 96.5%;
  height: 94%;
  padding: 0 50px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.login-container .login-box .login-left {
  width: 800px;
  margin-right: 10px;
}

.login-container .login-box .login-left .login-left-img {
  width: 100%;
  height: 100%;
}

.login-container .login-box .dark {
  position: absolute;
  top: 13px;
  right: 18px;
}

.login-container .login-box .login-form {
  width: 420px;
  padding: 50px 40px 45px;
  background-color: var(--el-bg-color);
  border-radius: 10px;
  box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.1);
}

.login-container .login-box .login-form .login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 45px;
}

.login-container .login-box .login-form .login-logo .login-icon {
  width: 350px;
  height: 70px;
}

.login-container .login-box .login-form .login-logo .logo-text {
  padding-left: 25px;
  margin: 0;
  font-size: 30px;
  font-weight: bold;
  color: #34495e;
  white-space: nowrap;
}

.login-container .login-box .login-form .el-form-item {
  margin-bottom: 40px;
}

.login-container .login-box .login-form .login-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
  white-space: nowrap;
}

.login-container .login-box .login-form .login-btn .el-button {
  width: 185px;
}

@media screen and (max-width: 1250px) {
  .login-container .login-box .login-left {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  .login-container .login-box .login-form {
    width: 97% !important;
  }
}
</style>
