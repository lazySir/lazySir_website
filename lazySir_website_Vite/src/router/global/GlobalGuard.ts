import router from "@/router";
//key value 路径对应标题后缀
interface TITLEMAP {
    [key: string]: string
}
const titleMap: TITLEMAP = {
    //博客
    'blog': ' - lazySir_blog',
    //默认
    '/': ' lazySir',
    //后台
    'admin': ' - lazySir_admin',
    //点单
    'order': ' - lazySir_order'

}
// 设置页面标题
function setDocumentTitle(path: string, title: string) {
    //获取path的第一个斜杠后面的内容
    const pathArr = path?.split("/");
    const pathName = pathArr?.[1];
    //将路径名作为key，获取对应的value
    const titleSuffix = titleMap[pathName];
    document.title = title + (titleSuffix ? titleSuffix : " - lazySir");
}

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
    // 如果令牌有效，设置页面标题
    setDocumentTitle(to.path as string, to.meta.title as string);

    next(); // 始终调用 next() 以继续
});
//全职后置导航守卫
router.afterEach((to, from) => {

});
