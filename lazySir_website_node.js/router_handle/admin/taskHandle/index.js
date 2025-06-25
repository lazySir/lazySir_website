const prisma = require('../../../db')
const {
  formatDate,
  validateChildDictionary,
  validatePerson,
  isSuperAdmin,
} = require('../../../utils')
const { encrypt, decrypt } = require('../../../utils/crypto ')
// 获取状态 ID => 对应值的映射
async function getDictionaryValueMap(ids) {
  const dicts = await prisma.sysDictionary.findMany({
    where: { dictionaryId: { in: ids } },
  })
  return dicts.reduce((acc, cur) => {
    acc[cur.dictionaryId] = cur.value
    return acc
  }, {})
}
/**
 * 添加任务
 * @param {*} req
 * @param {*} res
 */
exports.addTask = async (req, res) => {
  try {
    const {
      title,
      taskName,
      deadline,
      content,
      statusId,
      executorIds = [],
      viewerIds = [],
    } = req.body

    const creatorId = req.user.accountId

    // ✅ 校验任务状态是否有效（字典: taskStatus）
    let validStatus
    try {
      validStatus = await validateChildDictionary('taskStatus', statusId)
    } catch (err) {
      return res.myError(`任务状态(taskStatus)无效：${err.message}`, 400)
    }

    // ✅ 检查 taskName 是否唯一
    const existingTask = await prisma.task.findUnique({
      where: { taskName },
    })
    if (existingTask) {
      return res.myError(`任务代号（taskName）已存在，请更换`, 400)
    }

    // ✅ 校验执行人是否存在
    const validExecutors = await validatePerson(executorIds)
    const validExecutorIds = validExecutors.map((e) => e.accountId)
    const invalidExecutorIds = executorIds.filter(
      (id) => !validExecutorIds.includes(id),
    )
    if (invalidExecutorIds.length > 0) {
      return res.myError(
        `以下执行人ID无效：${invalidExecutorIds.join(', ')}`,
        400,
      )
    }

    // ✅ 校验授权查看人是否存在
    let validViewerIds = []
    if (viewerIds?.length) {
      const validViewers = await validatePerson(viewerIds)
      validViewerIds = validViewers.map((v) => v.accountId)
      const invalidViewerIds = viewerIds.filter(
        (id) => !validViewerIds.includes(id),
      )
      if (invalidViewerIds.length > 0) {
        return res.myError(
          `以下授权查看人ID无效：${invalidViewerIds.join(', ')}`,
          400,
        )
      }
    }
    // ✅ 加密任务内容
    const encryptContent = encrypt(content)
    // ✅ 创建任务
    const newTask = await prisma.task.create({
      data: {
        title,
        taskName,
        deadline: new Date(deadline),
        content: encryptContent,
        statusId, // 使用字典中的 value，确保一致
        creatorId,
      },
    })

    // ✅ 添加执行人
    const executorData = validExecutorIds.map((executorId) => ({
      taskId: newTask.taskId,
      executorId,
    }))
    await prisma.taskExecutor.createMany({
      data: executorData,
      skipDuplicates: true,
    })

    // ✅ 执行人也是授权人（合并 + 去重）
    const allViewerIds = Array.from(
      new Set([...validViewerIds, ...validExecutorIds]),
    )

    if (allViewerIds.length > 0) {
      const viewerData = allViewerIds.map((viewerId) => ({
        taskId: newTask.taskId,
        viewerId,
      }))
      await prisma.taskViewer.createMany({
        data: viewerData,
        skipDuplicates: true,
      })
    }

    res.mySuccess(newTask, '任务添加成功')
  } catch (error) {
    console.error('添加任务失败:', error)
    res.myError('添加任务失败: ' + error.message, 500)
  }
}
// /**
//  * 更新任务
//  * @param {*} req
//  * @param {*} res
//  */
exports.updateTask = async (req, res) => {
  try {
    const {
      taskId,
      title,
      taskName,
      deadline,
      content,
      statusId,
      executorIds = [],
      viewerIds = [],
    } = req.body

    // ✅ 检查任务是否存在
    const existingTask = await prisma.task.findUnique({
      where: { taskId },
    })

    if (!existingTask) {
      return res.myError(`任务不存在`, 404)
    }
    //检查是否是任务创建人
    if (existingTask.creatorId !== req.user.accountId) {
      return res.myError(`只有任务创建人可以修改任务`, 403)
    }
    // ✅ 检查 taskName 是否被其他任务占用
    const duplicate = await prisma.task.findFirst({
      where: {
        taskName,
        NOT: {
          taskId,
        },
      },
    })
    if (duplicate) {
      return res.myError(`任务代号（taskName）已被其他任务使用`, 400)
    }

    // ✅ 校验任务状态
    let validStatus
    try {
      validStatus = await validateChildDictionary('taskStatus', statusId)
    } catch (err) {
      return res.myError(`任务状态(taskStatus)无效：${err.message}`, 400)
    }

    // ✅ 校验执行人
    const validExecutors = await validatePerson(executorIds)
    const validExecutorIds = validExecutors.map((e) => e.accountId)
    const invalidExecutorIds = executorIds.filter(
      (id) => !validExecutorIds.includes(id),
    )
    if (invalidExecutorIds.length > 0) {
      return res.myError(
        `以下执行人ID无效：${invalidExecutorIds.join(', ')}`,
        400,
      )
    }

    // ✅ 校验授权人
    let validViewerIds = []
    if (viewerIds?.length) {
      const validViewers = await validatePerson(viewerIds)
      validViewerIds = validViewers.map((v) => v.accountId)
      const invalidViewerIds = viewerIds.filter(
        (id) => !validViewerIds.includes(id),
      )
      if (invalidViewerIds.length > 0) {
        return res.myError(
          `以下授权查看人ID无效：${invalidViewerIds.join(', ')}`,
          400,
        )
      }
    }

    // ✅ 执行人视为授权人（合并 + 去重）
    const allViewerIds = Array.from(
      new Set([...validViewerIds, ...validExecutorIds]),
    )

    // ✅ 加密内容
    const encryptContent = encrypt(content)

    // ✅ 更新任务
    const updatedTask = await prisma.task.update({
      where: { taskId },
      data: {
        title,
        taskName,
        deadline: new Date(deadline),
        content: encryptContent,
        statusId,
      },
    })

    // ✅ 删除旧的执行人 & 授权人记录（再重建）
    await prisma.taskExecutor.deleteMany({ where: { taskId } })
    await prisma.taskViewer.deleteMany({ where: { taskId } })

    // ✅ 重新添加执行人
    if (validExecutorIds.length > 0) {
      const executorData = validExecutorIds.map((executorId) => ({
        taskId,
        executorId,
      }))
      await prisma.taskExecutor.createMany({
        data: executorData,
        skipDuplicates: true,
      })
    }

    // ✅ 重新添加授权查看人
    if (allViewerIds.length > 0) {
      const viewerData = allViewerIds.map((viewerId) => ({
        taskId,
        viewerId,
      }))
      await prisma.taskViewer.createMany({
        data: viewerData,
        skipDuplicates: true,
      })
    }

    res.mySuccess(updatedTask, '任务更新成功')
  } catch (error) {
    console.error('更新任务失败:', error)
    res.myError('更新任务失败: ' + error.message, 500)
  }
}

