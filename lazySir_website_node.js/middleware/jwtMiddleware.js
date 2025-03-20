//使用unless指定哪些接口不需要进行token解析
// 中间件：从自定义的 'token' 请求头中提取 JWT
const expressJWT = require('express-jwt')

const jwtMiddleware = expressJWT({ secret: process.env.JWT_SECRETKEY }).unless({
    path: [/^\/(api|user)/],
})

module.exports = jwtMiddleware