import { defineStore } from 'pinia'
import { useAdminAccountStore } from './account'
export const useAdminAsideStore = defineStore('adminAside', {
    // 开启数据持久化
    persist: {
        // enabled:true,
        storage: window.sessionStorage,
    },
    state: () => {
        return {
            //侧边栏是否折叠
            isCollapse: false,
            breadCrumbList: [
                {
                    path: '/',
                    name: 'adminHome',
                    meta: {
                        title: '首页',
                        icon: 'material-symbols:home',
                        sortOrder: 0,
                    },
                    children: [
                        {

                            path: '/admin/home',
                            meta: {
                                title: '首页',
                                sortOrder: 0,
                                icon: 'material-symbols:home',
                            },

                            name: 'Dashboard',
                        },

                    ],
                },
            ] as MenuTypes.Menu[],
            tagList: [
                {
                    path: '/admin/home',
                    name: 'adminHome',
                    meta: {
                        title: '首页',
                        icon: 'material-symbols:home',
                        sortOrder: 0,
                    },
                },
            ] as MenuTypes.Menu[],
            //当前激活的tag
            editableTabsValue: 'adminHome'
        }
    },
    getters: {},
    actions: {
        //切换侧边栏折叠状态
        changeCollapse() {
            this.isCollapse = !this.isCollapse
        },
        //面包屑
        addBreadCrumb(routeName: string) {
            const adminAccountStore = useAdminAccountStore()
            //重置面包屑
            this.breadCrumbList = [
                {
                    path: '/',
                    name: 'adminHome',
                    meta: {
                        title: '首页',
                        icon: 'material-symbols:home',
                        sortOrder: 0,
                    },
                    children: [
                        {

                            path: '/admin/home',
                            meta: {
                                title: '后台首页',
                                sortOrder: 0,
                                icon: 'material-symbols:home',
                            },

                            name: 'Dashboard',
                        },

                    ],
                },
            ] as MenuTypes.Menu[]
            if (routeName != 'Dashboar') {
                let newRoutes = JSON.parse(JSON.stringify(adminAccountStore.menus))
                newRoutes.forEach((item: any) => {
                    if (item.name === routeName) {
                        this.breadCrumbList.push(item)

                    } else {

                        item.children.forEach((item2: any) => {
                            if (item2.name === routeName) {

                                this.breadCrumbList.push(item)
                                this.breadCrumbList.push(item2)
                            }
                        })
                    }
                })
            }
        },
        //跳转路由
        pushPath(item: string | any) {
            this.editableTabsValue = item.name ? item.name : item
            this.router.push({
                name: item.name ? item.name : item
            })
        },
        //添加tag
        addTag(menu: MenuTypes.Menu) {
            //如果tagList中已经存在该路由则不再添加
            if (this.tagList.some((item: MenuTypes.Menu) => item.name === menu.name)) return
            //将name，title以及如果存在icon放入tagList
            this.tagList.push(menu)
        },
        //删除tag
        deleteTag(val: string) {
            //删除tagList中的某一项
            if (val === "adminHome") return
            const flag = this.tagList.findIndex(item => {
                return item.name === val
            })
            this.tagList.splice(flag, 1)
            this.pushPath(this.tagList[flag - 1].name)
        },
        //重置tagBox
        resetTagBox() {
            this.tagList = [
                {
                    path: '/',
                    name: 'adminHome',
                    meta: {
                        title: '首页',
                        icon: 'material-symbols:home',
                        sortOrder: 0,
                    },
                },
            ] as MenuTypes.Menu[]
            this.pushPath("adminHome")
        },

    },
})
