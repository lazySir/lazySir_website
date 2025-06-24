const Joi = require('joi')

// 🔼 新增汇报
const taskReport_schema_add = {
  body: {
    taskId: Joi.string().required().error(new Error('任务ID不能为空')),

    title: Joi.string()
      .max(255)
      .required()
      .error(new Error('汇报标题不能为空，且不能超过255个字符')),

    statusId: Joi.string().required().error(new Error('汇报状态ID不能为空')),

    content: Joi.string()
      .max(100000)
      .required()
      .error(new Error('汇报内容不能为空，且不能超过10万字符')),

    note: Joi.string()
      .max(1000)
      .allow(null, '')
      .error(new Error('备注长度不能超过1000个字符')),

    attachment: Joi.string().allow(null, '').error(new Error('附件格式错误')),
  },
}

// 📝 更新汇报
const taskReport_schema_update = {
  body: {
    reportId: Joi.string().required().error(new Error('汇报ID不能为空')),

    title: Joi.string()
      .max(255)
      .required()
      .error(new Error('汇报标题不能为空，且不能超过255个字符')),

    statusId: Joi.string().required().error(new Error('汇报状态ID不能为空')),

    content: Joi.string()
      .max(100000)
      .required()
      .error(new Error('汇报内容不能为空，且不能超过10万字符')),

    note: Joi.string()
      .max(1000)
      .allow(null, '')
      .error(new Error('备注长度不能超过1000个字符')),

    attachment: Joi.string().allow(null, '').error(new Error('附件格式错误')),
  },
}

// 🔍 查询汇报（支持条件、分页）
const taskReport_schema_query = {
  query: {
    title: Joi.string().allow(null, '').error(new Error('标题格式不正确')),
    reporterNickname: Joi.string()
      .allow(null, '')
      .error(new Error('汇报人昵称格式不正确')),
    statusId: Joi.string().allow(null, '').error(new Error('状态格式不正确')),
    note: Joi.string().allow(null, '').error(new Error('备注格式不正确')),
    content: Joi.string().allow(null, '').error(new Error('内容格式不正确')),
    createDateTo: Joi.string()
      .allow(null, '')
      .error(new Error('创建时间格式不正确')),
    createDateFrom: Joi.string()
      .allow(null, '')
      .error(new Error('创建时间格式不正确')),
    updateDateTo: Joi.string()
      .allow(null, '')
      .error(new Error('更新时间格式不正确')),
    updateDateFrom: Joi.string()
      .allow(null, '')
      .error(new Error('更新时间格式不正确')),
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

// ❌ 删除汇报（支持批量）
const taskReport_schema_delete = {
  body: {
    reportIds: Joi.array()
      .items(Joi.string().required().error(new Error('汇报ID不能为空')))
      .required()
      .error(new Error('汇报ID列表不能为空或不为数组')),
  },
}

module.exports = {
  taskReport_schema_add,
  taskReport_schema_update,
  taskReport_schema_query,
  taskReport_schema_delete,
}
