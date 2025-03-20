const prisma = require('../../../db')
const { v4: uuidv4 } = require('uuid')
// 检查 menuValue 和 path 是否重复
const checkMenuValueAndPath = async (menuValue, path, menuId = '') => {
  try {
    // 检查 menuValue 是否已存在，并排除当前正在更新的 menuId
    const existingMenuValue = await prisma.adminMenu.findFirst({
      where: {
        menuValue,
        NOT: { menuId }, // 排除当前 menuId
      },
    })

    if (existingMenuValue) {
      return { duplicate: true, message: '菜单值已存在，请使用其他值' }
    }

    // 检查 path 是否已存在，并排除当前正在更新的 menuId
    const existingPath = await prisma.adminMenu.findFirst({
      where: {
        path,
        NOT: { menuId }, // 排除当前 menuId
      },
    })

    if (existingPath) {
      return { duplicate: true, message: '菜单路径已存在，请使用其他路径' }
    }

    // 如果 menuValue 和 path 都不重复
    return { duplicate: false }
  } catch (err) {
    throw new Error('检查菜单值和路径时出错')
  }
}
const { formatDate } = require('../../../utils')
exports.getMenu = async (req, res) => {
  const { menuName } = req.query;

  try {
    // Get all level 1 menus and include nested children
    const menus = await prisma.adminMenu.findMany({
      where: {
        level: 1, // Only keep level 1 menus
        ...(menuName && {
          menuName: {
            contains: menuName,
          },
        }),
      },
      include: {
        children: {
          include: {
            children: true, // Include children of children
          },
        },
      },
    });

    // Recursive function to process each menu and get creator and updater nicknames
    const processChildren = async (menu) => {
      const creator = await prisma.adminInfo.findUnique({
        where: { accountId: menu.accountId },
        select: { nickname: true },
      });

      const updater = menu.updateId
        ? await prisma.adminInfo.findUnique({
          where: { accountId: menu.updateId },
          select: { nickname: true },
        })
        : null;

      // Format the menu with additional info and recursively process children
      const formattedMenu = {
        ...menu,
        createdDate: formatDate(new Date(menu.createdDate)),
        updatedDate: formatDate(new Date(menu.updatedDate)),
        createNickname: creator ? creator.nickname : null,
        updateNickname: updater ? updater.nickname : null,
        children: await Promise.all(
          (menu.children || []).map(async (child) => processChildren(child))
        ),
      };

      // Remove accountId and updateId
      delete formattedMenu.accountId;
      delete formattedMenu.updateId;

      // Sort children by sortOrder in ascending order
      formattedMenu.children.sort((a, b) => a.sortOrder - b.sortOrder);

      return formattedMenu;
    };

    // Process each top-level menu and sort the result by sortOrder
    const menuResponse = await Promise.all(
      menus.map(async (menu) => processChildren(menu))
    );

    // Sort top-level menus by sortOrder in ascending order
    menuResponse.sort((a, b) => a.sortOrder - b.sortOrder);

    // Use the custom success response
    return res.mySuccess(menuResponse);
  } catch (error) {
    console.error(error);
    // Use the custom error response
    return res.myError(error);
  }
};

exports.addMenu = async (req, res) => {
  const {
    menuName,
    menuValue,
    parentId,
    level,
    path,
    state,
    icon,
    description,
    sortOrder,
  } = req.body;

  // 递归函数，获取所有父级和祖先的 menuId
  const getParentMenuIds = async (currentParentId) => {
    const parentMenuIds = [];  // 用于存储所有父级的 menuId
    let currentMenu = await prisma.adminMenu.findUnique({
      where: { menuId: currentParentId },
    });

    // 递归获取父级菜单的 parentId，直到没有父级菜单为止
    while (currentMenu) {
      parentMenuIds.push(currentMenu.menuId); // 收集当前父级菜单的 menuId
      if (currentMenu.parentId) {
        // 继续查找父级菜单的上级
        currentMenu = await prisma.adminMenu.findUnique({
          where: { menuId: currentMenu.parentId },
        });
      } else {
        // 没有上级菜单时，停止循环
        break;
      }
    }

    return parentMenuIds;
  };

  try {
    // 检查 menuValue 和 path 是否重复
    const { duplicate, message } = await checkMenuValueAndPath(menuValue, path);

    if (duplicate) {
      return res.myError(message);
    }

    // 如果存在 parentId，获取父级和祖先菜单的所有 menuId
    let parentMenuIds = [];
    if (parentId) {
      parentMenuIds = await getParentMenuIds(parentId);
    }

    // 删除 roleAndMenu 表中关联的 menuId 记录
    if (parentMenuIds.length > 0) {
      await prisma.roleAndMenu.deleteMany({
        where: {
          menuId: {
            in: parentMenuIds,
          },
        },
      });
    }

    // 创建新的菜单记录
    const newMenuData = {
      menuId: uuidv4(),
      menuName,
      menuValue,
      parent: parentId ? { connect: { menuId: parentId } } : undefined, // 连接父级菜单
      level: level || 1,
      path,
      state: state !== undefined ? state : true,
      icon: icon || 'ep:menu',
      description: description || null,
      sortOrder: sortOrder || 99,
      accountId: req.user.accountId,
      updateId: req.user.accountId,
    };

    // 使用 Prisma 创建菜单
    const result = await prisma.adminMenu.create({
      data: newMenuData,
    });

    // 返回成功响应
    return res.mySuccess(null, '菜单新增成功');
  } catch (err) {
    console.error(err);
    return res.myError('服务器错误，请稍后再试');
  }
};



