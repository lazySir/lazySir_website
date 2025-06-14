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
      methodId,
      description,
      groupId,
      state = true,
      requireAuth = true,
    } = req.body

    // 检查是否存在重复路径和方法
    const exist = await prisma.api.findFirst({
      where: {
        apiPath,
        methodId,
      },
    })

    if (exist) {
      return res.myError('该 API 接口路径和方法已存在', 400)
    }

    // 验证 methodId 是否属于 key 为 'methods' 的子字典
    const methodRoot = await prisma.sysDictionary.findFirst({
      where: {
        key: 'methods',
      },
    })

    if (!methodRoot) {
      return res.myError('未找到 methods 字典项', 400)
    }

    const validMethod = await prisma.sysDictionary.findFirst({
      where: {
        dictionaryId: methodId,
        parentId: methodRoot.dictionaryId,
      },
    })

    if (!validMethod) {
      return res.myError('methodId 无效，不属于 methods 字典项', 400)
    }

    // 验证 groupId 是否属于 key 为 'apiGroup' 的子字典（或你定义的 group key）
    const groupRoot = await prisma.sysDictionary.findFirst({
      where: {
        key: 'apiGroup',
      },
    })

    if (!groupRoot) {
      return res.myError('未找到 apiGroup 字典项', 400)
    }

    const validGroup = await prisma.sysDictionary.findFirst({
      where: {
        dictionaryId: groupId,
        parentId: groupRoot.dictionaryId,
      },
    })

    if (!validGroup) {
      return res.myError('groupId 无效，不属于 apiGroup 字典项', 400)
    }

    // 创建 API
    const newApi = await prisma.api.create({
      data: {
        apiName,
        apiPath,
        methodId,
        description,
        groupId,
        state,
        requireAuth,
        accountId: req.user.accountId, // 创建人ID
        updateId: req.user.accountId, // 更新人ID
      },
    })

    res.mySuccess(newApi, 'API 接口添加成功')
  } catch (error) {
    res.myError('添加 API 接口失败: ' + error.message, 500)
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
      state,
      requireAuth,
      page = 1,
      limit = 20,
    } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)
    const where = {
      AND: [
        apiName ? { apiName: { contains: apiName } } : {},
        apiPath ? { apiPath: { contains: apiPath } } : {},
        typeof state === 'boolean' ? { state } : {},
        typeof requireAuth === 'boolean' ? { requireAuth } : {},
      ],
    }
    const total = await prisma.api.count({ where })
    const list = await prisma.api.findMany({
      where,
      skip,
      take,
      orderBy: { updateDate: 'desc' },
    })
    // 收集 accountId / updateId / groupId / methodId
    const accountIdSet = new Set()
    const dictionaryIdSet = new Set()
    list.forEach((item) => {
      if (item.accountId) accountIdSet.add(item.accountId)
      if (item.updateId) accountIdSet.add(item.updateId)
      if (item.groupId) dictionaryIdSet.add(item.groupId)
      if (item.methodId) dictionaryIdSet.add(item.methodId)
    })
    const accountIds = Array.from(accountIdSet)
    const dictionaryIds = Array.from(dictionaryIdSet)
    // 查询 adminInfo 中的 nickname
    const adminInfos = await prisma.adminInfo.findMany({
      where: {
        accountId: {
          in: accountIds,
        },
      },
      select: {
        accountId: true,
        nickname: true,
      },
    })
    const nicknameMap = Object.fromEntries(
      adminInfos.map((info) => [info.accountId, info.nickname]),
    )
    // 查询字典信息
    const dictionaries = await prisma.sysDictionary.findMany({
      where: {
        dictionaryId: {
          in: dictionaryIds,
        },
      },
      select: {
        dictionaryId: true,
        key: true,
        value: true,
      },
    })
    const dictionaryMap = Object.fromEntries(
      dictionaries.map((d) => [d.dictionaryId, { key: d.key, value: d.value }]),
    )
    // 加工返回数据
    list.forEach((item) => {
      item.createDate = formatDate(item.createDate)
      item.updateDate = formatDate(item.updateDate)
      item.createNickname = nicknameMap[item.accountId] || null
      item.updateNickname = nicknameMap[item.updateId] || null
      const methodInfo = dictionaryMap[item.methodId] || {}
      item.methodKey = methodInfo.key || null
      item.methodValue = methodInfo.value || null
      const groupInfo = dictionaryMap[item.groupId] || {}
      item.groupKey = groupInfo.key || null
      item.groupValue = groupInfo.value || null
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
      methodId,
      description,
      groupId,
      state = true,
      requireAuth = true,
    } = req.body

    // 检查记录是否存在
    const existingApi = await prisma.api.findUnique({
      where: { apiId },
    })
    if (!existingApi) {
      return res.myError('要更新的 API 接口不存在', 404)
    }

    // 校验路径 + methodId 是否唯一（排除当前 apiId）
    const duplicate = await prisma.api.findFirst({
      where: {
        apiPath,
        methodId,
        NOT: { apiId },
      },
    })
    if (duplicate) {
      return res.myError('已存在相同路径和方法的其他 API 接口', 400)
    }

    // 获取 methods 的根 dictionaryId
    const methodRoot = await prisma.sysDictionary.findFirst({
      where: { key: 'methods' },
    })
    if (!methodRoot) {
      return res.myError('未找到方法类型字典定义', 400)
    }

    // 检查 methodId 是否为 methods 子项
    const methodValid = await prisma.sysDictionary.findFirst({
      where: {
        dictionaryId: methodId,
        parentId: methodRoot.dictionaryId,
      },
    })
    if (!methodValid) {
      return res.myError('无效的 methodId', 400)
    }

    // 获取 groups 的根 dictionaryId
    const groupRoot = await prisma.sysDictionary.findFirst({
      where: { key: 'apiGroup' },
    })
    if (!groupRoot) {
      return res.myError('未找到分组类型字典定义', 400)
    }

    // 检查 groupId 是否为 groups 子项
    const groupValid = await prisma.sysDictionary.findFirst({
      where: {
        dictionaryId: groupId,
        parentId: groupRoot.dictionaryId,
      },
    })
    if (!groupValid) {
      return res.myError('无效的 groupId', 400)
    }

    // 执行更新
    const updatedApi = await prisma.api.update({
      where: { apiId },
      data: {
        apiName,
        apiPath,
        methodId,
        description,
        groupId,
        state,
        requireAuth,
        updateId: req.user.accountId,
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
    const { roleIds } = req.query
    // ✅ 校验 roleIds 是否都存在于 adminRole 表中
    const existingRoles = await prisma.adminRole.findMany({
      where: {
        roleId: { in: roleIds },
      },
      select: { roleId: true },
    })

    const existingRoleIds = existingRoles.map((r) => r.roleId)
    const missingRoleIds = roleIds.filter((id) => !existingRoleIds.includes(id))

    if (missingRoleIds.length > 0) {
      return res.myError(
        `以下 roleId 不存在: ${missingRoleIds.join(', ')}`,
        400,
      )
    }

    // ✅ 查询这些角色绑定的所有 API（可能含重复）
    const bindings = await prisma.roleAndApi.findMany({
      where: {
        roleId: { in: roleIds },
      },
      include: {
        api: true,
      },
    })

    // ✅ 整合成不重复的 API 列表
    const uniqueApisMap = new Map()
    for (const item of bindings) {
      if (!uniqueApisMap.has(item.api.apiId)) {
        uniqueApisMap.set(item.api.apiId, item.api)
      }
    }

    const uniqueApis = Array.from(uniqueApisMap.values())

    // ✅ 收集所有 accountId 和 updateId
    const accountIdSet = new Set()
    uniqueApis.forEach((api) => {
      if (api.accountId) accountIdSet.add(api.accountId)
      if (api.updateId) accountIdSet.add(api.updateId)
    })

    const accountIds = Array.from(accountIdSet)

    // ✅ 查询 adminInfo 表中的 nickname
    const adminInfos = await prisma.adminInfo.findMany({
      where: {
        accountId: { in: accountIds },
      },
      select: {
        accountId: true,
        nickname: true,
      },
    })

    // ✅ 构建 accountId => nickname 映射
    const nicknameMap = {}
    adminInfos.forEach((info) => {
      nicknameMap[info.accountId] = info.nickname
    })

    // ✅ 添加 createNickname、updateNickname，格式化时间
    uniqueApis.forEach((api) => {
      api.createDate = formatDate(api.createDate)
      api.updateDate = formatDate(api.updateDate)
      api.createNickname = nicknameMap[api.accountId] || ''
      api.updateNickname = nicknameMap[api.updateId] || ''
    })

    res.mySuccess(
      { count: uniqueApis.length, list: uniqueApis },
      '查询角色 API 权限成功',
    )
  } catch (error) {
    res.myError('查询角色 API 权限失败: ' + error.message, 500)
  }
}
