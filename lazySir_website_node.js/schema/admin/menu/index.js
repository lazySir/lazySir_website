const Joi = require('joi')
const menuIdSchema = Joi.string()
  .max(255)
  .required()
  .error(new Error('菜单 ID 格式不正确或为空'))
const accountIdSchema = Joi.string()
  .max(255)
  .required()
  .error(new Error('更新人 ID 格式不正确或为空'))
const menuNameSchema = Joi.string()
  .max(255)
  .required()
  .error(new Error('菜单名称格式不正确或为空'))
const menuValueSchema = Joi.string()
  .max(255)
  .required()
  .error(new Error('菜单值格式不正确或为空或不唯一'))
const sortOrderSchema = Joi.number()
  .min(-99)
  .max(99)
  .error(new Error('菜单排序值范围为-99到99'))
const parentIdSchema = Joi.string()
  .allow(null, '') // 允许 null 和 空字符串
  .max(255)
  .error(new Error('上级菜单 ID 格式不正确'))
const levelSchema = Joi.number()
  .default(1)
  .min(1)
  .max(3)
  .error(new Error('菜单级别最小为1,最大为3'))
const pathSchema = Joi.string()
  .max(255)
  .required()
  .error(new Error('菜单路径格式不正确或为空或不唯一'))
const stateSchema = Joi.boolean()
  .default(true)
  .required()
  .error(new Error('状态格式应为布尔值'))

const iconSchema = Joi.string()
  .default('ep:menu')
  .max(255)
  .allow(null, '') // 允许 null 和 空字符串
  .error(new Error('图标格式不正确'))
const descriptionSchema = Joi.string()
  .max(255)
  .allow(null, '') // 允许 null 和 空字符串
  .error(new Error('菜单描述格式不正确'))

//搜索的名字
const searchMenuName = Joi.string()
  .max(255)
  .allow(null, '') // 允许 null 和 空字符串
  .error(new Error('菜单名称格式不正确或为空'))
const menu_schema_get = {
  query: {
    menuName: searchMenuName,
  },
}
//新增菜单的参数要求
const menu_schema_add = {
  body: {
    menuName: menuNameSchema,
    menuValue: menuValueSchema,
    parentId: parentIdSchema,
    level: levelSchema,
    path: pathSchema,
    state: stateSchema,
    icon: iconSchema,
    description: descriptionSchema,
    sortOrder: sortOrderSchema,
  },
}
//新增菜单的参数要求
const menu_schema_update = {
  body: {
    menuId: menuIdSchema,
    ...menu_schema_add.body,
  },
}
const menu_schema_delete = {
  body: {
    menusId: Joi.array()
      .items(menuIdSchema)
      .required()
      .error(new Error('菜单 ID 格式不正确或为空')),
  },
}
module.exports = {
  menu_schema_get,
  menu_schema_add,
  menu_schema_update,
  menu_schema_delete,
}
