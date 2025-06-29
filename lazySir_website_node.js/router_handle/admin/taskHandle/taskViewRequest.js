const prisma = require('../../../db')
const {
  formatDate,
  validateChildDictionary,
  validatePerson,
  isSuperAdmin,
} = require('../../../utils')
/**
 * 申请查看任务内容
 * @param {*} req
 * @param {*} res
 */
exports.addTaskViewRequest = async (req, res) => {
  try {
    const { taskId, reason } = req.body
    const applicantId = req.user.accountId

    // ✅ 校验任务是否存在
    const task = await prisma.task.findUnique({
      where: { taskId },
      include: {
        viewers: { select: { viewerId: true } },
        executors: { select: { executorId: true } },
      },
    })

    if (!task) {
      return res.myError('任务不存在', 400)
    }

    // ✅ 检查是否为创建人或已是执行人/授权查看人
    const isCreator = task.creatorId === applicantId
    const isExecutor = task.executors.some((e) => e.executorId === applicantId)
    const isViewer = task.viewers.some((v) => v.viewerId === applicantId)

    if (isCreator || isExecutor || isViewer) {
      return res.myError('你已经拥有该任务的查看权限，无需重复申请', 400)
    }

    // ✅ 检查是否已有未审批的申请记录
    const existingRequest = await prisma.taskViewRequest.findUnique({
      where: {
        taskId_applicantId: {
          taskId,
          applicantId,
        },
      },
    })

    if (existingRequest) {
      return res.myError('你已经提交过申请，请勿重复提交', 400)
    }

    // ✅ 设置默认审批状态（从字典中拿待审核状态）
    let status
    try {
      status = await validateChildDictionary(
        'approvalStatus',
        process.env.approvalStatus_TODO,
      )
    } catch (err) {
      return res.myError(`审批状态(approvalStatus)无效：${err.message}`, 400)
    }

    // // ✅ 创建申请记录
    const newRequest = await prisma.taskViewRequest.create({
      data: {
        taskId,
        applicantId,
        reason,
        statusId: status.dictionaryId, // 字典值
      },
    })

    res.mySuccess(newRequest, '申请提交成功')
  } catch (error) {
    console.error('提交任务查看申请失败:', error)
    res.myError('提交任务查看申请失败: ' + error.message, 500)
  }
}

/**
 * 审批任务查看申请（可重复修改审批状态）
 * @param {*} req
 * @param {*} res
 */
exports.approveTaskViewRequest = async (req, res) => {
  try {
    const { requestId, statusId, approveNote } = req.body
    const approverId = req.user.accountId

    // ✅ 查询申请记录
    const request = await prisma.taskViewRequest.findUnique({
      where: { requestId },
      include: {
        task: {
          select: { creatorId: true },
        },
      },
    })

    if (!request) {
      return res.myError('申请记录不存在', 400)
    }

    // ✅ 判断审批人身份
    if (request.task.creatorId !== approverId) {
      return res.myError('你不是该任务的创建人，无法审批', 403)
    }

    // ✅ 校验状态是否合法
    const validStatus = await validateChildDictionary(
      'approvalStatus',
      statusId,
    )
    if (!validStatus) {
      return res.myError('审批状态无效', 400)
    }

    const operations = []

    // ✅ 更新申请状态
    operations.push(
      prisma.taskViewRequest.update({
        where: { requestId },
        data: {
          statusId,
          approveNote: approveNote || null,
          approverId,
        },
      }),
    )

    // ✅ 如果状态为“通过”，插入/更新 viewer 授权
    if (statusId === process.env.approvalStatus_SUCCESS) {
      operations.push(
        prisma.taskViewer.upsert({
          where: {
            taskId_viewerId: {
              taskId: request.taskId,
              viewerId: request.applicantId,
            },
          },
          update: {},
          create: {
            taskId: request.taskId,
            viewerId: request.applicantId,
          },
        }),
      )
    }

    // ✅ 如果状态是“拒绝”，则从 viewer 表移除授权（可选，是否保留授权由你决定）
    if (
      statusId === process.env.approvalStatus_REJECT ||
      statusId === process.env.approvalStatus_TODO
    ) {
      operations.push(
        prisma.taskViewer.deleteMany({
          where: {
            taskId: request.taskId,
            viewerId: request.applicantId,
          },
        }),
      )
    }

    await prisma.$transaction(operations)

    res.mySuccess(null, `审批已更新为：${validStatus.value}`)
  } catch (error) {
    console.error('审批失败:', error)
    res.myError('审批失败: ' + error.message, 500)
  }
}

