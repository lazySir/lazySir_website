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
            {
                path: '/blog/article/:filename', name: 'BlogArticle', meta: { title: '文章' }, component: () => import('@/views/blog/articles/index.vue')
            }
        ]
    },
]
