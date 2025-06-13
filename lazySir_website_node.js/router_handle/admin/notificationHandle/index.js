const prisma = require('../../../db')
const { formatDate } = require('../../../utils')
/**
 * 添加通知
 * @param {*} req
 * @param {*} res
 */
exports.add = async (req, res) => {
  try {
    const { title, content, typeId, levelId, state = true } = req.body

    const senderId = req.user.accountId

    // 校验 typeId 是否属于字典 key 为 'noticeType'
    const typeRoot = await prisma.sysDictionary.findFirst({
      where: { key: 'notificationType' },
    })

    if (!typeRoot) {
      return res.myError('未找到通知类型（notificationType）字典项', 400)
    }

    const validType = await prisma.sysDictionary.findFirst({
      where: {
        dictionaryId: typeId,
        parentId: typeRoot.dictionaryId,
      },
    })

    if (!validType) {
      return res.myError('typeId 无效，不属于通知类型字典项', 400)
    }

    // 校验 levelId 是否属于字典 key 为 'level'
    const levelRoot = await prisma.sysDictionary.findFirst({
      where: { key: 'level' },
    })

    if (!levelRoot) {
      return res.myError('未找到通知等级（level）字典项', 400)
    }

    const validLevel = await prisma.sysDictionary.findFirst({
      where: {
        dictionaryId: levelId,
        parentId: levelRoot.dictionaryId,
      },
    })

    if (!validLevel) {
      return res.myError('levelId 无效，不属于通知等级字典项', 400)
    }

    // 创建通知
    const newNotification = await prisma.notification.create({
      data: {
        title,
        content,
        typeId,
        levelId,
        state,
        senderId,
      },
    })

    res.mySuccess(newNotification, '通知添加成功')
  } catch (error) {
    res.myError('添加通知失败: ' + error.message, 500)
  }
}

/**
 * 查询通知列表接口（支持分页、模糊查询、时间范围筛选）
 * @param {*} req
 * @param {*} res
 */
