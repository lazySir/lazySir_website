const prisma = require('../../../db')
const {
  formatDate,
  validateChildDictionary,
  isSuperAdmin,
} = require('../../../utils')
const { uploadUrls } = require('../../../config/upload')
const iconv = require('iconv-lite') // 引入iconv-lite库
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
 * 新增任务汇报
 * @param {*} req
 * @param {*} res
 */
exports.addTaskReport = async (req, res) => {
  try {
    const { taskId, title, statusId, note, content, attachment } = req.body

    const reporterId = req.user.accountId // 当前登录用户ID

    // ✅ 校验任务是否存在
    const task = await prisma.task.findUnique({
      where: { taskId },
      select: { taskId: true },
    })

    if (!task) {
      return res.myError('任务不存在', 400)
    }

    // ✅ 校验是否为任务执行人
    const isExecutor = await prisma.taskExecutor.findFirst({
      where: {
        taskId,
        executorId: reporterId,
      },
    })

    if (!isExecutor) {
      return res.myError('你不是该任务的执行人，无法提交汇报', 403)
    }

    // ✅ 校验 statusId 是否为合法字典项（任务进展状态）
    const validStatus = await validateChildDictionary(
      'taskReportStatus',
      statusId,
    )
    if (!validStatus) {
      return res.myError('任务进展状态（taskReportStatus）无效', 400)
    }

    // ✅ 创建汇报记录
    const report = await prisma.taskReport.create({
      data: {
        taskId,
        reporterId,
        title,
        statusId,
        note: note || null,
        content,
        attachment: attachment || null,
      },
    })

    res.mySuccess(report, '任务汇报新增成功')
  } catch (err) {
    console.error('新增任务汇报失败:', err)
    res.myError('新增任务汇报失败: ' + err.message, 500)
  }
}
/**
 * 更新任务汇报
 * @param {*} req
 * @param {*} res
 */
exports.updateTaskReport = async (req, res) => {
  try {
    const {
      reportId, // 汇报主键
      title, // 汇报标题
      statusId, // 状态（字典项）
      note, // 备注
      content, // 正文内容
      attachment, // 附件路径（相对路径）
    } = req.body

    const reporterId = req.user.accountId

    // ✅ 查询汇报是否存在
    const report = await prisma.taskReport.findUnique({
      where: { reportId },
      select: {
        reporterId: true,
      },
    })

    if (!report) {
      return res.myError('任务汇报记录不存在', 404)
    }

    // ✅ 校验权限：只能本人修改或者超级管理员
    if (report.reporterId !== reporterId || !isSuperAdmin(req)) {
      return res.myError('你不是该汇报的提交人，无法修改', 403)
    }
    // ✅ 校验 statusId 是否为合法字典项（任务进展状态）
    const validStatus = await validateChildDictionary(
      'taskReportStatus',
      statusId,
    )
    if (!validStatus) {
      return res.myError('任务进展状态（taskReportStatus）无效', 400)
    }

    // ✅ 执行更新
    await prisma.taskReport.update({
      where: { reportId },
      data: {
        title,
        statusId,
        note: note || null,
        content,
        attachment: attachment || null,
      },
    })

    res.mySuccess(null, '任务汇报更新成功')
  } catch (err) {
    console.error('更新任务汇报失败:', err)
    res.myError('更新任务汇报失败: ' + err.message, 500)
  }
}
/**
 * 查询任务汇报列表（支持条件筛选、分页）
 * @param {*} req
 * @param {*} res
 */