exports.updateMenu = async (req, res) => {
  try {
    const {
      menuId,
      menuName,
      menuValue,
      sortOrder,
      parentId,
      level,
      path,
      state,
      description,
      icon,
    } = req.body // 从请求体中获取更新的字段

    // 查找对应的菜单信息
    const menu = await prisma.adminMenu.findUnique({
      where: { menuId },
    })

    // 如果找不到菜单，返回错误
    if (!menu) {
      return res.myError('菜单未找到！')
    }

    // 检查 menuValue 和 path 是否重复
    const checkResult = await checkMenuValueAndPath(menuValue, path, menuId)
    if (checkResult.duplicate) {
      return res.myError(checkResult.message) // 返回重复的错误消息
    }

    // 获取当前用户的 adminInfo
    const adminInfo = await prisma.adminAccount.findUnique({
      where: { accountId: req.user.accountId },
    })

    // 检查用户是否是 admin
    const isAdminUser = adminInfo && adminInfo.username == 'admin' // 确保 adminInfo 存在后再访问 username
    // 比对 accountId 和 req.user.accountId
    //如果不是 admin 用户，则检查 menu.accountId 是否等于 req.user.accountId 如果等于的话，则允许修改
    if (!isAdminUser && menu.accountId !== req.user.accountId) {
      return res.myError('您没有权限修改此菜单！')
    }
    // 更新菜单
    const updatedMenu = await prisma.adminMenu.update({
      where: { menuId },
      data: {
        menuName,
        menuValue,
        sortOrder,
        parentId: parentId || null,
        level,
        path,
        state,
        description,
        icon,
        updateId: req.user.accountId, // 更新者 ID
      },
    })

    return res.mySuccess(updatedMenu, '菜单更新成功')
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，请稍后再试')
  }
}

exports.deleteMenu = async (req, res) => {
  try {
    const { menusId } = req.body // 从请求体中获取菜单 ID 数组
    const accountId = req.user.accountId // 假设从 token 中获取当前用户的 accountId
    const userAccount = await prisma.adminAccount.findUnique({
      where: { accountId }, // 根据当前用户的 accountId 查询用户信息
      select: { username: true }, // 只查询 username
    })

    if (!Array.isArray(menusId) || menusId.length === 0) {
      return res.myError('请提供有效的菜单 ID 数组') // 确保传入的参数有效
    }

    // 检查每个菜单的权限及是否有子菜单
    const menus = await prisma.adminMenu.findMany({
      where: {
        menuId: { in: menusId },
      },
      select: {
        menuId: true,
        menuName: true,
        accountId: true, // 获取菜单的 accountId
        children: true, // 包括子菜单
      },
    })
    const deletedMenus = []
    const unauthorizedMenus = []
    const menusWithChildren = []

    for (const menu of menus) {
      if (menu.children.length > 0) {
        // 如果菜单有子菜单，则添加到 menusWithChildren 数组
        menusWithChildren.push(menu)
      } else if (
        menu.accountId === accountId ||
        userAccount?.username === 'admin'
      ) {
        // 当前用户可以删除的菜单
        deletedMenus.push(menu)
      } else {
        // 当前用户没有权限删除的菜单
        unauthorizedMenus.push(menu)
      }
    }
    // 如果存在有子菜单的菜单，则不允许删除
    if (menusWithChildren.length > 0) {
      const menusNames = menusWithChildren
        .map((menu) => menu.menuName)
        .join(', ')
      return res.myError(`以下菜单有子菜单，无法删除: ${menusNames}`)
    }

    // 删除用户有权限删除的菜单
    if (deletedMenus.length > 0) {
      await prisma.adminMenu.deleteMany({
        where: {
          menuId: { in: deletedMenus.map((menu) => menu.menuId) }, // 根据菜单 ID 数组删除菜单
        },
      })
    }

    // 构建返回消息
    let message = '菜单删除成功'
    if (unauthorizedMenus.length > 0) {
      const unauthorizedNames = unauthorizedMenus
        .map((menu) => menu.menuName)
        .join(', ')
      message += `，以下菜单您无权限删除: ${unauthorizedNames}`
    }

    return res.mySuccess(null, message) // 返回成功的消息
  } catch (err) {
    console.error(err)
    return res.myError('服务器错误，请稍后再试') // 返回服务器错误
  }
}
