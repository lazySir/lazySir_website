const prisma = require('../../../db')
const { formatDate } = require('../../../utils')
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
        apiName ? { apiName: { contains: apiName } } : {},
        apiPath ? { apiPath: { contains: apiPath } } : {},
        method ? { method } : {},
        group ? { group: { contains: group } } : {},
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
    // 格式化日期
    list.forEach((item) => {
      item.createDate = formatDate(item.createDate)
      item.updateDate = formatDate(item.updateDate)
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

/**
 * 更新某个角色的 API 接口绑定关系
 * 逻辑：先删除该角色所有绑定，再重新绑定传入的 apiIds
 */
exports.updateRoleApi = async (req, res) => {
  try {
    const { roleId, apiIds } = req.body
    //检查roleID是否在adminRole表中存在
    const roleExists = await prisma.adminRole.findUnique({
      where: { roleId },
    })
    if (!roleExists) {
      return res.myError('角色 ID 不存在', 404)
    }
    // 删除所有该角色的绑定
    await prisma.roleAndApi.deleteMany({
      where: { roleId },
    })

    // 如果新绑定为空，直接返回
    if (!apiIds || apiIds.length === 0) {
      return res.mySuccess(null, '已清空该角色的所有 API 绑定')
    }

    // 构造新的绑定记录
    const createData = apiIds.map((apiId) => ({
      roleId,
      apiId,
    }))

    // 批量创建新绑定
    const created = await prisma.roleAndApi.createMany({
      data: createData,
      skipDuplicates: true, // 防止重复绑定
    })

    res.mySuccess(created, '角色 API 绑定关系更新成功')
  } catch (error) {
    res.myError('更新角色 API 绑定关系失败: ' + error.message, 500)
  }
}

/**
 * 查询多个角色绑定的 API 接口列表
 * 支持通过 roleIds 批量查询
 */
/**
 * 查询多个角色绑定的 API 列表（去重）
 * @param {*} req
 * @param {*} res
 */
exports.getRoleApi = async (req, res) => {
  try {
    const { roleIds } = req.body

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return res.myError('roleIds 不能为空', 400)
    }

    // 查询这些角色绑定的所有 API（含重复）
    const bindings = await prisma.roleAndApi.findMany({
      where: {
        roleId: { in: roleIds },
      },
      include: {
        api: true,
      },
    })

    // 整合成不重复的 API 列表
    const uniqueApisMap = new Map()
    for (const item of bindings) {
      if (!uniqueApisMap.has(item.api.apiId)) {
        uniqueApisMap.set(item.api.apiId, item.api)
      }
    }

    const uniqueApis = Array.from(uniqueApisMap.values())
    // 格式化日期
    uniqueApis.forEach((api) => {
      api.createDate = formatDate(api.createDate)
      api.updateDate = formatDate(api.updateDate)
    })
    //返回总条数

    res.mySuccess(
      { count: uniqueApis.length, data: uniqueApis },
      '查询角色 API 权限成功',
    )
  } catch (error) {
    res.myError('查询角色 API 权限失败: ' + error.message, 500)
  }
}
