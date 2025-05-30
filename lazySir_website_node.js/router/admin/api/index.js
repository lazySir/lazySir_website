const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

const apiHandle = require('../../../router_handle/admin/apiHandle/index.js')
const {
  api_schema_add,
  api_schema_update,
  api_schema_delete,
  api_schema_get,
} = require('../../../schema/admin/api/index.js')

// 新增API接口
router.post('/', expressJoi(api_schema_add), apiHandle.addApi)

// // 更新API接口
router.put('/', expressJoi(api_schema_update), apiHandle.updateApi)

// // 查询API接口（支持分页查询）
router.get('/', expressJoi(api_schema_get), apiHandle.getApi)

// // 删除API接口（支持批量删除）
router.delete('/', expressJoi(api_schema_delete), apiHandle.deleteApi)

module.exports = router
