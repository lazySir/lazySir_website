
const prisma = require('../../../db')
const { formatDate } = require('../../../utils/index')
// 处理菜单格式
const formatRoutes = (menu) => {
  // 先按 sortOrder 升序排序
  const sortedMenu = menu.sort((a, b) => {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });

  return sortedMenu.map((item) => {
    // 将 menuName 和 menuValue 修改为 name 和 value，并将其余属性放入 meta 中
    const {
      menuName: name,
      menuValue: value,
      path,
      children,
      ...rest
    } = item;

    // 构建 meta 对象，包含剩余属性
    const meta = { ...rest };

    // 如果有子菜单，递归处理 children
    const updatedChildren =
      children.length > 0 ? formatRoutes(children) : [];

    return {
      path,
      name: value, // 设置 name 为 menuValue
      meta: {
        title: name, // 将 menuName 作为 meta 的 title
        ...meta, // 将其他属性放入 meta
      },
      children: updatedChildren,
    };
  });
}
exports.getAuth = async (req, res) => {
  const { rolesId, flag } = req.body; // 从请求的 body 中获取 rolesId 数组和 flag 标志

  // 检查是否提供了 rolesId，且 rolesId 是否为数组
  if (!rolesId) {
    return res.myError('未提供角色ID数组');
  }
  // 如果 rolesId 为空数组则返回空数组
  if (rolesId.length === 0) {
    return res.myError('未查询到角色，请联系管理员处理');
  }

  try {
    // 查询与多个角色关联的菜单
    const roleMenus = await prisma.RoleAndMenu.findMany({
      where: {
        roleId: {
          in: rolesId, // 使用 "in" 进行批量查询
        },
      },
      select: {
        menu: true
      },
    });

    // 如果没有关联的菜单，返回空数组
    if (roleMenus.length === 0) {
      return res.myError('没有查询到有任何菜单权限，请联系管理员处理');
    }

    // 提取所有菜单信息
    let menus = roleMenus.map((rm) => rm.menu);
    // 构建一个包含所有父级菜单的递归函数
    const fetchParentMenus = async (menu) => {
      if (menu.parentId) {
        const parentMenu = await prisma.adminMenu.findUnique({
          where: {
            menuId: menu.parentId,
          }
        });

        // 如果找到父菜单，并且它尚未包含在菜单列表中，则将其添加
        if (parentMenu && !menuIds.has(parentMenu.menuId)) {
          menuIds.add(parentMenu.menuId);
          uniqueMenus.push(parentMenu);
          await fetchParentMenus(parentMenu); // 递归获取父级菜单
        }
      }
    };

    // 对菜单进行去重，确保相同的菜单不会重复
    const uniqueMenus = [];
    const menuIds = new Set();

    // 遍历菜单并添加到 uniqueMenus，同时根据 flag 决定是否递归获取父级菜单
    for (const menu of menus) {
      if (!menuIds.has(menu.menuId)) {
        menuIds.add(menu.menuId);
        uniqueMenus.push(menu);
        if (flag) {
          await fetchParentMenus(menu); // 如果 flag 为 true，获取该菜单的父菜单
        }
      }
    }

    // 如果 flag 为 false，直接返回去重后的菜单列表，不构建菜单树
    if (!flag) {
      return res.mySuccess(uniqueMenus); // 直接返回菜单列表
    }

    // 将菜单按层级关系进行 children 整理
    const buildMenuTree = (menuList, parentId = null) => {
      const filteredMenus = menuList.filter((menu) => menu.parentId === parentId);

      // 仅当 flag 为 true 时进行排序
      if (flag) {
        filteredMenus.sort((a, b) => a.sortOrder - b.sortOrder);
      }

      return filteredMenus.map((menu) => ({
        ...menu,
        children: buildMenuTree(menuList, menu.menuId), // 递归构建子菜单
      }));
    };

    // 构建菜单树
    let menuTree = buildMenuTree(uniqueMenus);
    menuTree = formatRoutes(menuTree)
    const filterStateRoutes = (menu) => {
      return menu
        .filter(item => item.meta.state == true) // 先过滤当前层级的菜单
        .map(item => {
          // 递归处理子菜单
          if (item.children) {
            return {
              ...item,
              children: filterStateRoutes(item.children) // 递归调用
            };
          }
          return item; // 如果没有子菜单，直接返回当前菜单项
        });
    };
    menuTree = filterStateRoutes(menuTree)
    // 返回构建后的菜单树
    return res.mySuccess(menuTree);
  } catch (error) {
    console.error('获取角色菜单失败:', error);
    return res.myError('获取角色菜单失败');
  }
};

