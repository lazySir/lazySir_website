
import requests from '@/utils/request'
import API from '@/utils/API'

export const reqGetRole = (data: PublicTypes.PageAndSize, roleName?: string) => {
    return requests({
        url: API.roleAPI.getRole.url,
        method: API.roleAPI.getRole.method,
        params: {
            roleName,
            ...data
        }
    })
}
export const reqAddRole = (data: RoleTypes.Role) => {
    return requests({
        url: API.roleAPI.addRole.url,
        method: API.roleAPI.addRole.method,
        data
    })
}
export const reqUpdateRole = (data: RoleTypes.Role) => {
    return requests({
        url: API.roleAPI.updateRole.url,
        method: API.roleAPI.updateRole.method,
        data
    })
}
export const reqDeleteRole = (rolesId: Array<string>) => {
    return requests({
        url: API.roleAPI.deleteRole.url,
        method: API.roleAPI.deleteRole.method,
        data: {
            rolesId
        }
    })
}