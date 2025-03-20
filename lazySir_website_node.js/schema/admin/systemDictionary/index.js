const Joi = require('joi');

// 字典ID 验证规则
const dictionaryIdSchema = Joi.string()
    .max(255)
    .required()
    .error(new Error('字典 ID 格式不正确或为空'));

// 键名称 验证规则
const keySchema = Joi.string()
    .max(100)
    .required()
    .error(new Error('键名称格式不正确或为空'));

// 值 验证规则
const valueSchema = Joi.string()
    .max(100)
    .required()
    .error(new Error('值格式不正确或为空'));

// 等级 验证规则（1至3）
const levelSchema = Joi.number()
    .min(1)
    .max(3)
    .required()
    .error(new Error('等级格式应为1至3之间'));

// 描述 验证规则
const descriptionSchema = Joi.string()
    .max(255)
    .allow(null, '') // 允许 null 和 空字符串
    .error(new Error('描述格式不正确'));

// 父级字典ID 验证规则
const parentIdSchema = Joi.string()
    .max(255)
    .allow(null, '')
    .error(new Error('父级字典 ID 格式不正确'));

// 状态 验证规则
const stateSchema = Joi.boolean()
    .default(true)
    .required()
    .error(new Error('状态格式应为布尔值'));



// 系统字典查询规则
const sysDictionary_schema_get = {
    query: {
        value: Joi.string().max(255).allow(null, ''),
        parentId: parentIdSchema,
        state: Joi.boolean().error((new Error('状态格式应为布尔值'))),
        level: Joi.number().min(1).max(3).error(new Error('等级格式应为1至3之间')),
        page: Joi.number().min(1).max(255).error(new Error('当前页数格式不正确')),
        limit: Joi.number().min(1).max(255).error(new Error('每页条数格式不正确')),
    },
};

// 系统字典新增规则
const sysDictionary_schema_add = {
    body: {
        key: keySchema,
        value: valueSchema,
        level: levelSchema,
        description: descriptionSchema,
        parentId: parentIdSchema,
        state: stateSchema,

    },
};
// 系统字典新增规则
const sysDictionary_schema_getAllParent = {
    query: {
        dictionaryId: dictionaryIdSchema

    },
};

// 系统字典更新规则
const sysDictionary_schema_update = {
    body: {
        dictionaryId: dictionaryIdSchema,
        key: keySchema,
        value: valueSchema,
        level: levelSchema,
        description: descriptionSchema,
        parentId: parentIdSchema,
        state: stateSchema,
    },
};

// 系统字典删除规则
const sysDictionary_schema_delete = {
    body: {
        dictionaryIds: Joi.array()
            .items(dictionaryIdSchema)
            .required()
            .error(new Error('字典 ID 格式不正确或为空')),
    },
};

module.exports = {
    sysDictionary_schema_add,
    sysDictionary_schema_get,
    sysDictionary_schema_update,
    sysDictionary_schema_delete,
    sysDictionary_schema_getAllParent
};
