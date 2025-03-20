const Joi = require('joi');

// 新闻新增规则
const news_schema_add = {
    body: {
        title: Joi.string()
            .max(255)
            .required()
            .error(new Error('标题不能为空，且长度不能超过255个字符')),
        content: Joi.string()
            .allow(null, '')

            .error(new Error('内容不能超过10000个字符且应为字符串')),
        state: Joi.boolean()
            .default(true)
            .error(new Error('状态必须为布尔值')),
        hotSearchWordIds: Joi.string()
            .allow(null, '')
            .max(255)
            .error(new Error('热搜词长度不能超过255个字符')),
        companyId: Joi.string()
            .required()
            .error(new Error('公司ID不能为空')),
    },
};

// 新闻更新规则
const news_schema_update = {
    body: {
        newsId: Joi.string()
            .required()
            .error(new Error('新闻ID不能为空')),
        title: Joi.string()
            .required()
            .max(255)
            .error(new Error('标题长度不能超过255个字符')),
        content: Joi.string()
            .allow(null, '')

            .error(new Error('内容不能超过10000个字符且应为字符串')),
        companyId: Joi.string()
            .required()
            .error(new Error('公司ID不能为空')),
        state: Joi.boolean()
            .required()
            .error(new Error('状态必须为布尔值')),
        hits: Joi.number()
            .integer()
            .min(0)
            .error(new Error('点击量必须是一个不小于0的整数')),
        hotSearchWordIds: Joi.string()
            .allow(null, '')
            .max(255)
            .error(new Error('热搜词长度不能超过255个字符')),
    },
};

// 新闻删除规则
const news_schema_delete = {
    body: {
        newsIds: Joi.array()
            .items(
                Joi.string()
                    .required()
                    .error(new Error('新闻ID不能为空'))
            )

    },
};

// 新闻查询规则
const news_schema_query = {
    query: {
        newsId: Joi.string()
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
        state: Joi.boolean()
            .allow(null)
            .error(new Error('状态必须为布尔值')),
        hotSearchWordIds: Joi.string()
            .allow(null, '')
            .max(255)
            .error(new Error('热搜词长度不能超过255个字符')),
        companyId: Joi.string()
            .allow(null, '')
            .error(new Error('公司ID不正确')),
        createDateFrom: Joi.date()
            .allow(null, '')
            .error(new Error('起始创建时间格式不正确')),
        createDateTo: Joi.date()
            .greater(Joi.ref('createDateFrom'))
            .allow(null, '')
            .error(new Error('结束创建时间必须大于起始创建时间')),
        updateDateFrom: Joi.date()
            .allow(null, '')
            .error(new Error('起始更新时间格式不正确')),
        updateDateTo: Joi.date()
            .greater(Joi.ref('updateDateFrom'))
            .allow(null, '')
            .error(new Error('结束更新时间必须大于起始更新时间')),
        hitsFrom: Joi.number()
            .integer()
            .min(0)
            .allow(null)
            .error(new Error('最小点击量必须是一个不小于0的整数')),
        hitsTo: Joi.number()
            .integer()
            .min(0)
            .greater(Joi.ref('hitsFrom'))
            .allow(null)
            .error(new Error('最大点击量必须大于或等于最小点击量')),
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
};

module.exports = {
    news_schema_add,
    news_schema_update,
    news_schema_delete,
    news_schema_query,
};