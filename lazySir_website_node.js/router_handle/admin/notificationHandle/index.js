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
    if (title) queryConditions.title = { contains: title }
    if (content) queryConditions.content = { contains: content }
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
        receivers: {
          select: {
            receiver: {
              select: {
                nickname: true,
              },
            },
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
    const result = notifications.map(({ receivers, ...item }) => {
      return {
        ...item,
        typeValue: sysdictionaryMap[item.typeId] || null,
        levelValue: sysdictionaryMap[item.levelId] || null,
        createDate: formatDate(item.createDate),
        receiver: receivers.map((r) => r.receiver?.nickname).filter(Boolean),
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
    const {
      page = 1,
      limit = 10,
      title,
      isRead,
      content,
      receiverNickname,
      senderNickName,
      receiveDateFrom,
      receiveDateTo,
      typeId,
      levelId,
      state,
    } = req.query

    // 构造筛选条件
    const where = {
      ...(isRead !== undefined && isRead !== null && { isRead }),

      ...(receiveDateFrom && {
        receiveDate: { gte: new Date(receiveDateFrom) },
      }),
      ...(receiveDateTo && {
        receiveDate: {
          ...(receiveDateFrom ? { gte: new Date(receiveDateFrom) } : {}),
          lte: new Date(receiveDateTo),
        },
      }),

      ...(state !== undefined &&
        state !== null && {
          notification: { state },
        }),

      ...(title && {
        notification: {
          ...(state !== undefined && state !== null && { state }),
          title: { contains: title },
        },
      }),

      ...(content && {
        notification: {
          ...(state !== undefined && state !== null && { state }),
          content: { contains: content },
        },
      }),

      ...(typeId && {
        notification: {
          ...(state !== undefined && state !== null && { state }),
          typeId,
        },
      }),

      ...(levelId && {
        notification: {
          ...(state !== undefined && state !== null && { state }),
          levelId,
        },
      }),

      ...(receiverNickname && {
        receiver: {
          nickname: {
            contains: receiverNickname,
          },
        },
      }),

      ...(senderNickName && {
        notification: {
          ...(state !== undefined && state !== null && { state }),
          sender: {
            nickname: {
              contains: senderNickName,
            },
          },
        },
      }),
    }

    // 查询总数
    const total = await prisma.notificationReceiver.count({
      where,
    })

    // 查询记录列表，包含通知内容、发送人昵称、接收人昵称
    const records = await prisma.notificationReceiver.findMany({
      where,
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
            receivers: {
              select: {
                receiver: {
                  select: {
                    nickname: true,
                  },
                },
              },
            },
          },
        },
        receiver: {
          select: {
            nickname: true,
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

    // 构建返回结果
    const result = records.map((record) => {
      const notification = record.notification
      return {
        ...record,
        receiveDate: formatDate(record.receiveDate),
        readAt: record.readAt ? formatDate(record.readAt) : null,
        receiver: record.receiver?.nickname || null,
        notification: {
          ...notification,
          createDate: notification?.createDate
            ? formatDate(notification.createDate)
            : null,
          typeValue: dictMap[notification?.typeId] || null,
          levelValue: dictMap[notification?.levelId] || null,
          receivers:
            notification?.receivers?.map((r) => r.receiver?.nickname) || [],
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

//管理员获取个人通知接口

exports.getMyNotifications = async (req, res) => {
  const receiverId = req.user.accountId

  try {
    // Step 1: 查找字典中 key 为 admin 或 system 的 typeId
    const dicts = await prisma.sysDictionary.findMany({
      where: {
        key: { in: ['admin', 'system'] },
      },
    })

    // 将结果映射为 key 到 dictionaryId 的对象
    const dictMap = {}
    for (const d of dicts) {
      dictMap[d.key] = d.dictionaryId
    }

    const missingKeys = []
    if (!dictMap.admin) missingKeys.push('admin')
    if (!dictMap.system) missingKeys.push('system')

    if (missingKeys.length > 0) {
      return res.myError(`字典中未找到 key: ${missingKeys.join(', ')}`, 404)
    }

    const typeIds = [dictMap.admin, dictMap.system]

    // Step 2: 查询通知表中 typeId 匹配且 state 为 true 的通知
    const notifications = await prisma.notification.findMany({
      where: {
        typeId: { in: typeIds },
        state: true,
      },
    })

    const allNotificationIds = notifications.map((n) => n.notificationId)

    // Step 3: 为当前用户补全 notificationReceiver（如果未存在）
    const existingReceiverRecords = await prisma.notificationReceiver.findMany({
      where: {
        notificationId: { in: allNotificationIds },
        receiverId,
      },
      select: {
        notificationId: true,
      },
    })

    const existingIds = new Set(
      existingReceiverRecords.map((r) => r.notificationId),
    )

    const missingRecords = allNotificationIds
      .filter((id) => !existingIds.has(id))
      .map((notificationId) => ({
        notificationId,
        receiverId,
      }))

    if (missingRecords.length > 0) {
      await prisma.notificationReceiver.createMany({
        data: missingRecords,
        skipDuplicates: true,
      })
    }

    // Step 4: 查询用户自己的接收记录（带通知详情，且通知启用）
    const receiverRecords = await prisma.notificationReceiver.findMany({
      where: {
        receiverId,
        notification: {
          state: true,
        },
      },
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

    // Step 5: 构造响应数据（含通知标题、内容、类型、等级、发送人昵称、时间等）

    // 先收集所有通知的 typeId 和 levelId
    const allTypeIds = new Set()
    const allLevelIds = new Set()

    receiverRecords.forEach((r) => {
      if (r.notification.typeId) allTypeIds.add(r.notification.typeId)
      if (r.notification.levelId) allLevelIds.add(r.notification.levelId)
    })

    // 查询对应的字典项
    const dictEntries = await prisma.sysDictionary.findMany({
      where: {
        dictionaryId: {
          in: [...allTypeIds, ...allLevelIds],
        },
      },
      select: {
        dictionaryId: true,
        value: true,
      },
    })

    // 构造 dictionaryId → value 的映射
    const dictMapById = Object.fromEntries(
      dictEntries.map((d) => [d.dictionaryId, d.value]),
    )

    // 构造最终结果
    const result = receiverRecords.map((r) => ({
      notificationReceiverId: r.notificationReceiverId,
      isRead: r.isRead,
      readAt: r.readAt ? formatDate(r.readAt) : null,
      receiveDate: formatDate(r.receiveDate),
      notification: {
        notificationId: r.notification.notificationId,
        title: r.notification.title,
        content: r.notification.content,
        typeId: r.notification.typeId,
        levelId: r.notification.levelId,
        typeValue: dictMapById[r.notification.typeId] || null,
        levelValue: dictMapById[r.notification.levelId] || null,
        senderNickname: r.notification.sender?.nickname || null,
        createDate: formatDate(r.notification.createDate),
      },
    }))

    return res.mySuccess(
      {
        list: result,
        total: result.length,
      },
      '个人通知列表获取成功',
    )
  } catch (error) {
    console.error(error)
    return res.myError('获取通知失败：' + error.message, 500)
  }
}
