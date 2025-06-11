import { defineStore } from 'pinia'
import {
    reqGetApi, reqAddOrUpdateApi, reqDeleteApi, reqGetRoleApi, reqUpdateRoleApi
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
            roleApiList: [] as AdminApiTypes.Api[] //角色API权限列表
        }
    },
    //相当于computed
    getters: {
        //根据group字段进行分组
        groupedApis(state) {
            const groupMap: Record<string, AdminApiTypes.Api[]> = {};

            state.list.forEach(api => {
                const group = api.groupValue || '未分组';
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
        },
        //只返回角色的apiId
        roleApiIds(state) {
            return state.roleApiList.map(api => api.apiId);
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
        },
        //新增或修改Api
        async addOrUpdateApi(data: AdminApiTypes.Api) {
            const res: APIrequest = await reqAddOrUpdateApi(data) as any
            if (res.code == 200) {
                ElMessage.success(res.message || '操作成功')
                return true
            } else {
                return false
            }
        },
        async deleteApi(id: string) {
            const res: APIrequest = await reqDeleteApi(id) as any
            if (res.code == 200) {
                ElMessage.success(res.message || '删除成功')
                //重新获取API列表
                return true
            } else {
                return false
            }
        },
        //获取角色API权限
        async getRoleApi(roleId: string) {
            const res: APIrequest = await reqGetRoleApi([roleId]) as any
            if (res.code == 200) {
                this.roleApiList = res.data.list
                return true
            } else {
                return false
            }
        },
        async updateRoleApi(roleId: string, apiIds: string[]) {
            const res: APIrequest = await reqUpdateRoleApi(roleId, apiIds) as any
            if (res.code == 200) {
                ElMessage.success(res.message || '更新成功')
                return true
            } else {
                return false
            }
        }
    }
})