exports.updateAuth = async (req, res) => {
  const { menusId, roleId } = req.body

  // 判断 roleId 和 menusId 是否提供，并且 menusId 是否是数组
  if (!roleId || !menusId || !Array.isArray(menusId)) {
    return res.myError('角色ID或菜单ID数组未提供，或菜单ID不是数组')
  }

  try {
    // 查询角色是否存在，并获取创建者的 accountId
    const role = await prisma.adminRole.findUnique({
      where: { roleId },
      select: { accountId: true },
    })

    if (!role) {
      return res.myError('角色不存在')
    }

    // 检查角色创建者是否是超级管理员
    const superAdmin = await prisma.adminAccount.findFirst({
      where: { username: 'admin' },
      select: { accountId: true },
    })

    if (
      superAdmin &&
      role.accountId === superAdmin.accountId &&
      req.user.accountId !== superAdmin.accountId
    ) {
      return res.myError('无权限修改超级管理员创建的角色菜单')
    }

    // 递归函数，获取子菜单
    const getChildrenMenuIds = async (menuId, level = 1) => {
      if (level > 3) return [] // 限制递归深度，最多三层

      const children = await prisma.adminMenu.findMany({
        where: { parentId: menuId },
        select: { menuId: true },
      })

      if (children.length === 0) return []

      // 收集子菜单ID并递归查找其子菜单
      const allChildrenIds = await Promise.all(
        children.map(async (child) => {
          const grandChildrenIds = await getChildrenMenuIds(
            child.menuId,
            level + 1,
          )
          return [child.menuId, ...grandChildrenIds]
        }),
      )

      return allChildrenIds.flat() // 扁平化数组
    }

    // 初始化要关联的菜单ID，包括传入的菜单
    let allMenuIds = [...menusId]

    // 遍历每个传入的 menuId，检查是否有子菜单，并添加
    for (let menuId of menusId) {
      const childrenMenuIds = await getChildrenMenuIds(menuId)
      allMenuIds = [...new Set(allMenuIds.concat(childrenMenuIds))] // 合并并去重
    }

    // 删除该角色的旧菜单关联
    await prisma.RoleAndMenu.deleteMany({
      where: { roleId },
    })

    // 添加新的菜单关联
    const newAssociations = allMenuIds.map((menuId) => ({
      roleId,
      menuId,
    }))

    await prisma.RoleAndMenu.createMany({
      data: newAssociations,
    })

    return res.mySuccess('角色菜单更新成功')
  } catch (error) {
    console.error('角色菜单更新失败:', error)
    return res.myError('角色菜单更新失败')
  }
}

exports.getRole = async (req, res) => {
  const { accountId } = req.query // 确保从 query 中正确获取 accountId

  if (!accountId) {
    return res.myError('未提供 accountId')
  }

  try {
    // 检查用户是否存在
    const user = await prisma.adminInfo.findUnique({
      where: { accountId },
      select: { accountId: true },
    })

    if (!user) {
      return res.myError('用户不存在')
    }

    // 获取用户的角色并去除"roles"包装
    let roles = await prisma.accountsAndRoles.findMany({
      where: { accountId },
      select: {
        roles: {
          select: {
            roleId: true,
            roleName: true,
            description: true,
            state: true,
          },
        },
      },
    })

    //过滤掉state为false的
    roles = roles.filter(item => {
      return item.roles.state === true; // 保留 state 为 true 的项
    });

    // 如果没有角色，返回空数组
    const formattedRoles =
      roles.length > 0 ? roles.map((role) => role.roles) : []

    return res.mySuccess(formattedRoles)
  } catch (error) {
    console.error('获取用户角色失败:', error)
    return res.myError('获取用户角色失败')
  }
}
exports.updateRole = async (req, res) => {
  const { rolesId, accountId } = req.body
  try {
    // 获取超级管理员的 accountId
    const adminAccount = await prisma.adminAccount.findFirst({
      where: { username: 'admin' },
      select: { accountId: true },
    })

    // 检查请求的 accountId 是否与超级管理员相同，并验证权限
    if (
      adminAccount &&
      accountId === adminAccount.accountId &&
      req.user.accountId !== adminAccount.accountId
    ) {
      return res.myError('无权限修改超级管理员的角色')
    }

    // 检查数据有效性
    const adminInfoExists = await prisma.adminInfo.findFirst({
      where: { accountId },
    })
    const roleExists = await prisma.adminRole.findFirst({
      where: { roleId: rolesId[0] },
    })

    if (!adminInfoExists || !roleExists) {
      return res.myError('无效的 accountId 或 roleId')
    }

    // 使用事务处理
    await prisma.$transaction(async (tx) => {
      await tx.accountsAndRoles.deleteMany({
        where: {
          accountId: accountId,
        },
      })
      await tx.accountsAndRoles.createMany({
        data: rolesId.map((roleId) => ({
          accountId: accountId,
          roleId: roleId,
        })),
      })
    })

    // 成功响应
    return res.mySuccess('角色分配成功')
  } catch (error) {
    console.error('角色分配失败:', error)
    return res.myError('角色分配失败')
  }
}
