// taskViewRequest Joi 校验规则
const Joi = require('joi')

const taskViewRequest_schema_add = {
  body: {
    taskId: Joi.string().required().error(new Error('任务ID不能为空')),
    reason: Joi.string()
      .max(10000)
      .allow(null, '')
      .error(new Error('申请理由不能超过10000个字符')),
  },
}

const taskViewRequest_schema_approve = {
  body: {
    requestId: Joi.string().required().error(new Error('申请ID不能为空')),

    statusId: Joi.string().required().error(new Error('审批状态不能为空')),

    approveNote: Joi.string()
      .max(1000)
      .allow(null, '')
      .error(new Error('审批备注不能超过1000个字符')),
  },
}

const taskViewRequest_schema_query = {
  query: {
    taskName: Joi.string()
      .allow(null, '')
      .error(new Error('任务代号格式不正确')),
    applicantNickname: Joi.string()
      .allow(null, '')
      .error(new Error('申请人昵称格式不正确')),
    //   审批人
    approverNickname: Joi.string()
      .allow(null, '')
      .error(new Error('审批人昵称格式不正确')),
    //   审批状态
    statusId: Joi.string()
      .allow(null, '')
      .error(new Error('审批状态格式不正确')),
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .error(new Error('分页页码必须是正整数')),
    limit: Joi.number()
      .integer()
      .min(1)
      .default(10)
      .error(new Error('每页数量必须是正整数')),
  },
}

module.exports = {
  taskViewRequest_schema_add,
  taskViewRequest_schema_approve,
  taskViewRequest_schema_query,
}
