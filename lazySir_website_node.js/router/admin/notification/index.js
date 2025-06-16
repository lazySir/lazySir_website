const express = require('express')
const router = express.Router()
//接受表的前缀
const reciverUrl = '/receiver'
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {
  notification_schema_add,
  notification_schema_update,
  notification_schema_delete,
  notification_schema_query,
  notificationReceiver_schema_add,
  notificationReceiver_schema_update,
  notificationReceiver_schema_query,
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
//增加通知接受表
router.post(
  reciverUrl,
  expressJoi(notificationReceiver_schema_add),
  authAdminNotificationHandle.addReceiver,
)
// //查询通知接受表
router.get(
  reciverUrl,
  expressJoi(notificationReceiver_schema_query),
  authAdminNotificationHandle.getReceiver,
)
// //修改通知接受表
router.put(
  reciverUrl,
  expressJoi(notificationReceiver_schema_update),
  authAdminNotificationHandle.updateReceiver,
)
//管理员获取个人通知
router.get('/personal', authAdminNotificationHandle.getMyNotifications)
module.exports = router
