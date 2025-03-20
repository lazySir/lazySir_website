import requests from '@/utils/request'
import API from '@/utils/API'
//获取公告列表
export const reqGetAnnountement = (data: AnnouncementTypes.getAnnouncements) => {
    return requests({
        url: API.announcementAPI.adminGetAnnouncement.url,
        method: API.announcementAPI.adminGetAnnouncement.method,
        params: data
    })
}
//新增和更新公告
export const reqAddorUpdateAnnouncement = (data: AnnouncementTypes.addOrUpdateAnnouncement) => {
    if (data.announcementId) {
        return requests({
            url: API.announcementAPI.adminUpdateAnnouncement.url,
            method: API.announcementAPI.adminUpdateAnnouncement.method,
            data
        })
    } else {
        return requests({
            url: API.announcementAPI.adminAddAnnouncement.url,
            method: API.announcementAPI.adminAddAnnouncement.method,
            data
        })
    }
}
//删除公告
export const reqDeleteAnnouncement = (data: Array<string>) => {
    return requests({
        url: API.announcementAPI.adminDeleteAnnouncement.url,
        method: API.announcementAPI.adminDeleteAnnouncement.method,
        data: {
            announcementIds: data
        }
    })
}