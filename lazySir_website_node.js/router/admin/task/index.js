const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {
  task_schema_add,
  task_schema_update,
  task_schema_query,
  task_schema_delete,
} = require('../../../schema/admin/taskSchema/index') // 引入Joi验证规则
const authAdminTaskRouterHandle = require('../../../router_handle/admin/taskHandle')
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

module.exports = router
