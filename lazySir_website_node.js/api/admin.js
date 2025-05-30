// routes/frontendRoutes.js
const express = require('express')
const router = express.Router()
//前缀

const permissionPrefix = '/permission'
//引入管理员路由
const authAdminApiRouter = require('../router/admin/api')
const authAdminMenuRouter = require('../router/admin/menu')
const authAdminAccountRouter = require('../router/admin/accountInfo')
const authAdminRoleRouter = require('../router/admin/role')
const authAdminPermissionRouter = require('../router/admin/permission')
const authAdminSystenDictionary = require('../router/admin/systemDictionary')
const authAdminRecruitmentRouter = require('../router/admin/recruitment')
const authAdminNewsRouter = require('../router/admin/news')
const authAdminHonorRouter = require('../router/admin/honor')
const authAdminAnnouncementRouter = require('../router/admin/announcement')
//管理员API接口
router.use('/adminApi', authAdminApiRouter)
//管理员账户信息接口
router.use('/accountInfo', authAdminAccountRouter)
//管理员菜单接口
router.use(permissionPrefix + '/menu', authAdminMenuRouter)
//管理员角色接口
router.use(permissionPrefix + '/role', authAdminRoleRouter)
//管理员修改用户角色接口
router.use(permissionPrefix + '/auth', authAdminPermissionRouter)
//管理员系统字典接口
router.use('/systemDictionary', authAdminSystenDictionary)
//管理员招聘接口
router.use('/recruitment', authAdminRecruitmentRouter)
//管理员新闻咨询接口
router.use('/news', authAdminNewsRouter)
//管理员：荣誉管理接口
router.use('/honor', authAdminHonorRouter)
//管理员：公告管理接口
router.use('/announcement', authAdminAnnouncementRouter)
module.exports = router
