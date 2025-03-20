const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const { news_schema_add,
    news_schema_update,
    news_schema_delete,
    news_schema_query, } = require('../../../schema/admin/newsSchema'); // 引入Joi验证规则
const authAdminNewsRouterHandle = require('../../../router_handle/admin/newsHandle')
const { newsImageUpload } = require('../../../config/upload.js')
//新增新闻
router.post('/', expressJoi(news_schema_add), authAdminNewsRouterHandle.addNews)
//查询新闻
router.get('/', expressJoi(news_schema_query), authAdminNewsRouterHandle.getNews)
//修改新闻
router.put('/', expressJoi(news_schema_update), authAdminNewsRouterHandle.updateNews)
//删除新闻
router.delete('/', expressJoi(news_schema_delete), authAdminNewsRouterHandle.deleteNews)
//上传新闻图片
router.post('/upload', newsImageUpload.single('img'), authAdminNewsRouterHandle.uploadNewsImg)
module.exports = router
