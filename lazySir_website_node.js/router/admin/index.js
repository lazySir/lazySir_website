// routes/frontendRoutes.js
const express = require('express')
const router = express.Router()
//前缀

const permissionPrefix = '/permission'
//引入管理员路由
const authAdminApiRouter = require('./api')
const authAdminMenuRouter = require('./menu')
const authAdminAccountRouter = require('./accountInfo')
const authAdminRoleRouter = require('./role')
const authAdminPermissionRouter = require('./permission')
const authAdminSystenDictionary = require('./systemDictionary')
const authAdminRecruitmentRouter = require('./recruitment')
const authAdminNewsRouter = require('./news')
const authAdminHonorRouter = require('./honor')
const authAdminAnnouncementRouter = require('./announcement')
const adminAccountRouter = require('./account')

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
//注册登陆接口
router.use('/account', adminAccountRouter)
module.exports = router
