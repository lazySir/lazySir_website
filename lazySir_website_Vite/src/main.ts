import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { setupElementPlus } from '@/utils/element-plus'
import { setupPinia } from '@/utils/pinia'
import IconifyIcon from '@/components/public/IconifyIcon/index.vue'
import AuthBtn from '@/components/public/AuthBtn/index.vue'
import AdminImage from '@/components/admin/image.vue'
//tailwindcss
import './style.css'
// 引入进度条样式
import 'nprogress/nprogress.css'
const app = createApp(App)
//全局注册组件
app.component('IconifyIcon', IconifyIcon)
app.component('AuthBtn', AuthBtn)
app.component('AdminImage', AdminImage)
//引入pinia
setupPinia(app)

//引入element-plus
setupElementPlus(app)
//导航守卫
import '@/router/admin/AdminGuard'
import '@/router/blog/BlogGuard'
import '@/router/global/GlobalGuard'
//引入router
app.use(router)

app.mount('#app')
