// routes/frontendRoutes.js
const express = require('express');
const router = express.Router();
const userAnnouncementRouter = require('../router/front/announcement')
const userNewsRouter = require('../router/front/news')
const userSystemDictionaryRouter = require('../router/front/systemDictionary')
const userHonorRouter = require('../router/front/honor')
const userRecruitmentRouter = require('../router/front/recruitment')
//前台公告接口
router.use('/announcement', userAnnouncementRouter)
//前台新闻接口
router.use('/news', userNewsRouter)
//前台系统字典接口
router.use('/systemDictionary', userSystemDictionaryRouter)
//前台荣誉接口
router.use('/honor', userHonorRouter)
//前台招聘接口
router.use('/recruitment', userRecruitmentRouter)

module.exports = router;