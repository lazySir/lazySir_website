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
// 导出一个函数reqAddOrUpdateTask，用于添加或更新任务
export const reqAddOrUpdateTask = (data: taskTypes.addOrUpdateTask) => {
    // 如果data中有taskId，则调用更新任务的接口
    if (data.taskId) {
        return requests({
            url: API.taskApi.updateTask.url,
            method: API.taskApi.updateTask.method,
            data
        })
        // 否则调用添加任务的接口
    } else {
        return requests({
            url: API.taskApi.addTask.url,
            method: API.taskApi.addTask.method,
            data
        })
    }
}
// 导出一个函数，用于删除任务
export const reqDeleteTask = (taskId: string[]) => {
    // 调用requests函数，传入url、method和data参数
    return requests({
        url: API.taskApi.deleteTask.url,
        method: API.taskApi.deleteTask.method,
        data: {
            // 将taskId数组赋值给taskIds
            taskIds: taskId
        }
    })
}

// 导出一个函数，用于获取审批列表
export const reqGetApprovalList = (data?: taskTypes.getApprovalList) => {
    // 调用requests函数，传入url、method和params参数
    return requests({
        url: API.taskAuthorizedApi.getTaskAuthorized.url,
        method: API.taskAuthorizedApi.getTaskAuthorized.method,
        params: data
    })
}
// 导出一个名为reqUpdateApproval的函数，参数为taskTypes.updateApproval类型的data
export const reqUpdateApproval = (data: taskTypes.updateApproval) => {
    // 调用requests函数，传入url、method和data参数
    return requests({
        url: API.taskAuthorizedApi.updateTaskAuthorized.url,
        method: API.taskAuthorizedApi.updateTaskAuthorized.method,
        data
    })
}
// 导出一个函数reqAddApproval，用于添加审批
export const reqAddApproval = (data: taskTypes.addApproval) => {
    // 调用requests函数，传入url、method和data参数
    return requests({
        url: API.taskAuthorizedApi.addTaskAuthorized.url,
        method: API.taskAuthorizedApi.addTaskAuthorized.method,
        data
    })
}
//获取个人申请列表
export const reqGetApplicationList = (data?: taskTypes.getApplication) => {
    return requests({
        url: API.taskAuthorizedApi.getPersonalTaskAuthorized.url,
        method: API.taskAuthorizedApi.getPersonalTaskAuthorized.method,
        params: data
    })
}
//获取可申请任务列表
export const reqGetCanApplicationTask = () => {
    return requests({
        url: API.taskAuthorizedApi.getTaskAuthorizedList.url,
        method: API.taskAuthorizedApi.getTaskAuthorizedList.method

    })
}