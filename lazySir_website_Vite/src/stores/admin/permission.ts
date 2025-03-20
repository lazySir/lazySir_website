import { defineStore } from 'pinia'
import { reqGetRoleMenu, reqUpdateRoleMenu, reqUpdateAdminRole } from '@/api/admin/permission'
import { ElMessage } from 'element-plus'
export const useAdminPermissionStore = defineStore('adminPermissionStore', {
    state: () => {
        return {
            roleMenuList: [] as MenuTypes.mysqlMenu[],

        }
    },
    getters: {

    },
    actions: {
        //获取角色菜单
        async getRoleMenu(rolesId: Array<String>) {
            const res: RequestTypes.request = await reqGetRoleMenu(rolesId) as any
            if (res.code === 200) {
                this.roleMenuList = res.data as MenuTypes.mysqlMenu[]
            }
        },
        //修改角色菜单
        async changeRoleMenu(rolesId: string, menusId: Array<string>) {
            const res: RequestTypes.request = await reqUpdateRoleMenu(rolesId, menusId) as any
            if (res.code === 200) {
                ElMessage.success('修改成功')
                return true
            }
            return false
        },
        //修改用户角色
        async changeAdminRole(rolesId: string[], accountId: string) {

            const res: RequestTypes.request = await reqUpdateAdminRole(rolesId, accountId) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            } else { return false }
        },
        //将菜单转为一维数组
        getMenusList(menus: MenuTypes.Menu[]) {
            //递归调用获取menusId
            return menus.flatMap(menu => {
                const children = this.getMenusList(menu.children as MenuTypes.Menu[]) as Array<String>;
                return [menu, ...children];
            });

        },

    },
})
