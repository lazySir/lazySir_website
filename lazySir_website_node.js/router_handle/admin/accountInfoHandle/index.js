const prisma = require('../../../db')
const bcrypt = require('bcryptjs') // 用于加密密码
const path = require('path')
const fs = require('fs')
const { uploadUrls } = require('../../../config/upload')
const { formatDate } = require('../../../utils/index')
exports.logout = async (req, res) => {
  res.mySuccess('退出成功')
}

exports.getAdminInfo = async (req, res) => {
  try {
    // 使用 Prisma 查询用户信息
    const userInfo = await prisma.adminInfo.findUnique({
      where: {
        accountId: req.user.accountId, // 从请求中获取 accountId
      },
    })

    // 检查是否找到用户信息
    if (userInfo) {
      return res.mySuccess(userInfo, '获取用户信息成功！') // 返回成功响应
    } else {
      return res.myError('获取用户信息失败！') // 没有找到用户信息，返回失败响应
    }
  } catch (err) {
    console.error(err) // 记录错误信息
    return res.myError('服务器错误，请稍后再试') // 返回服务器错误响应
  }
}

exports.getAdmins = async (req, res) => {
  const { page = 1, limit = 5, username = '' } = req.query;
  const skip = (page - 1) * limit;

  try {
    const totalUsers = await prisma.adminInfo.count({
      where: {
        adminAccount: {
          username: {
            contains: username,
          },
        },
      },
    });

    if (totalUsers === 0) {
      return res.mySuccess({
        users: [],
        totalUsers: 0,
        totalPages: 0,
        currentPage: parseInt(page),
      });
    }

    const users = await prisma.adminInfo.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      where: {
        adminAccount: {
          username: {
            contains: username,
          },
        },
      },
      select: {
        accountInfoId: true,
        phone: true,
        age: true,
        gender: true,
        email: true,
        nickname: true,
        address: true,
        state: true,
        accountId: true,
        isDelete: true,
        avatar: true,
        createDate: true,
        updateDate: true,
        adminAccount: {
          select: {
            username: true,
          },
        },
        // 获取用户的角色信息
        accountsAndRoles: {
          select: {
            roles: {
              select: {
                roleName: true, // 获取角色名称
                state: true,
                roleId: true
              },
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return res.mySuccess({
      users: users.map((user) => ({
        accountInfoId: user.accountInfoId,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        email: user.email,
        nickname: user.nickname,
        address: user.address,
        state: user.state,
        accountId: user.accountId,
        isDelete: user.isDelete,
        avatar: user.avatar,
        createDate: formatDate(user.createDate),
        updateDate: formatDate(user.updateDate),
        username: user.adminAccount.username,
        roles: user.accountsAndRoles.map((roleRelation) => roleRelation.roles), // 显示用户的角色名称
      })),
      totalUsers,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return res.myError('获取用户信息失败');
  }
};
exports.updateAdminInfo = async (req, res) => {
  const {
    accountId,
    nickname,
    phone,
    age,
    gender,
    email,
    address,
    avatar,
    state,
    isDelete,
    username,
  } = req.body;

  if (!accountId) {
    return res.myError('用户ID未提供');
  }
  // 获取当前用户的旧头像路径
  const adminInfo = await prisma.adminInfo.findUnique({
    where: { accountId: req.user.accountId },
  });
  if (adminInfo && adminInfo.avatar && avatar != adminInfo.avatar) {
    const oldAvatarPath = path.join(__dirname, '../../../public', adminInfo.avatar);
    // 检查旧头像文件是否存在并删除
    if (fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath);
    }
  }

  try {
    // 启动事务，确保信息的原子性更新
    await prisma.$transaction(async (tx) => {
      // 检查是否传入 username
      if (username) {
        // 校验 username 的长度
        if (username.length < 5 || username.length > 20) {
          throw new Error('用户名长度必须在5到20个字符之间'); // 抛出错误
        }

        // 检查 username 是否已存在，并且排除当前用户
        const existingUser = await tx.adminAccount.findUnique({
          where: { username },
        });

        // 如果 username 已存在并且不是当前用户，抛出错误
        if (existingUser && existingUser.accountId !== accountId) {
          throw new Error('用户名已被占用'); // 抛出错误
        }

        // 检查当前 accountId 是否是管理员(admin)
        const adminAccount = await tx.adminAccount.findFirst({
          where: { username: 'admin' },
          select: { accountId: true },
        });

        if (adminAccount && accountId === adminAccount.accountId) {
          // 如果是管理员账户，并且当前用户不是管理员，禁止修改
          if (req.user.accountId !== adminAccount.accountId) {
            throw new Error('无权限修改管理员账户'); // 抛出错误
          }
        }

        // 更新 adminAccount 的 username
        await tx.adminAccount.update({
          where: { accountId },
          data: { username },
        });
      }

      // 更新用户基本信息
      await tx.adminInfo.update({
        where: { accountId },
        data: {
          nickname,
          phone,
          age,
          gender,
          email,
          address,
          avatar,
          state,
          isDelete,
        },
      });
    });

    return res.mySuccess('用户信息更新成功');
  } catch (error) {
    console.error('更新用户信息失败:', error.message);
    return res.myError(error.message); // 返回错误消息
  }
};

exports.resetPassword = async (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.myError('用户ID未提供');
  }

  try {
    // 启动事务，确保信息的原子性更新
    await prisma.$transaction(async (tx) => {
      // 检查是否为管理员账户
      const adminAccount = await tx.adminAccount.findFirst({
        where: { username: 'admin' },
        select: { accountId: true },
      });

      if (adminAccount && accountId === adminAccount.accountId) {
        // 如果是管理员账户，并且当前用户不是管理员，禁止重置密码
        if (req.user.accountId !== adminAccount.accountId) {
          throw new Error('无权限重置超级管理员密码');
        }
      }

      // 重置密码并进行加密
      const newPassword = process.env.RESET_PASSWORD;
      const hashedPassword = bcrypt.hashSync(
        newPassword,
        Number(process.env.SALT_ROUNDS),
      );

      // 更新用户密码
      await tx.adminAccount.update({
        where: { accountId },
        data: { password: hashedPassword },
      });
    });

    res.mySuccess([], '密码重置成功：' + process.env.RESET_PASSWORD);
  } catch (error) {
    console.error('重置密码失败:', error);
    if (error.message === '无权限重置超级管理员密码') {
      return res.myError('无权限重置超级管理员密码');
    }
    res.myError('重置密码失败');
  }
};
exports.modifyPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body

  try {
    // 获取当前登录用户的账号信息
    const account = await prisma.adminAccount.findUnique({
      where: { accountId: req.user.accountId },
    })

    // 如果账号不存在，返回错误
    if (!account) {
      return res.myError('用户不存在')
    }

    // 验证旧密码是否正确
    const isPasswordValid = bcrypt.compareSync(oldPassword, account.password)
    if (!isPasswordValid) {
      return res.myError('旧密码错误')
    }

    // 加密新密码
    const hashedNewPassword = bcrypt.hashSync(
      newPassword,
      Number(process.env.SALT_ROUNDS),
    )

    // 更新用户密码
    await prisma.adminAccount.update({
      where: { accountId: req.user.accountId },
      data: { password: hashedNewPassword },
    })

    return res.mySuccess('密码修改成功')
  } catch (error) {
    console.error('修改密码失败:', error)
    return res.myError('修改密码失败，请稍后再试')
  }
}
exports.deleteAdminAccount = async (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.myError('用户ID未提供');
  }

  try {
    // 使用事务确保删除操作的原子性
    await prisma.$transaction(async (tx) => {
      // 检查要删除的账号是否为超级管理员
      const adminAccount = await tx.adminAccount.findUnique({
        where: { accountId },
        select: { username: true },
      });

      if (!adminAccount) {
        throw new Error('用户不存在');
      }

      // 如果要删除的账号是超级管理员，阻止删除操作
      if (adminAccount.username === 'admin') {
        throw new Error('超级管理员无法被删除');
      }

      // 删除用户的 adminAccount 数据，关联的 adminInfo 数据将自动删除
      await tx.adminAccount.delete({
        where: { accountId },
      });
    });

    return res.mySuccess([], '管理员账户删除成功');
  } catch (error) {
    console.error('删除管理员账户失败:', error.message);
    return res.myError(error.message || '删除管理员账户失败');
  }
};
//上传管理员头像
exports.uploadAvatar = async (req, res) => {
  try {
    // 确保文件上传成功
    const file = req.file;
    if (!file) {
      return res.myError('头像上传失败，请重新尝试');
    }

    // 构建图片访问 URL
    const imgUrl = uploadUrls.adminAvatar.saveUrl + `${file.filename}`;
    // 返回成功响应
    return res.mySuccess({
      message: '上传头像成功',
      imgUrl: imgUrl,
    });
  } catch (err) {
    console.error(err);
    return res.myError('服务器错误，上传失败');
  }
};