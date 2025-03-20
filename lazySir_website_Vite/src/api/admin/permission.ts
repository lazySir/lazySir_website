
import requests from '@/utils/request'
import API from '@/utils/API'
//获取管理员角色列表
export const reqGetAdminRole = (accountId: string) => {
    return requests({
        url: API.permissionAPI.getAdminRole.url,
        method: API.permissionAPI.getAdminRole.method,
        params: {
            accountId
        }
    })
}
//更新管理员角色列表
export const reqUpdateAdminRole = (rolesId: Array<String>, accountId: string) => {
    return requests({
        url: API.permissionAPI.updateAdminRole.url,
        method: API.permissionAPI.updateAdminRole.method,
        data: { rolesId, accountId }
    })
}
//获取角色菜单列表
export const reqGetRoleMenu = (rolesId: Array<String>, flag?: boolean) => {
    return requests({
        url: API.permissionAPI.getRoleMenu.url,
        method: API.permissionAPI.getRoleMenu.method,
        data: { rolesId, flag }
    })
}
//更新角色菜单列表
export const reqUpdateRoleMenu = (roleId: string, menusId: Array<String>) => {
    return requests({
        url: API.permissionAPI.updateRoleMenu.url,
        method: API.permissionAPI.updateRoleMenu.method,
        data: { roleId, menusId }
    })
}