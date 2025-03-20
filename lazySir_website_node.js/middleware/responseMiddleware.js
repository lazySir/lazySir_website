module.exports = (req, res, next) => {
    res.myError = function (err, code = 205) {
        res.json({
            code,
            message: err instanceof Error ? err.message : err,
        })
    }

    res.mySuccess = function (data, message = '操作成功', code = 200) {
        res.json({
            code,
            data,
            message,
        })
    }

    next()
}