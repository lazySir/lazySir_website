export const constantRoutes: any = [
    {
        path: '/admin/login',
        name: 'adminLogin',
        meta: {
            title: '后台登录界面',
        },
        component: () => import('@/views/admin/login/index.vue'),
    },
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    { path: '/admin/404', name: 'NotFound', meta: { title: '错误页面' }, component: () => import('@/views/admin/404/index.vue') }, ,

]