// 查询通知接口，改成和新闻接口类似风格
exports.get = async (req, res) => {
  try {
    const {
      notificationId,
      title,
      content,
      typeId,
      levelId,
      senderNickName,
      state,
      createDateFrom,
      createDateTo,
      page = 1,
      limit = 10,
    } = req.query

    const queryConditions = {}

    if (notificationId) queryConditions.notificationId = notificationId
    if (title) queryConditions.title = { contains: title, mode: 'insensitive' }
    if (content)
      queryConditions.content = { contains: content, mode: 'insensitive' }
    if (typeId) {
      const tid =
        typeof typeId === 'object' && typeId.value ? typeId.value : typeId
      queryConditions.typeId = tid
    }
    if (levelId) {
      const lid =
        typeof levelId === 'object' && levelId.value ? levelId.value : levelId
      queryConditions.levelId = lid
    }
    if (state !== undefined && state !== '')
      queryConditions.state = state === 'true'
    if (createDateFrom)
      queryConditions.createDate = { gte: new Date(createDateFrom) }
    if (createDateTo)
      queryConditions.createDate = {
        ...queryConditions.createDate,
        lte: new Date(createDateTo),
      }

    // 根据发送人昵称查找 accountId
    if (senderNickName) {
      const adminInfo = await prisma.adminInfo.findFirst({
        where: { nickname: senderNickName },
        select: { accountId: true },
      })
      if (!adminInfo) return res.myError('未找到对应的发送人')
      queryConditions.senderId = adminInfo.accountId
    }

    // 查询通知总数
    const totalCount = await prisma.notification.count({
      where: queryConditions,
    })

    // 查询通知列表
    const notifications = await prisma.notification.findMany({
      where: queryConditions,
      include: {
        sender: {
          select: {
            nickname: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: {
        createDate: 'desc',
      },
    })

    // 收集 typeId 和 levelId 的唯一值
    const uniqueTypeIds = [
      ...new Set(notifications.map((n) => n.typeId).filter(Boolean)),
    ]
    const uniqueLevelIds = [
      ...new Set(notifications.map((n) => n.levelId).filter(Boolean)),
    ]

    // 查询字典
    const sysdictionaryEntries = await prisma.sysDictionary.findMany({
      where: {
        OR: [
          { dictionaryId: { in: uniqueTypeIds } },
          { dictionaryId: { in: uniqueLevelIds } },
        ],
      },
      select: {
        dictionaryId: true,
        value: true,
      },
    })

    // 构造映射
    const sysdictionaryMap = {}
    sysdictionaryEntries.forEach(({ dictionaryId, value }) => {
      sysdictionaryMap[dictionaryId] = value
    })

    // 构造返回结果，新增 typeValue 和 levelValue，不替换原字段
    const result = notifications.map((item) => {
      return {
        ...item,
        typeValue: sysdictionaryMap[item.typeId] || null,
        levelValue: sysdictionaryMap[item.levelId] || null,
        senderNickName: item.sender ? item.sender.nickname : null,
        createDate: formatDate(item.createDate),
      }
    })

    return res.mySuccess(
      {
        list: result,
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
      },
      '通知查询成功',
    )
  } catch (error) {
    console.error(error)
    return res.myError('查询通知失败: ' + error.message, 500)
  }
}

/**
 * 更新通知
 * @param {*} req
 * @param {*} res
 */
exports.update = async (req, res) => {
  try {
    const { notificationId, title, content, typeId, levelId, state } = req.body

    if (!notificationId) {
      return res.myError('缺少通知ID', 400)
    }

    // 先查找是否存在该通知
    const existing = await prisma.notification.findUnique({
      where: { notificationId },
    })
    if (!existing) {
      return res.myError('通知不存在', 404)
    }

    const updateData = {}

    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (state !== undefined) updateData.state = state

    // 若提供 typeId，则验证其是否为合法子项
    if (typeId !== undefined) {
      const typeRoot = await prisma.sysDictionary.findFirst({
        where: { key: 'notificationType' },
      })
      if (!typeRoot) return res.myError('未找到通知类型字典项', 400)

      const validType = await prisma.sysDictionary.findFirst({
        where: {
          dictionaryId: typeId,
          parentId: typeRoot.dictionaryId,
        },
      })
      if (!validType)
        return res.myError('typeId 无效，不属于通知类型字典项', 400)

      updateData.typeId = typeId
    }

    // 若提供 levelId，则验证其是否为合法子项
    if (levelId !== undefined) {
      const levelRoot = await prisma.sysDictionary.findFirst({
        where: { key: 'level' },
      })
      if (!levelRoot) return res.myError('未找到通知等级字典项', 400)

      const validLevel = await prisma.sysDictionary.findFirst({
        where: {
          dictionaryId: levelId,
          parentId: levelRoot.dictionaryId,
        },
      })
      if (!validLevel)
        return res.myError('levelId 无效，不属于通知等级字典项', 400)

      updateData.levelId = levelId
    }

    const updated = await prisma.notification.update({
      where: { notificationId },
      data: updateData,
    })

    return res.mySuccess(updated, '通知更新成功')
  } catch (error) {
    console.error(error)
    return res.myError('更新通知失败: ' + error.message, 500)
  }
}

/**
 * 删除通知（支持批量）
 * @param {*} req
 * @param {*} res
 */
exports.delete = async (req, res) => {
  try {
    let { notificationIds } = req.body

    // 查询实际存在的通知
    const existing = await prisma.notification.findMany({
      where: {
        notificationId: { in: notificationIds },
      },
      select: { notificationId: true },
    })

    if (existing.length === 0) {
      return res.myError('未找到任何要删除的通知', 404)
    }

    const existingIds = existing.map((item) => item.notificationId)

    // 执行删除
    await prisma.notification.deleteMany({
      where: {
        notificationId: { in: existingIds },
      },
    })

    res.mySuccess(null, `成功删除 ${existingIds.length} 条通知`)
  } catch (error) {
    console.error(error)
    res.myError('删除通知失败: ' + error.message, 500)
  }
}
