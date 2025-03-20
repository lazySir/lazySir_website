const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { formatDate } = require('../../../utils')
exports.addRole = async (req, res) => {
  try {
    const { roleName, state, description } = req.body

    // 检查角色名称是否已经存在
    const existingRole = await prisma.adminRole.findUnique({
      where: { roleName },
    })

    if (existingRole) {
      return res.myError('角色名称已存在！')
    }

    // 创建新角色
    const newRole = await prisma.adminRole.create({
      data: {
        roleName,
        state: state !== undefined ? state : true, // 如果未提供，默认为 true
        description: description || null, // 允许 description 为 null
        accountId: req.user.accountId,
        updateId: req.user.accountId,
      },
    })

    // 返回成功响应
    return res.mySuccess(newRole, newRole.roleName + '创建成功')
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，请稍后再试')
  }
}

exports.getRole = async (req, res) => {
  try {
    const { roleName, page = 1, limit = 10 } = req.query; // 获取查询参数：roleName、page 和 limit

    const skip = (page - 1) * limit; // 计算分页的偏移量

    // 定义查询条件，如果有 roleName，则使用 contains 进行模糊查询
    const whereClause = roleName
      ? {
          roleName: {
            contains: roleName, // 模糊查询 roleName
          },
        }
      : {}; // 如果没有 roleName，则不添加查询条件

    // 查询符合条件的角色总数
    const totalRoles = await prisma.adminRole.count({
      where: whereClause,
    });

    // 查询角色，分页获取数据
    const roles = await prisma.adminRole.findMany({
      where: whereClause, // 应用查询条件
      skip: parseInt(skip), // 跳过指定数量的记录
      take: parseInt(limit), // 获取指定数量的记录
    });

    if (roles.length === 0) {
      return res.myError('未找到匹配的角色'); // 如果没有找到角色，返回错误提示
    }

    // 查找创建者和更新者的用户名
    const accountIds = roles.map((role) => role.accountId);
    const updateIds = roles.map((role) => role.updateId);
    const allAccountIds = [...new Set([...accountIds, ...updateIds])]; // 合并去重 accountId 和 updateId

    const accounts = await prisma.adminAccount.findMany({
      where: {
        accountId: { in: allAccountIds },
      },
      select: {
        accountId: true,
        username: true,
      },
    });

    // 生成用户名映射
    const usernameMap = accounts.reduce((map, account) => {
      map[account.accountId] = account.username;
      return map;
    }, {});

    // 将查询结果格式化并返回
    const formattedRoles = roles.map((role) => ({
      roleId: role.roleId,
      roleName: role.roleName,
      state: role.state,
      createDate: formatDate(new Date(role.createDate)), // 格式化创建时间
      updateDate: formatDate(new Date(role.updateDate)), // 格式化更新时间
      createUsername: usernameMap[role.accountId] || '未知创建者',
      updateUsername: usernameMap[role.updateId] || '未知更新者',
      description: role.description,
    }));

    // 计算总页数
    const totalPages = Math.ceil(totalRoles / limit);

    return res.mySuccess(
      {
        roles: formattedRoles, // 返回角色列表
        totalRoles, // 返回符合条件的总角色数
        totalPages, // 返回总页数
        currentPage: parseInt(page), // 当前页
      },
      '角色列表获取成功'
    );
  } catch (err) {
    console.error(err); // 打印错误日志
    return res.myError('服务器错误，请稍后再试'); // 返回错误响应
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { roleId, roleName, state, description } = req.body // 从请求体中获取更新的字段

    // 获取当前登录用户的 accountId
    const { accountId: currentAccountId } = req.user

    // 查询该角色的 accountId
    const roleToUpdate = await prisma.adminRole.findUnique({
      where: { roleId },
      select: { accountId: true },
    })

    if (!roleToUpdate) {
      return res.myError('未找到该角色')
    }
    // 获取创建该角色的账号信息
    const creatorAccount = await prisma.adminAccount.findUnique({
      where: { accountId: roleToUpdate.accountId },
      select: { username: true },
    })
    if (
      creatorAccount.username === 'admin' &&
      currentAccountId !== roleToUpdate.accountId
    ) {
      // 如果创建该角色的账号是超级管理员，且当前用户不是超级管理员，则禁止修改
      return res.myError('超级管理员创建的角色不允许修改')
    }

    // 检查是否提供了新的 roleName 且与其他角色重复
    if (roleName) {
      const existingRole = await prisma.adminRole.findFirst({
        where: {
          roleName: roleName,
          roleId: { not: roleId }, // 确保不会和自己重复
        },
      })

      if (existingRole) {
        return res.myError('角色名称已存在，请使用其他名称')
      }
    }

    // 更新角色信息
    const updatedRole = await prisma.adminRole.update({
      where: { roleId }, // 查找角色
      data: {
        roleName, // 如果提供了 roleName，则更新
        state, // 如果提供了 state，则更新
        description, // 如果提供了 description，则更新
        updateId: currentAccountId, // 更新最后修改人
      },
    })

    return res.mySuccess(updatedRole, '角色更新成功') // 返回成功响应
  } catch (err) {
    console.error(err) // 打印错误日志
    return res.myError('服务器错误，请稍后再试') // 返回错误响应
  }
}
exports.deleteRole = async (req, res) => {
  try {
    const { rolesId } = req.body // 从请求体中获取角色ID数组

    if (!Array.isArray(rolesId) || rolesId.length === 0) {
      return res.myError('角色ID数组不能为空') // 验证传入的角色ID数组是否有效
    }

    const { accountId: currentAccountId } = req.user // 获取当前登录用户的 accountId

    // 查询当前用户是否为超级管理员
    const currentUser = await prisma.adminAccount.findUnique({
      where: { accountId: currentAccountId },
      select: { username: true },
    })

    const isSuperAdmin = currentUser.username === 'admin' // 判断是否为超级管理员

    // 查找传入的角色ID对应的角色信息
    const rolesToDelete = await prisma.adminRole.findMany({
      where: {
        roleId: { in: rolesId }, // 查找传入的角色ID数组中的角色
      },
      select: {
        roleId: true,
        roleName: true,
        accountId: true, // 角色创建者的 accountId
      },
    })

    // 筛选出创建者是当前用户或超级管理员可以删除的角色
    const deletableRoles = rolesToDelete.filter(
      (role) => role.accountId === currentAccountId || isSuperAdmin,
    )

    // 如果没有可删除的角色，返回提示
    if (deletableRoles.length === 0) {
      return res.myError('您无权限删除这些角色')
    }

    // 批量删除可删除的角色
    const idsToDelete = deletableRoles.map((role) => role.roleId)
    await prisma.adminRole.deleteMany({
      where: {
        roleId: { in: idsToDelete }, // 删除可删除的角色ID
      },
    })

    // 生成提示信息
    const undeletableRoles = rolesToDelete.filter(
      (role) => !deletableRoles.includes(role),
    )
    let message = '角色删除成功'
    if (undeletableRoles.length > 0) {
      message += `，以下角色无权限删除：${undeletableRoles
        .map((role) => role.roleName)
        .join(', ')}`
    }

    return res.mySuccess(null, message) // 返回成功响应
  } catch (err) {
    console.error(err) // 打印错误日志
    return res.myError('服务器错误，请稍后再试') // 返回错误响应
  }
}
