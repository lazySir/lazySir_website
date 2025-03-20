import { defineStore } from 'pinia'
import { reqAddOrUpdateSysDictionary, reqGetSysDictionary, reqDeleteSysDictionary } from "@/api/admin/sysDictionary"
import { ElMessage } from 'element-plus'
interface sysRequest extends RequestTypes.request {
    data: {
        data: sysDictionaryTypes.sysDictionary[],
        totalCount: number
    }

}
export const useSysDictionaryStore = defineStore('sysDictionaryStore', {

    state: () => {
        return {
            sysDictionary1: [] as sysDictionaryTypes.sysDictionary[],
            sysDictionary2: [] as sysDictionaryTypes.sysDictionary[],
            sysDictionary3: [] as sysDictionaryTypes.sysDictionary[],
            totalCount1: 0,
            totalCount2: 0,
            totalCount3: 0
        }

    },
    getters: {},
    actions: {
        async getSysDictionary(value: sysDictionaryTypes.getSysDictionary) {
            const res: sysRequest = await reqGetSysDictionary(value) as any
            if (res.code == 200) {
                if (value.level && value.level == 2) {
                    this.sysDictionary2 = res.data.data
                    this.totalCount2 = res.data.totalCount
                } else if (value.level && value.level == 3) {
                    this.sysDictionary3 = res.data.data
                    this.totalCount3 = res.data.totalCount
                } else {
                    this.sysDictionary1 = res.data.data
                    this.totalCount1 = res.data.totalCount
                }
                return true
            } else {
                return false
            }

        },
        async addOrUpdateSysDictionary(value: sysDictionaryTypes.addOrUpdateSysDictionary) {
            let flag = false
            const res: sysRequest = await reqAddOrUpdateSysDictionary(value) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                flag = true
            }
            return flag
        },
        //删除字典
        async deleteSysDictionary(value: string[]) {
            let flag = false
            const res: sysRequest = await reqDeleteSysDictionary(value) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                flag = true
            }
            return flag
        }
    }
})
