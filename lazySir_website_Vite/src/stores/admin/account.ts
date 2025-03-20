import { defineStore } from "pinia";
import { reqLogin, reqRegister } from "@/api/admin/account";
import { reqLogout, reqAdminInfo, reqUpdateAdminInfo, reqModifyPwd } from "@/api/admin/accountInfo";
import { reqGetAdminRole, reqGetRoleMenu } from "@/api/admin/permission";
import { ElMessage } from "element-plus";
import { clearAllCookies, setCookie } from "@/utils";
import { Component } from "vue";
import { useAdminAsideStore } from "@/stores/admin/aside";
import { summarizePermissions } from '@/utils/permission'
// 使用 import.meta.glob 动态导入布局和视图
const layouts = import.meta.glob("../../layouts/admin/*.vue");
const views = import.meta.glob("../../views/**/*.vue");
//1.定义容器
//参数1：容器的ID，必须唯一（可以自己取名），将来Pinia会把所有的容器挂在到跟容器
export const useAdminAccountStore = defineStore("adminAccount", {
  // 开启数据持久化
  persist: {
    // enabled:true,
    storage: window.sessionStorage,
  },

  state: () => {
    return {
      adminInfo: {} as AdminTypes.adminInfo,
      menus: [] as MenuTypes.Menu[],
      token: "",
    };
  },
  //相当于computed
  getters: {

    flatMenus: (state) => {
      const flatten = (menus: any[]): any[] => {
        return menus.reduce((acc: any[], menu) => {
          // 将当前菜单添加到结果数组
          acc.push(menu);

          // 如果有子菜单，递归扁平化并添加到结果数组
          if (menu.children && menu.children.length > 0) {
            acc = acc.concat(flatten(menu.children));
          }

          return acc;
        }, []);
      };

      return flatten(state.menus);
    }

  },

  //相当于methods
  actions: {
    /**
     * 登陆
     * @params data 登陆信息
     * @returns flag 登陆成功返回true，否则返回false
     *
     */
    async login(data: AdminTypes.accountLogin) {
      let flag = false;
      let results: RequestTypes.request = (await reqLogin(data)) as any;
      if (results.code == 200) {
        setCookie(
          "token",
          (results.data as any)?.token,
          (results.data as any)?.expiresIn
        );
        this.token = (results.data as any)?.token
        //获取用户信息
        const res = await this.getAdminInfo();
        if (res) {
          //跳转到首页
          await this.addAsyncRoute();
          this.router.push({ name: "adminHome" });
          ElMessage.success(results.message);
          flag = true;
        }
      }
      return flag;
    },
    async register(data: AdminTypes.accountRegister) {
      let flag = false;
      let results: RequestTypes.request = (await reqRegister(data)) as any;
      if (results.code == 200) {
        //跳转到登录页面
        this.router.push("/admin/login");
        ElMessage.success(results.message);
        flag = true;
      }
      return flag;
    },
    async getAdminInfo() {
      this.adminInfo = {} as AdminTypes.adminInfo
      this.menus = [] as MenuTypes.Menu[]
      let results: RequestTypes.request = (await reqAdminInfo()) as any;
      if (results.code == 200) {
        this.adminInfo = results.data as AdminTypes.adminInfo;
        // 获取角色信息
        results = (await reqGetAdminRole(
          this.adminInfo.accountId as string
        )) as any;
        if (results.code == 200) {
          this.adminInfo.roles = results.data as any;
          // 获取角色菜单
          const rolesId = (this.adminInfo as any).roles.map(
            (item: any) => item.roleId
          );
          this.menus = (await reqGetRoleMenu(rolesId, true)).data as any;
          this.menus = summarizePermissions(this.menus) as any
          return true;
        }
      }
      return false;
    },
    async updateAdminInfo(val: AdminTypes.adminInfo) {
      const res: RequestTypes.request = await reqUpdateAdminInfo(val) as any
      if (res.code == 200) {
        return true
      }
      return false
    },
    async logout() {
      let results: RequestTypes.request = (await reqLogout()) as any;
      if (results.code == 200) {
        this.$reset();
        this.adminInfo = {} as AdminTypes.adminInfo;
        this.menus = [] as MenuTypes.Menu[];
        //清空cooies
        clearAllCookies();
        this.router.push("/admin/login");
        ElMessage.success(results.message);
        const adminAsideStore = useAdminAsideStore();
        adminAsideStore.$reset();
      }
    },
    //修改密码
    async EditPwd(newPassword: string, oldPassword: string) {
      const res: RequestTypes.request = await reqModifyPwd(newPassword, oldPassword) as any
      if (res.code == 200) {
        return true
      }
      return false
    },
    //添加动态路由
    async addAsyncRoute(): Promise<void> {
      return new Promise((resolve) => {
        const cmenus = JSON.parse(JSON.stringify(this.menus)); //深拷贝
        this.menus.forEach((item: any) => {
          item.component = this.resolveComponent(item.path, "layout"); // 一级菜单使用布局组件

          if (
            //这个是一级菜单，且没有子菜单的，
            item.meta.level === 1 &&
            item.children &&
            item.children.length === 0
          ) {
            item.redirect = item.path;
            const { level = 2, ...reset } = item.meta;
            item.children.push({
              path: item.path,
              name: item.name,
              meta: { title: item.meta.title, level, ...reset },
              component: this.resolveComponent(item.path),
            });
          }
          //这个是一级菜单且有1个子菜单的
          else if (
            item.meta.level === 1 &&
            item.children &&
            item.children.length == 1

          ) {
            item.redirect = item.children[0].path;
            item.children.forEach((child: any) => {
              child.component = this.resolveComponent(child.path);
            });
          } else {
            //是一级菜单且有多个子菜单的
            item.redirect = item.children[0]?.path || "";

            item.children.forEach((child: any) => {
              child.component = this.resolveComponent(child.path);
            });
          }
          this.router.addRoute(item); // 动态添加路由
        });
        resolve(); // 路由添加完成
      });
    },
    //将菜单变为动态路由
    resolveComponent(path: string, type?: string): Component {
      // 拿到views下面的所有文件之后，动态拼接`key`去获取value
      let importPage;
      if (type == "layout") {
        importPage = layouts[`../../layouts/admin/index.vue`];
      } else {
        importPage = views[`../../views${path}/index.vue`];
      }
      if (!importPage) {
        importPage = views[`../../views/admin/404/index.vue`];
      }
      return importPage;
    },
  },
});
