const Joi = require('joi')
const roleIdSchema = Joi.string()
  .max(255)
  .required()
  .error(new Error('角色 ID 格式不正确或为空'))
const roleNameSchema = Joi.string()
  .max(255)
  .required()
  .error(new Error('角色名称格式不正确或为空'))
const stateSchema = Joi.boolean()
  .default(true)
  .required()
  .error(new Error('状态格式应为布尔值'))
const descriptionSchema = Joi.string()
  .max(255)
  .allow(null, '') // 允许 null 和 空字符串
  .error(new Error('角色描述格式不正确'))
const searchRoleName = Joi.string().max(255).allow(null, '') // 允许 null 和 空字符串
const role_schema_get = {
  query: {
    searchRoleName,
    page: Joi.number().required().min(1).max(255).error(new Error('当前页数格式不正确')),
    limit: Joi.number().required().min(1).max(255).error(new Error('每页条数格式不正确')),
  },
}
const role_schema_add = {
  body: {
    roleName: roleNameSchema,
    description: descriptionSchema,
    state: stateSchema,
  },
}
const role_schema_update = {
  body: {
    roleId: roleIdSchema,
    roleName: roleNameSchema,
    description: descriptionSchema,
    state: stateSchema,
  },
}
const role_schema_delete = {
  body: {
    rolesId: Joi.array()
      .items(roleIdSchema)
      .required()
      .error(new Error('角色 ID 格式不正确或为空')),
  },
}

module.exports = {
  role_schema_add,
  role_schema_get,
  role_schema_update,
  role_schema_delete,
}
