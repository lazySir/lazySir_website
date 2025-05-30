const prisma = require('../../../db')

/**
 * 添加API接口
 * @param {*} req
 * @param {*} res
 */
exports.addApi = async (req, res) => {
  try {
    const {
      apiName,
      apiPath,
      method,
      description,
      group,
      state = true,
      requireAuth = true,
    } = req.body

    // 检查是否存在重复路径和方法
    const exist = await prisma.api.findFirst({
      where: {
        apiPath,
        method,
      },
    })
    console.log('exist', exist)
    if (exist) {
      return res.myError('该 API 接口路径和方法已存在', 400)
    }

    const newApi = await prisma.api.create({
      data: {
        apiName,
        apiPath,
        method,
        description,
        group,
        state,
        requireAuth,
        accountId: req.user.accountId, // 创建人ID
        updateId: req.user.accountId, // 更新人ID
      },
    })

    res.mySuccess(newApi, 'API 接口添加成功')
  } catch (error) {
    res.myError('添加 API 接口失败:' + error.message, 500)
  }
}

/**
 * 查询 API 接口列表（支持分页和多条件筛选）
 * @param {*} req
 * @param {*} res
 */
exports.getApi = async (req, res) => {
  try {
    const {
      apiName,
      apiPath,
      method,
      group,
      state,
      requireAuth,
      page = 1,
      limit = 20,
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    // 构造 where 条件
    const where = {
      AND: [
        apiName ? { apiName: { contains: apiName, mode: 'insensitive' } } : {},
        apiPath ? { apiPath: { contains: apiPath, mode: 'insensitive' } } : {},
        method ? { method } : {},
        group ? { group: { contains: group, mode: 'insensitive' } } : {},
        typeof state === 'boolean' ? { state } : {},
        typeof requireAuth === 'boolean' ? { requireAuth } : {},
      ],
    }

    // 查询总数
    const total = await prisma.api.count({ where })

    // 查询分页数据
    const list = await prisma.api.findMany({
      where,
      skip,
      take,
      orderBy: { updateDate: 'desc' },
    })

    res.mySuccess(
      {
        total,
        list,
        page: parseInt(page),
        limit: parseInt(limit),
      },
      '获取 API 接口列表成功',
    )
  } catch (error) {
    res.myError('获取 API 接口列表失败: ' + error.message, 500)
  }
}
/**
 * 更新 API 接口信息
 * @param {*} req
 * @param {*} res
 */
exports.updateApi = async (req, res) => {
  try {
    const {
      apiId,
      apiName,
      apiPath,
      method,
      description,
      group,
      state = true,
      requireAuth = true,
    } = req.body

    if (!apiId) {
      return res.myError('缺少 apiId 参数', 400)
    }

    // 判断是否存在该记录
    const existingApi = await prisma.api.findUnique({
      where: { apiId },
    })

    if (!existingApi) {
      return res.myError('要更新的 API 接口不存在', 404)
    }

    // 检查是否有其他 API 使用了相同的路径和方法
    const duplicate = await prisma.api.findFirst({
      where: {
        apiPath,
        method,
        NOT: { apiId }, // 排除当前自身
      },
    })

    if (duplicate) {
      return res.myError('已存在相同路径和方法的其他 API 接口', 400)
    }

    const updatedApi = await prisma.api.update({
      where: { apiId },
      data: {
        apiName,
        apiPath,
        method,
        description,
        group,
        state,
        requireAuth,
        updateId: req.user.accountId, // 更新人 ID
      },
    })

    res.mySuccess(updatedApi, 'API 接口更新成功')
  } catch (error) {
    res.myError('更新 API 接口失败: ' + error.message, 500)
  }
}

/**
 * 批量删除 API 接口
 * @param {*} req
 * @param {*} res
 */
exports.deleteApi = async (req, res) => {
  try {
    const { apiIds } = req.body

    if (!Array.isArray(apiIds) || apiIds.length === 0) {
      return res.myError('apiIds 格式不正确或为空', 400)
    }

    // 查询要删除的接口是否存在（可选校验）
    const existingApis = await prisma.api.findMany({
      where: {
        apiId: {
          in: apiIds,
        },
      },
    })

    if (existingApis.length === 0) {
      return res.myError('未找到要删除的 API 接口', 404)
    }

    // 删除接口（批量删除）
    const deleted = await prisma.api.deleteMany({
      where: {
        apiId: {
          in: apiIds,
        },
      },
    })

    res.mySuccess(
      {
        deletedCount: deleted.count,
        deletedIds: apiIds,
      },
      'API 接口删除成功',
    )
  } catch (error) {
    res.myError('删除 API 接口失败: ' + error.message, 500)
  }
}
