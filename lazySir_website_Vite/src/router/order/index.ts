import OrderFront from "@/layouts/order/index.vue";
export default [
    {
        path: '/order',
        name: 'Order',

        component: OrderFront,
        children: [
            {
                path: '/order', name: 'Order', meta: { title: '首页' }, component: () => import('@/views/order/index.vue')
            },
        ]
    },
]
