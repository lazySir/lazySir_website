const Joi = require('joi');

// 字段定义

const title = Joi.string()
    .max(255)
    .required()
    .error(new Error('标题格式不正确或为空'));
const content = Joi.string()
    .allow(null, '')

    .error(new Error('内容格式不正确'));
const isHot = Joi.boolean()
    .allow(null, '')
    .error(new Error('isHot格式不正确'));
const accountId = Joi.string()
    .max(255)
    .error(new Error('发布人ID格式不正确或为空'));
const addressId = Joi.string()
    .max(255)
    .required()
    .error(new Error('地址ID格式不正确或为空'));

const companyId = Joi.string()
    .max(255)
    .required()
    .error(new Error('公司ID格式不正确或为空'));

const category = Joi.string()
    .max(255)
    .required()
    .error(new Error('分类格式不正确或为空'));
// 查询招聘信息
const recruitment_schema_get = {
    query: {
        recruitmentId: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('招聘信息ID格式不正确或为空')),         // 可用于根据招聘信息ID查询
        nickName: Joi.string().min(1).max(255).allow(null, ''),          // 可用于根据发布人查询
        addressId: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('地址ID格式不正确或为空')),         // 可用于根据地址查询
        companyId: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('公司ID格式不正确或为空')),  // 可用于根据公司查询
        categoryId: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('分类ID格式不正确或为空')),        // 可用于根据分类查询
        degreeId: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('学历ID格式不正确或为空')),        // 可用于根据分类查询
        experienceId: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('工作经验ID格式不正确或为空')),        // 可用于根据分类查询
        // 可用于根据状态查询
        title: Joi.string()
            .max(255)
            .allow(null, '')
            .error(new Error('标题格式不正确或为空')),        // 可用于根据标题查询
        content: content,    // 可用于根据内容查询
        isHot: Joi.boolean().error(new Error('isHot格式不正确')),          // 可用于根据是否热门查询
        page: Joi.number().min(1).max(255).error(new Error('当前页数格式不正确')),
        limit: Joi.number().min(1).max(255).error(new Error('每页条数格式不正确'))
    },
};

module.exports = {

    recruitment_schema_get,
};