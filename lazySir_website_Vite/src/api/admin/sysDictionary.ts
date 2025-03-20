
import requests from '@/utils/request'
import API from '@/utils/API'
//删除系统字典接口
export const reqDeleteSysDictionary = (dictionaryIds: string[]) => {
    return requests({
        url: API.sysDictionaryAPI.adminDeleteDictionary.url,
        method: API.sysDictionaryAPI.adminDeleteDictionary.method,
        data: {
            dictionaryIds
        }
    })
}
//新增系统字典接口
export const reqAddOrUpdateSysDictionary = (data: sysDictionaryTypes.addOrUpdateSysDictionary) => {
    if (data.dictionaryId) {
        return requests({
            url: API.sysDictionaryAPI.adminUpdateDictionary.url,
            method: API.sysDictionaryAPI.adminUpdateDictionary.method,
            data
        })
    } else {
        return requests({
            url: API.sysDictionaryAPI.adminAddDictionary.url,
            method: API.sysDictionaryAPI.adminAddDictionary.method,
            data
        })
    }

}
//获取系统字典接口
export const reqGetSysDictionary = (data: sysDictionaryTypes.getSysDictionary) => {
    return requests({
        url: API.sysDictionaryAPI.adminGetDictionary.url,
        method: API.sysDictionaryAPI.adminGetDictionary.method,
        params: {
            ...data
        }
    })
}
//获取所有父级字典接口
export const reqGetAllParentDictionary = (data: string) => {
    return requests({
        url: API.sysDictionaryAPI.adminGetAllParentDictionary.url,
        method: API.sysDictionaryAPI.adminGetAllParentDictionary.method,
        params: {
            dictionaryId: data
        }
    })
}