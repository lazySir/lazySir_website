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
                path: '/blog/home', name: 'BlogHome', meta: { title: '首页' }, component: () => import('@/views/blog/home/index.vue')
            },
        ]
    },
]
