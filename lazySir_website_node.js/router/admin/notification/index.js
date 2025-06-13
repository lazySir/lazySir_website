const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {
  notification_schema_add,
  notification_schema_update,
  notification_schema_delete,
  notification_schema_query,
} = require('../../../schema/admin/notification') // 引入Joi验证规则
const authAdminNotificationHandle = require('../../../router_handle/admin/notificationHandle')
//新增通知
router.post(
  '/',
  expressJoi(notification_schema_add),
  authAdminNotificationHandle.add,
)
// //查询通知
router.get(
  '/',
  expressJoi(notification_schema_query),
  authAdminNotificationHandle.get,
)
// //修改通知
router.put(
  '/',
  expressJoi(notification_schema_update),
  authAdminNotificationHandle.update,
)
// //删除通知
router.delete(
  '/',
  expressJoi(notification_schema_delete),
  authAdminNotificationHandle.delete,
)

module.exports = router
