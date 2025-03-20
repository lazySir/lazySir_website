module.exports = (req, res, next) => {
    const token = req.headers['token']
    if (token) {
        req.headers['authorization'] = `Bearer ${token}`
    }
    next()
}