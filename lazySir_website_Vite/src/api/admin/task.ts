import requests from '@/utils/request'
import API from '@/utils/API'

//查询任务接口
export const reqGetTaskList = (data?: taskTypes.getTaskList) => {
    return requests({
        url: API.taskApi.getTask.url,
        method: API.taskApi.getTask.method,
        params: data
    })
}