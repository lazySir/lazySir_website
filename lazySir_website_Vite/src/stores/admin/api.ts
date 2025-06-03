import { defineStore } from 'pinia'
import {
    reqGetApi
} from '@/api/admin/api'
import { ElMessage } from 'element-plus'
interface APIrequest extends RequestTypes.request {
    data: {
        list: AdminApiTypes.Api[],
        total: number
    }

}

//1.定义容器
//参数1：容器的ID，必须唯一（可以自己取名），将来Pinia会把所有的容器挂在到跟容器
export const useAdminApiStore = defineStore('adminApi', {

    state: () => {
        return {
            list: [] as AdminApiTypes.Api[], //API列表
            total: 0 as number, //API总数
        }
    },
    //相当于computed
    getters: {
        //根据group字段进行分组
        groupedApis(state) {
            const groupMap: Record<string, AdminApiTypes.Api[]> = {};

            state.list.forEach(api => {
                const group = api.group || '未分组';
                if (!groupMap[group]) {
                    groupMap[group] = [];
                }
                groupMap[group].push(api);
            });

            return Object.entries(groupMap).map(([group, children]) => ({
                group,
                isParent: true,
                children,
            }));
        }
    },

    //相当于methods
    actions: {
        async getApiList(data: AdminApiTypes.GetApi) {
            const res: APIrequest = await reqGetApi(data) as any
            if (res.code == 200) {
                this.list = res.data.list
                this.total = res.data.total
                return true
            }
        }
    }
})


