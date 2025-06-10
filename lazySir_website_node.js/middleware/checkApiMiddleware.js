const prisma = require('../db')
const expressJWT = require('express-jwt')
const { match } = require('path-to-regexp')

// 初始化 JWT 中间件
const jwtMiddleware = expressJWT({
  secret: process.env.JWT_SECRETKEY,
  algorithms: ['HS256'],
  credentialsRequired: false,
})

module.exports = async function checkApiEnabled(req, res, next) {
  try {
    const requestPath = req.originalUrl.split('?')[0]
    const requestMethod = req.method.toUpperCase()

    // ✅ 1. 获取 methods 的根 dictionaryId
    const methodRootDict = await prisma.sysDictionary.findFirst({
      where: { key: 'methods' },
    })

    if (!methodRootDict) {
      return res.myError('未配置 HTTP 方法字典', 500)
    }

    // ✅ 2. 获取二级方法映射（例如 GET/POST => 对应 dictionaryId）
    const methodDicts = await prisma.sysDictionary.findMany({
      where: { parentId: methodRootDict.dictionaryId },
    })

    const methodDictMap = {}
    for (const dict of methodDicts) {
      methodDictMap[dict.value.toUpperCase()] = dict.dictionaryId
    }
    const requestMethodId = methodDictMap[requestMethod]
    if (!requestMethodId) {
      return res.myError(`未定义的请求方法：${requestMethod}`, 400)
    }

    // ✅ 3. 查询所有启用、methodId 匹配的接口
    const allApis = await prisma.api.findMany({
      where: {
        state: true,
        methodId: requestMethodId,
      },
    })
    // ✅ 4. 使用 path-to-regexp 匹配
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

    // 5. 未匹配到接口，拒绝访问
    if (!matchedApi) {
      return res.myError('接口未开放，拒绝访问', 403)
    }

    // 6. 保存接口信息
    req.apiInfo = matchedApi

    // 7. 若接口不需要认证，直接放行
    if (!matchedApi.requireAuth) return next()

    // 8. 需要认证：先执行 JWT 中间件
    jwtMiddleware(req, res, async function (err) {
      if (err) {
        return res.myError('Token 无效或已过期', 401)
      }

      const accountId = req.user?.accountId
      if (!accountId) {
        return res.myError('用户身份信息缺失', 401)
      }

      // 9. 查询用户的所有角色
      const roles = await prisma.accountsAndRoles.findMany({
        where: { accountId },
        select: { roleId: true },
      })
      const roleIds = roles.map((r) => r.roleId)

      if (roleIds.length === 0) {
        return res.myError('未分配角色，拒绝访问', 403)
      }

      // 10. 查询角色绑定的所有 api
      const roleApis = await prisma.roleAndApi.findMany({
        where: {
          roleId: { in: roleIds },
        },
        select: { apiId: true },
      })
      const permittedApiIds = new Set(roleApis.map((r) => r.apiId))

      // 11. 判断权限
      if (!permittedApiIds.has(matchedApi.apiId)) {
        return res.myError('权限不足，拒绝访问该接口', 403)
      }

      next()
    })
  } catch (err) {
    return res.myError('接口权限检查失败: ' + err.message, 500)
  }
}
