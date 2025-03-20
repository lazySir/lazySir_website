import { defineStore } from 'pinia'
import { reqAddorUpdateNews, reqDeleteNews, reqGetNews } from '@/api/admin/news'
import { ElMessage } from 'element-plus'
interface adminNewsRequest extends RequestTypes.request {
    data: {
        data: adminNewsTypes.news[]
        totalCount: number
    }

}
export const useAdminNewsStore = defineStore('adminNewsStore', {

    state: () => {
        return {
            newsList: [] as adminNewsTypes.news[],
            totalCount: 0,
        }

    },
    getters: {},
    actions: {
        //获取新闻咨询
        async getNewsList(val: adminNewsTypes.getNews) {
            const res: adminNewsRequest = await reqGetNews(val) as any
            if (res.code == 200) {
                let data = res.data.data.map(item => {
                    return {
                        ...item,
                        hotSearchWordIds: JSON.parse(item.hotSearchWordIds)
                    }
                })
                this.newsList = data
                this.totalCount = res.data.totalCount
                return true
            }
            return false

        },
        async addOrUpdateNews(val: adminNewsTypes.addorUpdateNews) {
            const res: RequestTypes.request = await reqAddorUpdateNews(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        },
        async deleteNews(val: Array<String>) {
            const res: RequestTypes.request = await reqDeleteNews(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        },
        //获取单个新闻
        async getNews(val: adminNewsTypes.getNews) {
            const res: adminNewsRequest = await reqGetNews(val) as any
            if (res.code == 200) {
                let data = res.data.data.map(item => {
                    return {
                        ...item,
                        hotSearchWordIds: JSON.parse(item.hotSearchWordIds)
                    }
                })
                if (data) {
                    return data[0]
                } else {
                    return false
                }

            }
            return false

        },
    }
})
