const prisma = require('../db')
const expressJWT = require('express-jwt')
const { match } = require('path-to-regexp')

// 初始化 JWT 中间件（用于手动执行）
const jwtMiddleware = expressJWT({
  secret: process.env.JWT_SECRETKEY,
  algorithms: ['HS256'],
})

module.exports = async function checkApiEnabled(req, res, next) {
  try {
    const requestPath = req.originalUrl.split('?')[0]
    const requestMethod = req.method.toUpperCase()

    // 1. 查询所有该方法的启用接口（可缓存此部分，避免频繁查库）
    const allApis = await prisma.api.findMany({
      where: {
        state: true,
        method: requestMethod,
      },
    })

    // 2. 使用 path-to-regexp 模糊匹配
    let matchedApi = null
    for (const api of allApis) {
      const matcher = match(api.apiPath, {
        decode: decodeURIComponent,
        end: true,
      })
      if (matcher(requestPath)) {
        matchedApi = api
        break
      }
    }

    // 3. 未匹配到接口
    if (!matchedApi) {
      return res.myError('接口未注册或不支持该方法，拒绝访问', 403)
    }

    // 4. 保存接口信息
    req.apiInfo = matchedApi

    // 5. 是否需要鉴权
    if (!matchedApi.requireAuth) return next()

    // 6. 手动执行 express-jwt 中间件
    jwtMiddleware(req, res, function (err) {
      if (err) {
        if (err.name === 'UnauthorizedError') {
          return res.myError('Token 无效或已过期', 401)
        }
        return res.myError('身份验证失败: ' + err.message, 401)
      }
      next()
    })
  } catch (err) {
    return res.myError('接口状态检查失败: ' + err.message, 500)
  }
}
