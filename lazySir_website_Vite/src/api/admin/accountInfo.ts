import requests from '@/utils/request'
import API from '@/utils/API'
//退出登陆接口
export const reqLogout = () =>
    requests({
        url: API.adminInfoAPI.logout.url,
        method: API.adminInfoAPI.logout.method
    })
//获取管理员信息
export const reqAdminInfo = () =>
    requests({
        url: API.adminInfoAPI.getAdmin.url,
        method: API.adminInfoAPI.getAdmin.method
    })
//获取管理员列表
export const reqGetAdminList = (data: PublicTypes.PageAndSize, username?: string) => {
    return requests({
        url: API.adminInfoAPI.getAllAdmin.url,
        method: API.adminInfoAPI.getAllAdmin.method,
        params: {
            page: data.page,
            limit: data.limit,
            username
        }
    })
}
//修改管理员信息
export const reqUpdateAdminInfo = (data: AdminTypes.adminInfo) => {
    return requests({
        url: API.adminInfoAPI.updateAdmin.url,
        method: API.adminInfoAPI.updateAdmin.method,
        data
    })
}
//重置管理员密码
export const reqResetAdminPwd = (accountId: string) => {
    return requests({
        url: API.adminInfoAPI.resetPassword.url,
        method: API.adminInfoAPI.resetPassword.method,
        data: {
            accountId
        }
    })
}
//修改密码
export const reqModifyPwd = (newPassword: string, oldPassword: string) => {
    return requests({
        url: API.adminInfoAPI.modifyPwd.url,
        method: API.adminInfoAPI.modifyPwd.method,
        data: {
            newPassword,
            oldPassword
        }
    })
}
//删除管理员
export const reqDeleteAdmin = (accountId: string) => {
    return requests({
        url: API.adminInfoAPI.deleteAdmin.url,
        method: API.adminInfoAPI.deleteAdmin.method,
        data: {
            accountId
        }
    })
}