const express = require('express');
const router = express.Router();
const adminAccountRouter = require('../router/admin/account')
//注册登陆接口
router.use('/account', adminAccountRouter)

module.exports = router;