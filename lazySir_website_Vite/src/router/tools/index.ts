import BlogFront from "@/layouts/blog/index.vue";
export default [
    {
        path: '/tools',
        name: 'Tools',

        component: BlogFront,
        children: [
            {
                path: '/tools',
                name: 'tools', meta: { title: '工具列表' }, component: () => import('@/views/tools/index.vue')
            },

            {
                path: '/tools/webCrypto',
                name: 'WebCrypto', meta: { title: 'webCrypto加密' }, component: () => import('@/views/tools/webCrypto.vue')
            },
            {
                path: '/tools/todoList',
                name: 'TodoList', meta: { title: '待办事项' }, component: () => import('@/views/tools/todoList.vue')
            },
            {
                path: '/tools/qrCode',
                name: 'QrCode', meta: { title: '二维码生成器' }, component: () => import('@/views/tools/qrCode.vue')
            },
            {
                path: '/tools/exifRead',
                name: 'ExifRead', meta: { title: 'EXIF查看' }, component: () => import('@/views/tools/exifRead.vue')
            }
        ]
    },
]
