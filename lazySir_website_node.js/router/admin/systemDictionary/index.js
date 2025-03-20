const express = require('express')
const router = express.Router()
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
const { sysDictionary_schema_add,
    sysDictionary_schema_get,
    sysDictionary_schema_update,
    sysDictionary_schema_delete,
    sysDictionary_schema_getAllParent } = require('../../../schema/admin/systemDictionary')
const systemDictionaryHandle = require('../../../router_handle/admin/systemDictionaryHandle/index')
router.post('/', expressJoi(sysDictionary_schema_add), systemDictionaryHandle.addDictionary)
router.get('/', expressJoi(sysDictionary_schema_get), systemDictionaryHandle.getDictionary)
router.put('/', expressJoi(sysDictionary_schema_update), systemDictionaryHandle.updateDictionary)
router.delete('/', expressJoi(sysDictionary_schema_delete), systemDictionaryHandle.deleteDictionary)
router.get('/getAllParent', expressJoi(sysDictionary_schema_getAllParent), systemDictionaryHandle.getDictionaryAndParents)
module.exports = router
