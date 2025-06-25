import { defineStore } from 'pinia'
import { reqGetTaskList, reqAddOrUpdateTask, reqDeleteTask } from '@/api/admin/task'
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
        async getTaskList(data?: taskTypes.getTaskList) {
            const res: taskRequest = await reqGetTaskList(data) as any
            if (res.code === 200) {
                this.taskList = res.data.list
                this.taskTotal = res.data.total
                return true
            } else {

                return false
            }
        },
        //修改或新增任务
        async addOrUpdateTask(data: taskTypes.addOrUpdateTask) {
            const res = await reqAddOrUpdateTask(data) as any
            if (res.code === 200) {
                ElMessage.success(res.message)
                return true
            } else {

                return false
            }
        },
        //删除任务
        async deleteTask(data: string[]) {
            const res = await reqDeleteTask(data) as any
            if (res.code === 200) {
                ElMessage.success(res.message)
                return true
            } else {

                return false
            }
        }
    }
})

