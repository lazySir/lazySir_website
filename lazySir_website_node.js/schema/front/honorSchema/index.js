const Joi = require('joi');


// 企业荣誉查询规则
const honor_schema_query = {
    query: {
        name: Joi.string()
            .optional()
            .allow(null, '')
            .max(255)
            .error(new Error('荣誉名称不能超过255个字符')),
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
    honor_schema_query,
};
