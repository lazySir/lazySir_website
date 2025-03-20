import requests from '@/utils/request'
import API from '@/utils/API'

export const reqLogin = (data: AdminTypes.accountLogin) => {
    return requests({
        url: API.accountAPI.login.url,
        method: API.accountAPI.login.method,
        data
    })
}
export const reqRegister = (data: AdminTypes.accountRegister) => {
    return requests({
        url: API.accountAPI.register.url,
        method: API.accountAPI.register.method,
        data
    })
}
