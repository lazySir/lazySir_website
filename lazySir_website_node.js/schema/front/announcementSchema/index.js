const Joi = require('joi');
// 公告查询规则
const announcement_schema_query = {
    query: {
        announcementId: Joi.string()
            .allow(null, '')
            .error(new Error('公告ID不正确')),

        title: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('标题不能超过255个字符')),

        content: Joi.string()
            .allow(null, '')
            .max(10000)  // 假设内容最大长度为10000个字符
            .error(new Error('内容不能超过10000个字符且应为字符串')),

        nickName: Joi.string()
            .allow(null, '')
            .error(new Error('发布人姓名格式有问题，应为string类型')),


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
            .default(10)
            .error(new Error('每页数量必须是正整数')),
    },
};

module.exports = {
    announcement_schema_query,
};
