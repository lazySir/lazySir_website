const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const { taskUpload } = require('../../../config/upload.js')
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
  taskViewRequest_schema_queryPersonal,
} = require('../../../schema/admin/taskSchema/taskViewRequest')
//汇报表
const {
  taskReport_schema_add,
  taskReport_schema_update,
  taskReport_schema_query,
  taskReport_schema_delete,
} = require('../../../schema/admin/taskSchema/taskReport')
//任务管理处理函数
const authAdminTaskRouterHandle = require('../../../router_handle/admin/taskHandle')
//授权管理处理函数
const authAdminTaskViewRequestRouterHandle = require('../../../router_handle/admin/taskHandle/taskViewRequest.js')
//任务汇报处理函数
const authAdminTaskReportRouterHandle = require('../../../router_handle/admin/taskHandle/taskReport.js')
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
//--------------------------------------审批-------------------------------------------
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
//查询个人申请列表
router.get(
  '/taskViewRequest/personal',
  expressJoi(taskViewRequest_schema_queryPersonal),
  authAdminTaskViewRequestRouterHandle.getMyTaskViewRequests,
)
//查询个人能申请的任务列表
router.get(
  '/taskApprovalList',
  authAdminTaskViewRequestRouterHandle.getTasksUserCanApplyView,
)

//-----------------------------------------汇报-----------------------------------------
//任务图片上传地址
router.post(
  '/uploadImage',
  taskUpload.single('img'),
  authAdminTaskReportRouterHandle.uploadTaskImg,
)
//任务文件上传地址
router.post(
  '/uploadFile',
  taskUpload.single('file'),
  authAdminTaskReportRouterHandle.uploadTaskFile,
)
//新增汇报记录
router.post(
  '/taskReport',
  expressJoi(taskReport_schema_add),
  authAdminTaskReportRouterHandle.addTaskReport,
)
//更新任务汇报记录
router.put(
  '/taskReport',
  expressJoi(taskReport_schema_update),
  authAdminTaskReportRouterHandle.updateTaskReport,
)
//筛选任务汇报列表 ---查询所有
router.get(
  '/taskReport',
  expressJoi(taskReport_schema_query),
  authAdminTaskReportRouterHandle.getTaskReports,
)
//查询个人可查看的任务汇报记录
router.get(
  '/taskReport/personal',
  expressJoi(taskReport_schema_query),
  authAdminTaskReportRouterHandle.getAuthorizedTaskReports,
)
//查询个人可汇报任务列表
router.get(
  '/taskReportList',
  authAdminTaskReportRouterHandle.getReportableTasks,
)
//删除汇报记录
router.delete(
  '/taskReport',
  expressJoi(taskReport_schema_delete),
  authAdminTaskReportRouterHandle.deleteTaskReport,
)
module.exports = router
