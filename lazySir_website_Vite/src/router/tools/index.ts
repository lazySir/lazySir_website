
export default [
    {
        path: '/tools/webCrypto',
        name: 'WebCrypto', meta: { title: 'webCrypto加密' }, component: () => import('@/views/tools/webCrypto.vue')
    },
    {
        path: '/tools/todoList',
        name: 'TodoList', meta: { title: '待办事项' }, component: () => import('@/views/tools/todoList.vue')
    },
]
