import requests from '@/utils/request'
import API from '@/utils/API'
//查询API接口
export const reqGetApi = (data: AdminApiTypes.GetApi) => {
    return requests({
        url: API.adminApi.getApi.url,
        method: API.adminApi.getApi.method,
        params: { ...data }
    })
}

export const reqAddOrUpdateApi = (data: AdminApiTypes.Api) => {
    if (data.apiId) {
        return requests({
            url: API.adminApi.updateApi.url,
            method: API.adminApi.updateApi.method,
            data: { ...data }
        })
    } else {
        return requests({
            url: API.adminApi.addApi.url,
            method: API.adminApi.addApi.method,
            data: { ...data }
        })
    }

}
export const reqDeleteApi = (apiId: string) => {
    return requests({
        url: API.adminApi.deleteApi.url,
        method: API.adminApi.deleteApi.method,
        data: {
            apiIds: [apiId]
        }
    })
}
//更新角色api接口权限
export const reqUpdateRoleApi = (roleId: string, apiIds: string[]) => {
    return requests({
        url: API.adminApi.updateRoleApi.url,
        method: API.adminApi.updateRoleApi.method,
        data: {
            roleId,
            apiIds
        }
    })
}
//获取角色api接口权限
export const reqGetRoleApi = (data: Array<string>) => {
    return requests({
        url: API.adminApi.getRoleApi.url,
        method: API.adminApi.getRoleApi.method,
        params: { roleIds: data }
    })
}