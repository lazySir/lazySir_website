import { defineStore } from 'pinia'
import { reqGetNotification, reqAddorUpdateNotification } from '@/api/admin/notification'
import { ElMessage } from 'element-plus'
interface NotificationRequest extends RequestTypes.request {
    data: {
        list: NotificationTypes.list[],
        total: number
    }

}
export const useNotificationStore = defineStore('NotificationStore', {

    state: () => {
        return {
            list: [] as NotificationTypes.list[],
            total: 0,
        }

    },
    getters: {},
    actions: {
        async getNotificationList(val?: NotificationTypes.getNotificationList) {
            const res: NotificationRequest = await reqGetNotification(val) as any
            if (res.code == 200) {
                this.list = res.data.list
                this.total = res.data.total
                console.log(res.data)
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
        }
    }
})
