const prisma = require('../../../db')
const { formatDate } = require('../../../utils') // 根据需要引入工具函数
const { uploadUrls } = require('../../../config/upload')
const iconv = require('iconv-lite') // 引入iconv-lite库
// 新增公告接口
exports.addAnnouncement = async (req, res) => {
  try {
    const { title, content, state, companyId, file } = req.body
    // 检查标题是否已经存在
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { title },
    })

    if (existingAnnouncement) {
      return res.myError('标题已存在，请使用其他标题')
    }
    // 创建新的公告
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content: content || null,
        state,
        accountId: req.user.accountId, // 发布人ID
        updatedId: req.user.accountId, // 更新人ID
        companyId,
        createDate: new Date(), // 创建时间
        updateDate: new Date(), // 更新时间
        file: file || null, // 附件
      },
    })

    return res.mySuccess(newAnnouncement, '公告创建成功')
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，请稍后再试')
  }
}
// 更新公告接口
exports.updateAnnouncement = async (req, res) => {
  try {
    const { announcementId, title, content, state, companyId, file, hits } =
      req.body
    // 查找正在更新的公告
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { announcementId },
    })

    if (!existingAnnouncement) return res.myError('未找到指定的公告信息')

    // 检查标题是否已经存在，排除当前公告
    const titleExists = await prisma.announcement.findFirst({
      where: { title, NOT: { announcementId } },
    })

    if (titleExists) {
      return res.myError('标题已存在，请使用其他标题')
    }

    // 更新公告
    const updatedAnnouncement = await prisma.announcement.update({
      where: { announcementId },
      data: {
        title,
        content,
        state,
        companyId,
        file: file || null,
        hits,
        updatedId: req.user.accountId,
        updateDate: new Date(),
      },
    })

    return res.mySuccess(updatedAnnouncement, '公告更新成功')
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，请稍后再试')
  }
}
// 查询公告接口
exports.getAnnouncements = async (req, res) => {
  try {
    const {
      announcementId,
      title,
      content,
      state,
      companyId,
      createDateFrom,
      createDateTo,
      updateDateFrom,
      updateDateTo,
      hitsFrom,
      nickName,
      updateNickName, // 更新人昵称
      hitsTo,
      page = 1,
      limit = 10,
    } = req.query
    const queryConditions = {}
    if (announcementId) queryConditions.announcementId = announcementId
    if (title) queryConditions.title = { contains: title }
    if (content) queryConditions.content = { contains: content }
    if (state !== undefined || state !== '') queryConditions.state = state
    if (companyId) queryConditions.companyId = companyId
    if (createDateFrom)
      queryConditions.createDate = { gte: new Date(createDateFrom) }
    if (createDateTo)
      queryConditions.createDate = {
        ...queryConditions.createDate,
        lte: new Date(createDateTo),
      }
    if (updateDateFrom)
      queryConditions.updateDate = { gte: new Date(updateDateFrom) }
    if (updateDateTo)
      queryConditions.updateDate = {
        ...queryConditions.updateDate,
        lte: new Date(updateDateTo),
      }
    if (hitsFrom) queryConditions.hits = { gte: parseInt(hitsFrom, 10) }
    if (hitsTo)
      queryConditions.hits = {
        ...queryConditions.hits,
        lte: parseInt(hitsTo, 10),
      }

    // 处理 nickName 查询
    if (nickName) {
      const adminInfo = await prisma.adminInfo.findFirst({
        where: { nickname: nickName },
        select: { accountId: true },
      })
      if (!adminInfo) return res.myError('未找到对应的发布人')
      queryConditions.accountId = adminInfo.accountId
    }
    // 处理 updateNickName 查询
    if (updateNickName) {
      const adminInfo = await prisma.adminInfo.findFirst({
        where: { nickname: updateNickName },
        select: { accountId: true },
      })
      if (!adminInfo) return res.myError('未找到对应的更新人')
      queryConditions.updatedId = adminInfo.accountId
    }
    const totalCount = await prisma.announcement.count({
      where: queryConditions,
    })

    const announcements = await prisma.announcement.findMany({
      where: queryConditions,
      skip: (page - 1) * limit,
      take: Number(limit),
    })
    const result = await Promise.all(
      announcements.map(async (item) => {
        const announcement = { ...item }
        if (item.accountId) {
          const adminInfo = await prisma.adminInfo.findFirst({
            where: { accountId: item.accountId },
            select: { nickname: true },
          })
          announcement.nickName = adminInfo ? adminInfo.nickname : null
        }
        if (item.updatedId) {
          const adminInfo = await prisma.adminInfo.findFirst({
            where: { accountId: item.updatedId },
            select: { nickname: true },
          })
          announcement.updateNickName = adminInfo ? adminInfo.nickname : null
        }
        if (item.companyId) {
          const systemDictionary = await prisma.sysDictionary.findFirst({
            where: { dictionaryId: item.companyId },
            select: { value: true },
          })
          announcement.companyValue = systemDictionary
            ? systemDictionary.value
            : null
        }

        announcement.createDate = formatDate(item.createDate)
        announcement.updateDate = formatDate(item.updateDate)
        return announcement
      }),
    )
    return res.mySuccess(
      {
        data: result,
        totalCount,
        page: Number(page),
        limit: Number(limit),
      },
      '公告查询成功',
    )
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，请稍后再试')
  }
}
// 删除公告接口
exports.deleteAnnouncements = async (req, res) => {
  try {
    // 验证请求数据
    const { announcementIds } = req.body

    if (!Array.isArray(announcementIds) || announcementIds.length === 0) {
      return res.myError('请提供有效的公告ID数组')
    }

    const existingAnnouncements = await prisma.announcement.findMany({
      where: { announcementId: { in: announcementIds } },
      select: { announcementId: true, title: true },
    })

    const existingAnnouncementIds = existingAnnouncements.map(
      (item) => item.announcementId,
    )
    const notFoundIds = announcementIds.filter(
      (id) => !existingAnnouncementIds.includes(id),
    )

    // 删除公告
    await prisma.announcement.deleteMany({
      where: { announcementId: { in: existingAnnouncementIds } },
    })

    if (notFoundIds.length > 0) {
      return res.mySuccess(
        { notFound: notFoundIds },
        '部分公告未找到，删除失败',
      )
    }

    return res.mySuccess(null, '公告删除成功')
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，请稍后再试')
  }
}

//上传公告图片
exports.uploadAnnouncementImg = async (req, res) => {
  try {
    // 确保文件上传成功
    const file = req.file
    if (!file) {
      return res.myError('公告图片上传失败，请重新尝试')
    }

    // 构建图片访问 URL
    const imgUrl =
      process.env.SERVER_URL +
      uploadUrls.announcementImage.imgSaveUrl +
      `${file.filename}`
    // 返回成功响应
    return res.send({
      errno: 0,
      data: { url: imgUrl },
    })
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，上传失败')
  }
}
//上传公告文件
exports.uploadAnnouncementFile = async (req, res) => {
  try {
    // 确保文件上传成功

    const file = req.file
    // 转换文件名为 UTF-8
    const UTFName = iconv.decode(
      Buffer.from(file.originalname, 'binary'),
      'utf8',
    )
    if (!file) {
      return res.myError('公告文件上传失败，请重新尝试')
    }

    // 构建图片访问 URL
    const fileUrl = uploadUrls.announcementImage.fileSaveUrl + file.filename
    // 返回成功响应
    return res.mySuccess(
      {
        name: UTFName,
        url: fileUrl,
      },
      '公告文件上传成功',
    )
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，上传失败')
  }
}
