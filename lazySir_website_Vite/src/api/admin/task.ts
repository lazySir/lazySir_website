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
export const reqAddOrUpdateTask = (data: taskTypes.addOrUpdateTask) => {
    if (data.taskId) {
        return requests({
            url: API.taskApi.updateTask.url,
            method: API.taskApi.updateTask.method,
            data
        })
    } else {
        return requests({
            url: API.taskApi.addTask.url,
            method: API.taskApi.addTask.method,
            data
        })
    }
}
export const reqDeleteTask = (taskId: string[]) => {
    return requests({
        url: API.taskApi.deleteTask.url,
        method: API.taskApi.deleteTask.method,
        data: {
            taskIds: taskId
        }
    })
}