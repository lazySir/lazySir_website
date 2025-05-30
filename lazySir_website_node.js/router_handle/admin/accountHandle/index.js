const prisma = require('../../../db')
const { v4: uuidv4 } = require('uuid')
//导入bcryptjs  用来加密密码
const bcrypt = require('bcryptjs')
//导入生成token的包
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    // 获取客户端提交的用户信息
    const info = req.body

    // 检查注册码是否正确
    if (info.register_code !== process.env.REGISTER_CODE) {
      return res.myError('注册码错误!')
    }

    // 查询用户名是否被占用
    const existingUser = await prisma.adminAccount.findUnique({
      where: { username: info.username },
    })
    if (existingUser) {
      return res.myError('账号已被注册!')
    }

    // 查询默认管理员角色
    const defaultRole = await prisma.adminRole.findUnique({
      where: { roleName: process.env.ADMIN_DEFAULT_ROLE_NAME },
    })
    if (!defaultRole) {
      return res.myError('默认管理员角色未找到!')
    }

    // 生成ID和加密密码
    const accountId = uuidv4()
    const hashedPassword = bcrypt.hashSync(
      info.password,
      Number(process.env.SALT_ROUNDS),
    )

    // 创建用户和用户信息的事务
    await prisma.$transaction(async (tx) => {
      // 注册 adminAccount 表
      await tx.adminAccount.create({
        data: {
          accountId,
          username: info.username,
          password: hashedPassword,
        },
      })

      // 注册 adminInfo 表
      await tx.adminInfo.create({
        data: {
          accountInfoId: uuidv4(),
          accountId,
          nickname: info.nickname || '默认用户名',
          avatar: info.avatar,
        },
      })

      // 添加用户角色关联
      await tx.accountsAndRoles.create({
        data: {
          accountId,
          roleId: defaultRole.roleId,
        },
      })
    })

    res.mySuccess('注册成功')
  } catch (err) {
    console.error(err)
    res.myError('服务器错误，请稍后再试')
  }
}

exports.login = async (req, res) => {
  try {
    const adminInfo = req.body

    // 1. 查询 adminAccount 表以获取用户账号
    const account = await prisma.adminAccount.findUnique({
      where: {
        username: adminInfo.username, // 使用唯一值进行查询
      },
    })

    // 2. 判断账号是否存在
    if (!account) {
      return res.myError('账号不存在！')
    }

    // 3. 查询 adminInfo 表以获取用户状态
    const accountInfo = await prisma.adminInfo.findUnique({
      where: {
        accountId: account.accountId, // 使用外键关联查询
      },
    })

    // 4. 判断用户信息是否存在和账号是否被禁用
    if (!accountInfo || !accountInfo.state) {
      return res.myError('账号被禁用！')
    }

    // 5. 判断账号和密码是否匹配
    const passwordMatch = bcrypt.compareSync(
      adminInfo.password,
      account.password,
    )
    if (!passwordMatch) {
      return res.myError('账号或密码有误！')
    }

    // 6. 生成 token
    const tokenStr = jwt.sign(
      { accountId: account.accountId }, // 使用账号 ID 作为 payload
      process.env.JWT_SECRETKEY, // 使用环境变量中的密钥
      { expiresIn: process.env.JWT_EXPIRES_IN }, // 设置 token 过期时间
    )

    // 7. 返回 token 和登录成功的消息
    res.mySuccess(
      { token: tokenStr, expiresIn: process.env.JWT_EXPIRES_IN },
      '登录成功!',
    )
  } catch (err) {
    console.error(err) // 记录错误信息
    res.myError('服务器错误，请稍后再试') // 返回服务器错误响应
  }
}
