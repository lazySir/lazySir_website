import { defineStore } from 'pinia'
import { reqGetRole, reqAddRole, reqDeleteRole, reqUpdateRole } from '@/api/admin/role'
import { ElMessage } from 'element-plus'
export const useAdminRoleStore = defineStore('adminRoleStore', {
    state: () => {
        return {
            roleList: [] as RoleTypes.Role[],
            PageAndSize: {
                page: 1,
                limit: 5,
                total: 0
            } as PublicTypes.PageAndSize,
            menusId: [] as Array<String>
        }
    },
    getters: {
    },
    actions: {
        //获取角色列表
        async getRoleList(roleName?: string): Promise<Boolean> {
            const res: RequestTypes.request = await reqGetRole(this.PageAndSize) as any;
            if (res.code == 200) {
                this.roleList = (res.data as any).roles as Array<RoleTypes.Role>;
                this.PageAndSize.total = (res.data as any).totalRoles;
                return true;
            }
            return false;
        },
        // //新增或修改角色
        async addOrUpdateRole(val: RoleTypes.Role): Promise<Boolean> {
            let results: RequestTypes.request = [] as any
            if (val.roleId) {
                results = await reqUpdateRole(val) as any;
            } else {
                results = await reqAddRole(val) as any;
            }
            if (results.code == 200) {
                await this.getRoleList();
                ElMessage.success(results.message);
                return true;
            }
            return false;
        },
        // //删除角色
        async deleteRole(rorleIds: Array<string>): Promise<Boolean> {
            const res: RequestTypes.request = await reqDeleteRole(rorleIds) as any;
            if (res.code == 200) {
                await this.getRoleList();
                ElMessage.success(res.message);
                return true;
            }
            return false;
        },
    },
})
