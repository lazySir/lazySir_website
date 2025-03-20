import { defineStore } from 'pinia'
import {
    reqGetAdminList, reqUpdateAdminInfo, reqResetAdminPwd, reqDeleteAdmin
} from '@/api/admin/accountInfo'
import { ElMessage } from 'element-plus'


//1.定义容器
//参数1：容器的ID，必须唯一（可以自己取名），将来Pinia会把所有的容器挂在到跟容器
export const useAdminUserStore = defineStore('adminUserStore', {

    state: () => {
        return {
            adminList: [] as AdminTypes.adminInfo[],
            PageAndSize: {
                page: 1,
                limit: 5,
                total: 0
            } as PublicTypes.PageAndSize,
        }
    },
    //相当于computed
    getters: {},

    //相当于methods
    actions: {
        //获取管理员列表
        async getAdminList(username?: string) {
            const res: RequestTypes.request = await reqGetAdminList(this.PageAndSize, username) as any
            if (res.code == 200) {
                this.adminList = (res.data as any).users
                this.PageAndSize.total = (res.data as any).totalUsers
            }

        },
        //删除管理员
        async deleteAdmin(accountId: string) {
            const res: RequestTypes.request = await reqDeleteAdmin(accountId) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        },
        //重置密码
        async resetPwdByAdmin(accountId: string) {
            const res: RequestTypes.request = await reqResetAdminPwd(accountId) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
            }
        },
        //新增或更新管理员信息
        async addOrUpdateAdminInfo(data: AdminTypes.adminInfo) {
            let res = {} as RequestTypes.request
            if (data.accountInfoId) {
                //说明是更新
                res = await reqUpdateAdminInfo(data) as any

            } else {
                //说明是新增
            }
            if (res.code == 200) {
                this.getAdminList()
                ElMessage.success(res.message)
                return true
            } else {
                return false
            }


        },
    }
})


