const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {
    news_schema_query, } = require('../../schema/front/newsSchema/index'); // 引入Joi验证规则
const frontNewsRouterHandle = require('../../router_handle/front/newsHandle/index.js')


//查询新闻
router.get('/', expressJoi(news_schema_query), frontNewsRouterHandle.getNews)

module.exports = router
