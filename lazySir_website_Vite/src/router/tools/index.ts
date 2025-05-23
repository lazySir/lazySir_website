import BlogFront from "@/layouts/blog/index.vue";
// 工具页面 meta 字段类型定义
export interface ToolMeta {
    title: string;                // 工具名称或页面标题
    description?: string;         // 工具描述
    img?: string;                // 工具图标链接
    url?: string;                 // 工具完整访问链接
    username?: string;            // 作者名或创建者
    featured?: boolean;           // 是否用于首页轮播图展示
}

// 单个路由配置项（children 中每一项）
export interface ToolRoute {
    path: string;
    name: string;
    component: () => Promise<any>;   // Vue 路由懒加载组件
    meta: ToolMeta;
}

// 路由总结构（带 children）
export interface ToolRouteGroup {
    path: string;
    name: string;
    component: () => Promise<any>;
    meta: {
        title: string;
    };
    children: ToolRoute[];
}
export default [
    {
        path: '/tools',
        name: 'Tools',
        component: BlogFront,
        meta: {
            title: '工具列表',
        },
        children: [
            {
                path: '/tools/list',
                name: '工具列表',
                component: () => import('@/views/tools/index.vue'),
                meta: {
                    title: '工具列表',
                },
            },
            {
                path: '/tools/webCrypto',
                name: 'WebCrypto',
                component: () => import('@/views/tools/webCrypto.vue'),
                meta: {
                    title: 'WebCrypto 加密工具',
                    description: '前端加密存储工具，支持 AES、PBKDF2、导出密钥等。',
                    img: 'https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/tools/webCrypto.png',
                    url: 'https://www.lazysir.me/tools/webCrypto',
                    username: 'lazySir',
                    featured: true
                },
            },
            {
                path: '/tools/todoList',
                name: 'ToDoList',
                component: () => import('@/views/tools/todoList.vue'),
                meta: {
                    title: '智能 ToDo List',
                    description: '极简但强大的任务管理工具，支持提醒、导入导出等功能。',
                    img: 'https://cdn.jsdelivr.net/gh/lazySir/image-host/lazySir_website/tools/todoList.png',
                    url: 'https://www.lazysir.me/tools/todoList',
                    username: 'lazySir',
                    featured: true
                },
            },
            {
                path: '/tools/qrCode',
                name: 'QrCode',
                component: () => import('@/views/tools/qrCode.vue'),
                meta: {
                    title: '二维码生成器',
                    description: '快速生成批量/单个二维码，支持自定义内容、大小、颜色等。',
                    img: 'https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/tools/qrCode.png',
                    url: 'https://www.lazysir.me/tools/qrcode',
                    username: 'lazySir',
                    featured: true
                },
            },
            {
                path: '/tools/exifRead',
                name: 'ExifRead',
                component: () => import('@/views/tools/exifRead.vue'),
                meta: {
                    title: 'EXIF 信息查看器',
                    description: '查看图片的 EXIF 信息，支持批量上传。',
                    img: 'https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/tools/exifRead.png',
                    url: 'https://www.lazysir.me/tools/exifRead',
                    username: 'lazySir',
                    featured: true
                },
            },
            {
                path: '/tools/colorPicker',
                name: 'ColorPicker',
                component: () => import('@/views/tools/colorPicker.vue'),
                meta: {
                    title: '拾色器',
                    description: '快速选择颜色，支持HEX、RGB、HSL、CMYK等格式。',
                    img: 'https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/tools/colorPicker.png',
                    url: 'http://localhost:5173/tools/colorPicker',
                    username: 'lazySir',
                    featured: true
                },
            },
        ]
    }
]
