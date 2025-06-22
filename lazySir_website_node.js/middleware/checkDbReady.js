const prisma = require('../db')

let isDbConnected = false
let dbChecked = false

// 中间件：首次请求检测数据库连接，失败用 res.myError 响应
module.exports = async (req, res, next) => {
  try {
    if (!dbChecked) {
      await prisma.$connect()
      console.log('✅ Prisma 数据库连接成功')
      isDbConnected = true
      dbChecked = true
    }

    if (!isDbConnected) {
      return res.myError('数据库连接失败，服务暂不可用', 500)
    }

    next()
  } catch (error) {
    console.error('❌ Prisma 数据库连接失败:', error.message)
    return res.myError('数据库连接失败: ' + error.message, 500)
  }
}
