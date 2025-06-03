const prisma = require('../db')
const expressJWT = require('express-jwt')
const { match } = require('path-to-regexp')

// 初始化 JWT 中间件（用于手动执行）
const jwtMiddleware = expressJWT({
  secret: process.env.JWT_SECRETKEY,
  algorithms: ['HS256'],
  credentialsRequired: false, // 允许匿名访问（我们手动处理是否需要 auth）
})

module.exports = async function checkApiEnabled(req, res, next) {
  try {
    const requestPath = req.originalUrl.split('?')[0]
    const requestMethod = req.method.toUpperCase()

    // 1. 查询所有该方法启用的接口
    const allApis = await prisma.api.findMany({
      where: {
        state: true,
        method: requestMethod,
      },
    })

    // 2. 使用 path-to-regexp 匹配
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

    // 3. 未匹配到接口，拒绝访问
    if (!matchedApi) {
      return res.myError('接口未开放，拒绝访问', 403)
    }

    // 4. 保存接口信息
    req.apiInfo = matchedApi

    // 5. 若接口不需要认证，直接放行
    if (!matchedApi.requireAuth) return next()

    // 6. 需要认证：先执行 JWT 中间件
    jwtMiddleware(req, res, async function (err) {
      if (err) {
        return res.myError('Token 无效或已过期', 401)
      }

      // 7. 获取当前用户 ID
      const accountId = req.user?.accountId
      if (!accountId) {
        return res.myError('用户身份信息缺失', 401)
      }

      // 8. 查询该用户的所有角色
      const roles = await prisma.accountsAndRoles.findMany({
        where: { accountId },
        select: { roleId: true },
      })
      const roleIds = roles.map((r) => r.roleId)

      if (roleIds.length === 0) {
        return res.myError('未分配角色，拒绝访问', 403)
      }

      // 9. 查询这些角色绑定的所有接口 ID
      const roleApis = await prisma.roleAndApi.findMany({
        where: {
          roleId: { in: roleIds },
        },
        select: { apiId: true },
      })
      const permittedApiIds = new Set(roleApis.map((r) => r.apiId))

      // 10. 判断当前请求的 api 是否在允许的范围内
      if (!permittedApiIds.has(matchedApi.apiId)) {
        return res.myError('权限不足，拒绝访问该接口', 403)
      }

      // 11. 权限验证通过
      next()
    })
  } catch (err) {
    return res.myError('接口权限检查失败: ' + err.message, 500)
  }
}
