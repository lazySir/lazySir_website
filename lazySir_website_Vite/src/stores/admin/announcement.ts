import { defineStore } from 'pinia'
import {
    reqAddorUpdateAnnouncement, reqDeleteAnnouncement, reqGetAnnountement
} from '@/api/admin/announcement'
import { ElMessage } from 'element-plus'
interface adminAnnouncementRequest extends RequestTypes.request {
    data: {
        data: AnnouncementTypes.announcement[]
        totalCount: number
    }

}

//1.定义容器
//参数1：容器的ID，必须唯一（可以自己取名），将来Pinia会把所有的容器挂在到跟容器
export const useAdminAnnouncementStore = defineStore('adminAnnouncementStore', {
    state: () => {
        return {
            list: [] as AnnouncementTypes.announcement[],
            total: 0,
        }
    },
    //相当于computed
    getters: {

    },
    //相当于methods
    actions: {
        //获取公告列表
        async getAnnouncementList(val: AnnouncementTypes.getAnnouncements) {
            const res: adminAnnouncementRequest = await reqGetAnnountement(val) as any
            if (res.code == 200) {
                let arr = res.data.data
                //由于数据库存储的是string，所以需要转换成数组
                arr = arr.map(item => {
                    item.file = item.file ? JSON.parse(item.file as any) : []
                    return item
                })
                this.list = arr
                this.total = res.data.totalCount
                return true
            }
            return false
        },
        async addorUpdateAnnouncement(val: AnnouncementTypes.addOrUpdateAnnouncement) {
            val = {
                ...val,
                file: JSON.stringify(val.file) as any
            }
            const res: RequestTypes.request = await reqAddorUpdateAnnouncement(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        },
        async deleteAnnouncement(val: Array<string>) {
            const res: RequestTypes.request = await reqDeleteAnnouncement(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        }
    }
})


