import requests from '@/utils/request'
import API from '@/utils/API'

//查询通知消息
// 导出一个函数，用于获取通知列表
export const reqGetNotification = (val?: NotificationTypes.getNotificationList) => {
    // 调用requests函数，传入url、method和params参数
    return requests({
        url: API.notificationApi.getNotification.url,
        method: API.notificationApi.getNotification.method,
        params: val
    })
}
// 导出一个函数，用于添加或更新通知
export const reqAddorUpdateNotification = (val: NotificationTypes.addOrupdateNotification) => {
    // 如果通知id存在，则调用更新通知的接口
    if (val.notificationId) {
        return requests({
            url: API.notificationApi.updateNotification.url,
            method: API.notificationApi.updateNotification.method,
            data: val
        })
        // 否则调用添加通知的接口
    } else {
        return requests({
            url: API.notificationApi.addNotification.url,
            method: API.notificationApi.addNotification.method,
            data: val
        })
    }

}
// 导出一个函数，用于删除通知
export const reqDeleteNotification = (val: String[]) => {
    // 调用requests函数，传入url、method和data参数
    return requests({
        url: API.notificationApi.deleteNotification.url,
        method: API.notificationApi.deleteNotification.method,
        data: {
            // 传入通知id数组
            notificationIds: val
        }
    })
}
// 导出一个函数，用于获取通知接收列表
export const reqGetNotificationReceive = (val?: NotificationTypes.getNotificationList) => {
    // 调用requests函数，传入url、method和params参数
    return requests({
        url: API.notificationApi.getNotificationReceive.url,
        method: API.notificationApi.getNotificationReceive.method,
        params: val
    })
}
// 导出一个函数，用于更新通知接收状态
export const reqUpdateNotificationReceive = (val: NotificationTypes.receiveUpdate) => {
    // 调用requests函数，传入url、method和data参数
    return requests({
        url: API.notificationApi.updateNotificationReceive.url,
        method: API.notificationApi.updateNotificationReceive.method,
        data: val
    })
}
// 导出一个函数，用于获取个人通知
export const reqGetPersonNotification = () => {
    // 调用requests函数，传入url、method和params参数
    return requests({
        url: API.notificationApi.getAdminPersonalNotifiction.url,
        method: API.notificationApi.getAdminPersonalNotifiction.method,

    })
}