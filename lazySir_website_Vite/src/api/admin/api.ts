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

