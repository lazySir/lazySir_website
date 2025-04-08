export default [
    {
        path: '/',
        name: 'Home',
        meta: {
            title: 'lazySir',
        },
        component: () => import('@/views/global/index.vue'),
    },
]
