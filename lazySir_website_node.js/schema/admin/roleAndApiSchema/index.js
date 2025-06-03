const Joi = require('joi')

// 基础字段校验
const roleId = Joi.string()
  .max(255)
  .required()
  .error(new Error('角色 ID 格式不正确或为空'))

const apiId = Joi.string().max(255).error(new Error('接口 ID 格式不正确或为空'))

const roleIds = Joi.array()
  .items(roleId)
  .required()
  .error(new Error('角色 ID 数组格式不正确或为空'))

const apiIds = Joi.array()
  .items(apiId)
  .required()
  .error(new Error('接口 ID 数组格式不正确或为空'))

// ---------- 查：根据 roleIds + apiIds 查询 ----------
const roleApi_schema_get = {
  body: {
    roleIds,
  },
}

// ---------- 改：更新一条绑定关系 ----------
const roleApi_schema_update = {
  body: {
    roleId,
    apiIds,
  },
}

module.exports = {
  roleApi_schema_get,

  roleApi_schema_update,
}