exports.getTaskReports = async (req, res) => {
  try {
    const {
      title,
      reporterNickname,
      statusId,
      note,
      content,
      createDateFrom,
      createDateTo,
      updateDateFrom,
      updateDateTo,
      page = 1,
      limit = 10,
    } = req.query

    const where = {}

    if (title) where.title = { contains: title }
    if (statusId) where.statusId = statusId
    if (note) where.note = { contains: note }
    if (content) where.content = { contains: content }

    if (createDateFrom || createDateTo) {
      where.createDate = {}
      if (createDateFrom) where.createDate.gte = new Date(createDateFrom)
      if (createDateTo) where.createDate.lte = new Date(createDateTo)
    }

    if (updateDateFrom || updateDateTo) {
      where.updateDate = {}
      if (updateDateFrom) where.updateDate.gte = new Date(updateDateFrom)
      if (updateDateTo) where.updateDate.lte = new Date(updateDateTo)
    }

    if (reporterNickname) {
      where.reporter = {
        nickname: { contains: reporterNickname },
      }
    }

    // ✅ 查询总数
    const total = await prisma.taskReport.count({ where })

    // ✅ 查询汇报数据 + 任务、汇报人
    const reports = await prisma.taskReport.findMany({
      where,
      include: {
        task: {
          select: {
            taskId: true,
            taskName: true,
            title: true,
            statusId: true,
          },
        },
        reporter: {
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

    // ✅ 获取所有用到的 statusId（任务和汇报状态）
    const statusIdSet = new Set()
    reports.forEach((r) => {
      if (r.statusId) statusIdSet.add(r.statusId)
      if (r.task?.statusId) statusIdSet.add(r.task.statusId)
    })

    const statusDict = await prisma.sysDictionary.findMany({
      where: { dictionaryId: { in: Array.from(statusIdSet) } },
    })

    const getStatusValue = (id) =>
      statusDict.find((d) => d.dictionaryId === id)?.value || '未知状态'

    // ✅ 格式化结果
    const formatted = reports.map((item) => ({
      reportId: item.reportId,
      title: item.title,
      statusId: item.statusId,
      statusValue: getStatusValue(item.statusId), // ✅ 汇报状态文本
      note: item.note || '',
      content: item.content,
      attachment: item.attachment || '',
      createDate: formatDate(item.createDate),
      updateDate: formatDate(item.updateDate),
      task: {
        taskId: item.task.taskId,
        taskName: item.task.taskName,
        title: item.task.title,
        statusId: item.task.statusId,
        statusValue: getStatusValue(item.task.statusId), // ✅ 任务状态文本
      },
      reporter: {
        accountId: item.reporter.accountId,
        nickname: item.reporter.nickname,
        state: item.reporter.state,
      },
    }))

    res.mySuccess(
      {
        list: formatted,
        total,
        page: Number(page),
        limit: Number(limit),
      },
      '任务汇报列表获取成功',
    )
  } catch (err) {
    console.error('查询任务汇报失败:', err)
    res.myError('查询任务汇报失败: ' + err.message, 500)
  }
}
/**
 * 删除任务汇报（支持批量）
 * @param {*} req
 * @param {*} res
 */
exports.deleteTaskReport = async (req, res) => {
  try {
    const { reportIds } = req.body
    const accountId = req.user.accountId
    const superAdmin = isSuperAdmin(req)

    // ✅ 查询所有待删除的汇报记录
    const reports = await prisma.taskReport.findMany({
      where: { reportId: { in: reportIds } },
    })

    if (reports.length === 0) {
      return res.myError('未找到任何匹配的任务汇报记录', 404)
    }

    // ✅ 权限校验（当前用户是汇报人 或 超管）
    const unauthorized = reports.find(
      (r) => !superAdmin && r.reporterId !== accountId,
    )
    if (unauthorized) {
      return res.myError('你无权删除他人提交的汇报记录', 403)
    }

    // ✅ 删除数据库记录
    await prisma.taskReport.deleteMany({
      where: { reportId: { in: reportIds } },
    })

    res.mySuccess(null, '任务汇报删除成功')
  } catch (error) {
    console.error('删除任务汇报失败:', error)
    res.myError('删除任务汇报失败: ' + error.message, 500)
  }
}
/**
 * 查询当前用户可查看的任务汇报记录（包含授权或任务状态为“解密”）
 * @param {*} req
 * @param {*} res
 */
exports.getAuthorizedTaskReports = async (req, res) => {
  try {
    const {
      title,
      reporterNickname,
      statusId,
      note,
      content,
      createDateFrom,
      createDateTo,
      updateDateFrom,
      updateDateTo,
      page = 1,
      limit = 10,
    } = req.query

    const accountId = req.user.accountId

    // ✅ 获取授权的任务ID
    const viewerTasks = await prisma.taskViewer.findMany({
      where: { viewerId: accountId },
      select: { taskId: true },
    })

    // ✅ 获取状态为“解密”的任务ID
    const decryptedTasks = await prisma.task.findMany({
      where: {
        statusId: process.env.taskStatus_DECRYPTION,
      },
      select: { taskId: true },
    })

    // ✅ 合并 taskId 并去重
    const authorizedTaskIds = [
      ...new Set([
        ...viewerTasks.map((t) => t.taskId),
        ...decryptedTasks.map((t) => t.taskId),
      ]),
    ]

    if (authorizedTaskIds.length === 0) {
      return res.mySuccess(
        { list: [], total: 0, page: Number(page), limit: Number(limit) },
        '无可查看的任务汇报',
      )
    }

    // ✅ 构造 where 条件
    const where = {
      taskId: { in: authorizedTaskIds },
    }

    if (title) where.title = { contains: title }
    if (statusId) where.statusId = statusId
    if (note) where.note = { contains: note }
    if (content) where.content = { contains: content }
    if (createDateFrom || createDateTo) {
      where.createDate = {}
      if (createDateFrom) where.createDate.gte = new Date(createDateFrom)
      if (createDateTo) where.createDate.lte = new Date(createDateTo)
    }
    if (updateDateFrom || updateDateTo) {
      where.updateDate = {}
      if (updateDateFrom) where.updateDate.gte = new Date(updateDateFrom)
      if (updateDateTo) where.updateDate.lte = new Date(updateDateTo)
    }
    if (reporterNickname) {
      where.reporter = {
        nickname: { contains: reporterNickname },
      }
    }

    // ✅ 查询总数
    const total = await prisma.taskReport.count({ where })

    // ✅ 查询记录
    const reports = await prisma.taskReport.findMany({
      where,
      include: {
        reporter: {
          select: {
            accountId: true,
            nickname: true,
            state: true,
          },
        },
        task: {
          select: {
            taskId: true,
            taskName: true,
            title: true,
            deadline: true,
            statusId: true,
          },
        },
      },
      orderBy: {
        createDate: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    // ✅ 获取所有涉及的状态值
    const allStatusIds = [
      ...new Set([
        ...reports.map((r) => r.statusId),
        ...reports.map((r) => r.task.statusId),
      ]),
    ]

    const statusDictMap = await getDictionaryValueMap(allStatusIds)

    // ✅ 格式化返回数据
    const formatted = reports.map((item) => ({
      reportId: item.reportId,
      title: item.title,
      note: item.note || '',
      content: item.content,
      attachment: item.attachment || '',
      statusId: item.statusId,
      statusValue: statusDictMap[item.statusId] || '',
      task: {
        taskId: item.task.taskId,
        taskName: item.task.taskName,
        title: item.task.title,
        deadline: formatDate(item.task.deadline),
        statusId: item.task.statusId,
        statusValue: statusDictMap[item.task.statusId] || '',
      },
      reporter: {
        accountId: item.reporter.accountId,
        nickname: item.reporter.nickname,
        state: item.reporter.state,
      },
      createDate: formatDate(item.createDate),
      updateDate: formatDate(item.updateDate),
    }))

    res.mySuccess(
      {
        list: formatted,
        total,
        page: Number(page),
        limit: Number(limit),
      },
      '可查看任务汇报列表获取成功',
    )
  } catch (err) {
    console.error('查询可查看任务汇报失败:', err)
    res.myError('查询可查看任务汇报失败: ' + err.message, 500)
  }
}

/**
 * 获取当前用户可汇报的任务列表
 * @param {*} req
 * @param {*} res
 */
exports.getReportableTasks = async (req, res) => {
  try {
    const accountId = req.user.accountId

    // ✅ 可汇报状态（env 中维护）
    const reportableStatusIds = [
      process.env.taskStatus_TODO,
      process.env.taskStatus_IN_PROGRESS,
    ]

    // ✅ 查找当前用户为执行人的任务
    const executorTasks = await prisma.taskExecutor.findMany({
      where: {
        executorId: accountId,
      },
      select: {
        taskId: true,
      },
    })
    const taskIds = executorTasks.map((t) => t.taskId)

    if (taskIds.length === 0) {
      return res.mySuccess({ list: [] }, '暂无可汇报的任务')
    }

    // ✅ 查询任务详情（状态必须在可汇报状态内）
    const tasks = await prisma.task.findMany({
      where: {
        taskId: {
          in: taskIds,
        },
        statusId: {
          in: reportableStatusIds,
        },
      },
      include: {
        creator: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
    })

    // ✅ 获取所有状态字典
    const statusDictMap = await getDictionaryValueMap(
      tasks.map((t) => t.statusId),
    )

    // ✅ 格式化输出
    const result = tasks.map((task) => ({
      taskId: task.taskId,
      title: task.title,
      taskName: task.taskName,
      creatorNickname: task.creator?.nickname || '',
      statusId: task.statusId,
      statusValue: statusDictMap[task.statusId] || '',
    }))

    res.mySuccess({ list: result }, '可汇报任务列表获取成功')
  } catch (err) {
    console.error('获取可汇报任务失败:', err)
    res.myError('获取可汇报任务失败: ' + err.message, 500)
  }
}

//上传任务图片
exports.uploadTaskImg = async (req, res) => {
  try {
    // 确保文件上传成功
    const file = req.file
    if (!file) {
      return res.myError('任务图片上传失败，请重新尝试')
    }

    // 构建图片访问 URL
    const imgUrl =
      process.env.SERVER_URL +
      uploadUrls.taskImage.imgSaveUrl +
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
//上传任务文件
exports.uploadTaskFile = async (req, res) => {
  try {
    // 确保文件上传成功

    const file = req.file
    // 转换文件名为 UTF-8
    const UTFName = iconv.decode(
      Buffer.from(file.originalname, 'binary'),
      'utf8',
    )
    if (!file) {
      return res.myError('任务文件上传失败，请重新尝试')
    }

    // 构建图片访问 URL
    const fileUrl = uploadUrls.taskImage.fileSaveUrl + file.filename
    // 返回成功响应
    return res.mySuccess(
      {
        name: UTFName,
        url: fileUrl,
      },
      '任务文件上传成功',
    )
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，上传失败')
  }
}
