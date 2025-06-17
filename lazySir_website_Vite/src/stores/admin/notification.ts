import { defineStore } from 'pinia'
import { reqGetNotification, reqAddorUpdateNotification, reqDeleteNotification, reqGetNotificationReceive, reqUpdateNotificationReceive, reqGetPersonNotification } from '@/api/admin/notification'
import { ElMessage } from 'element-plus'
interface NotificationRequest extends RequestTypes.request {
    data: {
        list: NotificationTypes.list[],
        total: number,
    }
}
interface NotificationReceiveRequest extends RequestTypes.request {
    data: {
        list: NotificationTypes.receive[],
        total: number,
    }
}

interface NotificationPersonalRequest extends RequestTypes.request {
    data: {
        list: NotificationTypes.personalNotification[],
        total: number,
    }
}
export const useNotificationStore = defineStore('NotificationStore', {

    state: () => {
        return {
            list: [] as NotificationTypes.list[],
            total: 0,
            receiveList: [] as NotificationTypes.receive[],
            receiveTotal: 0,
            ownList: [] as NotificationTypes.personalNotification[],
            ownTotal: 0,
            ownAllList: [] as NotificationTypes.personalNotification[],
        }

    },
    getters: {},
    actions: {
        async getNotificationList(val?: NotificationTypes.getNotificationList) {
            const res: NotificationRequest = await reqGetNotification(val) as any
            if (res.code == 200) {
                this.list = res.data.list
                this.total = res.data.total
            }
        },
        async addOrUpdateNotification(val: NotificationTypes.addOrupdateNotification) {
            const res: NotificationRequest = await reqAddorUpdateNotification(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            } else {
                return false
            }
        },
        async deleteNotification(val: String[]) {
            const res: NotificationRequest = await reqDeleteNotification(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            } else {
                return false
            }
        },
        //获取接收列表
        async getReceiverList(val?: NotificationTypes.receiveGet) {
            const res: NotificationReceiveRequest = await reqGetNotificationReceive(val) as any
            if (res.code == 200) {
                this.receiveList = res.data.list
                this.receiveTotal = res.data.total
                return true
            } else {
                return false
            }
        },
        //更新阅读状态
        async updateReceiver(val: NotificationTypes.receiveUpdate) {
            const res: NotificationReceiveRequest = await reqUpdateNotificationReceive(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            } else {
                return false
            }

        },
        //获取个人通知列表
        async getPersonalNotificationList(val: NotificationTypes.personalNotificationGet) {
            const res: NotificationPersonalRequest = await reqGetPersonNotification() as any
            if (res.code == 200) {
                const start = (val.page - 1) * val?.limit;
                const end = val.page * val.limit;
                this.ownList = res.data.list.slice(start, end);
                this.ownTotal = res.data.total
                this.ownAllList = res.data.list
                return true
            } else {
                return false
            }
        }

    }
})
