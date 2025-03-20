const express = require('express')
const router = express.Router()
const {
  menu_schema_get,
  menu_schema_add,
  menu_schema_update,
  menu_schema_delete,
} = require('../../../schema/admin/menu/index.js')
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const authAdminMenusRouterHandle = require('../../../router_handle/admin/menuHandle/index.js')

router.get('/', expressJoi(menu_schema_get), authAdminMenusRouterHandle.getMenu)
router.post(
  '/',
  expressJoi(menu_schema_add),
  authAdminMenusRouterHandle.addMenu,
)
router.put(
  '/',
  expressJoi(menu_schema_update),
  authAdminMenusRouterHandle.updateMenu,
)
router.delete(
  '/',
  expressJoi(menu_schema_delete),
  authAdminMenusRouterHandle.deleteMenu,
)
module.exports = router
