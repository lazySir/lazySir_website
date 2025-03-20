
import requests from '@/utils/request'
import API from '@/utils/API'
// 获取招聘列表
export const reqGetRecruitmentList = (val: RecruitmentTypes.GetRecruitment) => {
    return requests({
        url: API.recruitmentAPI.adminGetRecruitment.url,
        method: API.recruitmentAPI.adminGetRecruitment.method,
        params: val
    })
}
// 新增/更新招聘
export const reqAddorUpdateRecruitment = (val: RecruitmentTypes.AddRecruitment) => {
    if (val.recruitmentId) {
        return requests({
            url: API.recruitmentAPI.adminUpdateRecruitment.url,
            method: API.recruitmentAPI.adminUpdateRecruitment.method,
            data: {
                ...val
            }
        })
    } else {
        return requests({
            url: API.recruitmentAPI.adminAddRecruitment.url,
            method: API.recruitmentAPI.adminAddRecruitment.method,
            data: {
                ...val
            }
        })
    }

}
//删除招聘
export const reqDeleteRecruitment = (val: RecruitmentTypes.DeleteRecruitment) => {
    return requests({
        url: API.recruitmentAPI.adminDeleteRecruitment.url,
        method: API.recruitmentAPI.adminDeleteRecruitment.method,
        data: {
            recruitmentIds: val
        }
    })
}
