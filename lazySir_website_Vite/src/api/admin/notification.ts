import requests from '@/utils/request'
import API from '@/utils/API'

//查询通知消息
export const reqGetNotification = (val?: NotificationTypes.getNotificationList) => {
    return requests({
        url: API.notificationApi.getNotification.url,
        method: API.notificationApi.getNotification.method,
        params: val
    })
}
export const reqAddorUpdateNotification = (val: NotificationTypes.addOrupdateNotification) => {
    if (val.notificationId) {
        return requests({
            url: API.notificationApi.updateNotification.url,
            method: API.notificationApi.updateNotification.method,
            data: val
        })
    } else {
        return requests({
            url: API.notificationApi.addNotification.url,
            method: API.notificationApi.addNotification.method,
            data: val
        })
    }

}