exports.getTasks = async (req, res) => {
  try {
    const {
      title,
      taskName,
      statusId,
      creatorNickname,
      deadlineFrom,
      deadlineTo,
      page = 1,
      limit = 10,
    } = req.query

    const currentAccountId = req.user.accountId

    const where = {}

    if (title) where.title = { contains: title }
    if (taskName) where.taskName = { contains: taskName }
    if (statusId) where.statusId = statusId

    if (deadlineFrom || deadlineTo) {
      where.deadline = {}
      if (deadlineFrom) where.deadline.gte = new Date(deadlineFrom)
      if (deadlineTo) where.deadline.lte = new Date(deadlineTo)
    }

    if (creatorNickname) {
      where.creator = {
        nickname: {
          contains: creatorNickname,
        },
      }
    }

    // ✅ 查询总数
    const total = await prisma.task.count({ where })

    // ✅ 查询任务数据
    const tasks = await prisma.task.findMany({
      where,
      include: {
        creator: {
          select: {
            nickname: true,
            accountId: true,
            state: true,
          },
        },
        executors: {
          select: {
            executor: {
              select: {
                nickname: true,
                accountId: true,
                state: true,
              },
            },
          },
        },
        viewers: {
          select: {
            viewer: {
              select: {
                nickname: true,
                accountId: true,
                state: true,
              },
            },
          },
        },
      },
      orderBy: {
        createDate: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    // ✅ 提取所有状态ID
    const statusIds = [...new Set(tasks.map((t) => t.statusId))]

    // ✅ 获取字典映射（状态值）
    const statusDictMap = await getDictionaryValueMap(statusIds)

    // ✅ 格式化数据
    const formattedTasks = tasks.map((task) => {
      const executorIds = task.executors.map((e) => e.executor.accountId)
      const viewerIds = task.viewers.map((v) => v.viewer.accountId)
      const isDecryptionStatus =
        task.statusId === process.env.taskStatus_DECRYPTION
      const isCreator = task.creatorId === currentAccountId

      const canViewContent =
        isDecryptionStatus || isCreator || isSuperAdmin(req)
      task.creator.accountId === currentAccountId ||
        executorIds.includes(currentAccountId) ||
        viewerIds.includes(currentAccountId)

      return {
        taskId: task.taskId,
        title: task.title,
        taskName: task.taskName,
        deadline: formatDate(task.deadline),
        content: canViewContent ? decrypt(task.content) : '无权限查看',
        canViewContent,
        statusId: task.statusId,
        statusValue: statusDictMap[task.statusId] || '', // ✅ 状态值
        creatorId: task.creatorId,
        createDate: formatDate(task.createDate),
        updateDate: formatDate(task.updateDate),
        creator: {
          nickname: task.creator.nickname,
          accountId: task.creator.accountId,
          state: task.creator.state,
        },
        executors: task.executors.map((e) => ({
          nickname: e.executor.nickname,
          accountId: e.executor.accountId,
          state: e.executor.state,
        })),
        viewers: task.viewers.map((v) => ({
          nickname: v.viewer.nickname,
          accountId: v.viewer.accountId,
          state: v.viewer.state,
        })),
      }
    })

    // ✅ 返回结果
    res.mySuccess(
      {
        list: formattedTasks,
        total,
        page: Number(page),
        limit: Number(limit),
      },
      '任务列表获取成功',
    )
  } catch (error) {
    console.error('获取任务列表失败:', error)
    res.myError('获取任务列表失败: ' + error.message, 500)
  }
}

/**
 * 删除任务（支持批量）
 * @param {*} req
 * @param {*} res
 */
exports.deleteTasks = async (req, res) => {
  try {
    const { taskIds } = req.body
    const currentAccountId = req.user.accountId

    // ✅ 查询任务是否存在，获取 taskName 和 creatorId
    const existingTasks = await prisma.task.findMany({
      where: {
        taskId: {
          in: taskIds,
        },
      },
      select: { taskId: true, taskName: true, creatorId: true },
    })

    const existingTaskIds = existingTasks.map((t) => t.taskId)
    const invalidIds = taskIds.filter((id) => !existingTaskIds.includes(id))

    if (invalidIds.length > 0) {
      return res.myError(`以下任务ID不存在：${invalidIds.join(', ')}`, 400)
    }

    // ✅ 找出不是当前用户创建的任务
    const unauthorizedTasks = existingTasks.filter(
      (t) => t.creatorId !== currentAccountId,
    )

    if (unauthorizedTasks.length > 0) {
      const unauthorizedTaskNames = unauthorizedTasks.map((t) => t.taskName)
      return res.myError(
        `无权限删除以下任务（非本人创建）：${unauthorizedTaskNames.join(', ')}`,
        403,
      )
    }

    // ✅ 删除任务（子表 onDelete: Cascade 会自动删除）
    await prisma.task.deleteMany({
      where: {
        taskId: {
          in: taskIds,
        },
      },
    })

    res.mySuccess(null, `成功删除 ${taskIds.length} 条任务`)
  } catch (error) {
    console.error('删除任务失败:', error)
    res.myError('删除任务失败: ' + error.message, 500)
  }
}
