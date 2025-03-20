const express = require('express')
const router = express.Router()
const {
  role_schema_add,
  role_schema_get,
  role_schema_update,
  role_schema_delete,
} = require('../../../schema/admin/role/index.js')
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const authAdminRolesRouterHandle = require('../../../router_handle/admin/roleHandle/index.js')
router.get('/', expressJoi(role_schema_get), authAdminRolesRouterHandle.getRole)
router.post(
  '/',
  expressJoi(role_schema_add),
  authAdminRolesRouterHandle.addRole,
)
router.put(
  '/',
  expressJoi(role_schema_update),
  authAdminRolesRouterHandle.updateRole,
)
router.delete(
  '/',
  expressJoi(role_schema_delete),
  authAdminRolesRouterHandle.deleteRole,
)
module.exports = router
