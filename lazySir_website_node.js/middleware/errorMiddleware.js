const joi = require('joi')

function errorHandler(err, req, res, next) {
    // schema 数据验证失败
    if (err instanceof joi.ValidationError) return res.myError(err)

    // token 认证失败
    if (err.name === 'UnauthorizedError') return res.myError('token身份认证失败！')

    // 未知错误
    res.myError(err)
}

module.exports = errorHandler
