const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const {
  role_schema_add,
  role_schema_get,
  menuRole_schema_add,
  menuRole_schema_get,
} = require('../../../schema/admin/permission')
const authAdminPermissionRouterHandle = require('../../../router_handle/admin/permissionHandle/index.js')
router.put(
  '/menu',
  expressJoi(menuRole_schema_add),
  authAdminPermissionRouterHandle.updateAuth,
)
router.post(
  '/menu',
  expressJoi(menuRole_schema_get),
  authAdminPermissionRouterHandle.getAuth,
)
router.get(
  '/role',
  expressJoi(role_schema_get),
  authAdminPermissionRouterHandle.getRole,
)
router.put(
  '/role',
  expressJoi(role_schema_add),
  authAdminPermissionRouterHandle.updateRole,
)
module.exports = router
