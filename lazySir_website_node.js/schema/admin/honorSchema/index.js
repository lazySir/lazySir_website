const Joi = require('joi');

// 企业荣誉新增规则
const honor_schema_add = {
    body: {
        name: Joi.string()
            .max(255)
            .required()
            .error(new Error('荣誉名称不能为空，且长度不能超过255个字符')),
        description: Joi.string()
            .optional()
            .allow(null, '')
            .max(10000)
            .error(new Error('荣誉描述长度不能超过10000个字符')),
        companyId: Joi.string()
            .required()
            .error(new Error('公司ID不能为空')),
        newsId: Joi.string()
            .required()
            .error(new Error('新闻ID不能为空')),
        state: Joi.boolean()
            .default(true)
            .error(new Error('状态必须为布尔值')),
        createDate: Joi.date()
            .default(() => new Date())
            .error(new Error('获得日期格式不正确'))
    },
};

// 企业荣誉更新规则
const honor_schema_update = {
    body: {
        honorId: Joi.string()
            .required()
            .error(new Error('荣誉ID不能为空')),
        name: Joi.string()
            .max(255)
            .required()
            .error(new Error('荣誉名称不能为空，且长度不能超过255个字符')),
        description: Joi.string()
            .optional()
            .allow(null, '')
            .max(10000)
            .error(new Error('荣誉描述长度不能超过10000个字符')),
        companyId: Joi.string()
            .required()
            .error(new Error('公司ID不能为空')),
        newsId: Joi.string()
            .allow(null, '')
            .error(new Error('新闻ID格式错误，应为字符串类型')),
        state: Joi.boolean()
            .required()
            .error(new Error('状态必须为布尔值')),
        createDate: Joi.date()
            .required()
            .error(new Error('获得日期格式不正确'))
    },
};

// 企业荣誉删除规则
const honor_schema_delete = {
    body: {
        honorIds: Joi.array()
            .items(
                Joi.string()
                    .required()
                    .error(new Error('荣誉ID不能为空'))
            )
    },
};

// 企业荣誉查询规则
const honor_schema_query = {
    query: {
        name: Joi.string()
            .optional()
            .allow(null, '')
            .max(255)
            .error(new Error('荣誉名称不能超过255个字符')),
        state: Joi.boolean()
            .optional()
            .error(new Error('状态必须为布尔值')),
        companyId: Joi.string()
            .optional()
            .allow(null, '')
            .error(new Error('公司ID不正确')),
        description: Joi.string()
            .optional()
            .allow(null, '')
            .max(10000)
            .error(new Error('荣誉描述长度不能超过10000个字符')),
        newsId: Joi.string()
            .optional()
            .error(new Error('新闻ID不正确')),
        createDateFrom: Joi.date()
            .optional()
            .error(new Error('起始创建时间格式不正确')),
        createDateTo: Joi.date()
            .optional()
            .when('createDateFrom', {
                is: Joi.exist(),
                then: Joi.date().greater(Joi.ref('createDateFrom')).error(new Error('结束创建时间必须大于起始创建时间')),
            }),
        updateDateFrom: Joi.date()
            .optional()
            .error(new Error('起始更新时间格式不正确')),
        updateDateTo: Joi.date()
            .optional()
            .when('updateDateFrom', {
                is: Joi.exist(),
                then: Joi.date().greater(Joi.ref('updateDateFrom')).error(new Error('结束更新时间必须大于起始更新时间')),
            }),
        page: Joi.number()
            .min(1)
            .default(1)
            .error(new Error('分页页码必须是正整数')),
        limit: Joi.number()
            .min(1)
            .default(10)
            .error(new Error('每页数量必须是正整数')),
    },
};

module.exports = {
    honor_schema_add,
    honor_schema_update,
    honor_schema_delete,
    honor_schema_query,
};
