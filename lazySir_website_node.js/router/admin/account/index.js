const express = require('express')
const router = express.Router()
const adminAccountRouterHandle = require('../../../router_handle/admin/accountHandle/index.js')
//引入joi验证规则
const {
  account_schema_register,
  account_schema_login,
} = require('../../../schema/admin/account/index')
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
//管理员获取指定分类下的所有attrList
router.post(
  '/login',
  expressJoi(account_schema_login),
  adminAccountRouterHandle.login,
)
router.post(
  '/register',
  expressJoi(account_schema_register),
  adminAccountRouterHandle.register,
)
module.exports = router
