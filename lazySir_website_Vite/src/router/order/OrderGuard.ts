import router from "@/router";



// 路由前置守卫
router.beforeEach(async (to, from, next) => {
    const isFront = !to.path.startsWith("/admin");
    if (isFront) {

    }
    next(); // 始终调用 next() 以继续
});
//全职后置导航守卫
router.afterEach((to, from) => {

});
