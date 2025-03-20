const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const {
    sysDictionary_schema_get,
    sysDictionary_schema_getAllParent } = require('../../schema/front/systemDictionary/index')
const frontSystemDictionaryHandle = require('../../router_handle/front/systemDictionaryHandle/index')
router.get('/', expressJoi(sysDictionary_schema_get), frontSystemDictionaryHandle.getDictionary)
router.get('/getAllParent', expressJoi(sysDictionary_schema_getAllParent), frontSystemDictionaryHandle.getDictionaryAndParents)
module.exports = router
