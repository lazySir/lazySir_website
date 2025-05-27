import BlogFront from "@/layouts/blog/index.vue";
export default [
    {
        path: '/blog',
        name: 'Blog',

        component: BlogFront,
        children: [
            {
                path: '', name: 'BlogHome', meta: { title: '首页' }, component: () => import('@/views/blog/home/index.vue')
            },
            {
                path: 'article/:filename', name: 'BlogArticle', meta: { title: '文章' }, component: () => import('@/views/blog/articles/index.vue')
            },
            {
                path: '/friends', name: 'Friends', meta: { title: '友链' }, component: () => import('@/views/blog/friends/index.vue')
            },
            {
                path: '/archive', name: 'Archive', meta: { title: '归档' }, component: () => import('@/views/blog/archive/index.vue')
            }
        ]
    },
]
