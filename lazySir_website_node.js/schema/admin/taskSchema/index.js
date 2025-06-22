// 任务相关 Joi 校验规则
const Joi = require('joi')

const task_schema_add = {
  body: {
    title: Joi.string()
      .max(255)
      .required()
      .error(new Error('任务标题不能为空，且长度不能超过255个字符')),

    taskName: Joi.string()
      .max(100)
      .required()
      .error(new Error('任务代号不能为空，且长度不能超过100个字符')),

    deadline: Joi.date()
      .iso()
      .required()
      .error(new Error('任务截止日期格式不正确')),

    content: Joi.string()
      .max(100000)
      .required()
      .error(new Error('任务内容不能为空，且不能超过10万字符')),

    statusId: Joi.string().required().error(new Error('任务状态不能为空')),

    executorIds: Joi.array()
      .items(Joi.string().required().error(new Error('执行人ID格式有误')))
      .required()
      .error(new Error('执行人ID列表不能为空或不为数组')),

    viewerIds: Joi.array()
      .items(Joi.string().error(new Error('授权查看人ID格式有误')))
      .allow(null, '')
      .error(new Error('授权查看人列表格式不正确或不为数组')),
  },
}

const task_schema_update = {
  body: {
    taskId: Joi.string().required().error(new Error('任务ID不能为空')),

    title: Joi.string()
      .max(255)
      .required()
      .error(new Error('任务标题不能为空，且长度不能超过255个字符')),

    taskName: Joi.string()
      .max(100)
      .required()
      .error(new Error('任务代号不能为空，且长度不能超过100个字符')),

    deadline: Joi.date()
      .iso()
      .required()
      .error(new Error('任务截止日期格式不正确')),

    content: Joi.string()
      .max(100000)
      .required()
      .error(new Error('任务内容不能为空，且不能超过10万字符')),

    statusId: Joi.string().required().error(new Error('任务状态不能为空')),

    executorIds: Joi.array()
      .items(Joi.string().required().error(new Error('执行人ID格式有误')))
      .required()
      .error(new Error('执行人ID列表不能为空或不为数组')),

    viewerIds: Joi.array()
      .items(Joi.string().error(new Error('授权查看人ID格式有误')))
      .allow(null, '')
      .error(new Error('授权查看人列表格式不正确或不为数组')),
  },
}

const task_schema_query = {
  query: {
    title: Joi.string().allow(null, '').error(new Error('标题格式不正确')),
    taskName: Joi.string()
      .allow(null, '')
      .error(new Error('任务代号格式不正确')),
    statusId: Joi.string().allow(null, '').error(new Error('状态格式不正确')),
    creatorNickname: Joi.string()
      .allow(null, '')
      .error(new Error('创建人昵称格式不正确')),
    deadlineFrom: Joi.date()
      .iso()
      .allow(null, '')
      .error(new Error('开始截止时间格式不正确')),
    deadlineTo: Joi.date()
      .iso()
      .greater(Joi.ref('deadlineFrom'))
      .allow(null, '')
      .error(new Error('结束截止时间格式不正确')),
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
const task_schema_delete = {
  body: {
    taskIds: Joi.array()
      .items(Joi.string().required().error(new Error('任务ID不能为空')))
      .required()
      .error(new Error('任务ID列表不能为空或不为数组')),
  },
}
module.exports = {
  task_schema_add,
  task_schema_update,
  task_schema_query,
  task_schema_delete,
}
