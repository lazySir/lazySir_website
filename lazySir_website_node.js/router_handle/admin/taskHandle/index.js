const prisma = require('../../../db')
const {
  formatDate,
  validateChildDictionary,
  validatePerson,
} = require('../../../utils')
const { encrypt, decrypt } = require('../../../utils/crypto ')
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
// exports.updateTask = async (req, res) => {
//   try {
//     const {
//       taskId,
//       title,
//       taskName,
//       deadline,
//       content,
//       statusId,
//       executorIds = [],
//       viewerIds = [],
//     } = req.body

//     // ✅ 检查任务是否存在
//     const existingTask = await prisma.task.findUnique({
//       where: { taskId },
//     })

//     if (!existingTask) {
//       return res.myError(`任务不存在`, 404)
//     }

//     // ✅ 检查 taskName 是否被其他任务占用
//     const duplicate = await prisma.task.findFirst({
//       where: {
//         taskName,
//         NOT: {
//           taskId,
//         },
//       },
//     })
//     if (duplicate) {
//       return res.myError(`任务代号（taskName）已被其他任务使用`, 400)
//     }

//     // ✅ 校验任务状态
//     let validStatus
//     try {
//       validStatus = await validateChildDictionary('taskStatus', statusId)
//     } catch (err) {
//       return res.myError(`任务状态(taskStatus)无效：${err.message}`, 400)
//     }

//     // ✅ 校验执行人
//     const validExecutors = await validatePerson(executorIds)
//     const validExecutorIds = validExecutors.map((e) => e.accountId)
//     const invalidExecutorIds = executorIds.filter(
//       (id) => !validExecutorIds.includes(id),
//     )
//     if (invalidExecutorIds.length > 0) {
//       return res.myError(
//         `以下执行人ID无效：${invalidExecutorIds.join(', ')}`,
//         400,
//       )
//     }

//     // ✅ 校验授权人
//     let validViewerIds = []
//     if (viewerIds?.length) {
//       const validViewers = await validatePerson(viewerIds)
//       validViewerIds = validViewers.map((v) => v.accountId)
//       const invalidViewerIds = viewerIds.filter(
//         (id) => !validViewerIds.includes(id),
//       )
//       if (invalidViewerIds.length > 0) {
//         return res.myError(
//           `以下授权查看人ID无效：${invalidViewerIds.join(', ')}`,
//           400,
//         )
//       }
//     }

//     // ✅ 执行人视为授权人（合并 + 去重）
//     const allViewerIds = Array.from(
//       new Set([...validViewerIds, ...validExecutorIds]),
//     )

//     // ✅ 加密内容
//     const encryptContent = encrypt(content)

//     // ✅ 更新任务
//     const updatedTask = await prisma.task.update({
//       where: { taskId },
//       data: {
//         title,
//         taskName,
//         deadline: new Date(deadline),
//         content: encryptContent,
//         statusId: validStatus.value,
//       },
//     })

//     // ✅ 删除旧的执行人 & 授权人记录（再重建）
//     await prisma.taskExecutor.deleteMany({ where: { taskId } })
//     await prisma.taskViewer.deleteMany({ where: { taskId } })

//     // ✅ 重新添加执行人
//     if (validExecutorIds.length > 0) {
//       const executorData = validExecutorIds.map((executorId) => ({
//         taskId,
//         executorId,
//       }))
//       await prisma.taskExecutor.createMany({
//         data: executorData,
//         skipDuplicates: true,
//       })
//     }

//     // ✅ 重新添加授权查看人
//     if (allViewerIds.length > 0) {
//       const viewerData = allViewerIds.map((viewerId) => ({
//         taskId,
//         viewerId,
//       }))
//       await prisma.taskViewer.createMany({
//         data: viewerData,
//         skipDuplicates: true,
//       })
//     }

//     res.mySuccess(updatedTask, '任务更新成功')
//   } catch (error) {
//     console.error('更新任务失败:', error)
//     res.myError('更新任务失败: ' + error.message, 500)
//   }
// }
