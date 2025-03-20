
import requests from '@/utils/request'
import API from '@/utils/API'
// 获取新闻咨询
export const reqGetNews = (val: adminNewsTypes.getNews) => {
    return requests({
        url: API.newsAPI.adminGetNews.url,
        method: API.newsAPI.adminGetNews.method,
        params: val
    })
}
// 新增/更新新闻咨询
export const reqAddorUpdateNews = (val: adminNewsTypes.addorUpdateNews) => {
    if (val.newsId) {
        return requests({
            url: API.newsAPI.adminUpdateNews.url,
            method: API.newsAPI.adminUpdateNews.method,
            data: {
                ...val
            }
        })
    } else {
        return requests({
            url: API.newsAPI.adminAddNews.url,
            method: API.newsAPI.adminAddNews.method,
            data: {
                ...val
            }

        })
    }

}
//删除新闻咨询
export const reqDeleteNews = (val: Array<String>) => {
    return requests({
        url: API.newsAPI.adminDeleteNews.url,
        method: API.newsAPI.adminDeleteNews.method,
        data: {
            newsIds: val
        }
    })
}
