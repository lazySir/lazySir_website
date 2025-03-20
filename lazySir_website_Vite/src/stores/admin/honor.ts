import { defineStore } from 'pinia'
import {
    reqAddorUpdateHonor, reqDeleteHonor, reqGetHonor
} from '@/api/admin/honor'
import { ElMessage } from 'element-plus'

interface honorReq extends RequestTypes.request {
    data: {
        totalCount: number,
        data: AdminHonorTypes.honor[]
    }

}

//1.定义容器
//参数1：容器的ID，必须唯一（可以自己取名），将来Pinia会把所有的容器挂在到跟容器
export const useAdminHonorStore = defineStore('adminHonorStore', {

    state: () => {
        return {
            honorList: [] as AdminHonorTypes.honor[],
            total: 0,
        }
    },
    //相当于computed
    getters: {},

    //相当于methods
    actions: {
        async getHonorList(val: AdminHonorTypes.getHonor) {
            const res: honorReq = await reqGetHonor(val) as any
            if (res.code === 200) {
                this.honorList = res.data.data
                this.total = res.data.totalCount
                return true
            }
            return false
        },
        async addorUpdateHonor(val: AdminHonorTypes.addOrUpdateHonor) {
            const res: RequestTypes.request = await reqAddorUpdateHonor(val) as any
            if (res.code === 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        },
        async deleteHonor(val: string[]) {
            const res: RequestTypes.request = await reqDeleteHonor(val) as any
            if (res.code === 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        }
    }
})


