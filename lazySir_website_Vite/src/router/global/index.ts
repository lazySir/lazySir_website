export default [
    {
        path: '/',
        name: 'default',
        meta: {
            title: 'lazySir',
        },
        component: () => import('@/views/global/index.vue')
    },
]
