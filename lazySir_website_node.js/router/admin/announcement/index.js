const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const authAnnouncementHandle = require('../../../router_handle/admin/announcementHandle/index.js')
const {
    announcement_schema_add,
    announcement_schema_update,
    announcement_schema_delete,
    announcement_schema_query
} = require('../../../schema/admin/announcementSchema/index.js')

const { announcementUpload } = require('../../../config/upload.js')

// 添加公告
router.post('/', expressJoi(announcement_schema_add), authAnnouncementHandle.addAnnouncement)
//更新公告
router.put('/', expressJoi(announcement_schema_update), authAnnouncementHandle.updateAnnouncement)
//查询公告
router.get('/', expressJoi(announcement_schema_query), authAnnouncementHandle.getAnnouncements)
//删除公告接口
router.delete('/', expressJoi(announcement_schema_delete), authAnnouncementHandle.deleteAnnouncements)
//公告图片上传地址
router.post('/uploadImage', announcementUpload.single('img'), authAnnouncementHandle.uploadAnnouncementImg)
//公告文件上传地址
router.post('/uploadFile', announcementUpload.single('file'), authAnnouncementHandle.uploadAnnouncementFile)
module.exports = router