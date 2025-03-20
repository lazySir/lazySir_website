import { defineStore } from 'pinia'
import { reqGetMenu, reqAddMenu, reqDeleteMenu, reqUpdateMenu } from '@/api/admin/menu'
import { ElMessage } from 'element-plus'
export const useAdminMenuStore = defineStore('adminMenuStore', {
    state: () => {
        return {
            menuList: [] as MenuTypes.Menu[],
        }
    },
    getters: {
    },
    actions: {
        async getMenuList(value?: string) {
            const results: RequestTypes.request = await reqGetMenu(value) as any
            if (results.code === 200) {
                //处理下信息
                this.menuList = this.formatRoutes(results.data as Array<any>) as any
                // this.loadRoutes()
            }
            return true
        },
        async deleteMenu(value: Array<String>) {
            const results: RequestTypes.request = await reqDeleteMenu(value) as any
            if (results.code === 200) {
                this.getMenuList()
                ElMessage.success(results.message)
            }
            return false
        },
        async addOrUpdateMenu(value: MenuTypes.mysqlMenu) {
            let results: RequestTypes.request = [] as any
            if (!value.menuId) {
                results = await reqAddMenu(value) as any
            } else {
                results = await reqUpdateMenu(value) as any
            }
            if (results.code === 200) {
                this.getMenuList()
                ElMessage.success(results.message)
                return true
            }

            return false
        },
        formatRoutes(menu: Array<any>): Array<any> {
            // 先按 sortOrder 升序排序
            const sortedMenu = menu.sort((a, b) => {
                return (a.sortOrder || 0) - (b.sortOrder || 0);
            });

            return sortedMenu.map(item => {
                // 将 menuName 和 menuValue 修改为 name 和 value，并将其余属性放入 meta 中
                const { menuName: name, menuValue: value, path, children, ...rest } = item;

                // 构建 meta 对象，包含剩余属性
                const meta = { ...rest };

                // 如果有子菜单，递归处理 children
                const updatedChildren = children.length > 0 ? this.formatRoutes(children) : [];

                return {
                    path,
                    name: value, // 设置 name 为 menuValue
                    meta: {
                        title: name,  // 将 menuName 作为 meta 的 title
                        ...meta,  // 将其他属性放入 meta
                    },
                    children: updatedChildren,
                };
            });
        },
    }
})
