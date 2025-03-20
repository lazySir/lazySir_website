import requests from '@/utils/request'
import API from '@/utils/API'

export const reqGetHonor = (data: AdminHonorTypes.getHonor) => {
    return requests({
        url: API.honorAPI.adminGetHonor.url,
        method: API.honorAPI.adminGetHonor.method,
        params: {
            ...data
        }
    })
}
export const reqAddorUpdateHonor = (data: AdminHonorTypes.addOrUpdateHonor) => {
    if (data.honorId) {
        return requests({
            url: API.honorAPI.adminUpdateHonor.url,
            method: API.honorAPI.adminUpdateHonor.method,
            data
        })
    } else {
        return requests({
            url: API.honorAPI.adminAddHonor.url,
            method: API.honorAPI.adminAddHonor.method,
            data
        })
    }
}
export const reqDeleteHonor = (data: Array<String>) => {
    return requests({
        url: API.honorAPI.adminDeleteHonor.url,
        method: API.honorAPI.adminDeleteHonor.method,
        data: {
            honorIds: data
        }
    })
}