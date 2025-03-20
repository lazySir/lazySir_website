import { defineStore } from 'pinia'
import { reqGetRecruitmentList, reqAddorUpdateRecruitment, reqDeleteRecruitment } from '@/api/admin/recruitment'
import { ElMessage } from 'element-plus'
interface recruitmentRequest extends RequestTypes.request {
    data: {
        data: RecruitmentTypes.Recruitment[]
        totalCount: number
    }

}
export const useAdminRecruitmentStore = defineStore('adminRecruitmentStore', {

    state: () => {
        return {
            recruitmentList: [] as RecruitmentTypes.Recruitment[],
            totalCount: 0,
        }

    },
    getters: {},
    actions: {
        //获取招聘列表
        async getRecruitmentList(val: RecruitmentTypes.GetRecruitment) {
            const res: recruitmentRequest = await reqGetRecruitmentList(val) as any
            if (res.code == 200) {
                this.recruitmentList = res.data.data
                this.totalCount = res.data.totalCount
                return true
            }
            return false
        },
        //新增或修改招聘信息
        async addOrUpdateRecruitmentList(val: RecruitmentTypes.AddRecruitment) {

            const res: RequestTypes.request = await reqAddorUpdateRecruitment(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        },
        //删除招聘信息
        async deleteRecruitmentList(val: RecruitmentTypes.DeleteRecruitment) {
            const res: RequestTypes.request = await reqDeleteRecruitment(val) as any
            if (res.code == 200) {
                ElMessage.success(res.message)
                return true
            }
            return false
        }

    }
})
