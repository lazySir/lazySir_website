const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const authAdminRecruitmentRouterHandle = require('../../../router_handle/admin/recruitment/index.js')
const { recruitment_schema_add,
    recruitment_schema_update,
    recruitment_schema_delete,
    recruitment_schema_get } = require('../../../schema/admin/recruitment/index.js')

router.post('/', expressJoi(recruitment_schema_add), authAdminRecruitmentRouterHandle.addRecruitment)
router.get('/', expressJoi(recruitment_schema_get), authAdminRecruitmentRouterHandle.getRecruitments)
router.put('/', expressJoi(recruitment_schema_update), authAdminRecruitmentRouterHandle.updateRecruitment)
router.delete('/', expressJoi(recruitment_schema_delete), authAdminRecruitmentRouterHandle.deleteRecruitments)
module.exports = router
