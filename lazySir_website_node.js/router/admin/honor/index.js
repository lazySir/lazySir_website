const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

const adminHonorHandle = require('../../../router_handle/admin/hornorHandle/index.js')
const { honor_schema_add,
  honor_schema_update,
  honor_schema_delete,
  honor_schema_query } = require('../../../schema/admin/honorSchema/index.js')
router.post('/', expressJoi(honor_schema_add), adminHonorHandle.addHonor)
router.put('/', expressJoi(honor_schema_update), adminHonorHandle.updateHonor)
router.delete('/', expressJoi(honor_schema_delete), adminHonorHandle.deleteHonor)
router.get('/', expressJoi(honor_schema_query), adminHonorHandle.getHonor)
module.exports = router