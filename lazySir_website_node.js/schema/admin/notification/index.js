const Joi = require('joi')
const notification_schema_add = {
  body: {
    title: Joi.string()
      .max(255)
      .required()
      .error(new Error('标题不能为空，且长度不能超过255个字符')),

    content: Joi.string()
      .allow(null, '')
      .max(10000)
      .error(new Error('内容不能超过10000个字符')),

    typeId: Joi.string().required().error(new Error('通知类型不能为空')),

    levelId: Joi.string().required().error(new Error('优先等级不能为空')),
    state: Joi.boolean().default(true).error(new Error('状态必须为布尔值')),
  },
}
const notification_schema_update = {
  body: {
    notificationId: Joi.string().required().error(new Error('通知ID不能为空')),

    title: Joi.string()
      .max(255)
      .required()
      .error(new Error('标题不能为空，且长度不能超过255个字符')),

    content: Joi.string()
      .allow(null, '')
      .max(10000)
      .error(new Error('内容不能超过10000个字符')),

    typeId: Joi.string().required().error(new Error('通知类型不能为空')),

    levelId: Joi.string().required().error(new Error('优先等级不能为空')),

    state: Joi.boolean().required().error(new Error('状态必须为布尔值')),
  },
}
const notification_schema_delete = {
  body: {
    notificationIds: Joi.array()
      .items(Joi.string().required().error(new Error('通知ID不能为空')))
      .required()
      .error(new Error('通知ID列表不能为空')),
  },
}
const notification_schema_query = {
  query: {
    notificationId: Joi.string()
      .allow(null, '')
      .error(new Error('通知ID不正确')),

    title: Joi.string()
      .max(255)
      .allow(null, '')
      .error(new Error('标题不能超过255个字符')),

    content: Joi.string()
      .allow(null, '')
      .max(10000)
      .error(new Error('内容不能超过10000个字符')),

    typeId: Joi.string().allow(null, '').error(new Error('通知类型不正确')),

    levelId: Joi.string().allow(null, '').error(new Error('优先等级不正确')),

    senderNickName: Joi.string()
      .allow(null, '')
      .error(new Error('发送人不正确')),

    state: Joi.boolean().allow(null).error(new Error('状态必须为布尔值')),

    createDateFrom: Joi.date()
      .allow(null, '')
      .error(new Error('起始创建时间格式不正确')),

    createDateTo: Joi.date()
      .greater(Joi.ref('createDateFrom'))
      .allow(null, '')
      .error(new Error('结束创建时间必须大于起始创建时间')),

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
  notification_schema_add,
  notification_schema_update,
  notification_schema_delete,
  notification_schema_query,
}