/**
 * 查询任务查看授权申请记录
 * @param {*} req
 * @param {*} res
 */
/**
 * 查询任务查看授权申请记录
 * @param {*} req
 * @param {*} res
 */
exports.getTaskViewRequests = async (req, res) => {
  try {
    const {
      taskName,
      applicantNickname,
      approverNickname,
      statusId,
      page = 1,
      limit = 10,
    } = req.query

    const accountId = req.user.accountId

    const where = {}

    // ✅ 审批状态筛选
    if (statusId) {
      where.statusId = statusId
    }

    // ✅ 任务名称筛选
    if (taskName) {
      where.task = {
        taskName: {
          contains: taskName,
        },
      }
    }

    // ✅ 申请人昵称筛选
    if (applicantNickname) {
      where.applicant = {
        nickname: {
          contains: applicantNickname,
        },
      }
    }

    // ✅ 审批人昵称筛选
    if (approverNickname) {
      where.approver = {
        nickname: {
          contains: approverNickname,
        },
      }
    }

    // ✅ 非超级管理员限制只看自己任务的申请记录

    where.task = {
      ...where.task,
      creatorId: accountId,
    }

    // ✅ 查询总数
    const total = await prisma.taskViewRequest.count({ where })

    // ✅ 查询申请记录
    const requests = await prisma.taskViewRequest.findMany({
      where,
      include: {
        task: {
          select: {
            taskId: true,
            taskName: true,
            title: true,
            deadline: true,
            creatorId: true,
            statusId: true, // ✅ 添加任务状态 ID
          },
        },
        applicant: {
          select: {
            accountId: true,
            nickname: true,
            state: true,
          },
        },
        approver: {
          select: {
            accountId: true,
            nickname: true,
            state: true,
          },
        },
      },
      orderBy: {
        createDate: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    // ✅ 收集所有 statusId（授权状态 + 任务状态）
    const statusIds = [
      ...new Set([
        ...requests.map((r) => r.statusId),
        ...requests.map((r) => r.task?.statusId),
      ]),
    ]

    // ✅ 查询字典表中的状态值
    const statusDicts = await prisma.sysDictionary.findMany({
      where: {
        dictionaryId: {
          in: statusIds,
        },
      },
      select: {
        dictionaryId: true,
        value: true,
      },
    })

    const statusMap = Object.fromEntries(
      statusDicts.map((dict) => [dict.dictionaryId, dict.value]),
    )

    // ✅ 格式化返回数据
    const formatted = requests.map((item) => ({
      requestId: item.requestId,
      task: {
        taskId: item.task.taskId,
        taskName: item.task.taskName,
        title: item.task.title,
        deadline: formatDate(item.task.deadline),
        statusId: item.task.statusId,
        statusValue: statusMap[item.task.statusId] || '', // ✅ 任务状态值
      },
      applicant: {
        accountId: item.applicant.accountId,
        nickname: item.applicant.nickname,
        state: item.applicant.state,
      },
      approver: item.approver
        ? {
            accountId: item.approver.accountId,
            nickname: item.approver.nickname,
            state: item.approver.state,
          }
        : null,
      reason: item.reason || '',
      statusId: item.statusId,
      statusValue: statusMap[item.statusId] || '', // ✅ 授权申请状态值
      approveNote: item.approveNote || '',
      createDate: formatDate(item.createDate),
      updateDate: formatDate(item.updateDate),
    }))

    // ✅ 响应结果
    res.mySuccess(
      {
        list: formatted,
        total,
        page: Number(page),
        limit: Number(limit),
      },
      '授权申请列表获取成功',
    )
  } catch (err) {
    console.error('查询授权申请失败:', err)
    res.myError('查询授权申请失败: ' + err.message, 500)
  }
}

exports.getMyTaskViewRequests = async (req, res) => {
  try {
    const { taskName, statusId, page = 1, limit = 10 } = req.query

    const accountId = req.user.accountId // 当前登录用户ID

    // 构造查询条件：当前用户是申请人
    const where = {
      applicantId: accountId,
    }

    // ✅ 审批状态筛选
    if (statusId) {
      where.statusId = statusId
    }

    // ✅ 任务代号筛选
    if (taskName) {
      where.task = {
        taskName: {
          contains: taskName,
        },
      }
    }

    // ✅ 查询总条数
    const total = await prisma.taskViewRequest.count({ where })

    // ✅ 查询申请记录，包含任务、审批人
    const requests = await prisma.taskViewRequest.findMany({
      where,
      include: {
        task: {
          select: {
            taskId: true,
            taskName: true,
            title: true,
            deadline: true,
            statusId: true, // ✅ 查询任务状态
          },
        },
        approver: {
          select: {
            accountId: true,
            nickname: true,
            state: true,
          },
        },
      },
      orderBy: {
        createDate: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    // ✅ 提取所有相关状态ID（申请状态 + 任务状态）
    const statusIds = [
      ...new Set(
        requests.flatMap((item) => [item.statusId, item.task?.statusId]),
      ),
    ]

    // ✅ 查询状态字典中文名
    const statusDicts = await prisma.sysDictionary.findMany({
      where: {
        dictionaryId: {
          in: statusIds,
        },
      },
      select: {
        dictionaryId: true,
        value: true,
      },
    })

    // ✅ 构建字典 Map 映射
    const statusMap = Object.fromEntries(
      statusDicts.map((dict) => [dict.dictionaryId, dict.value]),
    )

    // ✅ 格式化返回数据
    const formatted = requests.map((item) => ({
      requestId: item.requestId,
      task: {
        taskId: item.task.taskId,
        taskName: item.task.taskName,
        title: item.task.title,
        deadline: formatDate(item.task.deadline),
        statusId: item.task.statusId,
        statusValue: statusMap[item.task.statusId] || '', // ✅ 任务状态中文名
      },
      approver: item.approver
        ? {
            accountId: item.approver.accountId,
            nickname: item.approver.nickname,
            state: item.approver.state,
          }
        : null,
      reason: item.reason || '',
      statusId: item.statusId,
      statusValue: statusMap[item.statusId] || '', // ✅ 审批状态中文名
      approveNote: item.approveNote || '',
      createDate: formatDate(item.createDate),
      updateDate: formatDate(item.updateDate),
    }))

    // ✅ 返回分页结果
    res.mySuccess(
      {
        list: formatted,
        total,
        page: Number(page),
        limit: Number(limit),
      },
      '个人申请列表获取成功',
    )
  } catch (err) {
    console.error('查询个人申请失败:', err)
    res.myError('查询个人申请失败: ' + err.message, 500)
  }
}
/**
 * 查询当前用户未被授权且未申请的任务列表（排除自己创建的任务）
 * @param {*} req
 * @param {*} res
 */
exports.getTasksUserCanApplyView = async (req, res) => {
  try {
    const accountId = req.user.accountId

    // ✅ 查询当前用户已授权查看、已执行、已申请的任务ID
    const [viewerTaskIds, executorTaskIds, appliedTaskIds] = await Promise.all([
      prisma.taskViewer.findMany({
        where: { viewerId: accountId },
        select: { taskId: true },
      }),
      prisma.taskExecutor.findMany({
        where: { executorId: accountId },
        select: { taskId: true },
      }),
      prisma.taskViewRequest.findMany({
        where: { applicantId: accountId },
        select: { taskId: true },
      }),
    ])

    // ✅ 整合需排除的任务ID列表
    const excludeIds = [
      ...viewerTaskIds,
      ...executorTaskIds,
      ...appliedTaskIds,
    ].map((item) => item.taskId)

    // ✅ 查询可申请查看的任务（未被授权 + 未申请 + 不是自己创建的）
    const tasks = await prisma.task.findMany({
      where: {
        taskId: {
          notIn: excludeIds,
        },
        creatorId: {
          not: accountId, // ✅ 移除自己创建的任务
        },
      },
      select: {
        taskId: true,
        title: true,
        taskName: true,
        statusId: true,
        creator: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createDate: 'desc',
      },
    })

    // ✅ 查询任务状态字典
    const statusIds = [...new Set(tasks.map((t) => t.statusId))]
    const statusDicts = await prisma.sysDictionary.findMany({
      where: {
        dictionaryId: { in: statusIds },
      },
      select: {
        dictionaryId: true,
        value: true,
      },
    })
    const statusMap = Object.fromEntries(
      statusDicts.map((d) => [d.dictionaryId, d.value]),
    )

    // ✅ 格式化结果
    const formatted = tasks.map((task) => ({
      taskId: task.taskId,
      title: task.title,
      taskName: task.taskName,
      creatorNickname: task.creator.nickname,
      statusId: task.statusId,
      statusValue: statusMap[task.statusId] || '',
    }))

    res.mySuccess(formatted, '获取可申请查看的任务列表成功')
  } catch (err) {
    console.error('获取可申请查看的任务失败:', err)
    res.myError('获取可申请查看的任务失败: ' + err.message, 500)
  }
}
