const Joi = require('joi');
// 新闻查询规则
const news_schema_query = {
    query: {
        newsId: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('新闻ID不正确')),
        title: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('标题不能超过255个字符')),
        content: Joi.string()
            .allow(null, '')

            .error(new Error('内容不能超过10000个字符且应为字符串')),
        nickName: Joi.string()
            .allow(null, '')
            .error(new Error('最后发布人名称不正确')),

        hotSearchWordIds: Joi.string()
            .allow(null, '')
            .max(255)
            .error(new Error('热搜词长度不能超过255个字符')),
        companyId: Joi.string()
            .allow(null, '')
            .error(new Error('公司ID不正确')),
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .error(new Error('分页页码必须是正整数')),
        limit: Joi.number()
            .integer()
            .min(1)
            .error(new Error('每页数量必须是正整数')),
    },
};

module.exports = {
    news_schema_query,
};