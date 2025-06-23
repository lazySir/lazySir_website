const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {
  //任务表
  task_schema_add,
  task_schema_update,
  task_schema_query,
  task_schema_delete,
} = require('../../../schema/admin/taskSchema/index') // 引入Joi验证规则
const {
  //任务审批表
  taskViewRequest_schema_add,
  taskViewRequest_schema_approve,
  taskViewRequest_schema_query,
} = require('../../../schema/admin/taskSchema/taskViewRequest')
//任务管理处理函数
const authAdminTaskRouterHandle = require('../../../router_handle/admin/taskHandle')
//授权管理处理函数
const authAdminTaskViewRequestRouterHandle = require('../../../router_handle/admin/taskHandle/taskViewRequest.js')
//新增任务
router.post('/', expressJoi(task_schema_add), authAdminTaskRouterHandle.addTask)
// //查询任务
router.get(
  '/',
  expressJoi(task_schema_query),
  authAdminTaskRouterHandle.getTasks,
)
// //修改任务
router.put(
  '/',
  expressJoi(task_schema_update),
  authAdminTaskRouterHandle.updateTask,
)
// //删除任务
router.delete(
  '/',
  expressJoi(task_schema_delete),
  authAdminTaskRouterHandle.deleteTasks,
)
// //新增审批
router.post(
  '/taskViewRequest',
  expressJoi(taskViewRequest_schema_add),
  authAdminTaskViewRequestRouterHandle.addTaskViewRequest,
)
// // //审批
router.put(
  '/taskViewRequest',
  expressJoi(taskViewRequest_schema_approve),
  authAdminTaskViewRequestRouterHandle.approveTaskViewRequest,
)
// // //查询审批
router.get(
  '/taskViewRequest',
  expressJoi(taskViewRequest_schema_query),
  authAdminTaskViewRequestRouterHandle.getTaskViewRequests,
)
module.exports = router
