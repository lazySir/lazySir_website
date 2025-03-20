import router from "@/router";
import { startLoading, endLoading } from "@/utils/loading";
import { getCookie } from "@/utils";

import { ElMessage } from "element-plus";
import { useAdminAccountStore } from "@/stores/admin/account";
//检测是否有路由权限
function hasAsyncRoutesPermission(
  menus: MenuTypes.Menu[],
  path: string
): boolean {
  return menus.some((item) => {
    if (item.path === path) {
      return true;
    }
    // 如果有子菜单，递归检查子菜单是否有权限
    return item.children
      ? hasAsyncRoutesPermission(item.children, path)
      : false;
  });
}
//检测是否存在当前路由
export function checkHasRoute(routeName: string) {
  return router.hasRoute(routeName);
}

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  const isAdmin = to.path.startsWith("/admin");
  if (isAdmin) {
    const myToken = getCookie("token");
    const adminAccountStore = useAdminAccountStore();
    const hasRouteFlag = checkHasRoute(to.name as string);
    const hasPermissionFlag = hasAsyncRoutesPermission(
      adminAccountStore.menus,
      to.path
    );
    // 检查令牌是否有效
    if ((!myToken || !adminAccountStore.token) && to.name !== 'adminLogin') {
      // 令牌过期或未登录
      ElMessage.warning("token过期或未登录，请重新登陆");
      next({ name: "adminLogin" });
    }

    // 检查路由权限
    if (!hasRouteFlag && hasPermissionFlag) {
      await adminAccountStore.addAsyncRoute();
      next({ path: to.path }); // 确保调用 next，传入路径
    }
  }
  next(); // 始终调用 next() 以继续
});
//全职后置导航守卫
router.afterEach((to, from) => {
  //关闭加载
  endLoading();
});
