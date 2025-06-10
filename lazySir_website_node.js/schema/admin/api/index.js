const Joi = require('joi')

// 字段定义
const apiId = Joi.string()
  .uuid()
  .required()
  .error(new Error('apiId格式不正确或为空'))

const apiName = Joi.string()
  .max(255)
  .required()
  .error(new Error('apiName格式不正确或为空'))

const apiPath = Joi.string()
  .max(255)
  .required()
  .error(new Error('apiPath格式不正确或为空'))

const methodId = Joi.string()
  .required()
  .error(new Error('methodId格式不正确或为空'))

const description = Joi.string()
  .max(500)
  .allow(null, '')
  .error(new Error('description格式不正确'))

const groupId = Joi.string()
  .max(255)
  .allow(null, '')
  .error(new Error('groupId格式不正确'))

const state = Joi.boolean()
  .default(true)
  .error(new Error('state格式不正确，应为布尔值'))

const requireAuth = Joi.boolean()
  .default(true)
  .error(new Error('requireAuth格式不正确，应为布尔值'))

const accountId = Joi.string()
  .max(255)
  .required()
  .error(new Error('accountId格式不正确或为空'))

const updateId = Joi.string()
  .max(255)
  .allow(null, '')
  .error(new Error('updateId格式不正确'))

// 改成 honor_schema_add 一样的写法

const api_schema_add = {
  body: {
    apiName,
    apiPath,
    methodId,
    description,
    groupId,
    state,
    requireAuth,
  },
}

const api_schema_update = {
  body: {
    apiId,
    apiName,
    apiPath,
    methodId,
    description,
    groupId,
    state,
    requireAuth,
  },
}

const api_schema_delete = {
  body: {
    apiIds: Joi.array()
      .items(apiId)
      .min(1)
      .required()
      .error(new Error('apiIds格式不正确或为空')),
  },
}

const api_schema_get = {
  query: {
    apiName: Joi.string().max(255).allow(null, ''),
    apiPath: Joi.string().max(255).allow(null, ''),
    state: Joi.boolean().allow(null),
    requireAuth: Joi.boolean().allow(null),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(9999).default(999),
  },
}

module.exports = {
  api_schema_add,
  api_schema_update,
  api_schema_delete,
  api_schema_get,
}
