const prisma = require('../../../db')
const { formatDate, validateChildDictionary } = require('../../../utils')

/**
 * 添加通知
 * @param {*} req
 * @param {*} res
 */
exports.add = async (req, res) => {
  try {
    const {
      title,
      content,
      typeId,
      levelId,
      state = true,
      receiverIds = [],
    } = req.body
    const senderId = req.user.accountId

    let validType, validLevel
    try {
      validType = await validateChildDictionary('notificationType', typeId)
      validLevel = await validateChildDictionary('level', levelId)
    } catch (err) {
      return res.myError(err.message, 400)
    }

    const isDesignation = validType.key === 'designation'
    let receiverRecords = []

    if (isDesignation) {
      if (!Array.isArray(receiverIds) || receiverIds.length === 0) {
        return res.myError('通知类型为“指定人员”时，receiverIds 不可为空', 400)
      }

      // ✅ 校验 receiverIds 中是否都存在于 adminInfo.accountId
      const validAccounts = await prisma.adminInfo.findMany({
        where: {
          accountId: {
            in: receiverIds,
          },
        },
        select: { accountId: true },
      })

      const validAccountIds = validAccounts.map((a) => a.accountId)
      const invalidIds = receiverIds.filter(
        (id) => !validAccountIds.includes(id),
      )

      if (invalidIds.length > 0) {
        return res.myError(
          `以下接收人ID无效，不存在于系统中：${invalidIds.join(', ')}`,
          400,
        )
      }

      receiverRecords = receiverIds.map((receiverId) => ({
        receiverId,
      }))
    }

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

    if (receiverRecords.length > 0) {
      await prisma.notificationReceiver.createMany({
        data: receiverRecords.map((r) => ({
          ...r,
          notificationId: newNotification.notificationId,
        })),
        skipDuplicates: true,
      })
    }

    res.mySuccess(newNotification, '通知添加成功')
  } catch (error) {
    console.error('添加通知失败:', error)
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

    // 查找是否存在该通知
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

    // ✅ 替换成统一校验逻辑
    if (typeId !== undefined) {
      try {
        await validateChildDictionary('notificationType', typeId)
        updateData.typeId = typeId
      } catch (err) {
        return res.myError('typeId 无效：' + err.message, 400)
      }
    }

    if (levelId !== undefined) {
      try {
        await validateChildDictionary('level', levelId)
        updateData.levelId = levelId
      } catch (err) {
        return res.myError('levelId 无效：' + err.message, 400)
      }
    }

    const updated = await prisma.notification.update({
      where: { notificationId },
      data: updateData,
    })

    return res.mySuccess(updated, '通知更新成功')
  } catch (error) {
    console.error('通知更新失败:', error)
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

exports.addReceiver = async (req, res) => {
  const { notificationId } = req.body
  const receiverId = req.user.accountId // 当前登录用户账号

  try {
    // 检查通知是否存在
    const notification = await prisma.notification.findUnique({
      where: { notificationId },
    })

    if (!notification) {
      return res.myError('通知ID不存在', 404)
    }

    // 检查是否已有接收记录
    const exist = await prisma.notificationReceiver.findFirst({
      where: {
        notificationId,
        receiverId,
      },
    })

    if (exist) {
      return res.mySuccess(null, '该通知已存在接收记录')
    }

    // 添加接收记录
    const result = await prisma.notificationReceiver.create({
      data: {
        notificationId,
        receiverId,
      },
    })

    res.mySuccess(result, '接收记录添加成功')
  } catch (err) {
    res.myError('添加接收记录失败: ' + err.message, 500)
  }
}

exports.updateReceiver = async (req, res) => {
  const { notificationId, isRead } = req.body
  const receiverId = req.user.accountId // 当前登录用户账号

  try {
    // 查找是否存在对应的接收记录
    const exist = await prisma.notificationReceiver.findFirst({
      where: {
        notificationId,
        receiverId,
      },
    })
    if (!exist) {
      return res.myError('接收记录不存在', 404)
    }

    // 只由后端控制 readAt 字段
    await prisma.notificationReceiver.update({
      where: {
        notificationReceiverId: exist.notificationReceiverId,
      },
      data: {
        isRead,
        readAt: isRead ? new Date() : null, // 只在标记为已读时设置当前时间
      },
    })

    res.mySuccess('阅读状态更新成功', 200)
  } catch (err) {
    res.myError('更新阅读状态失败: ' + err.message, 500)
  }
}
exports.getReceiver = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    // 查询总数
    const total = await prisma.notificationReceiver.count()

    // 查询记录列表，包含通知内容、发送人昵称、接收人昵称
    const records = await prisma.notificationReceiver.findMany({
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: {
        receiveDate: 'desc',
      },
      include: {
        notification: {
          include: {
            sender: {
              select: {
                nickname: true,
              },
            },
          },
        },
      },
    })

    // 提取通知 typeId 和 levelId
    const notifications = records.map((r) => r.notification).filter(Boolean)
    const typeIds = [
      ...new Set(notifications.map((n) => n.typeId).filter(Boolean)),
    ]
    const levelIds = [
      ...new Set(notifications.map((n) => n.levelId).filter(Boolean)),
    ]

    // 查字典
    const dictionaries = await prisma.sysDictionary.findMany({
      where: {
        dictionaryId: {
          in: [...typeIds, ...levelIds],
        },
      },
    })

    const dictMap = Object.fromEntries(
      dictionaries.map((d) => [d.dictionaryId, d.value]),
    )

    // 构建返回结果（typeValue / levelValue 放进 notification 中）
    const result = records.map((record) => {
      const notification = record.notification
      return {
        ...record,
        receiveDate: formatDate(record.receiveDate),
        readAt: record.readAt ? formatDate(record.readAt) : null,
        notification: {
          ...notification,
          createDate: notification?.createDate
            ? formatDate(notification.createDate)
            : null,
          typeValue: dictMap[notification?.typeId] || null,
          levelValue: dictMap[notification?.levelId] || null,
        },
      }
    })

    return res.mySuccess(
      {
        list: result,
        total,
        page: Number(page),
        limit: Number(limit),
      },
      '接收记录查询成功',
    )
  } catch (error) {
    console.error(error)
    return res.myError('查询接收记录失败：' + error.message, 500)
  }
}
