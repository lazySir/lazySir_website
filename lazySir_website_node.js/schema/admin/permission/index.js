const Joi = require('joi')
const rolesId = Joi.array()
  .items(String)
  .required()
  .error(new Error('角色 ID 格式不正确或为空'))
const roleId = Joi.string()
  .max(255)
  .required()
  .error(new Error('角色 ID 格式不正确或为空'))
const accountId = Joi.string()
  .max(255)
  .required()
  .error(new Error('用户 ID 格式不正确或为空'))
const menuId = Joi.string()
  .max(255)
  .allow(null, '')
  .error(new Error('菜单ID格式不正确或为空'))
const role_schema_add = {
  body: {
    rolesId,
    accountId,
  },
}
const role_schema_get = {
  query: {
    accountId,
  },
}
const menuRole_schema_add = {
  body: {
    menusId: Joi.array()
      .items(menuId)
      .error(new Error('菜单 ID 格式不正确或为空')),
    roleId,
  },
}
const menuRole_schema_get = {
  body: {
    rolesId: Joi.array()
      .items(String)
      .error(new Error('角色 ID 格式不正确或为空')),
    flag: Joi.boolean().default(false).error(new Error('flag格式不正确或为空'))
  },
}
module.exports = {
  role_schema_add,
  role_schema_get,
  menuRole_schema_add,
  menuRole_schema_get,
}
