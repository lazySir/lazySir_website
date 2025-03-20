const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const frontAnnouncementHandle = require('../../router_handle/front/announcementHandle/index.js')
const {
    announcement_schema_query
} = require('../../schema/front/announcementSchema/index.js')
router.get('/', expressJoi(announcement_schema_query), frontAnnouncementHandle.getAnnouncements)

module.exports = router