const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

const frontHonorHandle = require('../../router_handle/front/honorHandle/index')
const {
    honor_schema_query } = require('../../schema/front/honorSchema/index.js')

router.get('/', expressJoi(honor_schema_query), frontHonorHandle.getHonor)
module.exports = router