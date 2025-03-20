const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const frontRecruitmentHandle = require('../../router_handle/front/RecruitmentHandle/index.js')
const {

    recruitment_schema_get
} = require('../../schema/front/recruitmentSchema/index.js')



//查询公告
router.get('/', expressJoi(recruitment_schema_get), frontRecruitmentHandle.getRecruitments)

module.exports = router