import { defineStore } from 'pinia'
import { reqGetTaskList } from '@/api/admin/task'
import { ElMessage } from 'element-plus'
interface taskRequest extends RequestTypes.request {
    data: {
        list: taskTypes.taskList[],
        total: number,
    }
}
export const useAdminTaskStore = defineStore('adminTaskStore', {
    state: () => {
        return {
            taskList: [] as taskTypes.taskList[],
            taskTotal: 0,
        }
    },
    getters: {
    },
    actions: {
        //获取任务列表
        async getTaskList(params?: taskTypes.getTaskList) {
            const res: taskRequest = await reqGetTaskList(params) as any
            if (res.code === 200) {
                this.taskList = res.data.list
                this.taskTotal = res.data.total
                return true
            } else {
                ElMessage.error(res.message)
                return false
            }
        },
    }
})
