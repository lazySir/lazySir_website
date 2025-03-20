const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const { adminAvatarUpload } = require('../../../config/upload.js')
const authAdminAccountRouterHandle = require('../../../router_handle/admin/accountInfoHandle/index.js')
const {
  account_shcema_get,
  account_schema_update,
  account_schema_password,
  account_schema_delete,
} = require('../../../schema/admin/account')
//退出登陆接口
router.post('/logout', authAdminAccountRouterHandle.logout)
//获取目前登陆的管理员用户信息接口
router.get('/', authAdminAccountRouterHandle.getAdminInfo)
//获取所有管理员接口
router.get(
  '/all',
  expressJoi(account_shcema_get),
  authAdminAccountRouterHandle.getAdmins,
)
//修改管理员信息接口
router.put(
  '/',
  expressJoi(account_schema_update),
  authAdminAccountRouterHandle.updateAdminInfo,
)
//重置管理员密码接口
router.put('/resetPwd', authAdminAccountRouterHandle.resetPassword)
//修改管理员密码接口
router.put(
  '/modifyPwd',
  expressJoi(account_schema_password),
  authAdminAccountRouterHandle.modifyPassword,
)
//删除管理员接口
router.delete('/', expressJoi(account_schema_delete), authAdminAccountRouterHandle.deleteAdminAccount)
// 管理员上传头像接口
router.post('/uploadAvatar', adminAvatarUpload.single('img'), authAdminAccountRouterHandle.uploadAvatar);

module.exports = router