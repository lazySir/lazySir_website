import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from '@/router/admin/constantRoutes'
import blogConstantRoutes from '@/router/blog/index'
import globalConstantRoutes from '@/router/global/index'
let resultConstantRoutes = constantRoutes.concat(blogConstantRoutes)
resultConstantRoutes = resultConstantRoutes.concat(globalConstantRoutes)
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes: resultConstantRoutes, // `routes: routes` 的缩写
})

export default router
