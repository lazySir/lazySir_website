
import requests from '@/utils/request'
import API from '@/utils/API'

export const reqGetMenu = (data?: string) => {
    return requests({
        url: API.menuAPI.getMenu.url,
        method: API.menuAPI.getMenu.method,
        params: {
            menuName: data
        }
    })
}
export const reqAddMenu = (data: MenuTypes.mysqlMenu) => {
    return requests({
        url: API.menuAPI.addMenu.url,
        method: API.menuAPI.addMenu.method,
        data
    })
}
export const reqUpdateMenu = (data: MenuTypes.mysqlMenu) => {
    return requests({
        url: API.menuAPI.updateMenu.url,
        method: API.menuAPI.updateMenu.method,
        data
    })
}
export const reqDeleteMenu = (data: Array<String>) => {
    return requests({
        url: API.menuAPI.deleteMenu.url,
        method: API.menuAPI.deleteMenu.method,
        data: {
            menusId: data
        }
    })
}

