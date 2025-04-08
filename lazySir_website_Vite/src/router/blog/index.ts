import BlogFront from "@/layouts/blog/index.vue";
export default [
    {
        path: '/blog',
        name: 'Blog',
        redirect: "/blog/home",
        meta: {
            title: 'lazySir - blog ',
        },
        component: BlogFront,
        children: [
            {
                path: '/blog', name: 'Blog', meta: { title: '首页' }, component: () => import('@/views/blog/home/index.vue')
            },
        ]
    },
]
