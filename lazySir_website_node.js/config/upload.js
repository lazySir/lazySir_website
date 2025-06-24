const multer = require('multer')
const iconv = require('iconv-lite')
const uploadUrls = {
  adminAvatar: {
    //文件上传位置
    uploadUrl: 'public/admin/avatar/',
    //数据库存储路径要移除掉public
    saveUrl: '/admin/avatar/',
  },
  newsImage: {
    uploadUrl: 'public/public/news/',
    saveUrl: '/public/news/',
  },
  announcementImage: {
    imgUploadUrl: 'public/public/announcement/images/',
    imgSaveUrl: '/public/announcement/images/',
    fileUploadUrl: 'public/public/announcement/files/',
    fileSaveUrl: '/public/announcement/files/',
  },
  //任务
  taskImage: {
    imgUploadUrl: 'public/admin/task/images/',
    imgSaveUrl: '/public/task/images/',
    fileUploadUrl: 'public/admin/task/files/',
    fileSaveUrl: '/public/task/files/',
  },
}
// 管理员头像配置存储路径和文件名
const adminAvatarConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadUrls.adminAvatar.uploadUrl)
  },
  filename: function (req, file, cb) {
    // 确保 req.user.accountId 存在
    if (!req.user || !req.user.accountId) {
      return cb(new Error('用户未登录，无法获取 accountId'))
    }
    // 提取文件后缀名
    const newFileName = `${req.user.accountId}` + '-' + file.originalname
    cb(null, newFileName)
  },
})
// 后台新闻配置存储路径和文件名
// 新闻图片存储配置
const newsImageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadUrls.newsImage.uploadUrl)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const newFileName = `${uniqueSuffix}` + '-' + file.originalname
    cb(null, newFileName)
  },
})
// 公告管理图片存储配置
const announcementImageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据文件类型选择存储路径
    const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(
      file.mimetype,
    )
    if (isImage) {
      cb(null, uploadUrls.announcementImage.imgUploadUrl) // 图片存储路径
    } else {
      cb(null, uploadUrls.announcementImage.fileUploadUrl) // 非图片文件存储路径
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    // 转换文件名为 UTF-8
    const newFileName =
      `${uniqueSuffix}` +
      '-' +
      iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf8')
    cb(null, newFileName) // 生成新的文件名
  },
})
// 任务图片和文件存储配置
// 上传任务附件的 storage
const taskUploadConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(
      file.mimetype,
    )
    cb(
      null,
      isImage
        ? uploadUrls.taskImage.imgUploadUrl
        : uploadUrls.taskImage.fileUploadUrl,
    )
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + req.user.accountId
    // 转换文件名为 UTF-8
    const newFileName =
      `${uniqueSuffix}` +
      '-' +
      iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf8')
    cb(null, newFileName) // 生成新的文件名
  },
})
//新闻
const newsImageUpload = multer({ storage: newsImageConfig })
//管理员头像
const adminAvatarUpload = multer({ storage: adminAvatarConfig })
//公告
const announcementUpload = multer({ storage: announcementImageConfig })
//任务
const taskUpload = multer({ storage: taskUploadConfig })
module.exports = {
  adminAvatarUpload,
  newsImageUpload,
  announcementUpload,
  taskUpload,
  uploadUrls,
}
